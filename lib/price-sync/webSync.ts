'use client';

/**
 * 관리자 웹 업로드 → 승인 대기열 클라이언트 (설계문서 8-6).
 *
 * 파싱(hcell)과 검증(validate)은 로컬 파이프라인과 완전히 같은 코드를
 * 쓴다 — 여기의 몫은 파일을 읽어 그 코드에 넣고, 결과를 DB 함수
 * (stage/approve/discard_price_sync)로 나르는 것뿐이다. 검증 기준가는
 * 정적 카탈로그가 아니라 DB 현재가다: 관리자 수정·이전 승인 반영분이
 * 이미 DB 에 있기 때문이다.
 */

import { extractCpuRows, nameToIds } from './hcell';
import {
  validateRows,
  type CatalogProduct,
  type PriceRow,
  type SyncResult,
} from './validate';
import { getSupabase } from '@/lib/shop/supabaseClient';

export type UploadPreview = {
  fileName: string;
  /** 비교표 전체 행 수 */
  totalRows: number;
  /** 현재가가 없어 건너뛴 행 수 */
  skipped: number;
  result: SyncResult;
};

async function fetchDbCatalog(): Promise<CatalogProduct[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('slug, sku, name, price, sale_price, stock')
    .limit(1000);
  if (error || !data) return null;
  return data.map((row) => ({
    slug: row.slug as string,
    sku: row.sku as string,
    name: row.name as string,
    price: row.price as number,
    salePrice: (row.sale_price as number | null) ?? undefined,
    stock: row.stock as number,
  }));
}

/** 비교표 파일을 파싱해 DB 현재가 기준으로 검증한다. 아직 아무것도 쓰지 않는다 */
export async function parseAndValidate(file: File): Promise<UploadPreview> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const cpuRows = await extractCpuRows(buf);

  const rows: PriceRow[] = [];
  let skipped = 0;
  for (const row of cpuRows) {
    if (row.currentPrice === null) {
      skipped += 1; // 현재가 없음 — 취급 중단 상품이라 갱신 대상 아님
      continue;
    }
    rows.push({
      sku: nameToIds(row.name).sku,
      name: row.name,
      price: Math.round(row.currentPrice),
      // 비교표의 현재가는 시장 실가라 할인 개념이 없다 → 할인 제거로 반영
      salePrice: null,
      stock: null, // 재고 컬럼 없음 — 변경하지 않는다
      sourceLabel: `${row.rowNum}행`,
    });
  }

  const catalog = await fetchDbCatalog();
  if (!catalog) throw new Error('DB에서 상품 목록을 읽지 못했습니다.');

  return {
    fileName: file.name,
    totalRows: cpuRows.length,
    skipped,
    result: validateRows(rows, catalog),
  };
}

/** 검증 결과를 대기열에 올린다. 반환값은 실행(run) id */
export async function stageRun(preview: UploadPreview): Promise<number | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc('stage_price_sync', {
    items: preview.result.items.map((item) => ({
      sku: item.sku,
      product_slug: item.productSlug,
      old_price: item.oldPrice,
      new_price: item.newPrice,
      old_stock: item.oldStock,
      new_stock: item.newStock,
      verdict: item.verdict,
      reason: item.reason,
      source_label: item.sourceLabel,
    })),
  });
  if (error) return null;
  return data as number;
}

export type QueueRun = {
  id: number;
  status: string;
  totalCount: number;
  appliedCount: number;
  heldCount: number;
  rejectedCount: number;
  createdAt: string;
  appliedAt: string | null;
};

export async function listRuns(): Promise<QueueRun[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('price_sync_runs')
    .select('id, status, total_count, applied_count, held_count, failed_count, created_at, applied_at')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error || !data) return null;
  return data.map((row) => ({
    id: row.id as number,
    status: row.status as string,
    totalCount: row.total_count as number,
    appliedCount: row.applied_count as number,
    heldCount: row.held_count as number,
    rejectedCount: row.failed_count as number,
    createdAt: String(row.created_at),
    appliedAt: row.applied_at ? String(row.applied_at) : null,
  }));
}

export type QueueItem = {
  matchKey: string;
  productName: string | null;
  oldPrice: number | null;
  newPrice: number;
  verdict: string;
  reason: string | null;
  sourceLabel: string | null;
};

export async function fetchRunItems(runId: number): Promise<QueueItem[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('price_sync_items')
    .select('match_key, old_price, new_price, verdict, reason, source_label, products(name)')
    .eq('run_id', runId)
    .order('id');
  if (error || !data) return null;
  return data.map((row) => ({
    matchKey: row.match_key as string,
    productName: (row.products as unknown as { name: string } | null)?.name ?? null,
    oldPrice: row.old_price as number | null,
    newPrice: row.new_price as number,
    verdict: row.verdict as string,
    reason: row.reason as string | null,
    sourceLabel: row.source_label as string | null,
  }));
}

/** 승인 — ok 행이 상품에 반영된다. 반환값은 반영된 행 수 */
export async function approveRun(runId: number): Promise<number | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('approve_price_sync', { target_run: runId });
  if (error) return null;
  return data as number;
}

export async function discardRun(runId: number): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.rpc('discard_price_sync', { target_run: runId });
  return !error;
}

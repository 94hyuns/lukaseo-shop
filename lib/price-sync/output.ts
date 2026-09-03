import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_CHANGE_THRESHOLD, type SyncItem, type SyncResult } from './validate';

/**
 * 검증 결과를 파일로 내리는 공통 단계.
 *
 * 수집원(표준 엑셀, 한셀 비교표, 나중의 네이버 API)이 무엇이든
 * 출력 형식은 같아야 관리자 리포트 화면과 카탈로그 반영이 한 벌로 돈다.
 */

export function buildOverrides(items: SyncItem[]) {
  const overrides: Record<string, { price?: number; salePrice?: number | null; stock?: number }> =
    {};
  for (const item of items) {
    if (item.verdict !== 'ok' || !item.productSlug) continue;
    overrides[item.productSlug] = {
      price: item.newPrice ?? undefined,
      // 수집원에서 할인가 칸이 비면 "할인 없음"(null). 키 자체를 빼지 않는 이유는
      // 기존 할인을 지우는 것도 갱신이기 때문
      salePrice: item.newSalePrice,
      ...(item.newStock !== null ? { stock: item.newStock } : {}),
    };
  }
  return overrides;
}

export function writeSyncOutputs(
  rootDir: string,
  source: string,
  sourceFile: string,
  result: SyncResult,
): void {
  fs.writeFileSync(
    path.join(rootDir, 'data', 'price-overrides.json'),
    JSON.stringify(buildOverrides(result.items), null, 2) + '\n',
  );

  fs.writeFileSync(
    path.join(rootDir, 'data', 'price-sync-report.json'),
    JSON.stringify(
      {
        runAt: new Date().toISOString(),
        source,
        file: sourceFile,
        changeThreshold: DEFAULT_CHANGE_THRESHOLD,
        counts: result.counts,
        items: result.items,
      },
      null,
      2,
    ) + '\n',
  );
}

export function printSummary(result: SyncResult): void {
  const { counts } = result;
  console.log(
    `검증 완료 — 총 ${counts.total}행: 반영 ${counts.ok} · 보류 ${counts.held} · 거부 ${counts.rejected}`,
  );
  for (const item of result.items) {
    if (item.verdict === 'ok') continue;
    const label = item.verdict === 'held' ? '보류' : '거부';
    console.log(`  [${label}] ${item.sourceLabel} ${item.sku} — ${item.reason}`);
  }
  console.log('data/price-overrides.json, data/price-sync-report.json 갱신됨');
}

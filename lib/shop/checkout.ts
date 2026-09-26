'use client';

/**
 * 주문 생성·데모 결제 (설계문서 5장).
 *
 * 클라이언트는 slug 와 수량, 배송지만 보낸다. 금액 계산·재고 차감·가격
 * 스냅샷은 전부 DB 의 SECURITY DEFINER 함수(create_order) 안에서 일어나서,
 * 화면에 보이는 합계와 무관하게 서버가 확정한 금액만 저장된다.
 */

import { getSupabase } from './supabaseClient';
import { getProduct } from './catalog';
import type { StoredLine } from '@/lib/cart/store';

export type ReceiverInfo = {
  name: string;
  phone: string;
  postcode: string;
  address: string;
  addressDetail: string;
  memo: string;
};

export type CreateOrderResult =
  | { ok: true; orderNo: string }
  | { ok: false; message: string };

/** DB 함수가 던지는 코드를 사람이 읽을 말로 바꾼다 */
function translateError(raw: string): string {
  if (raw.includes('AUTH_REQUIRED')) return '로그인이 필요합니다.';
  if (raw.includes('EMPTY_CART')) return '장바구니가 비어 있습니다.';
  if (raw.includes('MISSING_RECEIVER')) return '받는 분 정보를 모두 입력해주세요.';
  if (raw.includes('BAD_QUANTITY')) return '수량은 1~99개 사이여야 합니다.';

  const stockMatch = raw.match(/OUT_OF_STOCK:([\w-]+)/);
  if (stockMatch) {
    const name = getProduct(stockMatch[1])?.name ?? stockMatch[1];
    return `재고가 부족합니다: ${name}. 수량을 줄이거나 상품을 빼주세요.`;
  }
  const unavailableMatch = raw.match(/UNAVAILABLE:([\w-]+)/);
  if (unavailableMatch) {
    const name = getProduct(unavailableMatch[1])?.name ?? unavailableMatch[1];
    return `지금은 판매하지 않는 상품입니다: ${name}.`;
  }
  return '주문 처리에 실패했습니다. 잠시 후 다시 시도해주세요.';
}

export async function createOrder(
  lines: StoredLine[],
  receiver: ReceiverInfo,
): Promise<CreateOrderResult> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, message: '서버에 연결할 수 없습니다.' };

  const { data, error } = await supabase.rpc('create_order', {
    items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
    receiver_name: receiver.name,
    receiver_phone: receiver.phone,
    address: receiver.address,
    address_detail: receiver.addressDetail || null,
    postcode: receiver.postcode,
    memo: receiver.memo || null,
  });

  if (error) return { ok: false, message: translateError(error.message) };
  return { ok: true, orderNo: data as string };
}

/** 서버가 확정한 주문 금액·상태를 읽는다 (RLS: 본인 주문만) */
export async function fetchOrderSummary(
  orderNo: string,
): Promise<{ totalAmount: number; status: string } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('orders')
    .select('total_amount, status')
    .eq('order_no', orderNo)
    .maybeSingle();
  if (error || !data) return null;
  return { totalAmount: data.total_amount as number, status: data.status as string };
}

/**
 * 데모 결제. 실제 PG 대신 DB 함수가 결제 레코드를 만들고 주문을 paid 로
 * 전이시킨다. 포트원이 붙으면 이 호출이 결제창 + 웹훅 검증으로 바뀐다.
 */
export async function payOrderDemo(orderNo: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.rpc('pay_order_demo', { target_order_no: orderNo });
  return !error;
}

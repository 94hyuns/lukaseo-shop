'use client';

/**
 * 내 주문 조회. 주문 생성은 서버(Worker API) 몫이라 여기엔 읽기만 있다.
 * RLS "본인 주문만 조회"가 접근을 제한한다.
 */

import { getSupabase } from './supabaseClient';

export type MyOrder = {
  orderNo: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  preparing: '상품 준비 중',
  shipped: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨',
  failed: '결제 실패',
  refunded: '환불됨',
};

export async function listMyOrders(): Promise<MyOrder[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('orders')
    .select('order_no, status, total_amount, created_at')
    .order('created_at', { ascending: false });
  if (error || !data) return null;

  return data.map((row) => ({
    orderNo: row.order_no as string,
    status: row.status as string,
    totalAmount: row.total_amount as number,
    createdAt: String(row.created_at).slice(0, 10),
  }));
}

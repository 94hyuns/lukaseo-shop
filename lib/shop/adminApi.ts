'use client';

/**
 * 관리자 쓰기 (설계문서 9장).
 *
 * 조회는 포트폴리오라 공개지만, 쓰기는 admin_users 에 등록된 계정만
 * 가능하다 — 화면의 isAdmin 은 버튼을 보여줄지 결정할 뿐이고, 실제
 * 권한은 DB 의 RLS 정책("관리자는 상품 수정")이 검사한다.
 */

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth/useSession';
import { getSupabase } from './supabaseClient';
import { getProductIdMap } from './productIds';
import type { ProductStatus } from './types';

export function useIsAdmin(): boolean {
  const { session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = session ? getSupabase() : null;
    if (!session || !supabase) {
      // 로그아웃 순간에도 동기 setState 를 피한다 (react-hooks/set-state-in-effect)
      queueMicrotask(() => setIsAdmin(false));
      return;
    }

    let cancelled = false;
    supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  return isAdmin;
}

export type ProductPatch = {
  price: number;
  salePrice: number | null;
  stock: number;
  status: ProductStatus | 'hidden';
};

export async function updateProductRow(slug: string, patch: ProductPatch): Promise<boolean> {
  const supabase = getSupabase();
  const idMap = await getProductIdMap();
  const productId = idMap?.get(slug);
  if (!supabase || !productId) return false;

  const { error } = await supabase
    .from('products')
    .update({
      price: patch.price,
      sale_price: patch.salePrice,
      stock: patch.stock,
      status: patch.status,
    })
    .eq('id', productId);
  return !error;
}

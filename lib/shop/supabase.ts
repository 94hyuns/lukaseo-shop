/**
 * Supabase Data API (PostgREST) 읽기 전용 클라이언트.
 *
 * supabase-js 대신 fetch 를 직접 쓴다 — 지금 필요한 건 익명 select 하나라
 * 의존성을 들일 이유가 없다. 접근 제어는 전적으로 DB 의 RLS 정책이 한다.
 *
 * 여기서는 절대 쓰기(insert/update)를 만들지 않는다. 주문·결제·상품 수정은
 * service role 키가 필요한 서버 경유 작업이다 (설계문서 4-3).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** DB products 행 중 화면 갱신에 필요한 부분 */
export type LiveProductRow = {
  slug: string;
  price: number;
  sale_price: number | null;
  stock: number;
  status: 'active' | 'soldout' | 'hidden';
};

/**
 * 전 상품의 가격·재고·상태를 익명으로 조회한다.
 * 환경변수가 없거나 네트워크가 막히면 null — 호출부는 정적 데이터로 폴백한다.
 */
export async function fetchLiveProducts(): Promise<LiveProductRow[] | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,price,sale_price,stock,status&limit=1000`,
      { headers: { apikey: SUPABASE_ANON_KEY } },
    );
    if (!res.ok) return null;
    return (await res.json()) as LiveProductRow[];
  } catch {
    return null;
  }
}

/**
 * 구매후기 목데이터.
 *
 * 설계문서 3-2에서 리뷰는 "축소 채택"으로 잡았다. 작성·수정·삭제는 인증이
 * 붙는 4단계 이후의 일이고, 뼈대 단계에서는 읽기 화면만 세운다.
 */

export type Review = {
  id: string;
  /** 어떤 상품에 달린 후기인지 */
  productSlug: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** 'YYYY-MM-DD' */
  createdAt: string;
  body: string;
};

export const REVIEWS: Review[] = [
  {
    id: 'rv-001',
    productSlug: 'lx-standard-5070',
    author: '김*훈',
    rating: 5,
    createdAt: '2026-08-09',
    body: '견적짜기로 직접 맞춰보다가 파워 용량 경고가 떠서 결국 완제품으로 샀습니다. 조립 상태 깔끔하고 소음도 생각보다 적네요.',
  },
  {
    id: 'rv-002',
    productSlug: 'asus-rtx5070-dual',
    author: '이*연',
    rating: 4,
    createdAt: '2026-08-05',
    body: '성능은 만족합니다. 다만 카드가 길어서 기존 케이스에 안 들어가 케이스까지 새로 샀어요. 길이 표기를 미리 봤어야 했습니다.',
  },
  {
    id: 'rv-003',
    productSlug: 'samsung-990pro-2tb',
    author: '박*수',
    rating: 5,
    createdAt: '2026-08-02',
    body: '로딩 체감이 확실히 다릅니다. 발열도 방열판 없이 쓸 만한 수준이에요.',
  },
  {
    id: 'rv-004',
    productSlug: 'pccooler-rz400',
    author: '정*민',
    rating: 4,
    createdAt: '2026-07-28',
    body: '이 가격에 이 성능이면 불만이 없습니다. 설치 설명서가 좀 불친절한 게 유일한 단점.',
  },
];

export function getRecentReviews(limit: number): Review[] {
  return [...REVIEWS]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getReviewsByProduct(productSlug: string): Review[] {
  return REVIEWS.filter((review) => review.productSlug === productSlug);
}

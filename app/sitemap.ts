import type { MetadataRoute } from 'next';

// output: 'export' 에서는 metadata 라우트도 정적임을 명시해야 한다
export const dynamic = 'force-static';
import { CATEGORIES, PRODUCTS } from '@/lib/shop/catalog';

const BASE_URL = 'https://shop.lukaseo.com';

/**
 * 빌드 시점에 sitemap.xml 로 생성된다 (요청 시점 API 를 안 쓰므로 정적).
 * lastModified 는 실제 갱신 시각을 모르는 상태라 넣지 않는다 —
 * 매 빌드마다 바뀌는 가짜 날짜는 크롤러에게 오히려 잡음이다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, priority: 1 },
    { url: `${BASE_URL}/products/`, priority: 0.9 },
    { url: `${BASE_URL}/builder/`, priority: 0.9 },
    ...CATEGORIES.map((category) => ({
      url: `${BASE_URL}/category/${category.slug}/`,
      priority: 0.7,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}/`,
      priority: 0.6,
    })),
  ];
}

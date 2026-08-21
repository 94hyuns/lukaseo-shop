import type { MetadataRoute } from 'next';

// output: 'export' 에서는 metadata 라우트도 정적임을 명시해야 한다
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 관리자 데모와 장바구니는 크롤링 대상이 아니다
      disallow: ['/admin/', '/cart/'],
    },
    sitemap: 'https://shop.lukaseo.com/sitemap.xml',
  };
}

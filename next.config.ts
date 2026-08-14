import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 뼈대 단계는 목데이터만 쓰므로 서버가 필요 없다. 정적 HTML로 내보낸다.
  // 결제(포트원 검증·웹훅)를 붙이는 시점에 이 줄을 빼고 배포 방식을 다시 정한다.
  output: 'export',
  // 정적 호스팅에서 /products 가 /products/index.html 로 매칭되도록 한다
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

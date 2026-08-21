import { describe, expect, it } from 'vitest';
import { getProduct } from '@/lib/shop/catalog';
import type { BuildSlots } from './compatibility';
import { decodeBuild, decodeLegacyQuery, encodeBuild } from './shareLink';

function part(slug: string) {
  const product = getProduct(slug);
  if (!product) throw new Error(`카탈로그에 없는 slug: ${slug}`);
  return product;
}

describe('encodeBuild / decodeBuild', () => {
  it('전체 구성이 왕복 인코딩 후 그대로 복원된다', () => {
    const build: BuildSlots = {
      cpu: part('intel-i5-14400f'),
      cooler: part('intel-stock-cooler'),
      mainboard: part('msi-mag-z790-tomahawk'),
      ram: part('samsung-ddr5-5600-32g'),
      gpu: part('msi-rtx4070s-ventus'),
      ssd: part('samsung-990pro-2tb'),
      psu: part('micronics-classic2-700'),
      case: part('abko-suitmaster-361h'),
    };
    const restored = decodeBuild(encodeBuild(build));
    expect(Object.keys(restored)).toHaveLength(8);
    expect(restored.cpu?.slug).toBe('intel-i5-14400f');
    expect(restored.case?.slug).toBe('abko-suitmaster-361h');
  });

  it('일부만 채운 구성도 왕복된다', () => {
    const build: BuildSlots = { gpu: part('asus-rtx5070-dual') };
    const restored = decodeBuild(encodeBuild(build));
    expect(Object.keys(restored)).toEqual(['gpu']);
  });

  it('토큰에 slug 가 날것으로 드러나지 않는다', () => {
    const token = encodeBuild({ cpu: part('intel-i5-14400f') });
    expect(token).not.toContain('intel');
    expect(token).not.toContain('cpu');
  });

  it('빈 구성은 빈 토큰', () => {
    expect(encodeBuild({})).toBe('');
    expect(decodeBuild('')).toEqual({});
  });

  it('깨진 토큰은 빈 구성으로 조용히 처리한다', () => {
    expect(decodeBuild('%%%not-base64%%%')).toEqual({});
    expect(decodeBuild('aaaa')).toEqual({});
  });

  it('슬롯에 맞지 않는 부품은 버린다 — CPU 자리에 메인보드 slug', () => {
    // SLOT_ORDER 첫 칸(cpu)에 메인보드 slug 를 넣은 토큰을 직접 만든다
    const forged = btoa('asrock-b650m-pg').replaceAll('+', '-').replaceAll('/', '_');
    expect(decodeBuild(forged)).toEqual({});
  });

  it('카탈로그에 없는 slug 는 버린다', () => {
    const forged = btoa('no-such-product').replaceAll('+', '-').replaceAll('/', '_');
    expect(decodeBuild(forged)).toEqual({});
  });
});

describe('decodeLegacyQuery — 옛 ?cpu=slug 형식', () => {
  it('유효한 슬롯 파라미터만 받아들인다', () => {
    const query = new URLSearchParams(
      'cpu=intel-i5-14400f&gpu=asus-rtx5070-dual&ram=no-such&mainboard=intel-i5-14400f',
    );
    const build = decodeLegacyQuery(query);
    // ram 은 없는 상품, mainboard 자리의 CPU slug 는 슬롯 불일치 → 버림
    expect(Object.keys(build).sort()).toEqual(['cpu', 'gpu']);
  });
});

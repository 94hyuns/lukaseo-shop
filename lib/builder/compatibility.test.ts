import { describe, expect, it } from 'vitest';
import { getProduct } from '@/lib/shop/catalog';
import type { Product } from '@/lib/shop/types';
import {
  missingSlots,
  recommendedWattage,
  summarize,
  totalPrice,
  totalTdp,
  validateBuild,
  type BuildSlots,
} from './compatibility';

/**
 * 픽스처를 따로 만들지 않고 실제 카탈로그 상품을 쓴다.
 * 목데이터의 스펙이 바뀌어 규칙 판정이 달라지면 테스트가 함께 깨져서,
 * 카탈로그와 엔진이 어긋나는 것을 바로 알 수 있다.
 */
function part(slug: string): Product {
  const product = getProduct(slug);
  if (!product) throw new Error(`카탈로그에 없는 slug: ${slug}`);
  return product;
}

/** 문제가 없어야 하는 기준 구성 — 실제 브라우저 검증에 썼던 그 조합 */
function goodBuild(): BuildSlots {
  return {
    cpu: part('amd-ryzen7-9700x'), // AM5, 65W, tier 8, 내장그래픽 있음
    cooler: part('pccooler-rz400'), // AM5 지원, 152mm, 180W
    mainboard: part('asrock-b650m-pg'), // AM5, DDR5, mATX
    ram: part('samsung-ddr5-5600-32g'), // DDR5
    gpu: part('asus-rtx5070-dual'), // 304mm, 250W, tier 8, 권장 650W
    ssd: part('sk-p41-1tb'),
    psu: part('seasonic-vertex-gx-850'), // 850W
    case: part('abko-suitmaster-361h'), // mATX 지원, VGA 330mm, 쿨러 165mm
  };
}

describe('validateBuild — 오류 규칙', () => {
  it('정상 구성은 문제가 없다', () => {
    expect(validateBuild(goodBuild())).toEqual([]);
  });

  it('빈 구성은 문제를 보고하지 않는다 (빈 슬롯은 missingSlots 의 몫)', () => {
    expect(validateBuild({})).toEqual([]);
  });

  it('① CPU 와 메인보드 소켓이 다르면 오류', () => {
    // i7 은 내장 그래픽이 있어 규칙 ⑪(화면 출력)에 걸리지 않는다
    const issues = validateBuild({
      cpu: part('intel-i7-14700k'), // LGA1700
      mainboard: part('asrock-b650m-pg'), // AM5
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].level).toBe('error');
    expect(issues[0].slots).toEqual(['cpu', 'mainboard']);
  });

  it('② 메모리 규격이 메인보드와 다르면 오류', () => {
    const issues = validateBuild({
      mainboard: part('asus-prime-h610m-k-d4'), // DDR4
      ram: part('samsung-ddr5-5600-32g'), // DDR5
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].level).toBe('error');
    expect(issues[0].slots).toEqual(['ram', 'mainboard']);
  });

  it('③ 메인보드 폼팩터를 케이스가 지원하지 않으면 오류', () => {
    const issues = validateBuild({
      mainboard: part('msi-mag-z790-tomahawk'), // ATX
      case: part('zalman-p30-itx'), // ITX 전용
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].level).toBe('error');
    expect(issues[0].slots).toEqual(['mainboard', 'case']);
  });

  it('④ 그래픽카드가 케이스보다 길면 오류', () => {
    const issues = validateBuild({
      gpu: part('msi-rtx5080-gaming-trio'), // 336mm
      case: part('darkflash-dlm21-mesh'), // 330mm 까지
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].level).toBe('error');
    expect(issues[0].slots).toEqual(['gpu', 'case']);
  });

  it('⑤ 공랭 쿨러가 케이스보다 높으면 오류, 수랭(높이 0)은 통과', () => {
    const tallAir = validateBuild({
      cooler: part('noctua-nh-d15'), // 165mm
      case: part('zalman-p30-itx'), // 70mm 까지
    });
    expect(tallAir).toHaveLength(1);
    expect(tallAir[0].level).toBe('error');

    const water = validateBuild({
      cooler: part('3rsys-socool-rc240'), // 수랭, heightMm 0
      case: part('zalman-p30-itx'),
    });
    expect(water).toEqual([]);
  });

  it('⑥ 쿨러가 CPU 소켓을 지원하지 않으면 오류', () => {
    const issues = validateBuild({
      cpu: part('amd-ryzen7-9700x'), // AM5
      cooler: part('intel-stock-cooler'), // LGA1700 전용
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].level).toBe('error');
    expect(issues[0].slots).toEqual(['cpu', 'cooler']);
  });
});

describe('validateBuild — 경고 규칙', () => {
  it('⑦ 쿨러 감당 발열이 CPU TDP 보다 낮으면 경고', () => {
    const issues = validateBuild({
      cpu: part('intel-i7-14700k'), // 125W
      cooler: part('intel-stock-cooler'), // 65W 까지
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].level).toBe('warning');
    expect(issues[0].slots).toEqual(['cpu', 'cooler']);
  });

  it('⑧⑨ 파워가 모자라면 경고 — 계산 용량과 제조사 권장 용량 각각', () => {
    const issues = validateBuild({
      gpu: part('msi-rtx5080-gaming-trio'), // 360W, 권장 850W
      psu: part('fsp-hydro-k-pro-400'), // 400W
    });
    const warnings = issues.filter((issue) => issue.level === 'warning');
    // 계산 용량 부족 + 제조사 권장 미달 = 2건
    expect(warnings).toHaveLength(2);
  });

  it('⑩ 성능 등급이 2단계 이상 벌어지면 병목 경고 (양방향)', () => {
    const weakCpu = validateBuild({
      cpu: part('amd-ryzen5-5600'), // tier 4
      gpu: part('msi-rtx5080-gaming-trio'), // tier 9
    });
    expect(weakCpu.some((issue) => issue.message.includes('CPU 성능이 낮습니다'))).toBe(true);

    const weakGpu = validateBuild({
      cpu: part('intel-i7-14700k'), // tier 8
      gpu: part('sapphire-rx7600-pulse'), // tier 5
    });
    expect(weakGpu.some((issue) => issue.message.includes('그래픽카드 성능이 낮습니다'))).toBe(true);

    const balanced = validateBuild({
      cpu: part('intel-i5-14400f'), // tier 6
      gpu: part('msi-rtx4070s-ventus'), // tier 7
    });
    expect(balanced.filter((issue) => issue.slots.join() === 'cpu,gpu')).toEqual([]);
  });

  it('⑪ 내장 그래픽 없는 CPU 에 그래픽카드가 없으면 경고', () => {
    const issues = validateBuild({ cpu: part('intel-i5-14400f') }); // igpu 없음
    expect(issues).toHaveLength(1);
    expect(issues[0].level).toBe('warning');

    // 내장 그래픽이 있으면 경고 없음
    expect(validateBuild({ cpu: part('amd-ryzen5-7600') })).toEqual([]);
  });
});

describe('validateBuild — 복합 구성', () => {
  it('일부러 어긋나게 짠 구성에서 오류 5건 + 경고 3건', () => {
    // 브라우저 수동 검증 때 쓴 그 조합을 그대로 고정해 둔다
    const issues = validateBuild({
      cpu: part('intel-i5-14400f'), // LGA1700, tier 6
      mainboard: part('msi-b550m-pro-vdh'), // AM4, DDR4 → ①②
      ram: part('samsung-ddr5-5600-32g'), // DDR5 → ②
      gpu: part('msi-rtx5080-gaming-trio'), // 336mm, tier 9 → ④⑧⑨⑩
      case: part('zalman-p30-itx'), // ITX, VGA 320, 쿨러 70 → ③④⑤
      cooler: part('noctua-nh-d15'), // 165mm → ⑤
      psu: part('fsp-hydro-k-pro-400'), // 400W → ⑧⑨
      ssd: part('samsung-990pro-2tb'),
    });
    const { errors, warnings, hasError } = summarize(issues);
    expect(errors).toHaveLength(5);
    expect(warnings).toHaveLength(3);
    expect(hasError).toBe(true);
  });
});

describe('집계 함수', () => {
  it('totalTdp — 부품 TDP 합에 기타 소비전력 30W 를 얹는다', () => {
    const build: BuildSlots = {
      cpu: part('intel-i5-14400f'), // 65W
      gpu: part('gigabyte-rtx4060-eagle'), // 115W
    };
    expect(totalTdp(build)).toBe(65 + 115 + 30);
    expect(totalTdp({})).toBe(0);
  });

  it('recommendedWattage — 1.3배 여유를 두고 50W 단위 올림', () => {
    const build: BuildSlots = {
      cpu: part('intel-i5-14400f'),
      gpu: part('gigabyte-rtx4060-eagle'),
    };
    // 210W × 1.3 = 273 → 300
    expect(recommendedWattage(build)).toBe(300);
    expect(recommendedWattage({})).toBe(0);
  });

  it('totalPrice — 할인가가 있으면 할인가로 합산', () => {
    const build: BuildSlots = {
      cpu: part('intel-i5-14400f'), // 할인 228,000
      gpu: part('gigabyte-rtx4060-eagle'), // 할인 389,000
    };
    expect(totalPrice(build)).toBe(228000 + 389000);
  });

  it('missingSlots — 그래픽카드는 필수가 아니다 (내장 그래픽 경로)', () => {
    const missing = missingSlots(goodBuild());
    expect(missing).toEqual([]);

    const partial = missingSlots({ cpu: part('intel-i5-14400f') });
    expect(partial).not.toContain('gpu');
    expect(partial).toContain('mainboard');
  });
});

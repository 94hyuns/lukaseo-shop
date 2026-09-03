import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '@/lib/shop/catalog';
import { validateRows, type PriceRow } from './validate';

/**
 * 기준 상품의 현재가를 카탈로그에서 읽는다.
 * 가격의 원천은 엑셀이라 갱신될 때마다 바뀌므로, 리터럴을 박으면
 * 가격 갱신을 돌릴 때마다 테스트가 깨진다. 비율로만 검증한다.
 */
const BASE_PRODUCT = PRODUCTS.find((product) => product.sku === 'CPU-INT-14400F');
if (!BASE_PRODUCT) throw new Error('테스트 기준 상품(CPU-INT-14400F)이 카탈로그에 없습니다');
const BASE = BASE_PRODUCT.price;

/** 테스트용 행 생성. 기본값은 정상 행 */
function row(patch: Partial<PriceRow>): PriceRow {
  return {
    sku: 'CPU-INT-14400F',
    name: null,
    price: BASE,
    salePrice: null,
    stock: null,
    sourceLabel: '테스트행',
    ...patch,
  };
}

describe('validateRows', () => {
  it('정상 행은 ok — 상품 정보가 채워진다', () => {
    const newPrice = BASE + 3000;
    const { items, counts } = validateRows([row({ price: newPrice, stock: 35 })], PRODUCTS);
    expect(counts).toEqual({ total: 1, ok: 1, held: 0, rejected: 0 });
    expect(items[0].productSlug).toBe('intel-i5-14400f');
    expect(items[0].oldPrice).toBe(BASE);
    expect(items[0].newPrice).toBe(newPrice);
  });

  it('가격이 0 이하·소수·비어 있으면 rejected', () => {
    const { items } = validateRows(
      [row({ price: 0 }), row({ price: -1000 }), row({ price: 1234.5 }), row({ price: null })],
      PRODUCTS,
    );
    expect(items.every((item) => item.verdict === 'rejected')).toBe(true);
  });

  it('할인가가 정가보다 높으면 rejected', () => {
    const { items } = validateRows([row({ price: BASE, salePrice: BASE + 10000 })], PRODUCTS);
    expect(items[0].verdict).toBe('rejected');
    expect(items[0].reason).toContain('할인가');
  });

  it('모르는 상품코드는 held — 거부가 아니라 사람이 확인', () => {
    const { items } = validateRows([row({ sku: 'SSD-XXX-9999' })], PRODUCTS);
    expect(items[0].verdict).toBe('held');
    expect(items[0].productSlug).toBeNull();
  });

  it('임계치(30%)를 넘는 변동은 held — 자릿수 오타 방어', () => {
    // 자릿수를 하나 빼먹은 상황 (현재가의 10%)
    const { items } = validateRows([row({ price: Math.round(BASE * 0.1) })], PRODUCTS);
    expect(items[0].verdict).toBe('held');
    expect(items[0].reason).toContain('90%');
  });

  it('임계치는 조절 가능하다', () => {
    // 10% 인상 — 기본 30%에서는 통과, 5% 임계치에서는 보류
    const raised = row({ price: Math.round(BASE * 1.1) });
    expect(validateRows([raised], PRODUCTS).items[0].verdict).toBe('ok');
    expect(validateRows([raised], PRODUCTS, 0.05).items[0].verdict).toBe('held');
  });

  it('중복 SKU 는 마지막 행을 채택하고 앞 행은 rejected', () => {
    const { items, counts } = validateRows(
      [row({ price: BASE, sourceLabel: '3행' }), row({ price: BASE + 1000, sourceLabel: '7행' })],
      PRODUCTS,
    );
    expect(items[0].verdict).toBe('rejected');
    expect(items[0].reason).toContain('7행');
    expect(items[1].verdict).toBe('ok');
    expect(counts.ok).toBe(1);
  });

  it('재고 음수는 rejected', () => {
    const { items } = validateRows([row({ stock: -3 })], PRODUCTS);
    expect(items[0].verdict).toBe('rejected');
  });
});

import { describe, expect, it } from 'vitest';
import { PRODUCTS } from '@/lib/shop/catalog';
import { validateRows, type PriceRow } from './validate';

/** 테스트용 행 생성. 기본값은 정상 행 */
function row(patch: Partial<PriceRow>): PriceRow {
  return {
    sku: 'CPU-INT-14400F', // 카탈로그 정가 249,000원
    name: null,
    price: 249000,
    salePrice: null,
    stock: null,
    sourceLabel: '테스트행',
    ...patch,
  };
}

describe('validateRows', () => {
  it('정상 행은 ok — 상품 정보가 채워진다', () => {
    const { items, counts } = validateRows([row({ price: 252000, stock: 35 })], PRODUCTS);
    expect(counts).toEqual({ total: 1, ok: 1, held: 0, rejected: 0 });
    expect(items[0].productSlug).toBe('intel-i5-14400f');
    expect(items[0].oldPrice).toBe(249000);
    expect(items[0].newPrice).toBe(252000);
  });

  it('가격이 0 이하·소수·비어 있으면 rejected', () => {
    const { items } = validateRows(
      [row({ price: 0 }), row({ price: -1000 }), row({ price: 1234.5 }), row({ price: null })],
      PRODUCTS,
    );
    expect(items.every((item) => item.verdict === 'rejected')).toBe(true);
  });

  it('할인가가 정가보다 높으면 rejected', () => {
    const { items } = validateRows([row({ price: 200000, salePrice: 210000 })], PRODUCTS);
    expect(items[0].verdict).toBe('rejected');
    expect(items[0].reason).toContain('할인가');
  });

  it('모르는 상품코드는 held — 거부가 아니라 사람이 확인', () => {
    const { items } = validateRows([row({ sku: 'SSD-XXX-9999' })], PRODUCTS);
    expect(items[0].verdict).toBe('held');
    expect(items[0].productSlug).toBeNull();
  });

  it('임계치(30%)를 넘는 변동은 held — 자릿수 오타 방어', () => {
    // 249,000원짜리를 24,900원으로 입력한 상황
    const { items } = validateRows([row({ price: 24900 })], PRODUCTS);
    expect(items[0].verdict).toBe('held');
    expect(items[0].reason).toContain('90%');
  });

  it('임계치는 조절 가능하다', () => {
    // 10% 인상 — 기본 30%에서는 통과, 5% 임계치에서는 보류
    const raised = row({ price: 273900 });
    expect(validateRows([raised], PRODUCTS).items[0].verdict).toBe('ok');
    expect(validateRows([raised], PRODUCTS, 0.05).items[0].verdict).toBe('held');
  });

  it('중복 SKU 는 마지막 행을 채택하고 앞 행은 rejected', () => {
    const { items, counts } = validateRows(
      [row({ price: 249000, sourceLabel: '3행' }), row({ price: 250000, sourceLabel: '7행' })],
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

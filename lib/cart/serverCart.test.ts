import { describe, expect, it } from 'vitest';
import { mergeLines } from './serverCart';

describe('mergeLines', () => {
  it('양쪽에 없는 상품은 그대로 합쳐진다', () => {
    const merged = mergeLines(
      [{ slug: 'a', quantity: 1 }],
      [{ slug: 'b', quantity: 2 }],
    );
    expect(merged).toEqual(
      expect.arrayContaining([
        { slug: 'a', quantity: 1 },
        { slug: 'b', quantity: 2 },
      ]),
    );
    expect(merged).toHaveLength(2);
  });

  it('겹치는 상품은 큰 수량을 택한다 — 합산하면 로그인마다 불어난다', () => {
    const merged = mergeLines(
      [{ slug: 'a', quantity: 3 }],
      [{ slug: 'a', quantity: 2 }],
    );
    expect(merged).toEqual([{ slug: 'a', quantity: 3 }]);
  });

  it('병합을 반복해도 결과가 변하지 않는다 (멱등)', () => {
    const local = [{ slug: 'a', quantity: 2 }, { slug: 'b', quantity: 1 }];
    const server = [{ slug: 'a', quantity: 5 }];
    const once = mergeLines(local, server);
    const twice = mergeLines(once, once);
    expect(twice).toEqual(once);
  });

  it('수량 0 이하는 버린다', () => {
    const merged = mergeLines([{ slug: 'a', quantity: 0 }], []);
    expect(merged).toEqual([]);
  });

  it('빈 장바구니끼리는 빈 결과', () => {
    expect(mergeLines([], [])).toEqual([]);
  });
});

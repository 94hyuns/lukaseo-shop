'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { useSession } from '@/lib/auth/useSession';
import { effectivePrice } from '@/lib/shop/catalog';
import { formatPrice } from '@/lib/shop/format';
import {
  createOrder,
  fetchOrderSummary,
  payOrderDemo,
  type ReceiverInfo,
} from '@/lib/shop/checkout';
import styles from './checkout.module.css';

/** 장바구니 화면과 같은 배송비 정책 — DB 함수(create_order)에도 같은 값이 있다 */
const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 500000;

const EMPTY_RECEIVER: ReceiverInfo = {
  name: '',
  phone: '',
  postcode: '',
  address: '',
  addressDetail: '',
  memo: '',
};

type Step =
  | { kind: 'form' }
  | { kind: 'created'; orderNo: string; serverTotal: number | null }
  | { kind: 'paid'; orderNo: string; serverTotal: number | null };

export default function CheckoutView() {
  const { lines, totalPrice, isReady, clear } = useCart();
  const { session, isReady: sessionReady } = useSession();
  const [receiver, setReceiver] = useState<ReceiverInfo>(EMPTY_RECEIVER);
  const [step, setStep] = useState<Step>({ kind: 'form' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  function update<K extends keyof ReceiverInfo>(key: K, value: string) {
    setReceiver((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = await createOrder(
      lines.map((line) => ({ slug: line.product.slug, quantity: line.quantity })),
      receiver,
    );
    if (!result.ok) {
      setPending(false);
      setError(result.message);
      return;
    }

    // 주문이 확정됐으니 장바구니는 비운다. 금액은 서버가 확정한 값을 다시 읽어 보여준다.
    clear();
    const summary = await fetchOrderSummary(result.orderNo);
    setPending(false);
    setStep({ kind: 'created', orderNo: result.orderNo, serverTotal: summary?.totalAmount ?? null });
  }

  async function handleDemoPay() {
    if (step.kind !== 'created') return;
    setPending(true);
    setError(null);
    const ok = await payOrderDemo(step.orderNo);
    setPending(false);
    if (!ok) {
      setError('결제 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setStep({ kind: 'paid', orderNo: step.orderNo, serverTotal: step.serverTotal });
  }

  // ── 주문 완료 화면 ──
  if (step.kind === 'created' || step.kind === 'paid') {
    return (
      <div className={styles.container}>
        <div className={styles.doneCard}>
          <p className={styles.doneBadge}>
            {step.kind === 'paid' ? '결제 완료 (데모)' : '주문 접수됨'}
          </p>
          <h1 className={styles.doneTitle}>
            {step.kind === 'paid' ? '주문이 완료됐습니다' : '주문이 접수됐습니다'}
          </h1>
          <dl className={styles.doneMeta}>
            <div>
              <dt>주문번호</dt>
              <dd className={styles.orderNo}>{step.orderNo}</dd>
            </div>
            <div>
              <dt>결제 금액 (서버 확정)</dt>
              <dd>{step.serverTotal !== null ? formatPrice(step.serverTotal) : '—'}</dd>
            </div>
          </dl>
          <p className={styles.doneNote}>
            금액은 화면 표시가가 아니라 주문 시점의 DB 가격으로 서버가 다시 계산한 값입니다.
            재고도 함께 차감됐습니다.
          </p>

          {step.kind === 'created' ? (
            <>
              <button
                type="button"
                className={styles.primary}
                onClick={handleDemoPay}
                disabled={pending}
              >
                {pending ? '결제 처리 중…' : '데모 결제 진행'}
              </button>
              <p className={styles.demoNote}>
                포트폴리오 데모라 실제 결제창 대신 서버 함수가 결제 완료 상태를 만듭니다.
                실 PG(포트원) 연동 자리는 비워져 있습니다.
              </p>
            </>
          ) : (
            <Link href="/account" className={styles.primary}>
              주문 내역 보기 →
            </Link>
          )}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── 접근 가드 ──
  if (!isReady || !sessionReady) {
    return <p className={styles.loading}>불러오는 중…</p>;
  }
  if (!session) {
    return (
      <div className={styles.container}>
        <div className={styles.guard}>
          <h1 className={styles.guardTitle}>주문하려면 로그인이 필요합니다</h1>
          <p className={styles.guardText}>
            주문은 계정에 저장되고, 금액은 서버가 계정 권한으로 검증합니다.
          </p>
          <Link href="/account" className={styles.primary}>
            로그인 / 회원가입 →
          </Link>
        </div>
      </div>
    );
  }
  if (lines.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.guard}>
          <h1 className={styles.guardTitle}>장바구니가 비어 있습니다</h1>
          <Link href="/products" className={styles.primary}>
            상품 둘러보기 →
          </Link>
        </div>
      </div>
    );
  }

  // ── 주문서 ──
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>주문하기</h1>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit} id="checkout-form">
          <h2 className={styles.sectionTitle}>받는 분</h2>
          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>이름</span>
              <input
                id="rcv-name"
                className={styles.input}
                value={receiver.name}
                onChange={(e) => update('name', e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>연락처</span>
              <input
                id="rcv-phone"
                className={styles.input}
                value={receiver.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="010-0000-0000"
                autoComplete="tel"
                required
              />
            </label>
          </div>
          <div className={styles.fieldRow}>
            <label className={`${styles.field} ${styles.fieldNarrow}`}>
              <span className={styles.fieldLabel}>우편번호</span>
              <input
                id="rcv-postcode"
                className={styles.input}
                value={receiver.postcode}
                onChange={(e) => update('postcode', e.target.value)}
                autoComplete="postal-code"
                required
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>주소</span>
              <input
                id="rcv-address"
                className={styles.input}
                value={receiver.address}
                onChange={(e) => update('address', e.target.value)}
                autoComplete="street-address"
                required
              />
            </label>
          </div>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>상세 주소 (선택)</span>
            <input
              id="rcv-detail"
              className={styles.input}
              value={receiver.addressDetail}
              onChange={(e) => update('addressDetail', e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>배송 메모 (선택)</span>
            <input
              id="rcv-memo"
              className={styles.input}
              value={receiver.memo}
              onChange={(e) => update('memo', e.target.value)}
              placeholder="부재 시 문 앞에 놓아주세요"
            />
          </label>
        </form>

        <aside className={styles.summary}>
          <h2 className={styles.sectionTitle}>주문 상품 {lines.length}개</h2>
          <ul className={styles.items}>
            {lines.map(({ product, quantity }) => (
              <li key={product.slug} className={styles.item}>
                <span className={styles.itemName}>{product.name}</span>
                <span className={styles.itemQty}>×{quantity}</span>
                <span className={styles.itemPrice}>
                  {formatPrice(effectivePrice(product) * quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className={styles.totals}>
            <div className={styles.totalRow}>
              <dt>상품 금액</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>배송비</dt>
              <dd>{shipping === 0 ? '무료' : formatPrice(shipping)}</dd>
            </div>
            <div className={`${styles.totalRow} ${styles.grand}`}>
              <dt>예상 합계</dt>
              <dd>{formatPrice(totalPrice + shipping)}</dd>
            </div>
          </dl>

          <p className={styles.verifyNote}>
            위 금액은 화면 기준 예상치입니다. 최종 결제 금액은 주문 시점에 서버가 DB
            가격으로 다시 계산해 확정하며, 화면과 다르면 확정 금액을 알려드립니다.
          </p>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" form="checkout-form" className={styles.primary} disabled={pending}>
            {pending ? '주문 처리 중…' : '주문 확정'}
          </button>
        </aside>
      </div>
    </div>
  );
}

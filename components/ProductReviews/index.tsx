'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ReviewList from '@/components/ReviewList';
import SectionHeading from '@/components/SectionHeading';
import { useSession } from '@/lib/auth/useSession';
import type { Review } from '@/lib/shop/reviews';
import {
  addReview,
  deleteReview,
  fetchProductReviews,
  reviewAuthorLabel,
  type DbReview,
} from '@/lib/shop/liveReviews';
import styles from './ProductReviews.module.css';

/**
 * 구매후기 섹션 — DB 후기(실제 작성분) + 시드 목데이터를 함께 보여준다.
 *
 * 시드는 데모 사이트의 첫인상을 위한 것이고, 로그인 사용자가 쓴 후기는
 * DB 에 저장돼 위쪽에 먼저 쌓인다. 본인 후기에만 삭제 버튼이 붙는데,
 * 이 판정은 화면 편의일 뿐이고 실제 권한은 RLS 가 검사한다.
 */

type Props = {
  slug: string;
  seedReviews: Review[];
};

function toReview(db: DbReview, slug: string): Review {
  return {
    id: `db-${db.id}`,
    productSlug: slug,
    author: reviewAuthorLabel(db.userId),
    rating: Math.min(5, Math.max(1, db.rating)) as Review['rating'],
    createdAt: db.createdAt,
    body: db.body,
  };
}

export default function ProductReviews({ slug, seedReviews }: Props) {
  const { session } = useSession();
  const [dbReviews, setDbReviews] = useState<DbReview[]>([]);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(() => {
    fetchProductReviews(slug).then((rows) => {
      if (rows) setDbReviews(rows);
    });
  }, [slug]);

  useEffect(reload, [reload]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setPending(true);
    setFailed(false);
    const ok = await addReview(slug, rating, trimmed);
    setPending(false);
    if (!ok) {
      setFailed(true);
      return;
    }
    setBody('');
    setRating(5);
    reload();
  }

  async function handleDelete(id: string) {
    const dbId = Number(id.replace('db-', ''));
    if (await deleteReview(dbId)) reload();
  }

  const combined: Review[] = [
    ...dbReviews.map((row) => toReview(row, slug)),
    ...seedReviews,
  ];
  const ownIds = session
    ? dbReviews
        .filter((row) => row.userId === session.user.id)
        .map((row) => `db-${row.id}`)
    : [];

  return (
    <section className={styles.section}>
      <SectionHeading title={`구매후기 (${combined.length})`} />

      {session ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label className={styles.ratingLabel}>
              별점
              <select
                className={styles.ratingSelect}
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {'★'.repeat(value)} ({value}점)
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className={styles.submit} disabled={pending || !body.trim()}>
              {pending ? '등록 중…' : '후기 등록'}
            </button>
          </div>
          <textarea
            className={styles.textarea}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="사용해 보신 경험을 남겨주세요"
            rows={3}
            maxLength={1000}
          />
          {failed && (
            <p className={styles.error} role="alert">
              후기 등록에 실패했습니다. 잠시 후 다시 시도해주세요.
            </p>
          )}
        </form>
      ) : (
        <p className={styles.loginHint}>
          후기를 남기려면 <Link href="/account">로그인</Link>이 필요합니다.
        </p>
      )}

      <ReviewList reviews={combined} ownReviewIds={ownIds} onDelete={handleDelete} />
    </section>
  );
}

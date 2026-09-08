'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth/useSession';
import { getSupabase } from '@/lib/shop/supabaseClient';
import {
  deleteBuild,
  listMyBuilds,
  type SavedBuild,
} from '@/lib/builder/savedBuilds';
import { SHARE_PARAM, encodeBuild } from '@/lib/builder/shareLink';
import { SLOT_LABELS, SLOT_ORDER, type BuildSlots } from '@/lib/builder/compatibility';
import { getProduct } from '@/lib/shop/catalog';
import styles from './account.module.css';

/**
 * 내 계정 화면.
 *
 * 비로그인: 이메일+비밀번호 로그인/회원가입 폼.
 * 로그인: 계정 정보, 저장된 견적 목록(불러오기·삭제), 로그아웃.
 *
 * 저장된 견적의 "불러오기"는 slug 들을 기존 공유 토큰으로 인코딩해
 * /builder?b=... 로 보낸다 — 빌더의 복원 코드를 그대로 탄다.
 */

function buildToken(slots: SavedBuild['slots']): string {
  const build: BuildSlots = {};
  for (const slot of SLOT_ORDER) {
    const slug = slots[slot];
    if (!slug) continue;
    const product = getProduct(slug);
    if (product) build[slot] = product;
  }
  return encodeBuild(build);
}

function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setError('로그인 서비스에 연결할 수 없습니다.');
      return;
    }

    setPending(true);
    setError(null);

    const { error: authError } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setPending(false);
    if (authError) {
      // 원문은 영어라 자주 나오는 것만 우리말로 바꾼다
      const message = authError.message.includes('Invalid login credentials')
        ? '이메일 또는 비밀번호가 맞지 않습니다.'
        : authError.message.includes('already registered')
          ? '이미 가입된 이메일입니다. 로그인해 주세요.'
          : authError.message;
      setError(message);
    }
    // 성공하면 onAuthStateChange 가 세션을 올려 화면이 바뀐다
  }

  return (
    <div className={styles.authCard}>
      <div className={styles.authTabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signin'}
          className={`${styles.authTab} ${mode === 'signin' ? styles.authTabActive : ''}`}
          onClick={() => setMode('signin')}
        >
          로그인
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          className={`${styles.authTab} ${mode === 'signup' ? styles.authTabActive : ''}`}
          onClick={() => setMode('signup')}
        >
          회원가입
        </button>
      </div>

      <form className={styles.authForm} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>이메일</span>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>비밀번호</span>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />
        </label>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? '처리 중…' : mode === 'signin' ? '로그인' : '가입하기'}
        </button>
      </form>

      <p className={styles.authNote}>
        포트폴리오 데모 계정입니다. 실제 쓰는 비밀번호는 넣지 마세요 — 장바구니·견적
        저장 외에는 아무것도 하지 않습니다.
      </p>
    </div>
  );
}

function SavedBuilds() {
  const [builds, setBuilds] = useState<SavedBuild[] | null>(null);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(() => {
    listMyBuilds().then((result) => {
      if (result === null) setFailed(true);
      else setBuilds(result);
    });
  }, []);

  useEffect(reload, [reload]);

  async function handleDelete(id: string) {
    if (await deleteBuild(id)) reload();
  }

  if (failed) return <p className={styles.muted}>저장된 견적을 불러오지 못했습니다.</p>;
  if (builds === null) return <p className={styles.muted}>불러오는 중…</p>;
  if (builds.length === 0) {
    return (
      <p className={styles.muted}>
        저장된 견적이 없습니다. <Link href="/builder">견적짜기</Link>에서 구성을 만들고
        &ldquo;견적 저장&rdquo;을 누르면 여기 쌓입니다.
      </p>
    );
  }

  return (
    <ul className={styles.buildList}>
      {builds.map((build) => {
        const parts = SLOT_ORDER.filter((slot) => build.slots[slot]);
        const token = buildToken(build.slots);
        return (
          <li key={build.id} className={styles.buildItem}>
            <div className={styles.buildInfo}>
              <strong className={styles.buildName}>{build.name}</strong>
              <span className={styles.buildMeta}>
                {new Date(build.createdAt).toLocaleDateString('ko-KR')} · 부품{' '}
                {parts.length}개 ({parts.map((slot) => SLOT_LABELS[slot]).join(', ')})
              </span>
            </div>
            <div className={styles.buildActions}>
              <Link
                href={token ? `/builder?${SHARE_PARAM}=${token}` : '/builder'}
                className={styles.buildLoad}
              >
                불러오기 →
              </Link>
              <button
                type="button"
                className={styles.buildDelete}
                onClick={() => handleDelete(build.id)}
              >
                삭제
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function AccountView() {
  const { session, isReady } = useSession();

  async function handleSignOut() {
    await getSupabase()?.auth.signOut();
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 계정</h1>

      {!isReady ? null : !session ? (
        <AuthForm />
      ) : (
        <div className={styles.signedIn}>
          <div className={styles.profile}>
            <div>
              <p className={styles.email}>{session.user.email}</p>
              <p className={styles.muted}>
                가입일{' '}
                {session.user.created_at
                  ? new Date(session.user.created_at).toLocaleDateString('ko-KR')
                  : '—'}
              </p>
            </div>
            <button type="button" className={styles.signOut} onClick={handleSignOut}>
              로그아웃
            </button>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>저장된 견적</h2>
            <SavedBuilds />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>장바구니</h2>
            <p className={styles.muted}>
              장바구니는 로그인 중 자동으로 계정에 저장됩니다. 다른 기기에서 로그인하면
              양쪽 장바구니가 합쳐집니다. <Link href="/cart">장바구니 보기 →</Link>
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import styles from './HeroSlider.module.css';

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** 배너 배경 그라디언트. 실제 기획전 이미지가 들어올 자리다 */
  gradient: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: '이 사이트의 주력 기능',
    title: '부품을 고르면 호환성을 대신 검사합니다',
    description:
      '소켓, 메모리 규격, 그래픽카드 길이, 파워 용량까지. 조립하고 나서 안 맞는 걸 발견하는 일이 없도록.',
    ctaLabel: '견적 짜러 가기',
    ctaHref: '/builder',
    gradient: 'linear-gradient(120deg, #17233f, #0d0d12 60%)',
  },
  {
    eyebrow: '게이밍 PC 기획전',
    title: 'QHD 주력 구성 최대 14% 할인',
    description: '조립·세팅을 마치고 부하 테스트까지 거친 완제품을 배송합니다.',
    ctaLabel: '게이밍 PC 보기',
    ctaHref: '/category/gaming-pc',
    gradient: 'linear-gradient(120deg, #2a1a33, #0d0d12 60%)',
  },
  {
    eyebrow: '무이자 할부 안내',
    title: '전 카드사 3개월 무이자',
    description: '100만원 이상 결제 시 6개월까지 적용됩니다.',
    ctaLabel: '완제품 보기',
    ctaHref: '/category/overclock-pc',
    gradient: 'linear-gradient(120deg, #123328, #0d0d12 60%)',
  },
];

const INTERVAL_MS = 6000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  /** 사용자가 버튼을 눌렀는지. null 이면 시스템 설정을 따른다 */
  const [manualPlay, setManualPlay] = useState<boolean | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // 모션 최소화를 켠 사용자에게 자동 전환은 그 자체로 방해다. 기본값을 멈춤으로 둔다.
  const isPlaying = manualPlay ?? !prefersReducedMotion;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const slide = SLIDES[index];

  return (
    <section
      className={styles.hero}
      style={{ background: slide.gradient }}
      aria-roledescription="캐러셀"
      aria-label="기획전 배너"
    >
      <div className={styles.inner}>
        <div className={styles.content} key={index}>
          <span className={styles.eyebrow}>{slide.eyebrow}</span>
          <h1 className={styles.title}>{slide.title}</h1>
          <p className={styles.description}>{slide.description}</p>
          <Link href={slide.ctaHref} className={styles.cta}>
            {slide.ctaLabel} →
          </Link>
        </div>

        <div className={styles.controls}>
          {/* 자동재생 일시정지는 접근성 필수 항목이다 (설계문서 3-2) */}
          <button
            type="button"
            className={styles.playButton}
            onClick={() => setManualPlay(!isPlaying)}
            aria-label={isPlaying ? '배너 자동 전환 멈춤' : '배너 자동 전환 시작'}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>

          <div className={styles.dots} role="tablist" aria-label="배너 선택">
            {SLIDES.map((item, dotIndex) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`${dotIndex + 1}번 배너: ${item.title}`}
                className={`${styles.dot} ${dotIndex === index ? styles.dotActive : ''}`}
                onClick={() => {
                  setIndex(dotIndex);
                  setManualPlay(false);
                }}
              />
            ))}
          </div>

          <span className={styles.counter}>
            {index + 1} / {SLIDES.length}
          </span>
        </div>
      </div>
    </section>
  );
}

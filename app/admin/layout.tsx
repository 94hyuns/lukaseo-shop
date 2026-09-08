import type { Metadata } from 'next';
import AdminNav from '@/components/AdminNav';
import styles from './admin-layout.module.css';

/**
 * 관리자 섹션 공통 껍데기.
 *
 * 포트폴리오 데모라 일부러 잠그지 않고 공개한다 — 보는 사람이 운영 화면까지
 * 볼 수 있어야 설계가 전달된다. 실제 서비스라면 여기가 인증·권한(role) 체크
 * 미들웨어가 서는 자리다 (설계문서 9장). 쓰기 동작이 없는 이유도 같다:
 * 쓰기는 서버와 인증이 전제라 3단계(Supabase) 이후에 열린다.
 */

export const metadata: Metadata = {
  title: {
    default: '관리자',
    template: '%s | lukashop 관리자',
  },
  // 공개는 하되 검색엔진에 실릴 이유는 없다
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.banner}>
        <div className={styles.bannerInner}>
          <strong>관리자 화면 — 공개 데모</strong>
          <span className={styles.bannerNote}>
            포트폴리오라 인증 없이 열어뒀습니다. 가격·재고·상태는 Supabase DB를 실시간
            조회하며, 업로드·승인 같은 쓰기 동작은 인증·서버 API 단계에서 열립니다.
          </span>
        </div>
      </div>

      <AdminNav />

      {children}
    </div>
  );
}

import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: '대시보드',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}

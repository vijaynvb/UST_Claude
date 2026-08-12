import { Outlet } from 'react-router-dom';
import { TopNav } from '@/components/layout/TopNav';

export function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-cream">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}

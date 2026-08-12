import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-[422px] rounded-lg border border-border-soft bg-white p-10 shadow-[0_1px_3px_rgb(0_0_0/0.06)]">
        <Link to="/" className="mb-3.5 flex items-center gap-2">
          <span className="h-[30px] w-[30px] shrink-0 rounded-full border-2 border-ink bg-yellow" aria-hidden="true" />
          <span className="font-display text-2xl font-bold text-ink">Taskly</span>
        </Link>
        {children}
      </div>
    </div>
  );
}

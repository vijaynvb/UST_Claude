import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
];

export function TopNav() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initial = user?.email.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className="h-[26px] w-[26px] shrink-0 rounded-full border-2 border-ink bg-yellow" aria-hidden="true" />
          <span className="font-display text-xl font-bold text-ink">Taskly</span>
        </div>
        <nav className="flex items-center gap-1.5" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm',
                  isActive ? 'border-2 border-ink bg-yellow font-bold text-ink' : 'text-muted-strong hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Account menu"
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-ink bg-divider text-xs font-bold text-ink"
        >
          {initial}
        </button>
        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-10 mt-2 w-56 rounded-md border-2 border-ink bg-white p-2 shadow-[0_1px_3px_rgb(0_0_0/0.06)]"
          >
            <p className="truncate px-2 py-1 text-xs text-muted" title={user?.email}>
              {user?.email}
            </p>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="w-full rounded px-2 py-1.5 text-left text-sm text-ink hover:bg-cream"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

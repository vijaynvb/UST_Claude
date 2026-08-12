import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-cream text-center">
      <p className="font-display text-5xl font-bold text-ink">404</p>
      <p className="text-sm text-muted">This page doesn't exist.</p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}

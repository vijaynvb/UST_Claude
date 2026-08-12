import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface AlertProps {
  variant?: 'error' | 'info';
  children: ReactNode;
}

export function Alert({ variant = 'error', children }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-md border-2 px-3 py-2.5 text-sm',
        variant === 'error' && 'border-danger bg-danger/10 text-danger',
        variant === 'info' && 'border-ink bg-cream text-ink',
      )}
    >
      {children}
    </div>
  );
}

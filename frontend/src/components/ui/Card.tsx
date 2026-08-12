import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border-2 border-ink bg-white p-3.5 shadow-[0_1px_3px_rgb(0_0_0/0.06)]', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

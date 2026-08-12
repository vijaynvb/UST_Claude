import { useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function Select({ label, id, className, children, ...rest }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={selectId} className="text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          'w-full rounded-md border-2 border-ink bg-white px-3 py-2.5 text-sm text-ink',
          'focus:outline-none focus:ring-2 focus:ring-yellow',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

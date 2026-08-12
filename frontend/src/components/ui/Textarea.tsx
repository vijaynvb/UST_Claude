import { useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className, ...rest }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={textareaId} className="text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'w-full resize-none rounded-lg border-2 border-ink p-3 text-sm text-ink placeholder:text-placeholder',
          'focus:outline-none focus:ring-2 focus:ring-yellow',
          error && 'border-danger',
          className,
        )}
        rows={4}
        {...rest}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

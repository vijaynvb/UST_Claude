import { useId, type InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, id, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label htmlFor={checkboxId} className="flex cursor-pointer items-center gap-2 text-sm text-muted-strong">
      <input
        id={checkboxId}
        type="checkbox"
        className="h-[19px] w-[19px] shrink-0 rounded border-2 border-ink accent-ink"
        {...rest}
      />
      {label}
    </label>
  );
}

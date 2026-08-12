import type { TaskStatus } from '@/types/task';
import { cn } from '@/utils/cn';

const STATUS_STYLES: Record<TaskStatus, string> = {
  Pending: 'bg-white border-ink text-ink',
  'In Progress': 'bg-yellow border-ink text-ink',
  Completed: 'bg-ink border-ink text-white',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

import type { TaskPriority } from '@/types/task';

const PRIORITY_DOT_COLOR: Record<TaskPriority, string> = {
  Low: 'border-2 border-ink',
  Medium: 'bg-yellow border-2 border-ink',
  High: 'bg-danger border-2 border-ink',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-ink whitespace-nowrap">
      <span className={`h-[13px] w-[13px] shrink-0 rounded-full ${PRIORITY_DOT_COLOR[priority]}`} aria-hidden="true" />
      {priority}
    </span>
  );
}

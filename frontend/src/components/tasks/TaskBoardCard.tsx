import type { Task } from '@/types/task';
import { PriorityBadge } from '@/components/tasks/PriorityBadge';
import { formatDueDate, isOverdue } from '@/utils/date';
import { cn } from '@/utils/cn';

export function TaskBoardCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-1.5 rounded-md border-2 border-ink bg-white p-2.5 text-left hover:bg-cream"
    >
      <p className="text-xs font-semibold text-ink">{task.title}</p>
      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className={cn('text-[10px] whitespace-nowrap', overdue ? 'text-danger' : 'text-muted')}>
            {overdue ? 'Overdue' : formatDueDate(task.dueDate)}
          </span>
        )}
      </div>
    </button>
  );
}

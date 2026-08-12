import type { Task } from '@/types/task';
import type { TaskFormValues } from '@/components/tasks/TaskFormDrawer';

/**
 * PUT /tasks/:id re-validates the full payload's due date against "now" even when
 * it didn't change, so saving an already-overdue task (e.g. just marking it Completed)
 * would otherwise 400. Detecting a status-only change lets callers route through
 * PATCH /tasks/:id/status instead, which only touches status.
 */
export function isStatusOnlyChange(original: Task, values: TaskFormValues): boolean {
  return (
    values.status !== undefined &&
    values.status !== original.status &&
    values.title === original.title &&
    (values.description ?? null) === (original.description ?? null) &&
    (values.dueDate ?? null) === (original.dueDate ?? null) &&
    values.priority === original.priority
  );
}

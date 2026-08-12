import { useState } from 'react';
import { useTaskList } from '@/hooks/useTaskList';
import { taskService } from '@/services/task.service';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/tasks/StatusBadge';
import { PriorityBadge } from '@/components/tasks/PriorityBadge';
import { TaskFormDrawer, type TaskFormValues } from '@/components/tasks/TaskFormDrawer';
import { formatDueDate, isOverdue } from '@/utils/date';
import { isStatusOnlyChange } from '@/utils/taskDiff';
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskPriority, type TaskSortBy, type TaskStatus } from '@/types/task';
import { cn } from '@/utils/cn';

export function TasksPage() {
  const { tasks, pagination, params, setParams, isLoading, error, refetch } = useTaskList();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function openCreateDrawer() {
    setActiveTask(null);
    setIsDrawerOpen(true);
  }

  function openEditDrawer(task: Task) {
    setActiveTask(task);
    setIsDrawerOpen(true);
  }

  async function handleSubmit(values: TaskFormValues) {
    if (activeTask && isStatusOnlyChange(activeTask, values)) {
      await taskService.updateStatus(activeTask.id, { status: values.status! });
    } else if (activeTask) {
      await taskService.update(activeTask.id, {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        priority: values.priority,
        status: values.status,
      });
    } else {
      await taskService.create({
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        priority: values.priority,
      });
    }
    refetch();
  }

  async function handleDelete() {
    if (!activeTask) return;
    await taskService.remove(activeTask.id);
    refetch();
  }

  function toggleSortDirection() {
    setParams({ sortDir: params.sortDir === 'asc' ? 'desc' : 'asc', page: params.page });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Tasks</h1>
          {pagination && <p className="text-sm text-muted">{pagination.totalItems} tasks</p>}
        </div>
        <Button onClick={openCreateDrawer}>+ New task</Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full min-w-40 sm:w-44">
          <Select
            label="Status"
            value={params.status ?? 'All'}
            onChange={(event) =>
              setParams({ status: event.target.value === 'All' ? undefined : (event.target.value as TaskStatus) })
            }
          >
            <option value="All">All</option>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full min-w-40 sm:w-44">
          <Select
            label="Priority"
            value={params.priority ?? 'All'}
            onChange={(event) =>
              setParams({ priority: event.target.value === 'All' ? undefined : (event.target.value as TaskPriority) })
            }
          >
            <option value="All">All</option>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full min-w-40 sm:w-44">
          <Select
            label="Sort by"
            value={params.sortBy}
            onChange={(event) => setParams({ sortBy: event.target.value as TaskSortBy })}
          >
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created</option>
          </Select>
        </div>

        <button
          type="button"
          onClick={toggleSortDirection}
          aria-label={`Sort ${params.sortDir === 'asc' ? 'ascending' : 'descending'}`}
          className="mb-0.5 rounded-md border-2 border-ink px-3 py-2.5 text-sm text-ink"
        >
          {params.sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {error && <Alert>{error}</Alert>}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!isLoading && tasks.length === 0 && (
        <EmptyState title="No tasks found" description="Try adjusting your filters, or create a new task." />
      )}

      {!isLoading && tasks.length > 0 && (
        <div className="overflow-x-auto rounded-lg border-2 border-ink bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink text-[11px] font-bold uppercase tracking-wide text-muted">
                <th scope="col" className="px-4 py-3">
                  Task
                </th>
                <th scope="col" className="px-4 py-3">
                  Priority
                </th>
                <th scope="col" className="px-4 py-3">
                  Due
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <tr key={task.id} className="border-b border-dashed border-divider-strong last:border-b-0">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openEditDrawer(task)}
                        className="text-left font-medium text-ink underline-offset-2 hover:underline"
                      >
                        {task.title}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className={cn('px-4 py-3 text-xs', overdue ? 'text-danger' : 'text-ink')}>
                      {overdue ? `Overdue · ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {tasks.length} of {pagination.totalItems}
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setParams({ page })}
          />
        </div>
      )}

      <TaskFormDrawer
        isOpen={isDrawerOpen}
        task={activeTask}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        onDelete={activeTask ? handleDelete : undefined}
      />
    </div>
  );
}

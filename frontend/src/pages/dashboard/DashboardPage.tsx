import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { taskService } from '@/services/task.service';
import { TaskBoardCard } from '@/components/tasks/TaskBoardCard';
import { TaskFormDrawer, type TaskFormValues } from '@/components/tasks/TaskFormDrawer';
import { StatCard } from '@/components/dashboard/StatCard';
import { CompletionRing } from '@/components/dashboard/CompletionRing';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDueDate } from '@/utils/date';
import { isStatusOnlyChange } from '@/utils/taskDiff';
import type { Task, TaskStatus } from '@/types/task';

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'Pending', title: 'To do' },
  { status: 'In Progress', title: 'Doing' },
  { status: 'Completed', title: 'Done' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useDashboardData();
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Dashboard</h1>
          {user && <p className="text-sm text-muted">Welcome back, {user.email}</p>}
        </div>
        <Button onClick={openCreateDrawer}>+ New task</Button>
      </div>

      {error && <Alert>{error}</Alert>}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!isLoading && data && data.totalTasks === 0 && (
        <EmptyState title="No tasks yet" description="Create your first task to see it show up on the board." />
      )}

      {!isLoading && data && data.totalTasks > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_220px]">
          {COLUMNS.map((column) => (
            <div key={column.status} className="flex flex-col gap-2 rounded-lg border-2 border-ink bg-cream-dark p-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-ink">{column.title}</h2>
                <span className="text-xs font-bold text-muted">{data.columnTotals[column.status]}</span>
              </div>
              <div className="flex flex-col gap-2">
                {data.columns[column.status].length === 0 && (
                  <p className="rounded-md border-2 border-dashed border-outline px-2 py-4 text-center text-xs text-placeholder">
                    No tasks
                  </p>
                )}
                {data.columns[column.status].map((task) => (
                  <TaskBoardCard key={task.id} task={task} onClick={() => openEditDrawer(task)} />
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <StatCard label="Due today">
              <p className="font-display text-3xl font-bold text-ink">{data.dueTodayCount}</p>
            </StatCard>
            <StatCard label="Completion">
              <CompletionRing percent={data.completionRate} />
            </StatCard>
            <StatCard label="Overdue">
              {data.overdueTasks.length === 0 ? (
                <p className="text-xs text-placeholder">Nothing overdue</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {data.overdueTasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="flex items-center gap-2 text-xs text-ink">
                      <span className="h-[13px] w-[13px] shrink-0 rounded-full border-2 border-ink bg-danger" />
                      <span className="truncate">{task.title}</span>
                      <span className="ml-auto shrink-0 text-[10px] text-danger">{formatDueDate(task.dueDate)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </StatCard>
          </div>
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

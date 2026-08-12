import { useCallback, useEffect, useState } from 'react';
import { taskService } from '@/services/task.service';
import type { Task, TaskStatus } from '@/types/task';
import { isDueToday, isOverdue } from '@/utils/date';

const BOARD_STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
const BOARD_PAGE_SIZE = 100;

export interface DashboardData {
  columns: Record<TaskStatus, Task[]>;
  columnTotals: Record<TaskStatus, number>;
  totalTasks: number;
  dueTodayCount: number;
  overdueTasks: Task[];
  completionRate: number;
}

interface UseDashboardDataResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => setRefetchToken((token) => token + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          BOARD_STATUSES.map((status) =>
            taskService.list({ status, page: 1, pageSize: BOARD_PAGE_SIZE, sortBy: 'dueDate', sortDir: 'asc' }),
          ),
        );
        if (cancelled) return;

        const columns = {} as Record<TaskStatus, Task[]>;
        const columnTotals = {} as Record<TaskStatus, number>;
        const allTasks: Task[] = [];

        BOARD_STATUSES.forEach((status, index) => {
          const response = responses[index];
          columns[status] = response.items;
          columnTotals[status] = response.pagination.totalItems;
          allTasks.push(...response.items);
        });

        const totalTasks = Object.values(columnTotals).reduce((sum, count) => sum + count, 0);
        const dueTodayCount = allTasks.filter((task) => isDueToday(task.dueDate) && task.status !== 'Completed').length;
        const overdueTasks = allTasks.filter((task) => isOverdue(task.dueDate, task.status));
        const completionRate = totalTasks === 0 ? 0 : Math.round((columnTotals.Completed / totalTasks) * 100);

        setData({ columns, columnTotals, totalTasks, dueTodayCount, overdueTasks, completionRate });
      } catch {
        if (!cancelled) setError('Unable to load your dashboard right now. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refetchToken]);

  return { data, isLoading, error, refetch };
}

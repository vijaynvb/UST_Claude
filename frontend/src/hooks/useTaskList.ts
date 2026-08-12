import { useCallback, useEffect, useState } from 'react';
import { taskService } from '@/services/task.service';
import type { PaginationMeta, Task, TaskListParams } from '@/types/task';

const DEFAULT_PARAMS: TaskListParams = {
  page: 1,
  pageSize: 10,
  sortBy: 'dueDate',
  sortDir: 'asc',
};

interface UseTaskListResult {
  tasks: Task[];
  pagination: PaginationMeta | null;
  params: TaskListParams;
  setParams: (updates: Partial<TaskListParams>) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTaskList(initialParams: Partial<TaskListParams> = {}): UseTaskListResult {
  const [params, setParamsState] = useState<TaskListParams>({ ...DEFAULT_PARAMS, ...initialParams });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const setParams = useCallback((updates: Partial<TaskListParams>) => {
    setParamsState((current) => {
      const resetsPage = !('page' in updates);
      return { ...current, ...updates, page: resetsPage ? 1 : (updates.page ?? current.page) };
    });
  }, []);

  const refetch = useCallback(() => setRefetchToken((token) => token + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await taskService.list(params);
        if (cancelled) return;
        setTasks(response.items);
        setPagination(response.pagination);
      } catch {
        if (!cancelled) setError('Unable to load tasks right now. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params, refetchToken]);

  return { tasks, pagination, params, setParams, isLoading, error, refetch };
}

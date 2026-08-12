export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
}

export interface TaskUpdateRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface TaskStatusUpdateRequest {
  status: TaskStatus;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface TaskListResponse {
  items: Task[];
  pagination: PaginationMeta;
}

export type TaskSortBy = 'dueDate' | 'priority' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface TaskListParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  pageSize?: number;
  sortBy?: TaskSortBy;
  sortDir?: SortDirection;
}

export const TASK_STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];

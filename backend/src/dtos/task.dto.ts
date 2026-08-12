import type { TaskPriority, TaskStatus } from '../models/task.model';
import type { PaginationMetaDto } from './common.dto';

export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequestDto {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
}

export interface TaskUpdateRequestDto {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface TaskStatusUpdateRequestDto {
  status: TaskStatus;
}

export interface TaskListQueryDto {
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  pageSize: number;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortDir: 'asc' | 'desc';
}

export interface TaskListResponseDto {
  items: TaskDto[];
  pagination: PaginationMetaDto;
}

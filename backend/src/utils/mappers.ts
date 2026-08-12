import type { UserDto } from '../dtos/auth.dto';
import type { TaskDto } from '../dtos/task.dto';
import type { TaskRow } from '../models/task.model';
import type { UserRow } from '../models/user.model';

export function toUserDto(row: UserRow): UserDto {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toTaskDto(row: TaskRow): TaskDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

import { randomUUID } from 'crypto';
import type {
  TaskCreateRequestDto,
  TaskDto,
  TaskListQueryDto,
  TaskListResponseDto,
  TaskStatusUpdateRequestDto,
  TaskUpdateRequestDto,
} from '../dtos/task.dto';
import type { TaskRow } from '../models/task.model';
import { AppError } from '../utils/AppError';
import { toTaskDto } from '../utils/mappers';
import type { TaskRepository } from '../repositories/task.repository';

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  list(userId: string, query: TaskListQueryDto): TaskListResponseDto {
    const { items, totalItems } = this.taskRepository.list({ userId, ...query });

    return {
      items: items.map(toTaskDto),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / query.pageSize)),
      },
    };
  }

  getById(userId: string, taskId: string): TaskDto {
    return toTaskDto(this.getOwnedTaskOrThrow(userId, taskId));
  }

  create(userId: string, input: TaskCreateRequestDto): TaskDto {
    this.assertDueDateNotInPast(input.dueDate ?? null);

    const now = new Date().toISOString();
    const task = this.taskRepository.create({
      id: randomUUID(),
      userId,
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      priority: input.priority ?? 'Medium',
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    });

    return toTaskDto(task);
  }

  update(userId: string, taskId: string, input: TaskUpdateRequestDto): TaskDto {
    this.getOwnedTaskOrThrow(userId, taskId);
    this.assertDueDateNotInPast(input.dueDate ?? null);

    const updated = this.taskRepository.update(taskId, {
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      priority: input.priority ?? 'Medium',
      status: input.status ?? 'Pending',
      updatedAt: new Date().toISOString(),
    });

    return toTaskDto(updated);
  }

  updateStatus(userId: string, taskId: string, input: TaskStatusUpdateRequestDto): TaskDto {
    const existing = this.getOwnedTaskOrThrow(userId, taskId);

    if (existing.status === 'Completed' && input.status !== 'Completed') {
      throw AppError.unprocessable('A completed task cannot be reopened via this endpoint.');
    }

    const updated = this.taskRepository.updateStatus(taskId, input.status, new Date().toISOString());
    return toTaskDto(updated);
  }

  delete(userId: string, taskId: string): void {
    this.getOwnedTaskOrThrow(userId, taskId);
    this.taskRepository.softDelete(taskId, new Date().toISOString());
  }

  private getOwnedTaskOrThrow(userId: string, taskId: string): TaskRow {
    const task = this.taskRepository.findActiveById(taskId);
    if (!task) {
      throw AppError.notFound('Task not found.');
    }
    if (task.user_id !== userId) {
      throw AppError.forbidden();
    }
    return task;
  }

  private assertDueDateNotInPast(dueDate: string | null): void {
    if (!dueDate) return;
    if (new Date(dueDate).getTime() < Date.now()) {
      throw AppError.badRequest('Due date cannot be in the past.');
    }
  }
}

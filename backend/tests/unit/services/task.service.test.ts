import { TaskService } from '../../../src/services/task.service';
import { AppError } from '../../../src/utils/AppError';
import type { TaskRepository } from '../../../src/repositories/task.repository';
import type { TaskRow } from '../../../src/models/task.model';

function buildTaskRow(overrides: Partial<TaskRow> = {}): TaskRow {
  return {
    id: 'task-1',
    user_id: 'user-1',
    title: 'Finish architecture doc',
    description: null,
    due_date: null,
    priority: 'Medium',
    status: 'Pending',
    deleted_at: null,
    created_at: '2026-08-10T09:00:00.000Z',
    updated_at: '2026-08-10T09:00:00.000Z',
    ...overrides,
  };
}

describe('TaskService', () => {
  let taskRepository: jest.Mocked<TaskRepository>;
  let taskService: TaskService;

  beforeEach(() => {
    taskRepository = {
      findActiveById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      softDelete: jest.fn(),
      list: jest.fn(),
    } as unknown as jest.Mocked<TaskRepository>;

    taskService = new TaskService(taskRepository);
  });

  describe('create', () => {
    it('creates a task owned by the requesting user, defaulting status to Pending', () => {
      taskRepository.create.mockImplementation((input) =>
        buildTaskRow({ id: input.id, title: input.title, priority: input.priority }),
      );

      const result = taskService.create('user-1', { title: 'Finish architecture doc' });

      expect(result.status).toBe('Pending');
      expect(taskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', status: 'Pending', priority: 'Medium' }),
      );
    });

    it('rejects a due date in the past', () => {
      expect(() =>
        taskService.create('user-1', {
          title: 'Finish architecture doc',
          dueDate: '2020-01-01T00:00:00Z',
        }),
      ).toThrow(AppError);
    });
  });

  describe('getById', () => {
    it('returns the task when owned by the requesting user', () => {
      taskRepository.findActiveById.mockReturnValue(buildTaskRow());

      const result = taskService.getById('user-1', 'task-1');

      expect(result.id).toBe('task-1');
    });

    it('throws 404 when the task does not exist', () => {
      taskRepository.findActiveById.mockReturnValue(undefined);

      try {
        taskService.getById('user-1', 'missing-task');
        fail('expected AppError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('throws 403 when the task belongs to a different user', () => {
      taskRepository.findActiveById.mockReturnValue(buildTaskRow({ user_id: 'other-user' }));

      try {
        taskService.getById('user-1', 'task-1');
        fail('expected AppError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(403);
      }
    });
  });

  describe('updateStatus', () => {
    it('rejects reopening a completed task via the status endpoint', () => {
      taskRepository.findActiveById.mockReturnValue(buildTaskRow({ status: 'Completed' }));

      try {
        taskService.updateStatus('user-1', 'task-1', { status: 'Pending' });
        fail('expected AppError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(422);
      }
      expect(taskRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('allows transitioning a non-completed task to Completed', () => {
      taskRepository.findActiveById.mockReturnValue(buildTaskRow({ status: 'In Progress' }));
      taskRepository.updateStatus.mockReturnValue(buildTaskRow({ status: 'Completed' }));

      const result = taskService.updateStatus('user-1', 'task-1', { status: 'Completed' });

      expect(result.status).toBe('Completed');
    });
  });

  describe('delete', () => {
    it('soft-deletes a task owned by the requesting user', () => {
      taskRepository.findActiveById.mockReturnValue(buildTaskRow());

      taskService.delete('user-1', 'task-1');

      expect(taskRepository.softDelete).toHaveBeenCalledWith('task-1', expect.any(String));
    });
  });
});

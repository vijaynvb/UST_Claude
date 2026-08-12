import { apiClient } from '@/services/apiClient';
import type {
  Task,
  TaskCreateRequest,
  TaskListParams,
  TaskListResponse,
  TaskStatusUpdateRequest,
  TaskUpdateRequest,
} from '@/types/task';

export const taskService = {
  async list(params: TaskListParams): Promise<TaskListResponse> {
    const response = await apiClient.get<TaskListResponse>('/tasks', { params });
    return response.data;
  },

  async getById(taskId: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },

  async create(payload: TaskCreateRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', payload);
    return response.data;
  },

  async update(taskId: string, payload: TaskUpdateRequest): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${taskId}`, payload);
    return response.data;
  },

  async updateStatus(taskId: string, payload: TaskStatusUpdateRequest): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${taskId}/status`, payload);
    return response.data;
  },

  async remove(taskId: string): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  },
};

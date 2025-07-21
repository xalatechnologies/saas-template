import { apiClient } from './api-client';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types';

export class TaskService {
  public async getTasks(): Promise<Task[]> {
    return apiClient.get<Task[]>('/tasks');
  }

  public async getTask(id: string): Promise<Task> {
    return apiClient.get<Task>(`/tasks/${id}`);
  }

  public async createTask(task: CreateTaskInput): Promise<Task> {
    return apiClient.post<Task>('/tasks', task);
  }

  public async updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
    return apiClient.patch<Task>(`/tasks/${id}`, updates);
  }

  public async deleteTask(id: string): Promise<void> {
    return apiClient.delete<void>(`/tasks/${id}`);
  }

  public async getTasksByStatus(status: string): Promise<Task[]> {
    return apiClient.get<Task[]>(`/tasks?status=${status}`);
  }

  public async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    return apiClient.get<Task[]>(`/tasks?assignee=${assigneeId}`);
  }

  public async searchTasks(query: string): Promise<Task[]> {
    return apiClient.get<Task[]>(`/tasks/search?q=${encodeURIComponent(query)}`);
  }
}

export const taskService = new TaskService();
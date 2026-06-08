import { apiClient } from './api-client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedToId: string;
  clientId?: string;
  filingId?: string;
  priority: string;
  status: string;
  dueAt?: string;
  assignedTo?: { id: string; name: string; email: string };
  client?: { id: string; displayName: string };
  filing?: { id: string; category: string };
  createdAt: string;
}

export const tasksService = {
  list: (params?: { status?: string; assignedToId?: string; clientId?: string; priority?: string; page?: number; limit?: number }) =>
    apiClient.get<any>('/tasks', params as any),

  getById: (id: string) =>
    apiClient.get<Task>(`/tasks/${id}`),

  create: (data: { title: string; description?: string; assignedToId: string; clientId?: string; filingId?: string; priority?: string; dueAt?: string }) =>
    apiClient.post<Task>('/tasks', data),

  update: (id: string, data: { title?: string; description?: string; status?: string; priority?: string; assignedToId?: string; dueAt?: string }) =>
    apiClient.patch<Task>(`/tasks/${id}`, data),
};

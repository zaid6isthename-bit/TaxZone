import { apiClient } from './api-client';

export interface Notification {
  id: string;
  recipientId: string;
  channel: string;
  eventType: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  readAt?: string;
}

export const notificationsService = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<any>('/notifications', params as any),

  markRead: (id: string) =>
    apiClient.patch<{ message: string }>(`/notifications/${id}/read`),

  markAllRead: () =>
    apiClient.patch<{ message: string }>('/notifications/read-all'),

  getUnreadCount: () =>
    apiClient.get<{ unreadCount: number }>('/notifications/unread-count'),
};

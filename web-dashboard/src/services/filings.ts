import { apiClient } from './api-client';

export interface Filing {
  id: string;
  clientId: string;
  category: string;
  periodStart: string;
  periodEnd: string;
  dueAt: string;
  status: string;
  assignedEmployeeId?: string;
  client?: { id: string; displayName: string; pan?: string; gstin?: string };
  assignedEmployee?: { id: string; name: string };
  reviewer?: { id: string; name: string };
  docRequests?: any[];
  documents?: any[];
  tasks?: any[];
  _count?: { documents: number; tasks: number };
}

export const filingsService = {
  list: (params?: { clientId?: string; status?: string; category?: string; assignedEmployeeId?: string; page?: number; limit?: number }) =>
    apiClient.get<any>('/filings', params as any),

  getById: (id: string) =>
    apiClient.get<Filing>(`/filings/${id}`),

  create: (data: { clientId: string; category: string; periodStart: string; periodEnd: string; dueAt: string; assignedEmployeeId?: string }) =>
    apiClient.post<Filing>('/filings', data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch<Filing>(`/filings/${id}/status`, { status }),

  getStats: () =>
    apiClient.get<any>('/filings/stats'),
};

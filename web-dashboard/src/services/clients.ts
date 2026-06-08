import { apiClient } from './api-client';

export interface Client {
  id: string;
  displayName: string;
  businessType: string;
  filingCategory: string;
  pan?: string;
  gstin?: string;
  onboardingStatus: string;
  assignedEmployeeId?: string;
  clientUser?: { id: string; email: string; name: string; phone: string; status: string };
  assignedEmployee?: { id: string; name: string; email: string };
  _count?: { filings: number; documents: number; tasks: number };
  filings?: any[];
  documents?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export const clientsService = {
  list: (params?: { page?: number; limit?: number; search?: string; status?: string; assignedEmployeeId?: string }) =>
    apiClient.get<PaginatedResponse<Client>>('/clients', params as any),

  getById: (id: string) =>
    apiClient.get<Client>(`/clients/${id}`),

  create: (data: { displayName: string; email: string; phone?: string; businessType?: string; filingCategory?: string; pan?: string; gstin?: string; assignedEmployeeId?: string }) =>
    apiClient.post<{ client: Client; tempPassword: string }>('/clients', data),

  update: (id: string, data: Partial<Client>) =>
    apiClient.patch<Client>(`/clients/${id}`, data),

  assign: (id: string, employeeId: string) =>
    apiClient.post<Client>(`/clients/${id}/assign`, { employeeId }),

  delete: (id: string) =>
    apiClient.delete<{ message: string }>(`/clients/${id}`),
};

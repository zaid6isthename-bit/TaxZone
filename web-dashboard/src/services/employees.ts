import { apiClient } from './api-client';

export interface Employee {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType: string;
  status: string;
  employeeProfile?: { department?: string; workloadLimit: number };
  _count?: { clients: number; assignedFilings: number; tasks: number };
}

export const employeesService = {
  list: (params?: { page?: number; limit?: number; department?: string }) =>
    apiClient.get<any>('/employees', params as any),

  getById: (id: string) =>
    apiClient.get<Employee>(`/employees/${id}`),

  create: (data: { email: string; name: string; phone?: string; department?: string; userType: string }) =>
    apiClient.post<{ user: Employee; tempPassword: string }>('/employees', data),

  delete: (id: string) =>
    apiClient.delete<{ message: string }>(`/employees/${id}`),
};

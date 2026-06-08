import { apiClient } from './api-client';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    organizationId?: string;
    isFirstLogin: boolean;
  };
}

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/auth/login', { email, password }),

  register: (data: { email: string; password: string; name: string; phone?: string; businessName?: string }) =>
    apiClient.post<LoginResponse>('/auth/register', data),

  refresh: (refreshToken: string) =>
    apiClient.post<LoginResponse>('/auth/refresh', { refreshToken }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }),

  getProfile: () =>
    apiClient.get<any>('/auth/me'),
};

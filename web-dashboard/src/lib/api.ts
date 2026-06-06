import { useAuthStore } from './store';

/**
 * Production-ready API client using native fetch.
 * This avoids dependency issues with axios while providing
 * the same interceptor-like functionality for auth.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const { accessToken, logout } = useAuthStore.getState();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-App-Platform': 'web',
    'X-App-Version': process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

const apiClient = {
  get: (url: string, options?: any) => {
    const query = options?.params ? '?' + new URLSearchParams(options.params).toString() : '';
    return apiRequest(`${url}${query}`, { method: 'GET' }).then(data => ({ data }));
  },
  post: (url: string, body: any) => apiRequest(url, { method: 'POST', body: JSON.stringify(body) }).then(data => ({ data })),
  put: (url: string, body: any) => apiRequest(url, { method: 'PUT', body: JSON.stringify(body) }).then(data => ({ data })),
  delete: (url: string) => apiRequest(url, { method: 'DELETE' }).then(data => ({ data })),
};

export default apiClient;

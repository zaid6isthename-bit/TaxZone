import { apiClient } from './api-client';

export interface DocumentRequest {
  id: string;
  clientId: string;
  filingId?: string;
  documentType: string;
  description?: string;
  status: string;
  dueAt?: string;
  requestedBy?: { id: string; name: string };
  client?: { id: string; displayName: string };
  documents?: { id: string; originalFilename: string; verificationStatus: string; createdAt: string }[];
}

export interface Document {
  id: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  verificationStatus: string;
  storageKey: string;
  uploadedBy?: { id: string; name: string };
  client?: { id: string; displayName: string };
  request?: { id: string; documentType: string };
  createdAt: string;
}

export const documentsService = {
  createRequest: (data: { clientId: string; filingId?: string; documentType: string; description?: string; dueAt?: string }) =>
    apiClient.post<DocumentRequest>('/documents/requests', data),

  getRequests: (params?: { clientId?: string; filingId?: string; status?: string; page?: number; limit?: number }) =>
    apiClient.get<any>('/documents/requests', params as any),

  upload: (requestId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.postFormData<Document>(`/documents/requests/${requestId}/upload`, formData);
  },

  verify: (id: string, status: 'approved' | 'rejected', rejectionReason?: string) =>
    apiClient.patch<Document>(`/documents/${id}/verify`, { status, rejectionReason }),

  list: (params?: { clientId?: string; filingId?: string; status?: string; page?: number; limit?: number }) =>
    apiClient.get<any>('/documents', params as any),
};

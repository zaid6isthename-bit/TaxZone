import { apiClient } from './api-client';

export interface SearchResults {
  clients: { id: string; displayName: string; pan?: string; gstin?: string; businessType: string }[];
  filings: { id: string; category: string; status: string; dueAt: string; client: { displayName: string } }[];
  documents: { id: string; originalFilename: string; mimeType: string; verificationStatus: string; client: { displayName: string } }[];
  tasks: { id: string; title: string; status: string; priority: string; assignedTo: { name: string } }[];
  users: { id: string; name: string; email: string; userType: string }[];
}

export const searchService = {
  search: (query: string) =>
    apiClient.get<SearchResults>('/search', { q: query }),
};

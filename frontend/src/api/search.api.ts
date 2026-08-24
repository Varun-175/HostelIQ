import apiClient from './client';

export interface SearchResults {
  students: any[];
  rooms: any[];
}

export const globalSearch = async (query: string): Promise<SearchResults> => {
  const response = await apiClient.get('/search', { params: { q: query } });
  return response.data.data;
};

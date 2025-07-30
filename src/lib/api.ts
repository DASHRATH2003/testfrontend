import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export const movieApi = {
  create: (data: any) => api.post('/movies', { ...data, type: 'movie' }),
  getAll: (page: number, limit: number) => 
    api.get<PaginatedResponse<any>>(`/movies?page=${page}&limit=${limit}`),
  update: (id: string, data: any) => api.put(`/movies/${id}`, { ...data, type: 'movie' }),
  delete: (id: string) => api.delete(`/movies/${id}`),
};

export const tvShowApi = {
  create: (data: any) => api.post('/tvshows', { ...data, type: 'tvshow' }),
  getAll: (page: number, limit: number) => 
    api.get<PaginatedResponse<any>>(`/tvshows?page=${page}&limit=${limit}`),
  update: (id: string, data: any) => api.put(`/tvshows/${id}`, { ...data, type: 'tvshow' }),
  delete: (id: string) => api.delete(`/tvshows/${id}`),
}; 
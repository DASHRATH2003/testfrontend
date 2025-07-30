import axios from 'axios';
import type { Movie, TVShow } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

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
  create: (data: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Movie>('/movies', { ...data, type: 'movie' }),
  getAll: (page: number, limit: number) => 
    api.get<PaginatedResponse<Movie>>(`/movies?page=${page}&limit=${limit}`),
  update: (id: string, data: Partial<Movie>) => 
    api.put<Movie>(`/movies/${id}`, { ...data, type: 'movie' }),
  delete: (id: string) => api.delete(`/movies/${id}`),
};

export const tvShowApi = {
  create: (data: Omit<TVShow, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<TVShow>('/tvshows', { ...data, type: 'tvshow' }),
  getAll: (page: number, limit: number) => 
    api.get<PaginatedResponse<TVShow>>(`/tvshows?page=${page}&limit=${limit}`),
  update: (id: string, data: Partial<TVShow>) => 
    api.put<TVShow>(`/tvshows/${id}`, { ...data, type: 'tvshow' }),
  delete: (id: string) => api.delete(`/tvshows/${id}`),
}; 
import apiClient from './client';
import { User } from '../contexts/AuthContext';

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data.data;
};
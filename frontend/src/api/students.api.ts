import apiClient from './client';

export interface StudentPreferences {
  roomType: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  floor?: number;
}

export interface StudentProfile {
  _id: string;
  name: string;
  registerNo: string;
  department: string;
  year: number;
  preferences: StudentPreferences;
  allocation?: {
    roomNo: number;
    score: number;
  };
}

export const getStudentProfile = async (id: string): Promise<StudentProfile> => {
  const response = await apiClient.get(`/students/${id}`);
  return response.data.data;
};

export const getStudents = async (): Promise<StudentProfile[]> => {
  const response = await apiClient.get('/students');
  return response.data.data;
};

export const createStudent = async (data: Omit<StudentProfile, '_id' | 'allocation'>): Promise<StudentProfile> => {
  const response = await apiClient.post('/students', data);
  return response.data.data;
};

export const deleteStudent = async (id: string): Promise<StudentProfile> => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data.data;
};

export const updateStudentPreferences = async (id: string, preferences: StudentPreferences): Promise<StudentProfile> => {
  const response = await apiClient.put(`/students/${id}`, { preferences });
  return response.data.data;
};

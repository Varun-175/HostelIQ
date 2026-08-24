import apiClient from './client';

export interface AnalyticsData {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  totalStudents: number;
  utilization: number;
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await apiClient.get('/analytics');
  return response.data.data;
};

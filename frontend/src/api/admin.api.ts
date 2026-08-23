import apiClient from './client';

/* ═══════════════════════════════════════════════
   TYPES — Match real backend admin controller
   ═══════════════════════════════════════════════ */

export interface DashboardMetrics {
  totalStudents: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  partialRooms: number;
  fullRooms: number;
  maintenanceRooms: number;
  utilization: number;
  pendingRequests: number;
  allocationsToday: number;
}

export interface AllocationRequestItem {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    registerNo: string;
    department: string;
  };
  preferences: {
    roomType?: string;
    preferredFloor?: number;
    preferredBlock?: string;
  };
  priority: number;
  status: string;
  requestedAt: string;
  createdAt: string;
}

/* ═══════════════════════════════════════════════
   API CALLS — Match actual admin routes
   ═══════════════════════════════════════════════ */

export const getAdminDashboard = async (): Promise<DashboardMetrics> => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data.data;
};

export const getAllocationRequests = async (status?: string, page = 1, limit = 50): Promise<{ data: AllocationRequestItem[]; metadata: { total: number; page: number; limit: number } }> => {
  const params: Record<string, any> = { page, limit };
  if (status) params.status = status;
  const response = await apiClient.get('/admin/allocation-requests', { params });
  return { data: response.data.data, metadata: response.data.metadata };
};

export const reviewAllocation = async (allocationId: string) => {
  const response = await apiClient.get(`/admin/allocations/${allocationId}/review`);
  return response.data.data;
};

export const approveAllocation = async (allocationId: string) => {
  const response = await apiClient.post(`/admin/allocations/${allocationId}/approve`);
  return response.data.data;
};

export const rejectAllocation = async (allocationId: string, reason: string) => {
  const response = await apiClient.post(`/admin/allocations/${allocationId}/reject`, { reason });
  return response.data.data;
};

export const overrideAllocation = async (allocationId: string, roomId: string, reason: string) => {
  const response = await apiClient.post(`/admin/allocations/${allocationId}/override`, { roomId, reason });
  return response.data.data;
};

export const adminCreateRoom = async (roomData: any) => {
  const response = await apiClient.post('/admin/rooms', roomData);
  return response.data.data;
};

export const adminUpdateRoomStatus = async (roomId: string, status: string) => {
  const response = await apiClient.patch(`/admin/rooms/${roomId}/status`, { status });
  return response.data.data;
};

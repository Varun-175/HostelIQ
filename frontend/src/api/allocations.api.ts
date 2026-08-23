/// <reference types="vite/client" />
import apiClient from './client';

/* ═══════════════════════════════════════════════
   TYPES — Match real backend Allocation model
   ═══════════════════════════════════════════════ */

export interface ScoreBreakdown {
  roomType: number;
  floor: number;
  capacity: number;
  occupancy: number;
  fairness: number;
}

export interface SmartFitMeta {
  totalScore: number;
  rank: number;
  candidatesEvaluated: number;
}

export interface AllocationResponse {
  _id: string;
  studentId: any; // populated with { name, registerNo, department }
  roomId?: string;
  roomNo: number;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  smartFit?: SmartFitMeta;
  reason: string;
  status: 'PENDING' | 'ALLOCATED' | 'CANCELLED';
  allocatedAt: string;
  allocatedBy: 'SYSTEM' | 'ADMIN';
  override?: boolean;
  overrideReason?: string;
}

/* ═══════════════════════════════════════════════
   API CALLS
   ═══════════════════════════════════════════════ */

export const requestAllocation = async (studentId: string): Promise<AllocationResponse> => {
  const response = await apiClient.post('/allocations/allocate', { studentId });
  return response.data.data;
};

export const getAllocations = async (): Promise<AllocationResponse[]> => {
  const response = await apiClient.get('/allocations');
  return response.data.data;
};

export const getStudentAllocation = async (studentId: string): Promise<AllocationResponse | null> => {
  try {
    const response = await apiClient.get(`/allocations/${studentId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

export const getStudentAllocationHistory = async (studentId: string) => {
  const response = await apiClient.get(`/allocations/${studentId}/history`);
  return response.data.data;
};

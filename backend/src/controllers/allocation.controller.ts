import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as allocationService from '../services/allocation.service';

export const allocate = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }
    const allocation = await allocationService.allocateStudent(studentId);
    res.status(200).json({ success: true, data: allocation });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllocations = async (req: Request, res: Response) => {
  try {
    const allocations = await allocationService.getAllocations();
    res.status(200).json({ success: true, data: allocations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentAllocation = async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }
    const allocation = await allocationService.getAllocationByStudentId(req.params.studentId as string);
    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation not found for this student' });
    }
    res.status(200).json({ success: true, data: allocation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

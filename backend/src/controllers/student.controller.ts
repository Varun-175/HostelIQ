import { Request, Response } from 'express';
import * as studentService from '../services/student.service';

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await studentService.getStudents();
    res.status(200).json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudentById(req.params.id as string);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

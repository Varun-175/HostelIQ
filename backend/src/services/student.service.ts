import { Student, IStudent } from '../models/Student';

export const createStudent = async (data: Partial<IStudent>): Promise<IStudent> => {
  const student = new Student(data);
  return await student.save();
};

export const getStudents = async (): Promise<IStudent[]> => {
  return await Student.find().sort({ createdAt: -1 });
};

export const getStudentById = async (id: string): Promise<IStudent | null> => {
  return await Student.findById(id);
};

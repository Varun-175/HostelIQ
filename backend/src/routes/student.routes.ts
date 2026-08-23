import { Router } from 'express';
import * as studentController from '../controllers/student.controller';

const router = Router();

router.post('/', studentController.registerStudent);
router.get('/', studentController.getStudents);
router.get('/register/:registerNo', studentController.getStudentByRegisterNo);
router.get('/:id', studentController.getStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

export default router;

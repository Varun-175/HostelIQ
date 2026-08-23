import { Router } from 'express';
import * as studentController from '../controllers/student.controller';

const router = Router();

router.post('/', studentController.registerStudent);
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudent);

export default router;

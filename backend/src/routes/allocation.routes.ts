import { Router } from 'express';
import * as allocationController from '../controllers/allocation.controller';

const router = Router();

router.post('/allocate', allocationController.allocate);
router.get('/', allocationController.getAllocations);
router.get('/:studentId/history', allocationController.getStudentAllocationHistory);
router.get('/:studentId', allocationController.getStudentAllocation);

export default router;

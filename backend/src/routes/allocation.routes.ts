import { Router } from 'express';
import * as allocationController from '../controllers/allocation.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeAnyPermission } from '../middleware/rbacMiddleware';

const router = Router();

router.post('/allocate', allocationController.allocate);
router.get('/', allocationController.getAllocations);
router.get('/:studentId/history', allocationController.getStudentAllocationHistory);
router.post('/:studentId/vacate', authenticate, authorizeAnyPermission(['allocation.request', 'allocation.manage']), allocationController.vacateStudent);
router.get('/:studentId', allocationController.getStudentAllocation);

export default router;

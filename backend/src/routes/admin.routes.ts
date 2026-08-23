import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorizePermission } from '../middleware/rbacMiddleware';

const router = Router();

// Protect all admin routes
router.use(authenticate);

router.get(
  '/dashboard',
  authorizePermission('analytics.read'),
  adminController.getDashboard
);

router.get(
  '/allocation-requests',
  authorizePermission('allocation.manage'),
  adminController.getAllocationRequests
);

router.post(
  '/rooms',
  authorizePermission('room.manage'),
  adminController.createRoom
);

router.patch(
  '/rooms/:id/status',
  authorizePermission('room.manage'),
  adminController.updateRoomStatus
);

router.get(
  '/allocations/:id/review',
  authorizePermission('allocation.manage'),
  adminController.reviewAllocation
);

router.post(
  '/allocations/:id/override',
  authorizePermission('allocation.override'),
  adminController.overrideAllocation
);

router.get(
  '/audit-logs',
  authorizePermission('analytics.read'),
  adminController.getAuditLogs
);

export default router;

import { Router } from 'express';
import * as roomController from '../controllers/room.controller';
import { authenticate } from '../middleware/authMiddleware';
import { authorizePermission } from '../middleware/rbacMiddleware';

const router = Router();

router.get('/', roomController.getRooms);
router.post('/', authenticate, authorizePermission('room.manage'), roomController.createRoom);
router.put('/:roomNo', authenticate, authorizePermission('room.manage'), roomController.updateRoom);
router.delete('/:roomNo', authenticate, authorizePermission('room.manage'), roomController.deleteRoom);
router.get('/:roomNo', roomController.getRoom);

export default router;

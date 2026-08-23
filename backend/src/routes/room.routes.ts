import { Router } from 'express';
import * as roomController from '../controllers/room.controller';

const router = Router();

router.get('/', roomController.getRooms);
router.post('/', roomController.createRoom); // Assuming we might need this to seed data
router.get('/:roomNo', roomController.getRoom);

export default router;

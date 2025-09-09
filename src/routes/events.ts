import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { eventController } from '../controllers/eventController';

const router = Router();

// Public routes
router.get('/', eventController.index);
router.get('/:id', eventController.show);

// Protected routes
router.get('/new', authenticateUser, eventController.showCreate);
router.post('/', authenticateUser, eventController.create);
router.get('/:id/edit', authenticateUser, eventController.showEdit);
router.put('/:id', authenticateUser, eventController.update);
router.delete('/:id', authenticateUser, eventController.delete);

export { router as eventRoutes };

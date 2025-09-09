import { Router } from 'express';
import { eventController } from '../controllers/eventController';

const router = Router();

// Public routes
router.get('/', eventController.index);
router.get('/:id', eventController.show);

export { router as eventRoutes };

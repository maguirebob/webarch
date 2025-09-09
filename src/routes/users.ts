import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { userController } from '../controllers/userController';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

router.get('/dashboard', userController.dashboard);
router.get('/profile', userController.showProfile);
router.post('/profile', userController.updateProfile);
router.delete('/account', userController.deleteAccount);

export { router as userRoutes };

import { Router } from 'express';
import { redirectIfAuthenticated, authenticateUser } from '../middleware/auth';
import { authController } from '../controllers/authController';

const router = Router();

// Public routes
router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.get('/register', redirectIfAuthenticated, authController.showRegister);
router.post('/register', redirectIfAuthenticated, authController.register);
router.get('/forgot-password', redirectIfAuthenticated, authController.showForgotPassword);
router.post('/forgot-password', redirectIfAuthenticated, authController.forgotPassword);
router.get('/reset-password/:token', redirectIfAuthenticated, authController.showResetPassword);
router.post('/reset-password/:token', redirectIfAuthenticated, authController.resetPassword);

// Protected routes
router.post('/logout', authenticateUser, authController.logout);

export { router as authRoutes };

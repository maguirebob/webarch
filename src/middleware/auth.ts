import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { userService } from '../services/userService';

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      req.flash('error', 'Please log in to access this page');
      res.redirect('/auth/login');
      return;
    }

    const user = await userService.findById(userId);
    if (!user || !user.isActive) {
      req.session.destroy(() => {});
      req.flash('error', 'Invalid session. Please log in again.');
      res.redirect('/auth/login');
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    req.flash('error', 'Authentication failed');
    res.redirect('/auth/login');
  }
};

export const redirectIfAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.session.userId) {
    res.redirect('/dashboard');
    return;
  }
  next();
};

import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { eventService } from '../services/eventService';
import { userService } from '../services/userService';

export const userController = {
  async dashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userEvents = await eventService.getUserEvents(req.user!.id);
      res.render('pages/users/dashboard', {
        title: 'Dashboard',
        user: req.user,
        events: userEvents,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.render('pages/users/dashboard', {
        title: 'Dashboard',
        user: req.user,
        events: [],
        error: 'Failed to load dashboard data',
      });
    }
  },

  async showProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.render('pages/users/profile', {
      title: 'Profile',
      user: req.user,
    });
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email } = req.body;
      const updatedUser = await userService.updateUser(req.user!.id, {
        firstName,
        lastName,
        email,
      });

      req.user = updatedUser;
      req.flash('success', 'Profile updated successfully!');
      res.redirect('/users/profile');
    } catch (error) {
      console.error('Profile update error:', error);
      req.flash('error', 'Failed to update profile');
      res.render('pages/users/profile', {
        title: 'Profile',
        user: req.user,
        formData: req.body,
      });
    }
  },

  async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await userService.deleteUser(req.user!.id);
      req.session.destroy(() => {
        req.flash('success', 'Account deleted successfully');
        res.redirect('/');
      });
    } catch (error) {
      console.error('Account deletion error:', error);
      req.flash('error', 'Failed to delete account');
      res.redirect('/users/profile');
    }
  },
};

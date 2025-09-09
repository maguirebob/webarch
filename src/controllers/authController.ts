import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { userService } from '../services/userService';

export const authController = {
  async showLogin(_req: Request, res: Response): Promise<void> {
    res.render('pages/auth/login', {
      title: 'Login',
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await userService.validatePassword(email, password);

      if (!user) {
        req.flash('error', 'Invalid email or password');
        res.render('pages/auth/login', {
          title: 'Login',
          formData: req.body,
        });
        return;
      }

      req.session.userId = user.id;
      req.flash('success', 'Welcome back!');
      res.redirect('/users/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'Login failed');
      res.render('pages/auth/login', {
        title: 'Login',
        formData: req.body,
      });
    }
  },

  async showRegister(_req: Request, res: Response): Promise<void> {
    res.render('pages/auth/register', {
      title: 'Register',
    });
  },

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await userService.createUser({
        email,
        password,
        firstName,
        lastName,
      });

      req.session.userId = user.id;
      req.flash('success', 'Account created successfully!');
      res.redirect('/users/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      req.flash('error', 'Registration failed');
      res.render('pages/auth/register', {
        title: 'Register',
        formData: req.body,
      });
    }
  },

  async showForgotPassword(_req: Request, res: Response): Promise<void> {
    res.render('pages/auth/forgot-password', {
      title: 'Forgot Password',
    });
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email: _email } = req.body;
      // TODO: Implement password reset logic
      req.flash('info', 'Password reset instructions sent to your email');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Forgot password error:', error);
      req.flash('error', 'Failed to send reset instructions');
      res.render('pages/auth/forgot-password', {
        title: 'Forgot Password',
        formData: req.body,
      });
    }
  },

  async showResetPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    res.render('pages/auth/reset-password', {
      title: 'Reset Password',
      token,
    });
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token: _token } = req.params;
      const { password: _password } = req.body;
      // TODO: Implement password reset logic
      req.flash('success', 'Password reset successfully!');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Reset password error:', error);
      req.flash('error', 'Failed to reset password');
      res.render('pages/auth/reset-password', {
        title: 'Reset Password',
        token: req.params['token'],
        formData: req.body,
      });
    }
  },

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/');
    });
  },
};

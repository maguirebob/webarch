import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  eventDate: Date;
  eventTime?: Date;
  location?: string;
  category?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface SessionData {
  userId?: string;
  isAuthenticated?: boolean;
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAuthenticated?: boolean;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  session: Request['session'] & SessionData;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventFilters {
  category?: string;
  isPublic?: boolean;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FlashMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

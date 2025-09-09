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


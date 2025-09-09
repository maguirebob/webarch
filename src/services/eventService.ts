import { Event, EventFilters, PaginationOptions } from '../types';
import { prisma } from '../lib/prisma';

export const eventService = {
  async getFeaturedEvents(): Promise<Event[]> {
    try {
      // Check if database is available
      if (!process.env['DATABASE_URL']) {
        console.log('No DATABASE_URL found, returning sample data');
        return [
          {
            id: '1',
            userId: 'demo',
            title: 'Sample Event 1',
            description: 'This is a sample event for demonstration',
            eventDate: new Date('2024-06-15'),
            eventTime: new Date('2024-06-15T09:00:00Z'),
            location: 'Sample Location',
            category: 'Technology',
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            userId: 'demo',
            title: 'Sample Event 2',
            description: 'Another sample event for demonstration',
            eventDate: new Date('2024-07-20'),
            eventTime: new Date('2024-07-20T18:00:00Z'),
            location: 'Another Location',
            category: 'Music',
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }

      const events = await prisma.event.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 2,
      });
      return events as Event[];
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  },

  async getPublicEvents(filters: EventFilters = {}): Promise<{ events: Event[]; pagination: PaginationOptions }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = { isPublic: true };

      if (filters.category) {
        where.category = filters.category;
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          orderBy: { eventDate: 'asc' },
          skip,
          take: limit,
        }),
        prisma.event.count({ where }),
      ]);

      return {
        events: events as Event[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching public events:', error);
      return {
        events: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  async getUserEvents(_userId: string): Promise<Event[]> {
    try {
      const events = await prisma.event.findMany({
        where: { userId: _userId },
        orderBy: { createdAt: 'desc' },
      });
      return events as Event[];
    } catch (error) {
      console.error('Error fetching user events:', error);
      return [];
    }
  },

  async getEventById(id: string): Promise<Event | null> {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });
      return event as Event | null;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      return null;
    }
  },

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    try {
      const event = await prisma.event.create({
        data: {
          userId: eventData.userId || 'anonymous',
          title: eventData.title || '',
          description: eventData.description || null,
          eventDate: eventData.eventDate || new Date(),
          eventTime: eventData.eventTime || null,
          location: eventData.location || null,
          category: eventData.category || null,
          isPublic: eventData.isPublic || false,
        },
      });
      return event as Event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  },

  async updateEvent(id: string, eventData: Partial<Event>, _userId: string): Promise<Event> {
    try {
      const updateData: any = {};
      
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.eventDate !== undefined) updateData.eventDate = eventData.eventDate;
      if (eventData.eventTime !== undefined) updateData.eventTime = eventData.eventTime;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      if (eventData.category !== undefined) updateData.category = eventData.category;
      if (eventData.isPublic !== undefined) updateData.isPublic = eventData.isPublic;

      const event = await prisma.event.update({
        where: { id },
        data: updateData,
      });
      return event as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  },

  async deleteEvent(id: string, _userId: string): Promise<boolean> {
    try {
      await prisma.event.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },
};
import { eventService } from '../../../services/eventService';

// Mock Prisma client
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    event: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { prisma } from '../../../lib/prisma';
const mockPrisma = prisma as any;

describe('EventService - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFeaturedEvents', () => {
    it('should call prisma.event.findMany with correct parameters', async () => {
      mockPrisma.event.findMany.mockResolvedValue([]);

      await eventService.getFeaturedEvents();

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 2,
      });
    });

    it('should return empty array on error', async () => {
      mockPrisma.event.findMany.mockRejectedValue(new Error('Database error'));

      const result = await eventService.getFeaturedEvents();

      expect(result).toEqual([]);
    });
  });

  describe('getPublicEvents', () => {
    it('should call prisma.event.findMany and count with correct parameters', async () => {
      mockPrisma.event.findMany.mockResolvedValue([]);
      mockPrisma.event.count.mockResolvedValue(0);

      await eventService.getPublicEvents();

      expect(mockPrisma.event.findMany).toHaveBeenCalled();
      expect(mockPrisma.event.count).toHaveBeenCalled();
    });

    it('should return empty result on error', async () => {
      mockPrisma.event.findMany.mockRejectedValue(new Error('Database error'));

      const result = await eventService.getPublicEvents();

      expect(result.events).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getEventById', () => {
    it('should call prisma.event.findUnique with correct id', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await eventService.getEventById('test-id');

      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should return null on error', async () => {
      mockPrisma.event.findUnique.mockRejectedValue(new Error('Database error'));

      const result = await eventService.getEventById('test-id');

      expect(result).toBeNull();
    });
  });

  describe('createEvent', () => {
    it('should call prisma.event.create with correct data', async () => {
      const eventData = {
        userId: 'user1',
        title: 'Test Event',
        description: 'Test Description',
        eventDate: new Date('2024-06-01'),
        isPublic: true,
      };

      mockPrisma.event.create.mockResolvedValue({ id: '1', ...eventData });

      await eventService.createEvent(eventData);

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user1',
          title: 'Test Event',
          description: 'Test Description',
          eventDate: new Date('2024-06-01'),
          isPublic: true,
        }),
      });
    });

    it('should throw error on database failure', async () => {
      mockPrisma.event.create.mockRejectedValue(new Error('Database error'));

      await expect(eventService.createEvent({ title: 'Test' })).rejects.toThrow('Failed to create event');
    });
  });

  describe('updateEvent', () => {
    it('should call prisma.event.update with correct parameters', async () => {
      const updateData = { title: 'Updated Title' };
      mockPrisma.event.update.mockResolvedValue({ id: '1', ...updateData });

      await eventService.updateEvent('1', updateData, 'user1');

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Updated Title' },
      });
    });

    it('should throw error on database failure', async () => {
      mockPrisma.event.update.mockRejectedValue(new Error('Database error'));

      await expect(eventService.updateEvent('1', { title: 'Test' }, 'user1')).rejects.toThrow('Failed to update event');
    });
  });

  describe('deleteEvent', () => {
    it('should call prisma.event.delete with correct id', async () => {
      mockPrisma.event.delete.mockResolvedValue({});

      const result = await eventService.deleteEvent('1', 'user1');

      expect(mockPrisma.event.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });

    it('should return false on database failure', async () => {
      mockPrisma.event.delete.mockRejectedValue(new Error('Database error'));

      const result = await eventService.deleteEvent('1', 'user1');

      expect(result).toBe(false);
    });
  });
});

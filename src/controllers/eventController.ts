import { Request, Response } from 'express';
import { eventService } from '../services/eventService';

export const eventController = {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const { category, page = 1 } = req.query;
      const result = await eventService.getPublicEvents({
        category: category as string,
        page: parseInt(page as string, 10),
      });

      res.render('pages/events', {
        title: 'Events',
        events: result.events,
        pagination: result.pagination,
        category,
      });
    } catch (error) {
      console.error('Events index error:', error);
      res.render('pages/events', {
        title: 'Events',
        events: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        error: 'Failed to load events',
      });
    }
  },

  async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).render('pages/404', { title: 'Event Not Found' });
        return;
      }
      const event = await eventService.getEventById(id);

      if (!event) {
        res.status(404).render('pages/404', { title: 'Event Not Found' });
        return;
      }

      res.render('pages/events/detail', {
        title: event.title,
        event,
      });
    } catch (error) {
      console.error('Event show error:', error);
      res.status(500).render('pages/500', { title: 'Server Error' });
    }
  },
};

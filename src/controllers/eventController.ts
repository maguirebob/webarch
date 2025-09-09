import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
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

  async showCreate(_req: AuthenticatedRequest, res: Response): Promise<void> {
    res.render('pages/events/new', {
      title: 'Create Event',
    });
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const eventData = {
        ...req.body,
        userId: req.user!.id,
      };

      const event = await eventService.createEvent(eventData);
      req.flash('success', 'Event created successfully!');
      res.redirect(`/events/${event.id}`);
    } catch (error) {
      console.error('Event create error:', error);
      req.flash('error', 'Failed to create event');
      res.render('pages/events/new', {
        title: 'Create Event',
        formData: req.body,
      });
    }
  },

  async showEdit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).render('pages/404', { title: 'Event Not Found' });
        return;
      }
      const event = await eventService.getEventById(id);

      if (!event || event.userId !== req.user!.id) {
        res.status(404).render('pages/404', { title: 'Event Not Found' });
        return;
      }

      res.render('pages/events/edit', {
        title: 'Edit Event',
        event,
      });
    } catch (error) {
      console.error('Event edit error:', error);
      res.status(500).render('pages/500', { title: 'Server Error' });
    }
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).render('pages/404', { title: 'Event Not Found' });
        return;
      }
      const event = await eventService.updateEvent(id, req.body, req.user!.id);

      req.flash('success', 'Event updated successfully!');
      res.redirect(`/events/${event.id}`);
    } catch (error) {
      console.error('Event update error:', error);
      req.flash('error', 'Failed to update event');
      res.redirect(`/events/${req.params['id']}/edit`);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).render('pages/404', { title: 'Event Not Found' });
        return;
      }
      await eventService.deleteEvent(id, req.user!.id);

      req.flash('success', 'Event deleted successfully!');
      res.redirect('/users/dashboard');
    } catch (error) {
      console.error('Event delete error:', error);
      req.flash('error', 'Failed to delete event');
      res.redirect('/users/dashboard');
    }
  },
};

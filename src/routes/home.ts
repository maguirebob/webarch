import { Router } from 'express';
import { eventService } from '../services/eventService';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const featuredEvents = await eventService.getFeaturedEvents();
    res.render('pages/home', {
      title: 'Home',
      events: featuredEvents,
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('pages/home', {
      title: 'Home',
      events: [],
      error: 'Failed to load events',
    });
  }
});

export { router as homeRoutes };

import express from 'express';
import path from 'path';
import { eventService } from './services/eventService';

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (_req, res) => {
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

app.get('/events', async (req, res) => {
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
    console.error('Events page error:', error);
    res.render('pages/events', {
      title: 'Events',
      events: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      error: 'Failed to load events',
    });
  }
});

app.get('/events/:id', async (req, res) => {
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
    console.error('Event detail error:', error);
    res.status(500).render('pages/500', { title: 'Server Error' });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).render('pages/500', { title: 'Server Error' });
});

// Start server
const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

export default app;
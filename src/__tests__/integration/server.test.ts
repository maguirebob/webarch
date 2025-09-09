import request from 'supertest';
import app from '../../server';

describe('Server Integration Tests', () => {
  describe('GET /', () => {
    it('should return home page with featured events', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Welcome to Web Arch Events');
      expect(response.text).toContain('Featured Events');
    });
  });

  describe('GET /events', () => {
    it('should return events listing page', async () => {
      const response = await request(app)
        .get('/events')
        .expect(200);

      expect(response.text).toContain('All Events');
      expect(response.text).toContain('Discover amazing events');
    });
  });

  describe('GET /events/:id', () => {
    it('should return event detail page for valid event', async () => {
      const response = await request(app)
        .get('/events/1')
        .expect(200);

      expect(response.text).toContain('Tech Conference 2024');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/events/nonexistent')
        .expect(404);

      expect(response.text).toContain('Event Not Found');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.text).toContain('Page Not Found');
    });
  });
});

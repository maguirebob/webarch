import request from 'supertest';
import app from '../../server';

describe('Events E2E Tests', () => {
  describe('Home Page', () => {
    it('should display featured events on home page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // Check page structure
      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('Welcome to Web Arch Events');
      expect(response.text).toContain('Featured Events');
      expect(response.text).toContain('Browse Events');
      
      // Check for event cards (should contain event titles)
      expect(response.text).toMatch(/Tech Conference|Music Festival|Art Exhibition/);
    });

    it('should have proper navigation links', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('href="/"');
      expect(response.text).toContain('href="/events"');
    });
  });

  describe('Events Listing Page', () => {
    it('should display all events in a grid layout', async () => {
      const response = await request(app)
        .get('/events')
        .expect(200);

      expect(response.text).toContain('All Events');
      expect(response.text).toContain('Discover amazing events');
      
      // Check for event cards
      expect(response.text).toContain('Tech Conference 2024');
      expect(response.text).toContain('Music Festival');
      expect(response.text).toContain('Art Exhibition Opening');
    });

    it('should have event detail links', async () => {
      const response = await request(app)
        .get('/events')
        .expect(200);

      expect(response.text).toContain('href="/events/1"');
      expect(response.text).toContain('href="/events/2"');
      expect(response.text).toContain('href="/events/3"');
    });
  });

  describe('Event Detail Pages', () => {
    it('should display event details for valid event', async () => {
      const response = await request(app)
        .get('/events/1')
        .expect(200);

      expect(response.text).toContain('Tech Conference 2024');
      expect(response.text).toContain('Convention Center, Downtown');
      expect(response.text).toContain('Technology');
      expect(response.text).toContain('Back to Events');
    });

    it('should display event details for another valid event', async () => {
      const response = await request(app)
        .get('/events/2')
        .expect(200);

      expect(response.text).toContain('Music Festival');
      expect(response.text).toContain('Central Park');
      expect(response.text).toContain('Music');
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/events/999')
        .expect(404);

      expect(response.text).toContain('Page Not Found');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.text).toContain('Page Not Found');
    });

    it('should handle invalid event IDs gracefully', async () => {
      const response = await request(app)
        .get('/events/invalid-id')
        .expect(404);

      expect(response.text).toContain('Page Not Found');
    });
  });

  describe('Responsive Design', () => {
    it('should include Tailwind CSS classes', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('bg-gray-50');
      expect(response.text).toContain('container mx-auto');
      expect(response.text).toContain('grid grid-cols-1 md:grid-cols-3');
    });

    it('should include proper meta tags', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('<meta charset="UTF-8">');
      expect(response.text).toContain('<meta name="viewport"');
      expect(response.text).toContain('content="width=device-width, initial-scale=1.0"');
    });
  });

  describe('Static Assets', () => {
    it('should serve CSS files', async () => {
      const response = await request(app)
        .get('/css/style.css')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/css/);
    });

    it('should serve JavaScript files', async () => {
      const response = await request(app)
        .get('/js/main.js')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/javascript/);
    });
  });
});

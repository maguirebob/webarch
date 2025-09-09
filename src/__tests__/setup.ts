// Test setup file for Jest

// Set test environment variables
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/web_arch_events_test';
process.env['PORT'] = '3001';

// Sample mock data
const mockEvents = [
  {
    id: '1',
    userId: 'user1',
    title: 'Tech Conference 2024',
    description: 'Annual technology conference featuring the latest innovations',
    eventDate: new Date('2024-06-15'),
    eventTime: new Date('2024-06-15T09:00:00Z'),
    location: 'Convention Center, Downtown',
    category: 'Technology',
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    userId: 'user2',
    title: 'Music Festival',
    description: 'Summer music festival with local and international artists',
    eventDate: new Date('2024-07-20'),
    eventTime: new Date('2024-07-20T18:00:00Z'),
    location: 'Central Park',
    category: 'Music',
    isPublic: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    userId: 'user3',
    title: 'Art Exhibition Opening',
    description: 'Contemporary art exhibition opening night',
    eventDate: new Date('2024-08-10'),
    eventTime: new Date('2024-08-10T19:00:00Z'),
    location: 'Modern Art Gallery',
    category: 'Art',
    isPublic: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

// Mock Prisma client globally for all tests
jest.mock('../lib/prisma', () => ({
  prisma: {
    event: {
      findMany: jest.fn().mockResolvedValue(mockEvents),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        const event = mockEvents.find(e => e.id === where.id);
        return Promise.resolve(event || null);
      }),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(mockEvents.length),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation(async (queries) => {
      const results = await Promise.all(queries.map((query: any) => query()));
      return results;
    }),
    $disconnect: jest.fn(),
  },
}));

// Mock console methods in tests to reduce noise
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test timeout
jest.setTimeout(10000);

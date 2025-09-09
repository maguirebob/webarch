# Web Architecture Events

A modern web application for event management built with Node.js, Express, and PostgreSQL.

## Features

- **Event Display**: Browse and view events with detailed information
- **Responsive Design**: Works on desktop and mobile devices
- **Database Integration**: PostgreSQL with Prisma ORM
- **Sample Data**: Pre-populated with 6 sample events
- **Server-side Rendering**: EJS templates with Tailwind CSS
- **TypeScript**: Full type safety and better development experience

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Templating**: EJS
- **Styling**: Tailwind CSS
- **Testing**: Jest (framework ready)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+

### Quick Setup

1. Clone the repository
```bash
git clone <repository-url>
cd web-arch-events
```

2. Set up environment variables
```bash
cp env.example .env
# Edit .env with your DATABASE_URL
```

3. Run the automated setup script
```bash
./setup-db.sh
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Staging Deployment

### Quick Setup
1. **Set up staging branch**
   ```bash
   ./scripts/setup-staging.sh
   ```

2. **Choose deployment platform**
   - **Railway** (Recommended): https://railway.app
   - **Render**: https://render.com
   - **Heroku**: https://heroku.com

3. **Deploy and verify**
   ```bash
   # After deployment, verify it works
   ./scripts/verify-deployment.sh
   ```

### Detailed Instructions
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide with step-by-step instructions for each platform.

### Manual Setup

If you prefer to set up manually:

1. Install dependencies
```bash
npm install
```

2. Generate Prisma client
```bash
npm run db:generate
```

3. Run database migrations
```bash
npm run db:migrate
```

4. Seed the database
```bash
npm run db:seed
```

5. Start the development server
```bash
npm run dev
```

## Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm start` - Start production server

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database and reseed

### Testing
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:e2e` - Run end-to-end tests only
- `npm run test:ci` - Run tests in CI mode

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

### Deployment
- `./scripts/setup-staging.sh` - Set up staging branch
- `./scripts/verify-deployment.sh` - Verify staging deployment

## Project Structure

```
src/
├── views/              # EJS template files
│   ├── pages/          # Page templates
│   └── partials/       # Reusable template partials
├── routes/             # Express route definitions
├── controllers/        # Route controllers
├── services/           # Business logic services
├── models/             # Database models
├── middleware/         # Express middleware
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── config/             # Configuration files
├── public/             # Static assets (CSS, JS, images)
└── __tests__/          # Test files
```

## Testing

This project follows Test-Driven Development (TDD) principles. All components must have tests before implementation.

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Contributing

1. Follow the TDD approach
2. Write tests first
3. Implement minimal code to pass tests
4. Refactor while keeping tests green
5. Follow the established code style and conventions

## License

MIT

# Deployment Guide

## 🚀 Staging Deployment Options

### Option 1: Railway (Recommended)

#### Prerequisites
1. GitHub repository with your code
2. Railway account (free at railway.app)

#### Setup Steps

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Create new project
   railway init
   ```

2. **Add PostgreSQL Database**
   - In Railway dashboard, click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will provide `DATABASE_URL`

3. **Deploy Application**
   - Connect your GitHub repository
   - Railway will auto-detect Node.js
   - Set environment variables:
     - `NODE_ENV=staging`
     - `DATABASE_URL` (from PostgreSQL service)

4. **Run Database Migrations**
   ```bash
   # In Railway dashboard, go to your app service
   # Add a one-time command:
   npx prisma migrate deploy
   ```

5. **Seed Database**
   ```bash
   # Add another one-time command:
   npm run db:seed
   ```

#### Railway Configuration
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Health Check**: `/` (returns 200)

### Option 2: Render

#### Setup Steps

1. **Create Render Account**
   - Go to render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Connect GitHub repository
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node

3. **Add PostgreSQL Database**
   - Create new PostgreSQL service
   - Copy connection string to `DATABASE_URL`

4. **Environment Variables**
   ```
   NODE_ENV=staging
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```

### Option 3: Heroku

#### Setup Steps

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Or download from heroku.com
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name-staging
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Run Migrations**
   ```bash
   heroku run npx prisma migrate deploy
   heroku run npm run db:seed
   ```

## 🔧 Pre-Deployment Checklist

### 1. Update package.json
Ensure these scripts exist:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

### 2. Environment Variables
Create staging environment file:
```bash
# .env.staging
NODE_ENV=staging
PORT=3000
DATABASE_URL=your_staging_database_url
```

### 3. Database Schema
Ensure Prisma schema is ready:
```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Test Locally
```bash
# Test production build
npm run build
npm start

# Test database connection
npm run db:seed
```

## 🚀 Deployment Commands

### Railway
```bash
# Deploy to Railway
railway up

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npm run db:seed
```

### Render
```bash
# Render auto-deploys from GitHub
# Just push to your staging branch
git push origin staging
```

### Heroku
```bash
# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Seed database
heroku run npm run db:seed
```

## 🔍 Post-Deployment Verification

1. **Check Application**
   - Visit staging URL
   - Verify home page loads
   - Check events listing
   - Test event details

2. **Check Database**
   - Verify events are displayed
   - Check database connection
   - Test CRUD operations

3. **Check Logs**
   - Monitor application logs
   - Check for errors
   - Verify health checks

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` environment variable
   - Verify database service is running
   - Check network connectivity

2. **Build Failures**
   - Check TypeScript compilation
   - Verify all dependencies are installed
   - Check build logs

3. **Migration Failures**
   - Ensure database is accessible
   - Check migration files
   - Verify Prisma client is generated

### Debug Commands

```bash
# Check environment variables
railway variables

# View logs
railway logs

# Run commands in staging environment
railway run npm run test
```

## 📊 Monitoring

### Health Checks
- **Endpoint**: `GET /`
- **Expected**: 200 OK
- **Timeout**: 30 seconds

### Logs
- Monitor application logs
- Check error rates
- Monitor database performance

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging
on:
  push:
    branches: [staging]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: railway up
```

## 💰 Cost Estimates

### Railway
- **Free Tier**: 500 hours/month
- **Paid**: $5/month for unlimited

### Render
- **Free Tier**: 750 hours/month
- **Paid**: $7/month for always-on

### Heroku
- **Eco**: $5/month (dyno) + $5/month (database)
- **Basic**: $7/month (dyno) + $5/month (database)

## 🎯 Recommended Next Steps

1. **Start with Railway** (easiest setup)
2. **Set up staging branch** in GitHub
3. **Deploy and test** basic functionality
4. **Add monitoring** and logging
5. **Set up CI/CD** for automatic deployments

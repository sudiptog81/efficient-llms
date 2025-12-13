# Newsletter Redis Queue Setup

## Overview

The newsletter subscription system uses Redis as a queue to handle email subscriptions asynchronously, ensuring fast API responses and reliable processing.

## Architecture

1. **API Endpoint** (`/api/newsletter-subscribe`) - Validates email and pushes to Redis queue
2. **Redis Queue** - Stores pending subscriptions
3. **Background Worker** - Processes queue and writes to Google Sheets

## Setup

### 1. Install Redis Client

```bash
npm install ioredis
```

### 2. Set Environment Variables

Add to your `.env.local`:

```env
REDIS_URL=redis://localhost:6379
# Or for production:
# REDIS_URL=redis://username:password@your-redis-host:6379
```

### 3. Run Redis Locally (Development)

**Using Docker:**
```bash
docker run -d -p 6379:6379 redis:alpine
```

**Or install Redis directly:**
- Windows: Use WSL2 or Redis for Windows
- Mac: `brew install redis && brew services start redis`
- Linux: `sudo apt-get install redis-server`

### 4. Start the Worker

```bash
npm run worker:newsletter
```

In production, use a process manager like PM2:

```bash
pm2 start workers/newsletter-worker.js --name newsletter-worker
```

## Production Deployment

### Option 1: Vercel + Upstash Redis

1. Sign up at [Upstash](https://upstash.com/)
2. Create a Redis database
3. Add `REDIS_URL` to Vercel environment variables
4. Deploy worker separately (e.g., on Render, Railway, or Fly.io)

### Option 2: Self-hosted

1. Deploy Redis instance (AWS ElastiCache, DigitalOcean, etc.)
2. Deploy worker as a separate service
3. Ensure worker has access to Redis and Google Sheets credentials

## Monitoring

The worker logs all operations:
- ✓ Successful subscriptions
- ✗ Failed attempts (will retry)

Monitor Redis queue length:
```bash
redis-cli llen newsletter:subscriptions
```

## Benefits Over Previous Approach

- **Fast Response**: ~5-10ms vs ~500-2000ms
- **Reliability**: No lost subscriptions if process crashes
- **Scalability**: Can handle traffic spikes
- **Retry Logic**: Failed operations can be retried
- **Monitoring**: Queue length indicates processing status

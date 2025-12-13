import Redis from 'ioredis';

let client = null;

export function getRedis() {
  if (client) return client;
  client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  });
  client.on('error', (err) => {
    console.error('Redis error:', err);
  });
  return client;
}

export async function ensureRedisReady() {
  const redis = getRedis();
  if (redis.status !== 'ready') {
    await redis.connect();
  }
  return redis;
}

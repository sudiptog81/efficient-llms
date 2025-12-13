import { ensureRedisReady } from '../../lib/redis';
import { getSheets } from '../../lib/sheets';

async function processSubscriptions(dataArray) {
  if (dataArray.length === 0) return;
  const sheets = await getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const values = dataArray.map(data => {
    const { email, timestamp } = JSON.parse(data);
    return [email, timestamp];
  });
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Subscribers!A:B',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', success: false });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized', success: false });
  }

  let redis;
  try {
    redis = await ensureRedisReady();
  } catch (err) {
    console.error('Redis connect error:', err);
    return res.status(500).json({ error: 'Redis connection failed', success: false });
  }

  const maxItems = parseInt((req.query?.max || '100'), 10);
  const batchSize = parseInt((req.query?.batchSize || '25'), 10);
  const deadline = Date.now() + 9000; // ~9s budget to stay under serverless limits

  let processed = 0;
  let failures = 0;
  const startedAt = Date.now();

  while (processed < maxItems && Date.now() < deadline) {
    const batch = [];
    for (let i = 0; i < batchSize && processed + i < maxItems; i++) {
      const data = await redis.lpop('newsletter:subscriptions');
      if (!data) break;
      batch.push(data);
    }

    if (batch.length === 0) break;

    try {
      await processSubscriptions(batch);
      processed += batch.length;
    } catch (err) {
      failures += batch.length;
      console.error('Batch processing error:', err);
      for (const data of batch) {
        await redis.rpush('newsletter:dead-letter', data);
      }
    }
  }

  const remaining = await redis.llen('newsletter:subscriptions');
  const deadLetters = await redis.llen('newsletter:dead-letter');
  const durationMs = Date.now() - startedAt;

  return res.status(200).json({
    processed,
    failures,
    remaining,
    deadLetters,
    durationMs,
    success: true,
  });
}

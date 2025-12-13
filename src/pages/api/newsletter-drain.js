import { ensureRedisReady } from '../../lib/redis';
import { getSheets } from '../../lib/sheets';

async function processSubscription(data) {
  const { email, timestamp } = JSON.parse(data);
  const sheets = await getSheets();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Subscribers!A:B',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[email, timestamp]],
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', success: false });
  }

  let redis;
  try {
    redis = await ensureRedisReady();
  } catch (err) {
    console.error('Redis connect error:', err);
    return res.status(500).json({ error: 'Redis connection failed', success: false });
  }

  const maxItems = parseInt((req.query?.max || '100'), 10);
  const deadline = Date.now() + 9000; // ~9s budget to stay under serverless limits

  let processed = 0;
  let failures = 0;
  const startedAt = Date.now();

  while (processed < maxItems && Date.now() < deadline) {
    const data = await redis.lpop('newsletter:subscriptions');
    if (!data) break;
    try {
      await processSubscription(data);
      processed += 1;
    } catch (err) {
      failures += 1;
      console.error('Drain processing error:', err);
      await redis.rpush('newsletter:dead-letter', data);
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

import { ensureRedisReady } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', success: false });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Oops! E-mail is empty.', success: false });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Oops! This e-mail is invalid.', success: false });
  }

  try {
    const redis = await ensureRedisReady();

    const timestamp = new Date().toISOString();

    await redis.rpush('newsletter:subscriptions', JSON.stringify({ email, timestamp }));

    return res.status(200).json({
      message: email + ' subscribed successfully',
      success: true
    });
  } catch (error) {
    console.error('Error queueing email subscription:', error);
    return res.status(500).json({
      error: 'Oops! Failed to subscribe.',
      success: false
    });
  }
}

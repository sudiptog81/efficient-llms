require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const Redis = require('ioredis');
const { google } = require('googleapis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
let sheetsClient = null;

async function getSheetsClient() {
  if (sheetsClient) {
    return sheetsClient;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

async function processSubscription(data) {
  try {
    const { email, timestamp } = JSON.parse(data);
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Subscribers!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, timestamp]],
      },
    });

    console.log(`✓ Successfully added ${email} to Google Sheets`);
  } catch (error) {
    console.error('Error processing subscription:', error);
    // Re-throw to trigger retry
    throw error;
  }
}

async function startWorker() {
  console.log('Newsletter worker started...');

  while (true) {
    try {
      // Block for up to 5 seconds waiting for new items
      const result = await redis.blpop('newsletter:subscriptions', 5);

      if (result) {
        const [, data] = result;
        await processSubscription(data);
      }
    } catch (error) {
      console.error('Worker error:', error);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await redis.quit();
  process.exit(0);
});

startWorker().catch(err => {
  console.error('Fatal worker error:', err);
  process.exit(1);
});

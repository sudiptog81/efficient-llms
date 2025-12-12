import { google } from 'googleapis';

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
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Subscribers!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, timestamp]],
      },
    });

    return res.status(200).json({
      message: email + ' subscribed successfully',
      success: true
    });
  } catch (error) {
    console.error('Error adding email to Google Sheets:', error);
    return res.status(500).json({
      error: 'Oops! Failed to subscribe.',
      success: false
    });
  }
}

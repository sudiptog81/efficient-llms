# Google Sheets API Setup Guide

Update the following values:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=<value from "client_email" in JSON file>
GOOGLE_SHEETS_PRIVATE_KEY=<value from "private_key" in JSON file>
GOOGLE_SHEET_ID=<spreadsheet ID from Step 5>
```

**Important Notes:**

- The `private_key` value should include the quotes and the `\n` characters
- Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"`
- Do NOT commit the `.env.local` file to version control

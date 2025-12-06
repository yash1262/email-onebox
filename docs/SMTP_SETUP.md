# SMTP Setup Guide

This guide explains how to configure SMTP for sending emails from the OneBox application.

## Configuration

Add the following environment variables to your `backend/.env` file:

```env
# SMTP Configuration (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Provider-Specific Settings

### Gmail

1. **SMTP Settings:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   ```

2. **App Password:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Generate an App Password for "Mail"
   - Use this password in `SMTP_PASS`

### Outlook/Office 365

1. **SMTP Settings:**
   ```env
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_SECURE=false
   ```

2. **Password:**
   - Use your regular Outlook password
   - Or create an App Password if 2FA is enabled

### Other Providers

- **Yahoo:** `smtp.mail.yahoo.com:587`
- **Zoho:** `smtp.zoho.com:587`
- **Custom SMTP:** Use your provider's SMTP settings

## How It Works

1. **Sending Emails:**
   - When you compose and send an email through the UI, it's sent via SMTP
   - The email is automatically indexed to Elasticsearch with `folder: "SENT"`

2. **Viewing Sent Emails:**
   - Click on "Sent" in the sidebar to view all sent emails
   - Sent emails are stored with the sender's account email

3. **Reply Tracking:**
   - When replying to an email, the `inReplyTo` and `references` headers are set
   - This maintains the email thread

## Troubleshooting

### "SMTP service not configured" Error

- Make sure all SMTP environment variables are set in `backend/.env`
- Restart the backend server after adding the variables

### Authentication Failed

- Verify your SMTP credentials are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check if your email provider requires additional security settings

### Sent Emails Not Appearing

- Check that the backend server is running
- Verify Elasticsearch is running and accessible
- Check backend logs for any indexing errors

## Testing

To test if SMTP is working:

1. Start the backend server
2. Open the frontend application
3. Click "Compose" or reply to an email
4. Send a test email
5. Check the "Sent" folder to verify it appears
6. Check the recipient's inbox to confirm delivery

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendSlackNotification = async (email: any) => {
  try {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      console.warn('Slack webhook URL not configured');
      return;
    }

    const message = {
      text: '🎯 New Interested Email Received!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 New Interested Email'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*From:*\n${email.from}`
            },
            {
              type: 'mrkdwn',
              text: `*Subject:*\n${email.subject}`
            },
            {
              type: 'mrkdwn',
              text: `*Date:*\n${new Date(email.date).toLocaleString()}`
            },
            {
              type: 'mrkdwn',
              text: `*Account:*\n${email.accountEmail}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Preview:*\n${email.body.substring(0, 200)}...`
          }
        }
      ]
    };

    await axios.post(slackWebhookUrl, message);
    console.log('Slack notification sent successfully');
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
};

export const triggerWebhook = async (email: any) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('Webhook URL not configured');
      return;
    }

    const payload = {
      event: 'email_interested',
      email: {
        from: email.from,
        subject: email.subject,
        body: email.body,
        date: email.date,
        accountEmail: email.accountEmail,
        category: email.category
      },
      timestamp: new Date().toISOString()
    };

    await axios.post(webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Webhook triggered successfully');
  } catch (error) {
    console.error('Error triggering webhook:', error);
  }
};

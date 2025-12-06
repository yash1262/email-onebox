import { sendSlackNotification } from '../../config/slack';

export class SlackService {
  async notifyInterestedEmail(email: any) {
    try {
      await sendSlackNotification(email);
      return { success: true };
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      return { success: false, error };
    }
  }

  async notifyBatch(emails: any[]) {
    const results = await Promise.allSettled(
      emails.map(email => sendSlackNotification(email))
    );

    return {
      total: emails.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };
  }
}

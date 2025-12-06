import { triggerWebhook } from '../../config/slack';

export class WebhookService {
  async trigger(email: any) {
    try {
      await triggerWebhook(email);
      return { success: true };
    } catch (error) {
      console.error('Error triggering webhook:', error);
      return { success: false, error };
    }
  }

  async triggerBatch(emails: any[]) {
    const results = await Promise.allSettled(
      emails.map(email => triggerWebhook(email))
    );

    return {
      total: emails.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };
  }
}

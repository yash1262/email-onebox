import { indexEmail } from '../../config/database';

export class EmailIndexer {
  async indexSingleEmail(email: any) {
    try {
      await indexEmail(email);
      return { success: true, id: email.messageId };
    } catch (error) {
      console.error('Error indexing email:', error);
      return { success: false, error };
    }
  }

  async bulkIndexEmails(emails: any[]) {
    try {
      const results = await Promise.allSettled(
        emails.map(email => indexEmail(email))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: true,
        indexed: successful,
        failed,
        total: emails.length
      };
    } catch (error) {
      console.error('Error in bulk indexing:', error);
      throw error;
    }
  }
}

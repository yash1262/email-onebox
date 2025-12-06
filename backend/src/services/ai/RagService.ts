import { GeminiService } from './GeminiService';
import { Logger } from '../../utils/logger';

const geminiService = new GeminiService();

export class RagService {
  async generateReply(email: any): Promise<string> {
    try {
      // Use Gemini as the primary AI service
      if (geminiService.isAvailable()) {
        return await geminiService.generateReply(email);
      } else {
        throw new Error('No AI service available. Please configure GEMINI_API_KEY in your .env file.');
      }
    } catch (error) {
      Logger.error('Error generating RAG reply:', error);
      throw error;
    }
  }

  async generateBulkReplies(emails: any[]): Promise<Map<string, string>> {
    if (geminiService.isAvailable()) {
      return await geminiService.generateBulkReplies(emails);
    } else {
      throw new Error('No AI service available. Please configure GEMINI_API_KEY in your .env file.');
    }
  }
}

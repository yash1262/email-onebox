import { OpenAI } from 'openai';
import { retrieveContext } from '../../config/vector-db';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class RagService {
  async generateReply(email: any): Promise<string> {
    try {
      // Retrieve relevant context from vector database
      const contexts = await retrieveContext(
        `${email.subject} ${email.body.substring(0, 500)}`
      );

      const contextText = contexts
        .map((ctx: any) => `Product: ${ctx.product}\nAgenda: ${ctx.agenda}`)
        .join('\n\n');

      const prompt = `You are an AI assistant helping to draft email replies for job applications.

Context from knowledge base:
${contextText}

Incoming Email:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Generate a professional, contextually appropriate reply that:
1. Acknowledges the email content positively
2. If they show interest (interview request, shortlisted, etc.), include the meeting booking link from the context
3. Keep it concise and professional (2-3 sentences)
4. Express enthusiasm for the opportunity
5. Always end with the meeting link if they're interested in proceeding

Reply:`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional email assistant helping with job applications. Generate appropriate email replies that include meeting booking links when the recipient shows interest.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return response.choices[0].message.content || 'Unable to generate reply';
    } catch (error) {
      console.error('Error generating RAG reply:', error);
      throw error;
    }
  }

  async generateBulkReplies(emails: any[]): Promise<Map<string, string>> {
    const replies = new Map<string, string>();

    for (const email of emails) {
      try {
        const reply = await this.generateReply(email);
        replies.set(email.messageId, reply);
      } catch (error) {
        console.error(`Error generating reply for ${email.messageId}:`, error);
        replies.set(email.messageId, 'Error generating reply');
      }
    }

    return replies;
  }
}

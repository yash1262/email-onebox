import { GoogleGenerativeAI } from '@google/generative-ai';
import { retrieveContext } from '../../config/vector-db';
import { config } from '../../config/env';
import { Logger } from '../../utils/logger';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private modelName: string = 'gemini-1.5-flash';

  constructor() {
    if (config.gemini.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        Logger.info('✅ Gemini AI initialized successfully');
      } catch (error) {
        Logger.error('Failed to initialize Gemini AI:', error);
      }
    } else {
      Logger.warn('⚠️  Gemini API key not found. Gemini features will be disabled.');
    }
  }

  private getModel(modelName?: string) {
    if (!this.genAI) {
      throw new Error('Gemini API not initialized');
    }
    return this.genAI.getGenerativeModel({ model: modelName || this.modelName });
  }

  async listAvailableModels(): Promise<string[]> {
    if (!this.genAI) {
      return [];
    }
    
    try {
      // Try to list models using the API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${config.gemini.apiKey}`
      );
      const data: any = await response.json();
      
      if (data && data.models && Array.isArray(data.models)) {
        const modelNames = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
        Logger.info(`Available Gemini models: ${modelNames.join(', ')}`);
        return modelNames;
      }
    } catch (error) {
      Logger.warn('Could not list available models:', error);
    }
    
    return [];
  }

  async generateReply(email: any): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.');
    }

    // Try different models in order of preference
    // Updated model names based on current Gemini API (as of 2024)
    const modelNames = [
      'gemini-2.5-flash',  // Fastest, recommended for most use cases
      'gemini-2.0-flash',  // Alternative fast model
      'gemini-2.5-pro',    // Better quality, slower
      // Legacy models (fallback)
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
    
    // Try to get available models first
    let availableModels: string[] = [];
    try {
      availableModels = await this.listAvailableModels();
    } catch (error) {
      Logger.warn('Could not fetch available models, using default list');
    }
    
    // If we got available models, prioritize those
    const modelsToTry = availableModels.length > 0 
      ? [...availableModels, ...modelNames.filter(m => !availableModels.includes(m))]
      : modelNames;
    
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        // Retrieve relevant context from vector database (optional - works without it)
        let contextText = '';
        try {
          const contexts = await retrieveContext(
            `${email.subject} ${email.body.substring(0, 500)}`
          );

          if (contexts && contexts.length > 0) {
            contextText = contexts
              .map((ctx: any) => `Product: ${ctx.product}\nAgenda: ${ctx.agenda}`)
              .join('\n\n');
          }
        } catch (contextError) {
          // Context retrieval is optional, continue without it
          Logger.warn('Could not retrieve context, generating reply without it');
        }

        const prompt = `You're a software engineer replying to an email. Write like a real person, not a bot.

${contextText ? `About you:\n${contextText}\n` : ''}

Email you got:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Write a natural reply:

TONE RULES:
- Sound like you're texting a colleague, not writing a formal letter
- Use "I'm" not "I am", "I'd" not "I would", "that's" not "that is"
- Be friendly and genuine, show personality
- Keep it SHORT - 2-3 sentences max
- NO corporate speak: avoid "I am writing to", "Thank you for reaching out", "I hope this email finds you well"
- Start with your actual response, not pleasantries

CONTENT RULES:
- If it's an interview/meeting request → Show excitement, confirm availability, share your calendar link
- If it's a job opportunity → Express interest briefly, ask one specific question
- If it's a rejection → Quick thanks, move on (1 sentence)
- If it's spam/newsletter → Ignore or unsubscribe (don't reply)
- If they're interested in talking → Share your meeting link: https://cal.com/example

EXAMPLES OF GOOD REPLIES:
"Absolutely! I'd love to chat about the role. Here's my calendar: https://cal.com/example - pick any time that works for you."

"This sounds great! Quick question - is this a remote position? Either way, I'm interested."

"Thanks for letting me know. Best of luck with the search!"

Write ONLY the reply message (no subject, no signature, no "Hi" or "Dear"):`;

        Logger.info(`Trying model: ${modelName}`);
        const model = this.getModel(modelName);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          Logger.info(`Successfully generated reply using model: ${modelName}`);
          return text;
        }
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message || error.toString() || '';
        Logger.warn(`Model ${modelName} failed: ${errorMsg.substring(0, 200)}`);
        
        // If it's a 404/model not found error, try the next model
        if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('404 Not Found')) {
          continue;
        }
        // For other errors, also try next model (might be temporary issues)
        if (errorMsg.includes('503') || errorMsg.includes('500')) {
          continue;
        }
        // For auth errors, break immediately
        if (errorMsg.includes('401') || errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('permission')) {
          break;
        }
      }
    }

    // If we get here, all models failed
    Logger.error('Error generating Gemini reply with all models:', lastError);
    const errorMsg = lastError?.message || lastError?.toString() || 'Unknown error';
    
    // Handle specific Gemini API errors
    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('401') || errorMsg.includes('permission')) {
      throw new Error('Invalid Gemini API key or insufficient permissions. Please check your GEMINI_API_KEY in .env file and ensure it has access to Generative Language API.');
    }
    if (errorMsg.includes('QUOTA_EXCEEDED') || errorMsg.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please check your usage limits.');
    }
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error(`No Gemini models available. Tried: ${modelsToTry.join(', ')}. Error: ${errorMsg.substring(0, 200)}`);
    }
    
    throw new Error(`Failed to generate reply: ${errorMsg.substring(0, 300)}`);
  }

  async generateBulkReplies(emails: any[]): Promise<Map<string, string>> {
    const replies = new Map<string, string>();

    for (const email of emails) {
      try {
        const reply = await this.generateReply(email);
        replies.set(email.messageId, reply);
      } catch (error) {
        Logger.error(`Error generating reply for ${email.messageId}:`, error);
        replies.set(email.messageId, 'Error generating reply');
      }
    }

    return replies;
  }

  isAvailable(): boolean {
    return this.genAI !== null;
  }
}


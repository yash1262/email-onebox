import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export type EmailCategory = 
  | 'Interested' 
  | 'Meeting Booked' 
  | 'Not Interested' 
  | 'Spam' 
  | 'Out of Office'
  | 'Uncategorized';

export async function categorizeEmail(email: any): Promise<EmailCategory> {
  try {
    // Rule-based categorization (works without OpenAI)
    const subject = (email.subject || '').toLowerCase();
    const body = (email.body || '').toLowerCase();
    const from = (email.from || '').toLowerCase();
    const content = `${subject} ${body}`;

    // Spam detection
    const spamKeywords = [
      'unsubscribe', 'click here', 'limited time', 'act now', 'buy now',
      'discount', 'offer', 'free', 'winner', 'congratulations', 'prize',
      'casino', 'viagra', 'pharmacy', 'weight loss', 'make money',
      'work from home', 'earn cash', 'credit card', 'loan', 'mortgage',
      'investment opportunity', 'nigerian prince', 'verify your account',
      'suspended account', 'update payment', 'claim your', 'promotional'
    ];
    if (spamKeywords.some(keyword => content.includes(keyword))) {
      return 'Spam';
    }

    // Out of Office detection
    const oooKeywords = [
      'out of office', 'away from office', 'on vacation', 'on leave',
      'automatic reply', 'auto reply', 'currently unavailable',
      'will respond when', 'limited access to email'
    ];
    if (oooKeywords.some(keyword => content.includes(keyword))) {
      return 'Out of Office';
    }

    // Meeting Booked detection
    const meetingKeywords = [
      'meeting confirmed', 'meeting scheduled', 'calendar invite',
      'accepted your invitation', 'zoom meeting', 'google meet',
      'meeting link', 'join the meeting', 'meeting details',
      'scheduled for', 'appointment confirmed', 'booking confirmed'
    ];
    if (meetingKeywords.some(keyword => content.includes(keyword))) {
      return 'Meeting Booked';
    }

    // Interested detection
    const interestedKeywords = [
      'interested', 'would like to', 'looking forward', 'excited about',
      'sounds good', 'let\'s discuss', 'tell me more', 'more information',
      'schedule a call', 'set up a meeting', 'available for', 'happy to',
      'shortlisted', 'selected', 'interview', 'next steps'
    ];
    if (interestedKeywords.some(keyword => content.includes(keyword))) {
      return 'Interested';
    }

    // Not Interested detection
    const notInterestedKeywords = [
      'not interested', 'no thank', 'not at this time', 'pass on',
      'decline', 'not a good fit', 'not looking', 'already have',
      'not in the market', 'maybe later', 'not right now'
    ];
    if (notInterestedKeywords.some(keyword => content.includes(keyword))) {
      return 'Not Interested';
    }

    return 'Uncategorized';
  } catch (error) {
    console.error('Error categorizing email:', error);
    return 'Uncategorized';
  }
}

export async function batchCategorizeEmails(emails: any[]): Promise<Map<string, EmailCategory>> {
  const results = new Map<string, EmailCategory>();

  for (const email of emails) {
    const category = await categorizeEmail(email);
    results.set(email.messageId, category);
  }

  return results;
}

import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/aiService';

export const useAIReply = () => {
  return useMutation({
    mutationFn: (emailId: string) => aiService.generateReply(emailId)
  });
};

export const useAIBulkReplies = () => {
  return useMutation({
    mutationFn: (emailIds: string[]) => aiService.generateBulkReplies(emailIds)
  });
};

export const useRecategorize = () => {
  return useMutation({
    mutationFn: (emailId: string) => aiService.recategorizeEmail(emailId)
  });
};

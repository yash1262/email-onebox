import React from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { useAIReply } from '../../hooks/useAI';

interface SuggestedReplyProps {
  emailId: string;
}

export const SuggestedReply: React.FC<SuggestedReplyProps> = ({ emailId }) => {
  const { mutate, data, isPending, error } = useAIReply();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    mutate(emailId);
  }, [emailId]);

  const handleCopy = () => {
    if (data?.suggestedReply) {
      navigator.clipboard.writeText(data.suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader size="lg" />
        <p className="mt-4 text-gray-600">Generating AI reply...</p>
      </div>
    );
  }

  if (error || !data) {
    const errorMessage = error as any;
    const isQuotaError = errorMessage?.response?.data?.code === 'OPENAI_QUOTA_EXCEEDED';
    
    return (
      <div className="text-center py-8 space-y-3">
        <p className="text-red-600 font-semibold">
          {isQuotaError ? '⚠️ OpenAI API Quota Exceeded' : 'Failed to generate reply'}
        </p>
        {isQuotaError && (
          <div className="text-sm text-gray-600 space-y-2">
            <p>Your OpenAI account has no remaining credits.</p>
            <p>
              <a 
                href="https://platform.openai.com/account/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Add credits to your OpenAI account →
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600">
        <Sparkles size={20} />
        <span className="font-semibold">AI-Generated Reply</span>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <pre className="whitespace-pre-wrap font-sans text-gray-800">
          {data.suggestedReply}
        </pre>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          This reply was generated using AI based on your product context
        </p>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={16} className="mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} className="mr-2" />
              Copy Reply
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

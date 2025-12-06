import React from 'react';
import { Copy, Check, Sparkles, RefreshCw, Send, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { useAIReply } from '../../hooks/useAI';

interface SuggestedReplyProps {
  emailId: string;
  onUseReply?: (reply: string) => void;
}

export const SuggestedReply: React.FC<SuggestedReplyProps> = ({ emailId, onUseReply }) => {
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

  const handleRegenerate = () => {
    mutate(emailId);
    setCopied(false);
  };

  const handleUseReply = () => {
    if (data?.suggestedReply && onUseReply) {
      onUseReply(data.suggestedReply);
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader size="lg" />
        </div>
        <p className="mt-6 text-gray-700 font-semibold">Generating AI reply with Gemini...</p>
        <p className="mt-2 text-sm text-gray-500">This may take a few seconds</p>
      </div>
    );
  }

  if (error || !data) {
    const errorMessage = error as any;
    const errorCode = errorMessage?.response?.data?.code;
    const errorMsg = errorMessage?.response?.data?.message || errorMessage?.message;
    const isApiKeyError = errorCode === 'GEMINI_API_KEY_MISSING';
    const isQuotaError = errorCode === 'GEMINI_QUOTA_EXCEEDED';
    
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-red-50 rounded-full">
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-red-600 font-semibold text-lg">
            {isApiKeyError ? 'Gemini API Key Required' : isQuotaError ? 'API Quota Exceeded' : 'Failed to generate reply'}
          </p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {errorMsg || 'An error occurred while generating the reply'}
          </p>
        </div>
        {isApiKeyError && (
          <div className="pt-4 space-y-3">
            <p className="text-sm text-gray-600">Get your free API key from Google:</p>
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-medium text-sm font-semibold"
            >
              Get Gemini API Key →
            </a>
            <p className="text-xs text-gray-500 pt-2">
              Then add it to your backend/.env file as GEMINI_API_KEY
            </p>
          </div>
        )}
        <Button variant="secondary" size="sm" onClick={handleRegenerate} className="mt-4">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-medium">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">AI-Generated Reply</h3>
            <p className="text-xs text-gray-500 font-medium">Powered by Google Gemini</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRegenerate}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <RefreshCw size={16} className="mr-1.5" />
          Regenerate
        </Button>
      </div>

      {/* Reply Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-primary-100/30 rounded-xl blur-sm opacity-60"></div>
        <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans text-[15px]">
              {data.suggestedReply}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/80">
        <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
          <Sparkles size={12} className="text-primary-500" />
          Generated using context-aware AI
        </p>
        <div className="flex gap-2.5">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleCopy}
            className="flex items-center gap-2 border-gray-300"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </Button>
          {onUseReply && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleUseReply}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700"
            >
              <Send size={16} />
              Use Reply
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

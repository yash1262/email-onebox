import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: {
    to: string;
    subject: string;
  };
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  isOpen,
  onClose,
  replyTo
}) => {
  const [to, setTo] = useState(replyTo?.to || '');
  const [subject, setSubject] = useState(replyTo?.subject || '');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    // Implement send logic
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-6 w-[600px] bg-white rounded-t-lg shadow-2xl border border-gray-200 z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">New Message</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-3">
        <Input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Compose your message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Button
            onClick={handleSend}
            isLoading={isSending}
            disabled={!to || !subject || !body}
          >
            <Send size={16} className="mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

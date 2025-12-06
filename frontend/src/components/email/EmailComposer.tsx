import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { emailService } from '../../services/emailService';
import { useAccountStore } from '../../store/accountStore';
import { useEmails } from '../../hooks/useEmails';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: {
    to: string;
    subject: string;
    messageId?: string;
    references?: string;
  };
  initialBody?: string;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  isOpen,
  onClose,
  replyTo,
  initialBody = ''
}) => {
  const [to, setTo] = useState(replyTo?.to || '');
  const [subject, setSubject] = useState(replyTo?.subject || '');
  const [body, setBody] = useState(initialBody);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedAccount } = useAccountStore();
  const { refetch } = useEmails();

  React.useEffect(() => {
    if (replyTo) {
      setTo(replyTo.to);
      setSubject(replyTo.subject);
    }
  }, [replyTo]);

  React.useEffect(() => {
    if (initialBody) {
      setBody(initialBody);
    }
  }, [initialBody]);

  const handleSend = async () => {
    setIsSending(true);
    setError(null);

    try {
      // Use selected account or first available account as sender
      const from = selectedAccount || to; // Fallback to recipient if no account selected

      const result = await emailService.sendEmail({
        from,
        to,
        subject,
        body,
        inReplyTo: replyTo?.messageId,
        references: replyTo?.references
      });

      if (result.success) {
        // Refresh email list to show sent email
        refetch();
        onClose();
        // Reset form
        setTo('');
        setSubject('');
        setBody('');
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-6 w-[640px] bg-white rounded-t-xl shadow-large border border-gray-200/80 z-40 max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/80 bg-gradient-to-br from-white to-gray-50/50">
        <h3 className="font-semibold text-gray-900 text-base">Compose Reply</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <div className="p-5 space-y-4 flex-1 overflow-y-auto bg-white">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">To</label>
          <Input
            placeholder="Recipient email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
          <Input
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
          <textarea
            placeholder="Compose your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-72 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-sans text-sm leading-relaxed transition-all"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200/80 bg-gray-50/50">
        <div className="flex-1">
          {error && (
            <p className="text-xs font-medium text-red-600">
              {error}
            </p>
          )}
          {!error && (
            <p className="text-xs font-medium text-gray-500">
              {body.length} characters
            </p>
          )}
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            isLoading={isSending}
            disabled={!to || !subject || !body}
            size="sm"
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Send size={16} className="mr-1.5" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

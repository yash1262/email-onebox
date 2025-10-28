import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Reply, Sparkles, Paperclip, ExternalLink } from 'lucide-react';
import { Email } from '../../types/email.types';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { SuggestedReply } from '../ai/SuggestedReply';
import { useEmailStore } from '../../store/emailStore';

interface EmailDetailProps {
  email: Email;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email }) => {
  const { setSelectedEmail } = useEmailStore();
  const [showReplyModal, setShowReplyModal] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={() => setSelectedEmail(null)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyModal(true)}
            >
              <Sparkles size={16} className="mr-1" />
              AI Reply
            </Button>
            <Button variant="ghost" size="sm">
              <Reply size={16} className="mr-1" />
              Reply
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">
              {email.subject || '(No Subject)'}
            </h1>
            {email.category && <CategoryBadge category={email.category} />}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">From:</span>
            <span className="text-gray-600">{email.from}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">To:</span>
            <span className="text-gray-600">{email.to}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{format(new Date(email.date), 'PPpp')}</span>
            <span>•</span>
            <span>{email.accountEmail}</span>
            <span>•</span>
            <span>{email.folder}</span>
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Paperclip size={16} className="text-gray-500" />
              <span className="font-medium text-gray-700">
                {email.attachments.length} attachment(s)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose max-w-none">
          {email.html ? (
            <div dangerouslySetInnerHTML={{ __html: email.html }} />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-gray-800">
              {email.body}
            </pre>
          )}
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Attachments
            </h3>
            <div className="space-y-2">
              {email.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Paperclip size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        title="AI Suggested Reply"
        size="lg"
      >
        <SuggestedReply emailId={email.id} />
      </Modal>
    </div>
  );
};

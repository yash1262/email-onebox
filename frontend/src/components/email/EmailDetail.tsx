import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Reply, Sparkles, Paperclip, ExternalLink } from 'lucide-react';
import { Email } from '../../types/email.types';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { SuggestedReply } from '../ai/SuggestedReply';
import { EmailComposer } from './EmailComposer';
import { useEmailStore } from '../../store/emailStore';

interface EmailDetailProps {
  email: Email;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email }) => {
  const { setSelectedEmail } = useEmailStore();
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [composerBody, setComposerBody] = useState('');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between mb-6">
            <button
              onClick={() => setSelectedEmail(null)}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all lg:hidden text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowReplyModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0 rounded-xl px-4 py-2.5 font-semibold"
              >
                <Sparkles size={16} className="mr-2" />
                AI Reply
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setComposerBody('');
                  setShowComposer(true);
                }}
                className="border-gray-300 hover:bg-gray-50 rounded-xl px-4 py-2.5 font-medium"
              >
                <Reply size={16} className="mr-2" />
                Reply
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 leading-tight">
                {email.subject || '(No Subject)'}
              </h1>
              {email.category && <CategoryBadge category={email.category} />}
            </div>

            <div className="grid grid-cols-1 gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">From</span>
                <span className="text-sm font-medium text-gray-900">{email.from}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">To</span>
                <span className="text-sm font-medium text-gray-900">{email.to}</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Date</span>
                <span className="text-sm text-gray-600">{format(new Date(email.date), 'PPpp')}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{email.accountEmail}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-medium text-gray-500 capitalize">{email.folder.toLowerCase()}</span>
              </div>

              {email.attachments && email.attachments.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Files</span>
                  <div className="flex items-center gap-2">
                    <Paperclip size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-4xl">
          <div className="prose prose-slate max-w-none">
            {email.html ? (
              <div 
                className="email-content"
                dangerouslySetInnerHTML={{ __html: email.html }} 
              />
            ) : (
              <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-[15px]">
                {email.body}
              </div>
            )}
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                Attachments
              </h3>
              <div className="space-y-2.5">
                {email.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Paperclip size={18} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {attachment.filename}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(attachment.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        title="AI Suggested Reply"
        size="lg"
      >
        <SuggestedReply 
          emailId={email.id} 
          onUseReply={(reply) => {
            setComposerBody(reply);
            setShowReplyModal(false);
            setShowComposer(true);
          }}
        />
      </Modal>

      {/* Email Composer */}
      <EmailComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        replyTo={{
          to: email.from,
          subject: email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject || ''}`
        }}
        initialBody={composerBody}
      />
    </div>
  );
};

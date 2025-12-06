import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Email } from '../../types/email.types';
import { CategoryBadge } from './CategoryBadge';
import { Paperclip } from 'lucide-react';

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

export const EmailItem: React.FC<EmailItemProps> = ({ email, isSelected, onClick }) => {
  const hasAttachments = email.attachments && email.attachments.length > 0;
  const senderName = email.from.split('<')[0].trim() || email.from;

  return (
    <div
      onClick={onClick}
      className={`px-5 py-4 cursor-pointer transition-all duration-200 border-b border-gray-100/80 ${
        isSelected 
          ? 'bg-primary-50/50 border-l-4 border-l-primary-600 shadow-soft' 
          : 'hover:bg-gray-50/50 border-l-4 border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center gap-2.5 mb-2">
            <p className="font-semibold text-sm text-gray-900 truncate">
              {senderName}
            </p>
            {email.category && <CategoryBadge category={email.category} />}
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
              {email.accountEmail.split('@')[0]}
            </span>
          </div>

          {/* Subject */}
          <h3 className="text-sm font-semibold text-gray-900 truncate mb-1.5 leading-snug">
            {email.subject || '(No Subject)'}
          </h3>

          {/* Preview */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2.5">
            {email.body.substring(0, 150)}...
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2.5 text-xs text-gray-500">
            <span className="font-medium">{formatDistanceToNow(new Date(email.date), { addSuffix: true })}</span>
            <span className="text-gray-300">•</span>
            <span className="capitalize">{email.folder.toLowerCase()}</span>
            {hasAttachments && (
              <>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-primary-600 font-medium">
                  <Paperclip size={12} />
                  {email.attachments!.length}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

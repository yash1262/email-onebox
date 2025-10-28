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

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Sender */}
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 truncate">
              {email.from.split('<')[0].trim() || email.from}
            </p>
            {email.category && <CategoryBadge category={email.category} />}
          </div>

          {/* Subject */}
          <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
            {email.subject || '(No Subject)'}
          </h3>

          {/* Preview */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {email.body.substring(0, 150)}...
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>{formatDistanceToNow(new Date(email.date), { addSuffix: true })}</span>
            <span>•</span>
            <span>{email.folder}</span>
            {hasAttachments && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Paperclip size={12} />
                  {email.attachments!.length}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Account Badge */}
        <div className="flex-shrink-0">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {email.accountEmail.split('@')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};

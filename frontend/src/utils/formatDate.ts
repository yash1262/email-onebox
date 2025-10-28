import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatEmailDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return format(dateObj, 'h:mm a');
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  return format(dateObj, 'MMM d');
};

export const formatFullDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PPpp');
};

export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

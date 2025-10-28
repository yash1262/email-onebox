export const APP_NAME = 'Email Onebox';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const FOLDERS = {
  INBOX: 'INBOX',
  SENT: 'SENT',
  STARRED: 'STARRED',
  TRASH: 'TRASH',
  ARCHIVE: 'ARCHIVE'
} as const;

export const REFRESH_INTERVAL = 30000; // 30 seconds
export const SEARCH_DEBOUNCE = 500; // 500ms

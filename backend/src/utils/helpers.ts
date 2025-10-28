export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatEmailAddress = (address: string): {
  name?: string;
  email: string;
} => {
  const match = address.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { email: address.trim() };
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script[^>]*>.*<\/script>/gm, '')
    .replace(/<style[^>]*>.*<\/style>/gm, '')
    .replace(/on\w+="[^"]*"/gm, '');
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

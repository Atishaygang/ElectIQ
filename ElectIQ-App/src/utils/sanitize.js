import { APP_CONFIG } from '../config/appConfig';

/**
 * Sanitizes input string to remove potentially malicious tags.
 * @param {string} input 
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input
    .replace(/<script[^>]*?>.*?<\/script>/gi, '')
    .replace(/<img[^>]*?>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\bonclick\s*=\s*(?:'[^']*'|"[^"]*"|[^>\s]+)/gi, '');
};

/**
 * Truncates text to a maximum length.
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = APP_CONFIG.MAX_CHAT_LENGTH) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength);
};

/**
 * Validates and sanitizes a chat message.
 * @param {string} message 
 * @returns {string}
 */
export const validateChatMessage = (message) => {
  let cleaned = sanitizeInput(message);
  cleaned = truncateText(cleaned);
  return cleaned.trim();
};

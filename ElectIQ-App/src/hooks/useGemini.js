import { useState, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateChatMessage, sanitizeInput } from '../utils/sanitize';
import { chatRateLimiter } from '../utils/rateLimit';
import { logger } from '../utils/logger';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `You are ElectIQ, an expert on Indian elections.
Answer questions about the Election Commission of India, EVM machines,
constituencies, voter registration, election timeline, political parties,
voting process, and election results. Keep answers simple, accurate, and
under 150 words. If asked in Hindi, respond in Hindi. Be neutral and factual.`;

const FAQ_FALLBACK = {
  "default": "I'm having trouble connecting right now, but I can tell you that the Election Commission of India (ECI) conducts elections. Try asking me again in a moment."
};

/**
 * Hook to interact with the Gemini AI model.
 */
export const useGemini = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatSessionRef = useRef(null);

  const initChat = async () => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
      });
      chatSessionRef.current = model.startChat({
        history: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))
      });
    } catch (e) {
      logger.error("Failed to init chat", e);
    }
  };

  /**
   * Memoized parsing function for response text.
   */
  const parseResponse = useCallback((result) => {
    return result.response.text();
  }, []);

  /**
   * Sends a message to the Gemini API.
   * @param {string} userText 
   */
  const sendMessage = useCallback(async (userText) => {
    const sanitizedText = validateChatMessage(userText);
    if (!sanitizedText) return;

    setMessages(prev => [...prev, { id: Date.now(), text: sanitizedText, sender: 'user' }]);
    
    if (chatRateLimiter.isRateLimited()) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "You've reached the limit of 10 messages per minute. Please wait a moment.", 
        sender: 'bot' 
      }]);
      return;
    }

    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        await initChat();
      }
      
      const result = await chatSessionRef.current.sendMessage(sanitizedText);
      const responseText = parseResponse(result);
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }]);
    } catch (error) {
      logger.error("Gemini API Error:", error);
      // Fallback
      setMessages(prev => [...prev, { id: Date.now() + 1, text: FAQ_FALLBACK.default, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  }, [parseResponse]);

  const clearChat = useCallback(() => {
    setMessages([]);
    chatSessionRef.current = null;
  }, []);

  return { messages, setMessages, sendMessage, isLoading, clearChat, sanitizeInput };
};

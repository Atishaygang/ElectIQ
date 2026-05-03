import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useGemini } from '../../hooks/useGemini';
import { useFirebase } from '../../hooks/useFirebase';
import { Send, Trash2, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { useDebounce } from '../../hooks/useDebounce';
import PropTypes from 'prop-types';

const ChatMessageBubble = React.memo(({ message }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div 
      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
        message.sender === 'user' 
          ? 'bg-saffron text-white rounded-tr-sm' 
          : 'bg-dark-card border border-gray-800 text-gray-200 rounded-tl-sm'
      }`}
    >
      {message.text}
    </div>
  </motion.div>
));

ChatMessageBubble.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired
};

const ChatTab = () => {
  const location = useLocation();
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const [language, setLanguage] = useState('en'); 
  
  const { messages, sendMessage, isLoading, clearChat, sanitizeInput } = useGemini();
  const { addQuestion } = useFirebase();
  const messagesEndRef = useRef(null);

  const handleSend = useCallback(async (textToProcess) => {
    const text = typeof textToProcess === 'string' ? textToProcess : debouncedInput;
    if (!text.trim() || isLoading) return;
    
    const sanitized = sanitizeInput(text);
    setInput('');
    
    try {
      await addQuestion(sanitized, language);
    } catch (e) {
      // logged by helper
    }
    
    await sendMessage(sanitized);
  }, [debouncedInput, isLoading, sanitizeInput, language, addQuestion, sendMessage]);

  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSend(location.state.initialMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleSend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleLanguage = useCallback(() => {
    setLanguage(l => l === 'en' ? 'hi' : 'en');
  }, []);

  const suggestions = [
    "How to register to vote?",
    "What is Model Code of Conduct?",
    "How does EVM work?",
    "When is the next election?"
  ];

  // Virtualization - only render last 50 messages
  const displayMessages = messages.slice(-APP_CONFIG.MAX_CHAT_HISTORY);

  return (
    <div className="flex flex-col h-full bg-dark-bg absolute inset-0 pb-16" aria-busy={isLoading}>
      <div className="flex justify-between items-center p-3 border-b border-gray-800 bg-dark-card sticky top-0 z-10">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1 text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full"
          aria-pressed={language === 'hi'}
        >
          <Globe2 size={14} />
          {language === 'en' ? 'English' : 'हिंदी'}
        </button>
        <button 
          onClick={clearChat}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {displayMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <span className="text-4xl mb-4 block" aria-hidden="true">🤖</span>
            <p>Ask me anything about Indian Elections!</p>
          </div>
        )}
        
        <AnimatePresence>
          {displayMessages.map((m) => (
            <ChatMessageBubble key={m.id} message={m} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-card border border-gray-800 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-saffron rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-saffron rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
              <span className="w-2 h-2 bg-saffron rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {displayMessages.length === 0 && (
        <div className="px-4 pb-2 flex overflow-x-auto gap-2 no-scrollbar">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-full border border-gray-700 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 bg-dark-card border-t border-gray-800">
        <form 
          className="relative flex items-center"
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        >
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.substring(0, APP_CONFIG.MAX_CHAT_LENGTH))}
            placeholder={language === 'en' ? "Type a question..." : "प्रश्न पूछें..."}
            className="w-full bg-dark-bg border border-gray-700 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-saffron"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-saffron text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-opacity"
            aria-label="Send message"
            aria-disabled={isLoading}
          >
            <Send size={16} />
          </button>
        </form>
        <div className="text-right py-1">
          <span className="text-[10px] text-gray-600">{input.length}/{APP_CONFIG.MAX_CHAT_LENGTH}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatTab);

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGemini } from '../../hooks/useGemini';
import { db } from '../../config/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';
import { Send, Trash2, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatTab = () => {
  const location = useLocation();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'
  
  const { messages, sendMessage, isLoading, clearChat, sanitizeInput } = useGemini();
  const messagesEndRef = useRef(null);

  // Handle initial message from Home tab quick actions
  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSend(location.state.initialMessage);
      // clear the state so it doesn't trigger again on re-render
      window.history.replaceState({}, document.title)
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToProcess) => {
    const text = typeof textToProcess === 'string' ? textToProcess : input;
    if (!text.trim() || isLoading) return;
    
    const sanitized = sanitizeInput(text);
    setInput('');
    
    // Save anonymized question to Firebase
    try {
      push(ref(db, 'questions'), {
        text: sanitized,
        lang: language,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Firebase write error", e);
    }
    
    // Send to Gemini
    await sendMessage(sanitized);
  };

  const suggestions = [
    "How to register to vote?",
    "What is Model Code of Conduct?",
    "How does EVM work?",
    "When is the next election?"
  ];

  return (
    <div className="flex flex-col h-full bg-dark-bg absolute inset-0 pb-16">
      {/* Chat header config */}
      <div className="flex justify-between items-center p-3 border-b border-gray-800 bg-dark-card sticky top-0 z-10">
        <button 
          onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <span className="text-4xl mb-4 block" aria-hidden="true">🤖</span>
            <p>Ask me anything about Indian Elections!</p>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.sender === 'user' 
                    ? 'bg-saffron text-white rounded-tr-sm' 
                    : 'bg-dark-card border border-gray-800 text-gray-200 rounded-tl-sm'
                }`}
              >
                {m.text}
              </div>
            </motion.div>
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

      {/* Suggestions */}
      {messages.length === 0 && (
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

      {/* Input */}
      <div className="p-3 bg-dark-card border-t border-gray-800">
        <form 
          className="relative flex items-center"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.substring(0, 500))} // Enforce 500 limit
            placeholder={language === 'en' ? "Type a question..." : "प्रश्न पूछें..."}
            className="w-full bg-dark-bg border border-gray-700 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-saffron"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-saffron text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-opacity"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="text-right py-1">
          <span className="text-[10px] text-gray-600">{input.length}/500</span>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;

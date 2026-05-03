import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Renders a single chat message bubble.
 * @param {Object} props - Component props.
 * @param {Object} props.message - The message object.
 * @param {string} props.message.sender - Sender ('user' or 'system').
 * @param {string} props.message.text - Message content.
 * @returns {JSX.Element} ChatMessageBubble component.
 */
const ChatMessageBubble = ({ message }) => (
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
);

ChatMessageBubble.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })
};

ChatMessageBubble.defaultProps = {
  message: { sender: 'system', text: '' }
};

export default React.memo(ChatMessageBubble);

// src/components/Chatbot.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage = { from: 'user', text: input };
    const newBotMessage = {
      from: 'bot',
      text: "Thanks! We'll get back to you shortly."
    };

    setMessages([...messages, newUserMessage, newBotMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-white text-gray-800 rounded-xl shadow-xl w-80 max-w-xs overflow-hidden flex flex-col border border-gray-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {/* Header */}
            <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold">Chat with us</span>
              <button onClick={handleToggle} className="text-white">
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-60 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.from === 'bot'
                      ? 'bg-green-100 text-left text-gray-800'
                      : 'bg-yellow-100 text-right text-gray-800 self-end'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-2 border-t flex">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm text-gray-800"
              />
              <button
                onClick={handleSend}
                className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-md"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          onClick={handleToggle}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FaCommentDots size={20} />
        </motion.button>
      )}
    </div>
  );
};

export default Chatbot;
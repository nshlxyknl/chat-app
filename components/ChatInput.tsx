
'use client';

import { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  onTyping,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMessage(text);

    // Reset height to auto to get accurate scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120
      ) + 'px';
    }

    // Emit typing event when text is entered
    if (text.length > 0) {
      onTyping(true);
    }

    // Clear typing indicator after 2 seconds of inactivity
if (typingTimeoutRef.current) {
  clearTimeout(typingTimeoutRef.current);
}    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  // Handle send message
  const handleSend = () => {
    if (!message.trim() || disabled) return;

    onSendMessage(message);
    setMessage('');
    onTyping(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Send on Enter, but allow Shift+Enter for new line
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-6 bg-white shadow-lg">
      <div className="flex gap-3">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={
            disabled ? 'Connecting...' : 'Type a message... (Shift+Enter for new line)'
          }
          disabled={disabled}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={1}
          maxLength={500}
          style={{ maxHeight: '120px' }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 flex-shrink-0"
          title="Send message (Ctrl+Enter)"
        >
          📤
        </button>
      </div>

      {/* Character count */}
      <div className="text-right text-xs text-gray-500 mt-2">
        {message.length}/500
      </div>
    </div>
  );
}
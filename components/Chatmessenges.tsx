// components/ChatMessages.tsx

'use client';

import { useEffect, useRef } from 'react';
import { Message, TypingUser } from '../lib/types';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId?: string;
  typingUsers: TypingUser[];
}

export default function ChatMessages({
  messages,
  currentUserId,
  typingUsers,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    return () => clearTimeout(timer);
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm opacity-75">Start the conversation!</p>
          </div>
        </div>
      )}

      {/* Messages list */}
      {messages.map((msg) => {
        const isOwn = msg.userId === currentUserId;
        const isSystem = msg.userId === 'system';

        // System message (join/leave)
        if (isSystem) {
          return (
            <div key={msg.id} className="text-center py-2">
              <span className="text-xs text-gray-500 italic">
                {msg.message}
              </span>
            </div>
          );
        }

        // Regular message
        return (
          <div
            key={msg.id}
            className={`flex gap-3 animate-in slide-in-from-bottom-4 duration-300 ${
              isOwn ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Avatar - only show for other users */}
            {!isOwn && (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: msg.color }}
                title={msg.username}
              >
                {msg.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Message content */}
            <div className={isOwn ? 'order-2' : ''}>
              {/* Header (name + time) - only show for other users */}
              {!isOwn && (
                <div className="text-xs text-gray-600 mb-1 ml-2">
                  <strong>{msg.username}</strong>
                  <span className="ml-2 opacity-75">{msg.timestamp}</span>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm break-words transition ${
                  isOwn
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-br-none shadow-md'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.message}
              </div>

              {/* Timestamp - only show for own messages */}
              {isOwn && (
                <div className="text-xs text-gray-600 mt-1 mr-2 text-right">
                  {msg.timestamp}
                </div>
              )}
            </div>

            {/* Avatar space for own messages */}
            {isOwn && (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: msg.color }}
              >
                {msg.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex gap-3 animate-in slide-in-from-bottom-4">
          <div className="w-10 h-10" />
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 rounded-bl-none">
            <div className="text-xs text-gray-600 mb-2">
              {typingUsers.map((u) => u.username).join(', ')}{' '}
              {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400" />
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
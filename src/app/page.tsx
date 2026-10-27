// app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { initSocket, getSocket } from '../../lib/socket';
import { Message, User, TypingUser } from '../../lib/types';
import ChatMessages from '../../components/Chatmessenges';
import ChatInput from '../../components/ChatInput';
import UsersList from '../../components/UserList';
import ConnectionStatus from '../../components/ConnectionStatus';
import LoginForm from '../../components/LoginForm';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const socket = initSocket();

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected');
    });

    // Message events
    socket.on('receive-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Users list update
    socket.on('users-list', (usersList: User[]) => {
      setUsers(usersList);
    });

    // Typing indicator
    socket.on('user-typing', (data: TypingUser) => {
      setTypingUsers((prev) => {
        const filtered = prev.filter((u) => u.userId !== data.userId);
        if (data.isTyping) {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    // User joined notification
    socket.on('user-joined', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          userId: 'system',
          username: 'System',
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          color: '#636e72',
        },
      ]);
    });

    // User left notification
    socket.on('user-left', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          userId: 'system',
          username: 'System',
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          color: '#636e72',
        },
      ]);
    });

    // Cleanup event listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive-message');
      socket.off('users-list');
      socket.off('user-typing');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, []);

  // Handle login
  const handleLogin = (username: string, color: string) => {
    const socket = getSocket();
    if (!socket) return;

    if (!socket.id) {
  console.error('Socket ID not available');
  return;
}

    const user: User = {
      id: socket.id,
      name: username,
      color: color,
      avatar: username.charAt(0).toUpperCase(),
    };

    setCurrentUser(user);
    setShowLogin(false);

    // Emit user join event to server
    socket.emit('user-join', { username, color });
  };

  // Handle send message
  const handleSendMessage = (text: string) => {
    const socket = getSocket();
    if (!socket || !currentUser) return;

    // Emit message to server
    socket.emit('send-message', { message: text });

    // Add message to local state immediately for better UX
    const messageObj: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.name,
      message: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      color: currentUser.color,
    };

    setMessages((prev) => [...prev, messageObj]);
  };

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('typing', isTyping);
  };

  // Show login screen if not logged in
  if (showLogin) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show chat interface
  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Hidden on small screens */}
      <div className="hidden lg:flex lg:w-80 bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 text-white flex-col shadow-xl">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-indigo-500 border-opacity-30">
          <h2 className="text-2xl font-bold mb-1">💬 ChatHub</h2>
          <p className="text-sm text-indigo-100 opacity-80">
            {currentUser?.name}
          </p>
        </div>

        {/* Users List */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">
            Online Users ({users.length})
          </h3>
          <UsersList users={users} currentUserId={currentUser?.id} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 lg:p-6 flex justify-between items-center shadow-sm bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to ChatHub 👋
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {users.length} user{users.length !== 1 ? 's' : ''} online
            </p>
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </div>

        {/* Messages Display */}
        <ChatMessages
          messages={messages}
          currentUserId={currentUser?.id}
          typingUsers={typingUsers}
        />

        {/* Message Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
}
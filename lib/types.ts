
export interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  color: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface ChatState {
  users: User[];
  messages: Message[];
  currentUser: User | null;
  isConnected: boolean;
  typingUsers: TypingUser[];
}
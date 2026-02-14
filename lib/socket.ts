// lib/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  // Return existing connection if already connected
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  // Connection event
  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server', socket?.id);
  });

  // Connection error
  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error);
  });

  // Disconnection event
  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
  });

  // Socket error
  socket.on('error', (error) => {
    console.error('⚠️ Socket error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const emitEvent = <T>(event: string, data?: T): void => {
  if (socket?.connected) {
    socket.emit(event, data);
  } else {
    console.warn(`Socket not connected. Cannot emit ${event}`);
  }
};
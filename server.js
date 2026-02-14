// server.js - Plain JavaScript WebSocket Server

const express = require('express');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const cors = require('cors');

// ==================== SERVER SETUP ====================

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (_, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== STATE MANAGEMENT ====================

// Store all connected users
const users = new Map();

// Store messages (keep last 100)
const messages = [];

// ==================== SOCKET.IO CONNECTION ====================

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // EVENT: user-join
  socket.on('user-join', (data) => {
    try {
      // Store user information
      const user = {
        id: socket.id,
        name: data.username,
        color: data.color,
      };

      users.set(socket.id, user);
      socket.user = user;

      console.log(`📝 ${data.username} joined. Total users: ${users.size}`);

      // Send updated users list to all clients
      io.emit('users-list', Array.from(users.values()));

      // Notify other users that someone joined
      socket.broadcast.emit('user-joined', {
        message: `${data.username} joined the chat 👋`,
        username: data.username,
      });
    } catch (error) {
      console.error('Error in user-join:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // EVENT: send-message
  socket.on('send-message', (data) => {
    try {
      if (!socket.user) {
        socket.emit('error', { message: 'User not registered' });
        return;
      }

      const messageText = data.message.trim();

      // Validate message
      if (messageText.length === 0) {
        return;
      }

      if (messageText.length > 500) {
        socket.emit('error', { message: 'Message too long (max 500 chars)' });
        return;
      }

      // Create message object
      const messageObj = {
        id: `${socket.id}-${Date.now()}`,
        userId: socket.id,
        username: socket.user.name,
        message: messageText,
        color: socket.user.color,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Store message (keep last 100)
      messages.push(messageObj);
      if (messages.length > 100) {
        messages.shift();
      }

      console.log(`💬 ${socket.user.name}: ${messageText}`);

      // Broadcast message to all clients
      io.emit('receive-message', messageObj);
    } catch (error) {
      console.error('Error in send-message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // EVENT: typing
  socket.on('typing', (isTyping) => {
    try {
      if (!socket.user) return;

      // Broadcast typing status to other clients
      socket.broadcast.emit('user-typing', {
        userId: socket.id,
        username: socket.user.name,
        isTyping,
      });
    } catch (error) {
      console.error('Error in typing:', error);
    }
  });

  // EVENT: disconnect
  socket.on('disconnect', () => {
    try {
      const user = users.get(socket.id);

      if (user) {
        users.delete(socket.id);

        console.log(`❌ ${user.name} disconnected. Total users: ${users.size}`);

        // Notify other users that someone left
        io.emit('user-left', {
          message: `${user.name} left the chat 👋`,
          username: user.name,
        });

        // Send updated users list to all clients
        io.emit('users-list', Array.from(users.values()));
      }
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  });

  // EVENT: error
  socket.on('error', (error) => {
    console.error(`⚠️ Socket error for ${socket.id}:`, error);
  });
});

// ==================== HTTP ROUTES ====================

// Get all current users
app.get('/api/users', (_, res) => {
  res.json({
    users: Array.from(users.values()),
    count: users.size,
  });
});

// Get message history
app.get('/api/messages', (_, res) => {
  res.json({
    messages,
    count: messages.length,
  });
});

// Get server stats
app.get('/api/stats', (_, res) => {
  res.json({
    connectedUsers: users.size,
    totalMessages: messages.length,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.SOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}`);
  console.log(`📡 Ready for WebSocket connections`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// ==================== GRACEFUL SHUTDOWN ====================

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// ==================== ERROR HANDLING ====================

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = server;
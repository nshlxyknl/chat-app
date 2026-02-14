// components/LoginForm.tsx

'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, color: string) => void;
}

const COLORS = ['#667eea', '#e17055', '#00b894', '#fdcb6e', '#6c5ce7', '#fd79a8'];

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    onLogin(username, selectedColor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
            💬 ChatHub
          </h1>
          <p className="text-gray-600 font-medium">
            Real-time chat with WebSockets & Next.js
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-800 mb-3">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-800 font-medium"
              autoFocus
              required
            />
            <p className="text-xs text-gray-500 mt-2">{username.length}/20</p>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-4">
              Choose Your Color
            </label>
            <div className="flex gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full transition transform hover:scale-110 ${
                    selectedColor === color
                      ? 'ring-4 ring-gray-400 scale-110 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transition transform hover:scale-102 active:scale-95 text-lg"
          >
            Join Chat 🚀
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          💡 Powered by WebSockets & Next.js with TypeScript
        </p>
      </div>
    </div>
  );
}
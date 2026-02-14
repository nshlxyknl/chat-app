// components/UsersList.tsx

'use client';

import { User } from '../lib/types';

interface UsersListProps {
  users: User[];
  currentUserId?: string;
}

export default function UsersList({ users, currentUserId }: UsersListProps) {
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {users.length === 0 ? (
        <div className="text-xs text-white opacity-60 text-center py-4">
          Waiting for users...
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className={`p-3 rounded-lg cursor-pointer transition transform hover:scale-102 ${
              user.id === currentUserId
                ? 'bg-white bg-opacity-30 border-2 border-white'
                : 'hover:bg-white hover:bg-opacity-10'
            }`}
            title={user.id === currentUserId ? '(You)' : ''}
          >
            <div className="flex items-center gap-3">
              {/* User avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: user.color }}
              >
                {user.avatar}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="text-xs opacity-75 ml-1">(You)</span>
                  )}
                </p>
              </div>

              {/* Online status indicator */}
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
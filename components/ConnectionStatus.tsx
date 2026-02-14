// components/ConnectionStatus.tsx

'use client';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
        isConnected
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700 animate-pulse'
      }`}
    >
      {/* Status indicator dot */}
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
      />

      {/* Status text */}
      <span>{isConnected ? 'Connected' : 'Reconnecting...'}</span>
    </div>
  );
}
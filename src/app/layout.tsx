// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChatHub - Real-time Chat with WebSockets',
  description: 'A real-time chat application built with Next.js, TypeScript, and WebSockets',
  keywords: ['chat', 'websocket', 'nextjs', 'typescript', 'socket.io'],
  authors: [{ name: 'Your Name' }],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
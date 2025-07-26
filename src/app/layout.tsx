// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import TrackingScripts from '@/components/TrackingScripts';
import GoogleAdSense, { AdUnit } from '@/components/GoogleAdSense';
import MainLayout from '@/components/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prompt Gallery',
  description: 'A collection of AI prompts',
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google AdSense domains for better performance */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <meta name="google-adsense-account" content="ca-pub-2778127979909711" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <GoogleAdSense />
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
        <TrackingScripts />
      </body>
    </html>
  );
}

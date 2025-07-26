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
        <link rel="preconnect" href="https://tpc.googlesyndication.com" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <GoogleAdSense />
          
          {/* Top Banner Ad */}
          <div className="w-full bg-white shadow-sm">
            <div className="container mx-auto px-4">
              <AdUnit 
                slot="GhW6WJ"
                format="auto"
                responsive={true}
                className="py-2"
              />
            </div>
          </div>
          
          <MainLayout>
            {children}
          </MainLayout>
          
          {/* Bottom Banner Ad */}
          <div className="w-full bg-white border-t border-gray-100 mt-12">
            <div className="container mx-auto px-4 py-6">
              <AdUnit 
                slot="GhW6WJ"
                format="auto"
                responsive={true}
              />
            </div>
          </div>
        </AuthProvider>
        <TrackingScripts />
      </body>
    </html>
  );
}

'use client';

import { ReactNode } from 'react';
import { AdUnit } from './GoogleAdSense';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen dark:bg-white">
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Right Sidebar Ad - Desktop Only */}
      <div className="hidden lg:block w-64 flex-shrink-0 p-4">
        <div className="sticky top-24">
         
        </div>
      </div>
    </div>
  );
}

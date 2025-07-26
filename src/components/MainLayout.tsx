'use client';

import { ReactNode } from 'react';
import { AdUnit } from './GoogleAdSense';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar Ad - Desktop Only */}
      <div className="hidden lg:block w-64 flex-shrink-0 p-4">
        <div className="sticky top-24">
          <AdUnit 
            slot="your-left-sidebar-slot-id" 
            format="auto"
            className="mb-4"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Right Sidebar Ad - Desktop Only */}
      <div className="hidden lg:block w-64 flex-shrink-0 p-4">
        <div className="sticky top-24">
          <AdUnit 
            slot="your-right-sidebar-slot-id" 
            format="auto"
            className="mb-4"
          />
        </div>
      </div>
    </div>
  );
}

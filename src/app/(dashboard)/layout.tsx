'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardAuthGuard from './DashboardAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DashboardAuthGuard>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-grid-pattern">
            <div className="p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardAuthGuard>
  );
}
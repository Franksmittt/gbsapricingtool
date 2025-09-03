'use client';

import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/app/AuthContext';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <header className="flex-shrink-0 bg-gray-900 border-b border-white/10">
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-400 hover:text-white mr-4"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <p className="text-sm text-gray-400">Welcome, <span className="font-semibold text-white">{user?.name}</span></p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white" />
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-300 ring-2 ring-gray-600">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
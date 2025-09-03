'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, GitCompareArrows, Wrench, Settings, LogOut, BatteryCharging, X, Table, Calculator, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/AuthContext';
import { UserRole } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // <-- Get the logout function

  const navItems = [
    { name: 'Price Lists', href: '/pricelists', icon: BarChart2, roles: ['Boss', 'Manager'] },
    { name: 'Pricing Matrix', href: '/matrix', icon: Table, roles: ['Boss', 'Manager'] },
    { name: 'GP Analysis', href: '/analysis', icon: Calculator, roles: ['Boss', 'Manager'] },
    { name: 'Comparison', href: '/comparison', icon: GitCompareArrows, roles: ['Boss', 'Manager'] },
    { name: 'Reports', href: '/reports', icon: FileText, roles: ['Boss', 'Manager'] },
    { name: 'Supplier Costs', href: '/costs', icon: Wrench, roles: ['Boss', 'Manager'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['Boss'] },
  ];

  const filteredNavItems = navItems.filter(item => user?.role && (item.roles as UserRole[]).includes(user.role));

  const SidebarContent = () => (
    <div className="w-64 bg-gray-900 text-gray-300 flex flex-col h-full border-r border-white/10 no-print">
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <Link href="/pricelists" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <BatteryCharging className="h-7 w-7 text-red-500" />
            <span className="text-lg font-bold text-white">GBSAPricing</span>
        </Link>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white" aria-label="Close sidebar">
            <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-grow px-4 py-6">
        <ul>
          {filteredNavItems.map(item => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 my-1 rounded-md transition-colors text-sm ${
                  pathname.startsWith(item.href)
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10">
        {/* The logout button now calls the logout function */}
        <button
            onClick={logout}
            className="flex w-full items-center px-4 py-3 my-1 rounded-md text-gray-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
        >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        <SidebarContent />
      </div>
      <AnimatePresence>
        {isOpen && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-30 bg-black/50 md:hidden no-print" onClick={onClose} />
                <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 left-0 h-full z-40 md:hidden no-print">
                    <SidebarContent />
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
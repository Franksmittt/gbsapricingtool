'use client';

import { useAuth } from '@/app/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect runs when the user or loading state changes.
    // If loading is finished and there is still no user, it redirects to the login page.
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // While checking for a user, or if no user is found, show a loading screen.
  // This prevents the dashboard from briefly flashing before the redirect occurs.
  if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center h-screen bg-background text-foreground">
            <p className="text-gray-400">Loading Secure Session...</p>
        </div>
    );
  }

  // If loading is complete and a user exists, render the actual dashboard content.
  return <>{children}</>;
}
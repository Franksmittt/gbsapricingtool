'use client';

import { useAuth } from '@/app/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would redirect to a login page.
    // For now, this is a placeholder.
    if (!isLoading && !user) {
      console.log("No user found, redirecting...");
      // router.push('/'); // Uncomment this in a real app
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center h-screen bg-background text-foreground">
            <p className="text-gray-400">Authenticating...</p>
        </div>
    );
  }

  return <>{children}</>;
}
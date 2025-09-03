'use client';

import { ShieldOff } from 'lucide-react';

export default function DisabledPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-grid-pattern text-center">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 border border-white/10 shadow-soft rounded-lg">
        <div className="inline-block p-3 bg-gray-900 rounded-full">
          <ShieldOff className="h-10 w-10 text-yellow-500" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white">Application Access Disabled</h1>
        <p className="text-gray-400">
          Access to this application is temporarily suspended.
        </p>
        <p className="text-gray-400">
          Please contact the system administrator for more information.
        </p>
      </div>
    </div>
  );
}
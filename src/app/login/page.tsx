'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/AuthContext';
import { BatteryCharging, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      router.push('/'); // Redirect to the main dashboard on successful login
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-grid-pattern">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 border border-white/10 shadow-soft rounded-lg">
        <div className="text-center">
          <div className="inline-block p-3 bg-gray-900 rounded-full">
            <BatteryCharging className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">GBSA Pricing Tool</h1>
          <p className="mt-2 text-sm text-gray-400">Please sign in to continue</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div>
            <Button type="submit" size="lg" className="w-full">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
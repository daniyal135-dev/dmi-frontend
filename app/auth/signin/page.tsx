'use client';

import Link from 'next/link';
import { useState } from 'react';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { AppBackground } from '@/app/components/AppChrome';

export default function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.username, formData.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const field =
    'w-full rounded-xl border border-app-border bg-app-bg-mid px-4 py-3 text-app-text placeholder:text-app-muted/70 transition-colors focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/25';

  return (
    <AppBackground>
      <header className="relative z-10 border-b border-app-border bg-app-surface/85 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent shadow-lg">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="text-2xl font-bold text-app-text">DMI+ Platform</span>
          </Link>
          <Link href="/auth/signup" className="font-medium text-app-muted transition-colors hover:text-app-text">
            Need an account? Sign up
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-3xl border border-app-border bg-app-surface/95 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-app-text">Welcome Back</h1>
            <p className="text-app-muted">Sign in to your DMI+ Platform account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="mb-2 block font-medium text-app-text">
                Username / Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={field}
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block font-medium text-app-text">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={field}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-app-muted">
                <input type="checkbox" className="h-4 w-4 rounded border-app-border text-app-accent focus:ring-app-accent" />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-app-accent hover:text-app-accent-hover">
                Forgot password?
              </Link>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/15 p-4 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl py-3 text-lg font-semibold text-white shadow-lg transition-all ${
                isLoading ? 'cursor-not-allowed bg-app-muted' : 'btn-primary-glow bg-app-accent hover:bg-app-accent-hover'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-app-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-app-surface px-2 text-app-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-xl border border-app-border bg-app-bg-mid px-4 py-3 font-medium text-app-text transition-colors hover:bg-app-surface-hover"
              >
                Google
              </button>
              <button
                type="button"
                className="rounded-xl border border-app-border bg-app-bg-mid px-4 py-3 font-medium text-app-text transition-colors hover:bg-app-surface-hover"
              >
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppBackground>
  );
}

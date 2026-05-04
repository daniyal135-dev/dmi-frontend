'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';
import { AppBackground } from '@/app/components/AppChrome';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      alert('Account created successfully! Please sign in.');
      router.push('/auth/signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
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
          <Link href="/auth/signin" className="font-medium text-app-muted transition-colors hover:text-app-text">
            Already have an account? Sign in
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-md px-4 py-12">
        <div className="rounded-3xl border border-app-border bg-app-surface/95 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-app-text">Create Account</h1>
            <p className="text-app-muted">Join DMI+ Platform and start detecting deepfakes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/15 p-4 text-sm text-red-700 dark:text-red-300">
                ⚠️ {error}
              </div>
            ) : null}

            <div>
              <label htmlFor="username" className="mb-2 block font-medium text-app-text">
                Username <span className="text-app-accent">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={field}
                placeholder="johndoe123"
              />
              <p className="mt-1 text-xs text-app-muted">You will use this to sign in</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="mb-2 block font-medium text-app-text">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={field}
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block font-medium text-app-text">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={field}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block font-medium text-app-text">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={field}
                placeholder="john@example.com"
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
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block font-medium text-app-text">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={field}
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 rounded border-app-border text-app-accent focus:ring-app-accent"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-app-muted">
                I agree to the{' '}
                <Link href="/terms" className="text-app-accent hover:text-app-accent-hover">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-app-accent hover:text-app-accent-hover">
                  Privacy Policy
                </Link>
              </label>
            </div>

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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-app-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-app-surface px-2 text-app-muted">Or sign up with</span>
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

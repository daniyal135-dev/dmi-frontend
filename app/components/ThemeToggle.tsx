'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const THEME_STORAGE_KEY = 'dmi-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') setTheme(attr);
  }, []);

  const toggle = () => {
    const next: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={theme === 'dark'}
      className="fixed bottom-28 left-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-app-border bg-app-surface text-app-text shadow-lg shadow-red-950/10 backdrop-blur-md transition-colors hover:bg-app-surface-hover hover:border-app-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/45 md:bottom-32"
    >
      {!mounted ? (
        <span className="h-5 w-5" aria-hidden />
      ) : theme === 'light' ? (
        <Moon className="h-5 w-5 text-app-accent" strokeWidth={1.85} aria-hidden />
      ) : (
        <Sun className="h-5 w-5 text-app-accent" strokeWidth={1.85} aria-hidden />
      )}
    </button>
  );
}

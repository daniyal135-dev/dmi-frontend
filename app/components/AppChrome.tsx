'use client';

import Image from 'next/image';
import Link from 'next/link';

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="cyber-bg-layer cyber-scan-line relative min-h-screen overflow-hidden text-app-text">
      <div className="theme-vignette pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full bg-app-accent/14 blur-3xl opacity-80" />
        <div className="animation-delay-2000 animate-blob absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-app-accent/10 blur-3xl opacity-70" />
        <div className="animation-delay-4000 animate-blob absolute left-40 top-40 h-80 w-80 rounded-full bg-app-accent/8 blur-3xl opacity-60" />
      </div>
      {children}
    </div>
  );
}

export const SITE_NAV = [
  { href: '/', label: 'Home' },
  { href: '/forum', label: 'Forum' },
  { href: '/archive', label: 'Archive' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/dashboard', label: 'Dashboard' },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-app-border bg-app-surface/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-app-text transition-opacity hover:opacity-90"
        >
          <Image
            src="/banner/logo.png"
            alt="DMI+"
            width={224}
            height={56}
            className="h-12 w-auto max-h-14 shrink-0 object-contain object-left sm:h-14"
          />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold">DMI+</span>
            <span className="text-xs text-app-muted">Media verification</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {SITE_NAV.map(({ href, label }) => (
            <Link key={href} href={href} className="nav-link-soft rounded-lg px-3 py-2 text-sm text-app-muted">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

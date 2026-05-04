'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Shield,
  Image as ImageIcon,
  Video,
  FileText,
  Layers,
  Fingerprint,
  Users,
  BookOpen,
  ArrowRight,
  LayoutDashboard,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import RealTimeAnalytics from './components/RealTimeAnalytics';
import InteractiveDemo from './components/InteractiveDemo';
import Gamification from './components/Gamification';

const HERO_BANNER_SRC = `/banner/${encodeURIComponent('ChatGPT Image May 4, 2026, 12_43_55 AM.png')}`;

export default function Home() {
  const [heroBannerMissing, setHeroBannerMissing] = useState(false);
  const [heroScrollY, setHeroScrollY] = useState(0);
  const [heroMotionSafe, setHeroMotionSafe] = useState(false);

  useEffect(() => {
    setHeroMotionSafe(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setHeroScrollY(window.scrollY));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /** Thora zoom-out (0.96 base) + scroll boost — layer wide rakhi hai taake scale < 1 par bhi left/right fill rahe */
  const bannerTy = heroMotionSafe ? Math.min(heroScrollY * 0.28, 96) : 0;
  const bannerZoomBoost = heroMotionSafe ? Math.min(heroScrollY, 720) * 0.00014 : 0;
  const bannerScale = 0.96 * (1 + bannerZoomBoost);
  const bannerTransform =
    !heroBannerMissing ? `translate3d(0, ${bannerTy}px, 0) scale(${bannerScale})` : undefined;

  const panel =
    'interactive-tile rounded-2xl border border-app-border bg-app-surface shadow-sm backdrop-blur-sm';

  return (
    <div className="cyber-bg-layer cyber-scan-line relative min-h-screen text-app-text">
      <div className="theme-vignette pointer-events-none absolute inset-0" aria-hidden />

      <header className="sticky top-0 z-40 border-b border-app-border bg-app-surface/85 backdrop-blur-xl supports-[backdrop-filter]:bg-app-surface/78">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 pl-3 sm:pl-4 lg:px-8 lg:pl-6">
          <Link
            href="/"
            className="group -ml-1 flex shrink-0 items-center gap-2.5 outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-app-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg sm:-ml-2 sm:gap-3"
          >
            <Image
              src="/banner/logo.png"
              alt=""
              width={224}
              height={56}
              className="h-12 w-auto max-h-14 shrink-0 object-contain object-left transition-transform duration-200 group-hover:scale-[1.02] sm:h-14"
              priority
            />
            <div className="flex flex-col justify-center leading-tight">
              <span className="text-[15px] font-semibold tracking-tight text-app-text">DMI+</span>
              <span className="text-[13px] text-app-muted">Media verification</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {[
              ['/', 'Home'],
              ['/forum', 'Forum'],
              ['/archive', 'Archive'],
              ['/knowledge', 'Knowledge'],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="nav-link-soft rounded-lg px-3 py-2 text-sm text-app-muted outline-none focus-visible:ring-2 focus-visible:ring-app-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/auth/signin"
              className="btn-outline-glow inline-flex items-center gap-2 rounded-lg border border-app-border px-4 py-2 text-sm font-medium text-app-text outline-none hover:bg-app-accent-soft focus-visible:ring-2 focus-visible:ring-app-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
            >
              <LogIn className="h-4 w-4 opacity-70" aria-hidden />
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary-glow inline-flex items-center gap-2 rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-white outline-none hover:bg-app-accent-hover focus-visible:ring-2 focus-visible:ring-app-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Full-width hero — edge to edge; bottom fades into page background via .hero-banner-scrim */}
      <section className="relative mb-14 w-full overflow-hidden">
        <div className="relative min-h-[min(72vh,640px)] w-full sm:min-h-[min(76vh,680px)]">
          {!heroBannerMissing ? (
            <div className="absolute inset-0 overflow-hidden" aria-hidden>
              <div
                className="absolute -top-[5%] left-[-6%] h-[111%] w-[112%] max-w-none will-change-transform"
                style={
                  bannerTransform
                    ? { transform: bannerTransform }
                    : undefined
                }
              >
                <div className="relative h-full w-full opacity-[1.00]">
                  <Image
                    src={HERO_BANNER_SRC}
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                    onError={() => setHeroBannerMissing(true)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-app-accent/18 via-app-bg-mid to-app-bg"
              aria-hidden
            />
          )}
          <div className="hero-banner-scrim" aria-hidden />
          <div className="relative z-10 mx-auto flex min-h-[min(72vh,640px)] max-w-4xl flex-col justify-center px-5 py-14 text-center sm:min-h-[min(76vh,680px)] sm:py-16 lg:px-8">
            <p className="mb-4 flex justify-center font-mono text-[12px] font-bold uppercase tracking-[0.2em] sm:text-[13px]">
              <span className="hero-kicker-backdrop text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.65)]">
                <Layers className="size-[14px] shrink-0 text-white sm:size-[15px]" aria-hidden />
                Multimodal deepfake detection
              </span>
            </p>
            <h1 className="mb-5 text-[2.125rem] font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)] sm:text-5xl sm:leading-[1.1]">
              Deepfake Media Investigation Platform
            </h1>
            <p className="mx-auto mb-10 flex w-full max-w-4xl flex-col items-center gap-0 px-1 text-[17px] font-bold leading-relaxed tracking-tight sm:text-[18px]">
              <span className="hero-body-backdrop hero-body-backdrop--stack-top max-w-full text-center text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)]">
                Analyze images, video, and text with clear verdicts and confidence built for coursework demos
              </span>
              <span className="hero-body-backdrop hero-body-backdrop--stack-bottom w-fit max-w-full text-center text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)]">
                and serious verification workflows alike.
              </span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/upload/image"
                className="btn-primary-glow inline-flex items-center gap-2 rounded-lg bg-app-accent px-6 py-3 text-[15px] font-medium text-white outline-none hover:bg-app-accent-hover focus-visible:ring-2 focus-visible:ring-app-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
              >
                Start analysis
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/dashboard"
                className="btn-outline-glow inline-flex items-center gap-2 rounded-lg border border-white/35 bg-white/15 px-6 py-3 text-[15px] font-medium text-white backdrop-blur-md outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-5 pb-24 lg:px-8">
        <div className="mx-auto mt-4 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Accuracy rate', value: '99.2%' },
            { label: 'Files analyzed', value: '10K+' },
            { label: 'Active users', value: '5K+' },
            { label: 'Support', value: '24/7' },
          ].map((kpi) => (
            <Link key={kpi.label} href="/dashboard" className={`${panel} px-5 py-6 text-center`}>
              <div className="text-2xl font-semibold tabular-nums tracking-tight text-app-text">{kpi.value}</div>
              <div className="mt-1.5 text-sm text-app-muted">{kpi.label}</div>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-20 grid gap-10 lg:grid-cols-3 lg:items-start">
          <div className={`${panel} p-8 lg:col-span-2`}>
            <h2 className="mb-3 text-lg font-semibold text-app-text">Why use DMI+</h2>
            <p className="mb-6 text-sm leading-relaxed text-app-muted">
              One workspace for uploads, JWT-backed APIs, saved history, and readable explanations—without noisy gimmicks.
            </p>
            <ul className="space-y-3 text-sm text-app-muted">
              {[
                'Image screening with heatmap-style attention cues',
                'Video handled frame-by-frame then aggregated',
                'Text modality when your model checkpoint is ready',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-app-accent" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${panel} p-8`}>
            <h3 className="mb-4 text-sm font-semibold text-app-text">Coverage</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-app-accent/80" />
                <div>
                  <div className="text-sm font-medium text-app-text">Images</div>
                  <div className="text-xs text-app-muted">ViT classifier + heatmaps</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-app-accent/50" />
                <div>
                  <div className="text-sm font-medium text-app-text">Video</div>
                  <div className="text-xs text-app-muted">Temporal aggregation</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-app-muted/45" />
                <div>
                  <div className="text-sm font-medium text-app-text">Text</div>
                  <div className="text-xs text-app-muted">Encoder-based detector</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-14 border-t border-app-border pt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight text-app-text sm:text-2xl">How it works</h2>
            <p className="mt-1 max-w-xl text-sm text-app-muted">Four steps from upload to stored results.</p>
          </div>
          <InteractiveDemo />
        </div>

        <div className="mb-16">
          <div className="mb-10">
            <h2 className="text-xl font-semibold tracking-tight text-app-text sm:text-2xl">Modalities</h2>
            <p className="mt-2 text-sm text-app-muted">Pick the medium you need to inspect.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                href: '/upload/image',
                title: 'Images',
                desc: 'Upload stills and review verdict plus heatmaps where available.',
                icon: ImageIcon,
              },
              {
                href: '/upload/video',
                title: 'Video',
                desc: 'Short clips analyzed frame-by-frame, then summarized.',
                icon: Video,
              },
              {
                href: '/upload/text',
                title: 'Text',
                desc: 'Paste passages for AI-vs-human style classification.',
                icon: FileText,
              },
            ].map((item) => (
              <div key={item.href} className={`${panel} flex flex-col p-8`}>
                <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-app-accent-soft text-app-accent">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mb-2 text-[17px] font-semibold text-app-text">{item.title}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-app-muted">{item.desc}</p>
                <Link
                  href={item.href}
                  className="text-link-glow inline-flex items-center gap-2 text-sm font-medium text-app-accent outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-app-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
                >
                  Open
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-app-text sm:text-2xl">Product pillars</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-app-muted">
              Practical tooling—not placeholder buzzwords.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Model-driven', desc: 'Backend inference you can demo end-to-end.', icon: Layers },
              { title: 'Explainability', desc: 'Confidence scores and narrative explanations.', icon: Fingerprint },
              { title: 'Community', desc: 'Forum and archive for discussion.', icon: Users },
              { title: 'Documentation', desc: 'Knowledge base for methods and caveats.', icon: BookOpen },
            ].map((f) => (
              <div key={f.title} className={`${panel} p-6`}>
                <span className="mb-4 inline-flex rounded-xl bg-app-accent-soft p-3 text-app-accent">
                  <f.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mb-2 text-[15px] font-semibold text-app-text">{f.title}</h3>
                <p className="text-sm leading-relaxed text-app-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <Gamification />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { label: 'Images analyzed', value: '10K+' },
            { label: 'Videos processed', value: '5K+' },
            { label: 'Reported accuracy', value: '95%' },
          ].map((s) => (
            <div key={s.label} className={`${panel} px-6 py-9 text-center`}>
              <div className="text-3xl font-semibold tabular-nums text-app-text">{s.value}</div>
              <div className="mt-2 text-sm text-app-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-app-border bg-app-surface/75 py-14 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent text-white shadow-[0_6px_22px_-10px_rgba(239,68,68,0.4)]">
                  <Shield className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-[17px] font-semibold text-app-text">DMI+ Platform</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-app-muted">
                Final-year multimodal deepfake investigation stack—frontend, API, and ML hooks wired for demonstration
                and iteration.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-app-muted">Product</h4>
              <ul className="space-y-2 text-sm text-app-muted">
                <li>
                  <Link href="/upload/image" className="footer-link-glow rounded-sm outline-none focus-visible:text-app-text focus-visible:ring-2 focus-visible:ring-app-accent/35">
                    Image analysis
                  </Link>
                </li>
                <li>
                  <Link href="/upload/video" className="footer-link-glow rounded-sm outline-none focus-visible:text-app-text focus-visible:ring-2 focus-visible:ring-app-accent/35">
                    Video analysis
                  </Link>
                </li>
                <li>
                  <Link href="/upload/text" className="footer-link-glow rounded-sm outline-none focus-visible:text-app-text focus-visible:ring-2 focus-visible:ring-app-accent/35">
                    Text analysis
                  </Link>
                </li>
                <li>
                  <Link href="/archive" className="footer-link-glow rounded-sm outline-none focus-visible:text-app-text focus-visible:ring-2 focus-visible:ring-app-accent/35">
                    Archive
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-app-muted">Resources</h4>
              <ul className="space-y-2 text-sm text-app-muted">
                <li>
                  <Link
                    href="/knowledge"
                    className="footer-link-glow rounded-sm outline-none focus-visible:text-app-text focus-visible:ring-2 focus-visible:ring-app-accent/35"
                  >
                    Knowledge base
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="footer-link-glow rounded-sm outline-none focus-visible:text-app-text focus-visible:ring-2 focus-visible:ring-app-accent/35">
                    Forum
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-app-border pt-8 text-sm text-app-muted md:flex-row">
            <span>© {new Date().getFullYear()} DMI+ Platform</span>
            <div className="flex gap-8">
              <span className="cursor-default hover:text-app-text">Privacy</span>
              <span className="cursor-default hover:text-app-text">Terms</span>
              <span className="cursor-default hover:text-app-text">Contact</span>
            </div>
          </div>
        </div>
      </footer>

      <AIAssistant />
      <RealTimeAnalytics />
    </div>
  );
}

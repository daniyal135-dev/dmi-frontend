'use client';

import { useState, useEffect } from 'react';
import { Upload, ScanSearch, ShieldAlert, FileBarChart } from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  Icon: typeof Upload;
}

const demoSteps: DemoStep[] = [
  {
    id: 'upload',
    title: 'Upload',
    description: 'Drop or paste media — images, short video, or text — into one intake.',
    Icon: Upload,
  },
  {
    id: 'analyze',
    title: 'Inference',
    description: 'Models score authenticity with calibrated confidence and signals.',
    Icon: ScanSearch,
  },
  {
    id: 'detect',
    title: 'Verdict',
    description: 'Readable outcome: genuine, synthetic, or uncertain when evidence is thin.',
    Icon: ShieldAlert,
  },
  {
    id: 'report',
    title: 'History',
    description: 'Runs persist on your dashboard with timestamps and explanations.',
    Icon: FileBarChart,
  },
];

const DEMO_MS = 10000;
const TICK_MS = 80;

export default function InteractiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const id = window.setInterval(() => {
      setProgress((p) => {
        const delta = (100 * TICK_MS) / DEMO_MS;
        const next = p + delta;
        if (next >= 100) {
          queueMicrotask(() => setIsPlaying(false));
          return 100;
        }
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [isPlaying]);

  const currentStep = Math.min(demoSteps.length - 1, Math.floor(progress / 25));

  const startDemo = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const ActiveIcon = demoSteps[currentStep]?.Icon ?? ScanSearch;

  return (
    <div
      className={`demo-shell-surface relative mx-auto max-w-6xl overflow-hidden rounded-2xl border px-5 py-4 shadow-sm backdrop-blur-md transition-[border-color,box-shadow] duration-500 sm:px-10 sm:py-5 ${
        isPlaying ? 'border-app-accent/35 demo-shell-playing' : 'border-app-border'
      }`}
    >
      <div
        className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-app-accent/16 blur-[80px] animate-demo-blob"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-app-accent/14 blur-[80px] animate-demo-blob-delayed"
        aria-hidden
      />

      <div className="relative">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight text-app-text sm:text-lg">Interactive preview</h3>
            <p className="mt-0.5 text-[11px] text-app-muted sm:text-xs">
              ~10s pipeline — wider layout, compact height.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-app-border bg-app-surface/90 px-3 py-1.5 text-[11px] text-app-muted shadow-sm backdrop-blur-sm sm:text-xs">
            <span
              className={`relative flex h-1.5 w-1.5 shrink-0 rounded-full ${isPlaying ? 'bg-app-accent' : 'bg-app-muted/50'}`}
              aria-hidden
            >
              {isPlaying ? (
                <span className="absolute inset-0 animate-ping rounded-full bg-app-accent opacity-60" aria-hidden />
              ) : null}
            </span>
            <span className="font-medium text-app-text">{isPlaying ? 'Analyzing…' : 'Idle'}</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
        </header>

        <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-center lg:gap-8 xl:gap-10">
          {/* Compact wireframe — short fixed size */}
          <div className="relative mx-auto flex h-[148px] w-[148px] shrink-0 sm:h-[164px] sm:w-[164px] lg:mx-0">
            <div className="absolute flex h-full w-full items-center justify-center">
              <div className="absolute h-[94%] w-[94%] rounded-full border border-dashed border-app-accent/28 animate-demo-orbit" />
              <div className="absolute h-[76%] w-[76%] rounded-full border border-dashed border-app-accent/18 animate-demo-orbit-reverse" />
              <div className="absolute h-[58%] w-[58%] rounded-full border border-app-accent/12 shadow-[0_0_28px_-14px_rgba(239,68,68,0.3)]" />
            </div>

            <svg
              viewBox="0 0 260 260"
              className="relative z-[2] h-[88%] w-[88%]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <linearGradient id="interactiveDemoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#fca5a5" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28" />
                </linearGradient>
              </defs>
              <ellipse
                cx="130"
                cy="132"
                rx="82"
                ry="102"
                stroke="url(#interactiveDemoStroke)"
                strokeWidth="1.1"
                className="demo-wire-dash"
              />
              <ellipse
                cx="130"
                cy="132"
                rx="54"
                ry="68"
                stroke="url(#interactiveDemoStroke)"
                strokeWidth="0.65"
                opacity={0.65}
                className="demo-wire-dash"
                style={{ animationDelay: '-1.2s' }}
              />
              <path
                d="M130 52 V228 M54 132 H206"
                className="text-app-border"
                stroke="currentColor"
                strokeOpacity={0.85}
                strokeWidth="0.6"
                strokeDasharray="4 8"
              />
              <circle cx="130" cy="96" r="4" fill="#ef4444" fillOpacity={isPlaying ? 0.85 : 0.35} className={isPlaying ? 'animate-pulse' : ''} />
              <circle cx="96" cy="142" r="3" className="fill-app-text opacity-[0.22]" />
              <circle cx="164" cy="148" r="3" className="fill-app-text opacity-[0.22]" />
            </svg>

            <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
              <div
                className={`flex flex-col items-center justify-center rounded-lg border px-3 py-2.5 backdrop-blur-md transition-[transform,border-color,box-shadow,background-color] duration-300 ${
                  isPlaying
                    ? 'scale-[1.02] border-app-accent/35 bg-app-surface shadow-[0_0_26px_-10px_rgba(239,68,68,0.35)]'
                    : 'scale-100 border-app-border bg-app-surface/95 shadow-sm'
                }`}
              >
                <ActiveIcon
                  key={currentStep}
                  className={`demo-hub-icon h-8 w-8 ${isPlaying ? 'text-app-accent' : 'text-app-muted'}`}
                  strokeWidth={1.65}
                  aria-hidden
                />
                {/* Step labels stay on cards only — hub shows dots so text doesn’t flash over the animation */}
                <div className="mt-2 flex gap-1.5" aria-hidden>
                  {demoSteps.map((step, i) => (
                    <span
                      key={step.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep ? 'w-4 bg-app-accent shadow-[0_0_10px_rgba(239,68,68,0.45)]' : 'w-1.5 bg-app-muted/45'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps — use full remaining width; single row on xl */}
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-2.5 lg:gap-3 xl:grid-cols-4">
            {demoSteps.map((step, index) => {
              const Icon = step.Icon;
              const active = isPlaying && index === currentStep;
              const filled = progress >= (index + 1) * 25 || progress >= 100;

              return (
                <div
                  key={step.id}
                  className={`relative rounded-xl border p-3 transition-all duration-300 ${
                    active
                      ? 'demo-step-hot scale-[1.01] border-app-accent/35 bg-app-accent-soft shadow-[0_0_22px_-14px_rgba(239,68,68,0.22)]'
                      : filled
                        ? 'border-app-border bg-app-surface'
                        : 'border-app-border bg-app-surface/90 hover:border-app-accent/25'
                  }`}
                >
                  {active ? (
                    <span
                      className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-app-accent shadow-[0_0_12px_3px_rgba(239,68,68,0.55)]"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className={`mb-1.5 inline-flex rounded-lg border p-1.5 transition-colors ${
                      active ? 'border-app-accent/35 bg-app-surface text-app-accent' : 'border-app-border bg-app-accent-soft text-app-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.65} aria-hidden />
                  </div>
                  <h4 className={`text-xs font-semibold tracking-tight sm:text-[13px] ${active ? 'text-app-text' : 'text-app-text/90'}`}>{step.title}</h4>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-app-muted sm:text-[11px]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-app-muted sm:text-xs">
            <span className="font-medium text-app-text/90">Pipeline progress</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-app-bg-mid ring-1 ring-app-border">
            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-red-800 via-red-500 to-red-300 transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            >
              {isPlaying ? (
                <div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent demo-progress-shimmer"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-app-border bg-app-surface/90 px-4 py-2.5 shadow-sm sm:py-3">
          <p key={currentStep} className="demo-caption-swap text-center text-[11px] leading-relaxed text-app-text sm:text-xs">
            {demoSteps[currentStep]?.description}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-app-border pt-4">
          <button
            type="button"
            onClick={startDemo}
            disabled={isPlaying}
            className={`btn-primary-glow min-w-[124px] rounded-xl px-6 py-2 text-xs font-semibold sm:text-sm ${
              isPlaying ? 'cursor-not-allowed bg-app-surface-hover text-app-muted' : 'bg-app-accent text-white shadow-[0_4px_22px_-6px_rgba(239,68,68,0.48)] hover:bg-app-accent-hover'
            }`}
          >
            {isPlaying ? 'Running…' : 'Run demo'}
          </button>
          <button
            type="button"
            onClick={stopDemo}
            className="btn-outline-glow min-w-[104px] rounded-xl border border-app-border bg-app-surface px-4 py-2 text-xs font-medium text-app-text hover:bg-app-accent-soft sm:text-sm"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

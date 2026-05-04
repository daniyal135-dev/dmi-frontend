'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';

export default function Demo() {
  const [activeDemo, setActiveDemo] = useState('image');

  const demos = [
    {
      id: 'image',
      title: 'Image Analysis Demo',
      icon: '🖼️',
      description: 'See how our AI detects manipulated images',
    },
    {
      id: 'video',
      title: 'Video Detection Demo',
      icon: '🎥',
      description: 'Watch real-time deepfake video detection',
    },
    {
      id: 'text',
      title: 'Text Analysis Demo',
      icon: '📝',
      description: 'Analyze AI-generated text vs human writing',
    },
  ];

  const innerPanel = 'rounded-xl border border-app-border bg-app-bg-mid/90 p-6';

  return (
    <AppBackground>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-app-text md:text-6xl">
            <span className="bg-gradient-to-r from-app-accent via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Interactive Demo
            </span>
          </h1>
          <p className="mb-8 text-xl text-app-muted">Experience our AI detection technology in action</p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {demos.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => setActiveDemo(demo.id)}
              className={`rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:scale-[1.02] ${
                activeDemo === demo.id
                  ? 'border-app-accent bg-app-accent-soft shadow-md'
                  : 'border-app-border bg-app-surface/90 hover:border-app-accent/40'
              }`}
            >
              <div className="mb-4 text-5xl">{demo.icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-app-text">{demo.title}</h3>
              <p className="text-sm text-app-muted">{demo.description}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-app-border bg-app-surface/90 p-8 shadow-sm backdrop-blur-md">
          {activeDemo === 'image' && (
            <div className="space-y-6">
              <h2 className="mb-4 text-2xl font-bold text-app-text">Image Analysis Demo</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className={`${innerPanel} flex h-64 items-center justify-center`}>
                    <div className="text-center">
                      <div className="mb-4 text-6xl">🖼️</div>
                      <p className="text-app-muted">Sample Image Preview</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-3 font-semibold text-white hover:opacity-95"
                  >
                    Upload Sample Image
                  </button>
                </div>
                <div className="space-y-4">
                  <div className={innerPanel}>
                    <h3 className="mb-4 font-semibold text-app-text">Analysis Results</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-app-muted">Verdict:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Real</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-muted">Confidence:</span>
                        <span className="font-semibold text-app-text">94.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-muted">Trust Index:</span>
                        <span className="font-semibold text-sky-600 dark:text-sky-400">89/100</span>
                      </div>
                    </div>
                  </div>
                  <div className={innerPanel}>
                    <h3 className="mb-2 font-semibold text-app-text">Heatmap</h3>
                    <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/15 to-sky-500/15">
                      <p className="text-sm text-app-muted">Heatmap Visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'video' && (
            <div className="space-y-6">
              <h2 className="mb-4 text-2xl font-bold text-app-text">Video Detection Demo</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className={`${innerPanel} flex h-64 items-center justify-center`}>
                    <div className="text-center">
                      <div className="mb-4 text-6xl">🎥</div>
                      <p className="text-app-muted">Sample Video Preview</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-3 font-semibold text-white hover:opacity-95"
                  >
                    Upload Sample Video
                  </button>
                </div>
                <div className="space-y-4">
                  <div className={innerPanel}>
                    <h3 className="mb-4 font-semibold text-app-text">Analysis Results</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-app-muted">Verdict:</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">Fake</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-muted">Confidence:</span>
                        <span className="font-semibold text-app-text">87.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-muted">Frames Analyzed:</span>
                        <span className="font-semibold text-app-text">247</span>
                      </div>
                    </div>
                  </div>
                  <div className={innerPanel}>
                    <h3 className="mb-2 font-semibold text-app-text">Temporal Analysis</h3>
                    <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/15 to-amber-500/15">
                      <p className="text-sm text-app-muted">Frame Consistency Graph</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'text' && (
            <div className="space-y-6">
              <h2 className="mb-4 text-2xl font-bold text-app-text">Text Analysis Demo</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <textarea
                    className="h-64 w-full rounded-xl border border-app-border bg-app-bg-mid p-6 text-app-text placeholder:text-app-muted focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/25"
                    placeholder="Paste or type text to analyze..."
                  />
                  <button
                    type="button"
                    className="w-full rounded-xl bg-gradient-to-r from-app-accent to-red-900 px-6 py-3 font-semibold text-white hover:opacity-95"
                  >
                    Analyze Text
                  </button>
                </div>
                <div className="space-y-4">
                  <div className={innerPanel}>
                    <h3 className="mb-4 font-semibold text-app-text">Analysis Results</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-app-muted">Source:</span>
                        <span className="font-semibold text-amber-700 dark:text-amber-400">AI-Generated</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-muted">Confidence:</span>
                        <span className="font-semibold text-app-text">91.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-app-muted">Language:</span>
                        <span className="font-semibold text-app-text">English</span>
                      </div>
                    </div>
                  </div>
                  <div className={innerPanel}>
                    <h3 className="mb-2 font-semibold text-app-text">Explanation</h3>
                    <p className="text-sm text-app-muted">
                      The text exhibits patterns typical of AI-generated content, including repetitive phrasing and lack
                      of natural linguistic variation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-2xl border border-app-accent/30 bg-app-accent-soft/30 p-8 backdrop-blur-md">
            <h2 className="mb-4 text-3xl font-bold text-app-text">Ready to Try It Yourself?</h2>
            <p className="mb-6 text-app-muted">Upload your own files for full analysis with detailed reports</p>
            <Link
              href="/upload/image"
              className="inline-block rounded-xl bg-app-accent px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-app-accent-hover"
            >
              Start Analyzing Now →
            </Link>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}

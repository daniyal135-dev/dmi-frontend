'use client';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { getAnalysisResult } from '@/lib/api';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';

interface ResultShape {
  id?: string;
  verdict?: string;
  confidence?: number;
  explanation?: string;
  metadata?: Record<string, unknown>;
  heatmap_path?: string;
  file_type?: string;
  created_at?: string;
}

interface ApiAnalysisResponse {
  result?: ResultShape;
}

function normalizePayload(raw: unknown): ResultShape | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const inner = o.result;
  if (inner && typeof inner === 'object') return inner as ResultShape;
  return o as ResultShape;
}

export default function Results({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [result, setResult] = useState<ResultShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = (await getAnalysisResult(resolvedParams.id)) as ApiAnalysisResponse | ResultShape;
        const normalized = 'result' in data && data.result ? data.result : normalizePayload(data);
        setResult(normalized);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load analysis results';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <AppBackground>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-app-border border-t-app-accent" />
            <h2 className="mb-2 text-2xl font-bold text-app-text">Loading Results...</h2>
            <p className="text-app-muted">This may take a few moments</p>
          </div>
        </div>
      </AppBackground>
    );
  }

  if (error || !result) {
    return (
      <AppBackground>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 text-4xl text-app-accent">⚠️</div>
            <h2 className="mb-2 text-2xl font-bold text-app-text">Error Loading Results</h2>
            <p className="text-app-muted">{error || 'Analysis result not found'}</p>
            <Link href="/upload/image" className="mt-4 inline-block text-app-accent hover:text-app-accent-hover">
              Try uploading again
            </Link>
          </div>
        </div>
      </AppBackground>
    );
  }

  const resultData = result;
  const verdict = resultData.verdict?.toUpperCase() || 'UNKNOWN';
  const rawConfidence = resultData.confidence ?? 0;
  const confidence = rawConfidence > 1 ? Math.round(rawConfidence) : Math.round(rawConfidence * 100);
  const explanation = resultData.explanation || 'No explanation available.';
  const metadata = resultData.metadata || {};
  const heatmapPath = resultData.heatmap_path;

  const card = 'rounded-3xl border border-app-border bg-app-surface/90 p-8 shadow-sm backdrop-blur-md';

  return (
    <AppBackground>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-app-text md:text-6xl">
            <span className="bg-gradient-to-r from-app-accent via-red-500 to-orange-400 bg-clip-text text-transparent">
              Analysis Results
            </span>
          </h1>
          <p className="text-xl text-app-muted">Analysis ID: {resultData.id}</p>
        </div>

        <div className={`${card} mb-8`}>
          <div className="text-center">
            <div
              className={`mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full ${
                verdict === 'FAKE'
                  ? 'bg-gradient-to-br from-red-500 to-red-700'
                  : verdict === 'REAL'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                    : 'bg-gradient-to-br from-amber-400 to-amber-600'
              }`}
            >
              <span className="text-4xl">{verdict === 'FAKE' ? '⚠️' : verdict === 'REAL' ? '✅' : '❓'}</span>
            </div>
            <h2
              className={`mb-4 text-5xl font-bold ${
                verdict === 'FAKE'
                  ? 'text-red-600 dark:text-red-400'
                  : verdict === 'REAL'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {verdict}
            </h2>
            <div className="mb-6">
              <div className="mb-2 text-app-muted">Confidence Level</div>
              <div className="mb-2 text-3xl font-bold text-app-text">{confidence}%</div>
              <div className="h-4 w-full rounded-full bg-app-bg-mid">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    verdict === 'FAKE'
                      ? 'bg-gradient-to-r from-red-500 to-red-700'
                      : verdict === 'REAL'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-700'
                        : 'bg-gradient-to-r from-amber-400 to-amber-600'
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${card} mb-8`}>
          <h3 className="mb-6 text-2xl font-bold text-app-text">📊 Analysis Explanation</h3>
          <p className="text-lg leading-relaxed text-app-muted">{explanation}</p>
        </div>

        {heatmapPath ? (
          <div className={`${card} mb-8`}>
            <h3 className="mb-6 text-2xl font-bold text-app-text">🌡️ Manipulation Heatmap</h3>
            <div className="rounded-xl border border-app-border bg-app-bg-mid/80 p-8 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic backend media URL */}
              <img
                src={`http://127.0.0.1:8000/media/${heatmapPath}`}
                alt="Heatmap"
                className="mx-auto h-auto max-w-full rounded-xl"
                onError={(e) => {
                  console.error('Heatmap image failed to load:', heatmapPath);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="mt-4 text-app-muted">Red areas indicate potential manipulation zones</p>
            </div>
          </div>
        ) : null}

        {metadata && Object.keys(metadata).length > 0 ? (
          <div className={`${card} mb-8`}>
            <h3 className="mb-6 text-2xl font-bold text-app-text">📋 File Metadata</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-app-border bg-app-bg-mid/80 p-4">
                  <div className="mb-1 text-sm text-app-muted">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="font-semibold text-app-text">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-6 flex justify-center">
          <Link
            href="/upload/image"
            className="btn-primary-glow inline-flex items-center gap-2 rounded-xl bg-app-accent px-8 py-4 font-semibold text-white hover:bg-app-accent-hover"
          >
            🖼️ Analyze another image
          </Link>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-8 py-4 font-semibold text-white transition hover:opacity-95"
          >
            📄 Download Report
          </button>
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-4 font-semibold text-white transition hover:opacity-95"
          >
            🔗 Share Results
          </button>
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-4 font-semibold text-white transition hover:opacity-95"
          >
            📚 Submit to Archive
          </button>
        </div>

        <div className={card}>
          <h3 className="mb-6 text-2xl font-bold text-app-text">🔧 Analysis Details</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-app-muted">File Type</div>
              <div className="font-semibold text-app-text">{resultData.file_type?.toUpperCase() || 'IMAGE'}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-app-muted">Confidence</div>
              <div className="font-semibold text-app-text">{confidence}%</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-app-muted">Analysis Date</div>
              <div className="font-semibold text-app-text">
                {resultData.created_at
                  ? new Date(resultData.created_at).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}

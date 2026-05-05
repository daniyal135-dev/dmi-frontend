'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import {
  getUserProfile,
  getAllAnalysisResults,
  type AnalysisResultRow,
} from '@/lib/api';
import { AppBackground } from '@/app/components/AppChrome';

function localYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function last7DaysActivity(analyses: AnalysisResultRow[]) {
  const dayKeys: { label: string; key: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    dayKeys.push({
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      key: localYmd(d),
    });
  }
  const map = new Map<string, number>();
  for (const { key } of dayKeys) map.set(key, 0);
  for (const a of analyses) {
    const key = localYmd(new Date(a.created_at));
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
  }
  return dayKeys.map(({ label, key }) => ({ day: label, analyses: map.get(key) ?? 0 }));
}

function analysesThisMonth(analyses: AnalysisResultRow[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return analyses.filter((a) => {
    const d = new Date(a.created_at);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}

function avgConfidencePct(analyses: AnalysisResultRow[]): number | null {
  if (analyses.length === 0) return null;
  const vals = analyses.map((a) => a.confidence);
  const max = Math.max(...vals);
  const scale = max <= 1.001 ? 100 : 1;
  const sum = vals.reduce((s, c) => s + c * scale, 0);
  return sum / vals.length;
}

function formatRelativeLogin(iso: string | null | undefined): string {
  if (iso == null || iso === '') return 'Just now';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 'Just now';
  const sec = Math.round((Date.now() - t) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
  return new Date(iso).toLocaleDateString();
}

function verdictLabel(verdict: string): string {
  const v = verdict.toLowerCase();
  if (v === 'real') return 'AUTHENTIC';
  if (v === 'fake') return 'FAKE';
  if (v === 'uncertain') return 'UNCERTAIN';
  return verdict.toUpperCase();
}

function thumbnailForType(fileType: string): string {
  if (fileType === 'video') return '🎥';
  if (fileType === 'text') return '📝';
  return '🖼️';
}

function basenamePath(p: string): string {
  const s = p.replace(/\\/g, '/');
  const i = s.lastIndexOf('/');
  return i >= 0 ? s.slice(i + 1) || s : s || 'Analysis';
}

function confidenceDisplay(c: number): number {
  return c <= 1.001 ? Math.round(c * 1000) / 10 : Math.round(c * 10) / 10;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    last_login?: string | null;
  } | null>(null);
  const [analysisRows, setAnalysisRows] = useState<AnalysisResultRow[]>([]);

  useEffect(() => {
    const load = async () => {
      setStatsLoading(true);
      try {
        const [profile, rows] = await Promise.all([
          getUserProfile(),
          getAllAnalysisResults(),
        ]);
        setUserProfile(profile);
        const sorted = [...rows].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAnalysisRows(sorted);
      } catch {
        console.error('Failed to load dashboard data');
        try {
          const profile = await getUserProfile();
          setUserProfile(profile);
        } catch {
          setUserProfile({ username: 'User', email: '' });
        }
        setAnalysisRows([]);
      } finally {
        setStatsLoading(false);
      }
    };
    load();
  }, []);

  const totalAnalyses = analysisRows.length;
  const thisMonth = useMemo(() => analysesThisMonth(analysisRows), [analysisRows]);
  const accuracyPct = useMemo(() => avgConfidencePct(analysisRows), [analysisRows]);
  const savedReports = 0;

  const quickStats = useMemo(
    () => [
      {
        label: 'Total Analyses',
        value: statsLoading ? '…' : String(totalAnalyses),
        barPct: totalAnalyses === 0 ? 0 : Math.min(100, 8 + totalAnalyses * 4),
      },
      {
        label: 'This Month',
        value: statsLoading ? '…' : String(thisMonth),
        barPct: thisMonth === 0 ? 0 : Math.min(100, 10 + thisMonth * 8),
      },
      {
        label: 'Avg. confidence',
        value:
          statsLoading ? '…' : accuracyPct == null ? '—' : `${accuracyPct.toFixed(1)}%`,
        barPct:
          accuracyPct == null ? 0 : Math.min(100, Math.max(0, accuracyPct)),
      },
      {
        label: 'Saved Reports',
        value: statsLoading ? '…' : String(savedReports),
        barPct: 0,
      },
    ],
    [statsLoading, totalAnalyses, thisMonth, accuracyPct, savedReports]
  );

  const activityData = useMemo(() => last7DaysActivity(analysisRows), [analysisRows]);
  const activityMax = useMemo(
    () => Math.max(1, ...activityData.map((d) => d.analyses)),
    [activityData]
  );

  const recentAnalyses = useMemo(() => {
    return analysisRows.slice(0, 20).map((a) => ({
      id: String(a.id),
      type: a.file_type,
      filename: basenamePath(a.file_path),
      result: verdictLabel(a.verdict),
      confidence: confidenceDisplay(a.confidence),
      date: new Date(a.created_at).toLocaleDateString(),
      status: 'completed' as const,
      thumbnail: thumbnailForType(a.file_type),
    }));
  }, [analysisRows]);

  const handleQuickUpload = (type: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = `/upload/${type}`;
    }, 1000);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'FAKE':
        return 'text-red-600 bg-red-500/15 dark:text-red-400 dark:bg-red-500/20';
      case 'AUTHENTIC':
        return 'text-emerald-700 bg-emerald-500/15 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'UNCERTAIN':
        return 'text-amber-700 bg-amber-500/15 dark:text-amber-400 dark:bg-amber-500/20';
      case 'PROCESSING':
        return 'text-sky-700 bg-sky-500/15 dark:text-sky-400 dark:bg-sky-500/20';
      default:
        return 'text-app-muted bg-app-bg-mid';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const panel = 'rounded-3xl border border-app-border bg-app-surface/90 p-8 shadow-sm backdrop-blur-md';

  return (
    <AppBackground>
      <header className="relative z-10 border-b border-app-border bg-app-surface/85 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent shadow-lg">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <h1 className="text-2xl font-bold text-app-text">DMI+ Platform</h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-app-text">Welcome back,</p>
              <p className="text-sm text-app-muted">{userProfile?.username || 'User'}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-app-accent font-semibold text-white">
              {userProfile?.username ? userProfile.username.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/auth/signin';
              }}
              className="text-sm text-app-muted transition-colors hover:text-app-text"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <nav className="relative z-10 border-b border-app-border bg-app-surface/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'analyses', label: 'My Analyses', icon: '🔍' },
              { id: 'reports', label: 'Reports', icon: '📋' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-2 py-4 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-app-accent text-app-accent'
                    : 'border-transparent text-app-muted hover:border-app-border hover:text-app-text'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className={panel}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-app-text">Dashboard Overview</h2>
                  <p className="text-app-muted">Monitor your deepfake detection activities and insights</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-app-muted">Last login</p>
                  <p className="font-medium text-app-text">
                    {formatRelativeLogin(userProfile?.last_login)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-app-border bg-app-surface/90 p-6 shadow-sm backdrop-blur-md transition-all hover:border-app-accent/25"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-app-muted">{stat.label}</div>
                  </div>
                  <div className="mb-2 text-3xl font-bold text-app-text">{stat.value}</div>
                  <div className="h-2 w-full rounded-full bg-app-bg-mid">
                    <div
                      className="h-2 rounded-full bg-app-accent transition-all duration-1000"
                      style={{ width: `${stat.barPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={panel}>
              <h3 className="mb-6 text-2xl font-bold text-app-text">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  { type: 'image', label: 'Analyze Image', icon: '🖼️', color: 'from-sky-600 to-blue-700' },
                  { type: 'video', label: 'Analyze Video', icon: '🎥', color: 'from-emerald-600 to-teal-700' },
                  { type: 'text', label: 'Analyze Text', icon: '📝', color: 'from-app-accent to-red-800' },
                ].map((action) => (
                  <button
                    key={action.type}
                    type="button"
                    onClick={() => handleQuickUpload(action.type)}
                    disabled={isLoading}
                    className={`rounded-2xl bg-gradient-to-r p-6 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 ${action.color} ${
                      isLoading ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="mb-4 text-4xl">{action.icon}</div>
                    <div className="text-lg">{action.label}</div>
                    <div className="mt-2 text-sm opacity-90">Click to start analysis</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={panel}>
              <h3 className="mb-6 text-2xl font-bold text-app-text">Last 7 days</h3>
              <div className="flex h-48 items-end justify-between gap-2">
                {activityData.map((data, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center">
                    <div
                      className="w-full min-h-[4px] rounded-t-lg bg-gradient-to-t from-app-accent to-red-400 transition-all hover:opacity-90"
                      style={{
                        height: `${(data.analyses / activityMax) * 100}%`,
                      }}
                      title={`${data.analyses} analyses`}
                    />
                    <div className="mt-2 text-sm text-app-muted">{data.day}</div>
                    <div className="mt-1 text-xs text-app-text">{data.analyses}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analyses' && (
          <div className="space-y-6">
            <div className={panel}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-app-text">Recent Analyses</h3>
                <button
                  type="button"
                  className="rounded-lg bg-app-accent px-4 py-2 text-white transition-colors hover:bg-app-accent-hover"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {statsLoading && (
                  <p className="text-app-muted">Loading your analyses…</p>
                )}
                {!statsLoading && recentAnalyses.length === 0 && (
                  <div className="rounded-xl border border-dashed border-app-border bg-app-bg-mid/40 py-12 text-center">
                    <p className="text-app-muted">No analyses yet. Use Quick Actions on Overview to run your first check.</p>
                  </div>
                )}
                {!statsLoading &&
                  recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="cursor-pointer rounded-xl border border-app-border bg-app-bg-mid/80 p-6 transition-all hover:border-app-accent/25 hover:bg-app-surface-hover"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{analysis.thumbnail}</div>
                        <div>
                          <h4 className="font-semibold text-app-text">{analysis.filename}</h4>
                          <p className="text-sm text-app-muted">
                            {analysis.type.toUpperCase()} • {analysis.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className={`rounded-full px-3 py-1 text-sm font-medium ${getResultColor(analysis.result)}`}>
                          {analysis.result}
                        </div>
                        <div className="font-semibold text-app-text">{analysis.confidence}%</div>
                        <div className="text-2xl">{getStatusIcon(analysis.status)}</div>
                        <Link href={`/results/${analysis.id}`} className="text-app-accent hover:text-app-accent-hover">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className={panel}>
              <h3 className="mb-6 text-2xl font-bold text-app-text">Saved Reports</h3>
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl">📋</div>
                <h4 className="mb-2 text-xl font-semibold text-app-text">No Reports Yet</h4>
                <p className="mb-6 text-app-muted">Save analysis results to create detailed reports</p>
                <button
                  type="button"
                  className="rounded-lg bg-app-accent px-6 py-3 text-white transition-colors hover:bg-app-accent-hover"
                >
                  Create First Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className={panel}>
              <h3 className="mb-6 text-2xl font-bold text-app-text">Account Settings</h3>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block font-medium text-app-text">Email Notifications</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-app-border text-app-accent focus:ring-app-accent"
                      defaultChecked
                    />
                    <span className="text-app-muted">Receive email updates for analysis results</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-app-text">Analysis Privacy</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-app-border text-app-accent focus:ring-app-accent"
                    />
                    <span className="text-app-muted">Share anonymous data to improve detection accuracy</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-app-text">API Access</label>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      className="rounded-lg border border-app-border bg-app-bg-mid px-4 py-2 text-app-text transition-colors hover:bg-app-surface-hover"
                    >
                      Generate API Key
                    </button>
                    <span className="text-sm text-app-muted">For programmatic access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppBackground>
  );
}

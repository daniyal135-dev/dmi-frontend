'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/api';
import { AppBackground } from '@/app/components/AppChrome';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{ username: string; email: string } | null>(null);
  const [userStats] = useState({
    totalAnalyses: 47,
    thisMonth: 12,
    accuracyRate: 98.7,
    savedReports: 23,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch {
        console.error('Failed to fetch user profile');
        setUserProfile({ username: 'User', email: '' });
      }
    };
    fetchUserProfile();
  }, []);

  const recentAnalyses = [
    {
      id: '1',
      type: 'image',
      filename: 'suspicious_photo.jpg',
      result: 'FAKE',
      confidence: 94.2,
      date: '2024-01-18',
      status: 'completed',
      thumbnail: '🖼️',
    },
    {
      id: '2',
      type: 'video',
      filename: 'news_clip.mp4',
      result: 'AUTHENTIC',
      confidence: 87.5,
      date: '2024-01-17',
      status: 'completed',
      thumbnail: '🎥',
    },
    {
      id: '3',
      type: 'text',
      filename: 'article_text.txt',
      result: 'AI-GENERATED',
      confidence: 91.8,
      date: '2024-01-16',
      status: 'completed',
      thumbnail: '📝',
    },
    {
      id: '4',
      type: 'image',
      filename: 'profile_pic.png',
      result: 'PROCESSING',
      confidence: null as number | null,
      date: '2024-01-18',
      status: 'processing',
      thumbnail: '⏳',
    },
  ];

  const quickStats = [
    { label: 'Total Analyses', value: userStats.totalAnalyses, change: '+12%', trend: 'up' as const },
    { label: 'This Month', value: userStats.thisMonth, change: '+3', trend: 'up' as const },
    { label: 'Accuracy Rate', value: `${userStats.accuracyRate}%`, change: '+2.1%', trend: 'up' as const },
    { label: 'Saved Reports', value: userStats.savedReports, change: '+5', trend: 'up' as const },
  ];

  const activityData = [
    { day: 'Mon', analyses: 8 },
    { day: 'Tue', analyses: 12 },
    { day: 'Wed', analyses: 6 },
    { day: 'Thu', analyses: 15 },
    { day: 'Fri', analyses: 9 },
    { day: 'Sat', analyses: 4 },
    { day: 'Sun', analyses: 7 },
  ];

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
      case 'AI-GENERATED':
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
                  <p className="font-medium text-app-text">2 hours ago</p>
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
                    <div
                      className={`rounded-full px-2 py-1 text-xs ${
                        stat.trend === 'up'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-500/15 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>
                  <div className="mb-2 text-3xl font-bold text-app-text">{stat.value}</div>
                  <div className="h-2 w-full rounded-full bg-app-bg-mid">
                    <div
                      className="h-2 rounded-full bg-app-accent transition-all duration-1000"
                      style={{ width: `${[72, 48, 94, 56][index]}%` }}
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
              <h3 className="mb-6 text-2xl font-bold text-app-text">Weekly Activity</h3>
              <div className="flex h-48 items-end justify-between gap-2">
                {activityData.map((data, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-app-accent to-red-400 transition-all hover:opacity-90"
                      style={{ height: `${(data.analyses / 15) * 100}%` }}
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
                {recentAnalyses.map((analysis) => (
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
                        {analysis.confidence != null && (
                          <div className="font-semibold text-app-text">{analysis.confidence}%</div>
                        )}
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

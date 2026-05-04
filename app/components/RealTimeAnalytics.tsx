'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';

interface AnalyticsData {
  totalAnalyses: number;
  liveAnalyses: number;
  accuracyRate: number;
  usersOnline: number;
  deepfakesDetected: number;
  processingTime: number;
}

export default function RealTimeAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalAnalyses: 0,
    liveAnalyses: 0,
    accuracyRate: 0,
    usersOnline: 0,
    deepfakesDetected: 0,
    processingTime: 0,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        totalAnalyses: prev.totalAnalyses + Math.floor(Math.random() * 3),
        liveAnalyses: Math.floor(Math.random() * 50) + 10,
        accuracyRate: 98.5 + Math.random() * 1.5,
        usersOnline: Math.floor(Math.random() * 200) + 150,
        deepfakesDetected: prev.deepfakesDetected + Math.floor(Math.random() * 2),
        processingTime: 1.2 + Math.random() * 0.8,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="fixed top-36 right-4 z-40 sm:right-6">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer rounded-2xl border border-app-border bg-app-surface text-left shadow-lg shadow-red-950/8 backdrop-blur-xl transition-colors hover:border-app-accent/35 ${
          isExpanded ? 'w-72 sm:w-80' : 'w-44 sm:w-48'
        }`}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-app-accent opacity-25" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-app-accent" />
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-app-text">
              <Activity className="h-3.5 w-3.5 text-app-accent" aria-hidden />
              Live
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-app-muted" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4 text-app-muted" aria-hidden />
          )}
        </div>

        <div className="px-3 pb-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-app-muted">Queues</span>
            <span className="text-sm font-bold text-app-accent">
              {isVisible ? data.liveAnalyses : '0'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-app-muted">Sessions</span>
            <span className="text-sm font-bold text-app-text">
              {isVisible ? data.usersOnline : '0'}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-app-border">
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-app-muted">Total analyses</span>
                <span className="text-lg font-bold text-app-text">
                  {isVisible ? formatNumber(data.totalAnalyses) : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-app-muted">Accuracy</span>
                <span className="text-lg font-bold text-app-accent">
                  {isVisible ? data.accuracyRate.toFixed(1) + '%' : '0%'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-app-muted">Flags (demo)</span>
                <span className="text-lg font-bold text-app-accent">
                  {isVisible ? formatNumber(data.deepfakesDetected) : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-app-muted">Avg time</span>
                <span className="text-lg font-bold text-app-text">
                  {isVisible ? data.processingTime.toFixed(1) + 's' : '0s'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-app-border px-4 py-3">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-app-accent" />
                <span className="h-1.5 w-1.5 rounded-full bg-app-accent/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-app-muted/50" />
              </div>
              <span className="text-xs text-app-muted">Simulated activity</span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

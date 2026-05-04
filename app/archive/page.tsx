'use client';

import { useState } from 'react';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';

export default function Archive() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const archiveEntries = [
    {
      id: 1,
      title: 'Celebrity Deepfake Collection',
      description: 'Collection of verified celebrity deepfakes for research purposes',
      category: 'celebrities',
      fakeScore: 95,
      views: 1200,
      verified: true,
      thumbnail: '👤',
    },
    {
      id: 2,
      title: 'Political Deepfake Videos',
      description: 'Archive of political deepfake videos with analysis reports',
      category: 'politics',
      fakeScore: 89,
      views: 3400,
      verified: true,
      thumbnail: '🏛️',
    },
    {
      id: 3,
      title: 'AI-Generated Text Samples',
      description: 'Examples of AI-generated text for detection training',
      category: 'text',
      fakeScore: 92,
      views: 856,
      verified: true,
      thumbnail: '📝',
    },
    {
      id: 4,
      title: 'Social Media Deepfakes',
      description: 'Deepfakes found on social media platforms',
      category: 'social',
      fakeScore: 78,
      views: 2100,
      verified: false,
      thumbnail: '📱',
    },
    {
      id: 5,
      title: 'News Media Manipulations',
      description: 'Verified manipulations in news media content',
      category: 'news',
      fakeScore: 87,
      views: 1500,
      verified: true,
      thumbnail: '📰',
    },
    {
      id: 6,
      title: 'Entertainment Industry Fakes',
      description: 'Deepfakes from movies, TV shows, and entertainment',
      category: 'entertainment',
      fakeScore: 91,
      views: 2800,
      verified: true,
      thumbnail: '🎬',
    },
  ];

  const categories = [
    { id: 'all', name: 'All', count: archiveEntries.length },
    { id: 'celebrities', name: 'Celebrities', count: archiveEntries.filter((e) => e.category === 'celebrities').length },
    { id: 'politics', name: 'Politics', count: archiveEntries.filter((e) => e.category === 'politics').length },
    { id: 'text', name: 'Text', count: archiveEntries.filter((e) => e.category === 'text').length },
    { id: 'social', name: 'Social Media', count: archiveEntries.filter((e) => e.category === 'social').length },
    { id: 'news', name: 'News', count: archiveEntries.filter((e) => e.category === 'news').length },
    { id: 'entertainment', name: 'Entertainment', count: archiveEntries.filter((e) => e.category === 'entertainment').length },
  ];

  const filteredEntries = archiveEntries.filter((entry) => {
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const card = 'rounded-2xl border border-app-border bg-app-surface/90 p-6 shadow-sm backdrop-blur-md';

  return (
    <AppBackground>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-app-text md:text-6xl">
            <span className="bg-gradient-to-r from-violet-500 via-app-accent to-red-600 bg-clip-text text-transparent">
              Public Deepfake Archive
            </span>
          </h1>
          <p className="mb-8 text-xl text-app-muted">
            Browse verified deepfakes and manipulated content for research and education
          </p>
        </div>

        <div className={`${card} mb-8 p-6`}>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search archive entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-app-border bg-app-bg-mid px-4 py-3 text-app-text placeholder:text-app-muted focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/25"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-app-accent text-white'
                      : 'bg-app-bg-mid text-app-muted hover:bg-app-surface-hover hover:text-app-text'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className={`${card} transition-transform hover:scale-[1.02]`}>
              <div className="mb-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-app-accent to-red-900 transition-transform group-hover:rotate-12">
                  <span className="text-2xl">{entry.thumbnail}</span>
                </div>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <h3 className="text-lg font-semibold text-app-text">{entry.title}</h3>
                  {entry.verified ? <span className="text-sm text-emerald-600 dark:text-emerald-400">✓</span> : null}
                </div>
                <p className="mb-4 text-sm text-app-muted">{entry.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-app-muted">Fake Score:</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-app-bg-mid">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-app-accent to-red-700 transition-all"
                        style={{ width: `${entry.fakeScore}%` }}
                      />
                    </div>
                    <span className="font-semibold text-app-text">{entry.fakeScore}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-app-muted">Views:</span>
                  <span className="font-semibold text-app-text">{entry.views.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-app-muted">Category:</span>
                  <span className="font-semibold capitalize text-app-text">{entry.category}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-app-border pt-4">
                <button
                  type="button"
                  className="w-full rounded-xl bg-app-accent py-2 font-semibold text-white transition hover:bg-app-accent-hover"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            className="rounded-xl border border-app-border bg-app-surface/90 px-8 py-4 font-semibold text-app-text shadow-sm backdrop-blur-md transition hover:bg-app-surface-hover"
          >
            Load More Entries
          </button>
        </div>
      </main>
    </AppBackground>
  );
}

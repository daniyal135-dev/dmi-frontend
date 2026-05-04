'use client';

import { useState } from 'react';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';

export default function Forum() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const forumThreads = [
    {
      id: 1,
      title: 'How to detect deepfakes in videos?',
      author: 'JohnDoe',
      replies: 24,
      views: 1205,
      category: 'detection',
      lastActive: '2 hours ago',
      pinned: true,
    },
    {
      id: 2,
      title: 'False positive on my analysis',
      author: 'SarahM',
      replies: 12,
      views: 456,
      category: 'help',
      lastActive: '5 hours ago',
      pinned: false,
    },
    {
      id: 3,
      title: 'Best practices for metadata verification',
      author: 'TechGuru',
      replies: 45,
      views: 2340,
      category: 'general',
      lastActive: '1 day ago',
      pinned: false,
    },
    {
      id: 4,
      title: 'New AI model update discussion',
      author: 'AdminTeam',
      replies: 67,
      views: 3210,
      category: 'news',
      lastActive: '3 hours ago',
      pinned: true,
    },
    {
      id: 5,
      title: 'Sharing my deepfake detection research',
      author: 'ResearcherAI',
      replies: 89,
      views: 5600,
      category: 'general',
      lastActive: '6 hours ago',
      pinned: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Discussions', icon: '💬' },
    { id: 'general', name: 'General', icon: '🌐' },
    { id: 'detection', name: 'Detection Help', icon: '🔍' },
    { id: 'help', name: 'Technical Support', icon: '❓' },
    { id: 'news', name: 'News & Updates', icon: '📢' },
  ];

  const filteredThreads =
    selectedCategory === 'all' ? forumThreads : forumThreads.filter((thread) => thread.category === selectedCategory);

  const card = 'rounded-2xl border border-app-border bg-app-surface/90 shadow-sm backdrop-blur-md';

  return (
    <AppBackground>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-app-text md:text-6xl">
            <span className="bg-gradient-to-r from-app-accent via-red-500 to-violet-500 bg-clip-text text-transparent">
              Community Forum
            </span>
          </h1>
          <p className="mb-8 text-xl text-app-muted">
            Connect with experts, share insights, and discuss deepfake detection
          </p>
          <button
            type="button"
            className="rounded-xl bg-app-accent px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-app-accent-hover"
          >
            + Create New Thread
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className={`${card} sticky top-24 p-6`}>
              <h3 className="mb-4 text-lg font-semibold text-app-text">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                      selectedCategory === category.id
                        ? 'bg-app-accent font-medium text-white'
                        : 'bg-app-bg-mid text-app-muted hover:bg-app-surface-hover hover:text-app-text'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 border-t border-app-border pt-6">
                <h3 className="mb-4 text-sm font-semibold text-app-text">Forum Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-app-muted">Threads</span>
                    <span className="font-semibold text-app-text">2,543</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-app-muted">Posts</span>
                    <span className="font-semibold text-app-text">18,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-app-muted">Members</span>
                    <span className="font-semibold text-app-text">15,678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-app-muted">Online Now</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">247</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`${card} cursor-pointer p-6 transition-colors hover:border-app-accent/30 hover:bg-app-surface`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        {thread.pinned ? (
                          <span className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-800 dark:text-amber-400">
                            📌 Pinned
                          </span>
                        ) : null}
                        <span className="rounded-lg bg-app-accent-soft px-2 py-1 text-xs font-semibold capitalize text-app-accent">
                          {thread.category}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-app-text">{thread.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-app-muted">
                        <span className="flex items-center gap-1">
                          <span>👤</span>
                          {thread.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          {thread.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👁️</span>
                          {thread.views} views
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-app-muted">Last active</div>
                      <div className="font-semibold text-app-text">{thread.lastActive}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                className="rounded-xl border border-app-border bg-app-bg-mid px-4 py-2 text-app-text transition hover:bg-app-surface-hover"
              >
                Previous
              </button>
              <div className="flex gap-2">
                <button type="button" className="rounded-xl bg-app-accent px-4 py-2 text-white">
                  1
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-app-border bg-app-bg-mid px-4 py-2 text-app-text hover:bg-app-surface-hover"
                >
                  2
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-app-border bg-app-bg-mid px-4 py-2 text-app-text hover:bg-app-surface-hover"
                >
                  3
                </button>
              </div>
              <button
                type="button"
                className="rounded-xl border border-app-border bg-app-bg-mid px-4 py-2 text-app-text transition hover:bg-app-surface-hover"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}

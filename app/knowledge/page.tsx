'use client';

import { useState } from 'react';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';

export default function Knowledge() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const articles = [
    {
      id: 1,
      title: 'Understanding Deepfakes: A Complete Guide',
      excerpt: "Learn what deepfakes are, how they're created, and their impact on society.",
      category: 'basics',
      readTime: '10 min',
      difficulty: 'Beginner',
      author: 'Dr. Sarah Chen',
      date: '2024-01-15',
      featured: true,
    },
    {
      id: 2,
      title: 'AI Detection Methods: Technical Overview',
      excerpt: 'Deep dive into the technical methods used to detect AI-generated content.',
      category: 'technical',
      readTime: '15 min',
      difficulty: 'Advanced',
      author: 'Prof. Michael Rodriguez',
      date: '2024-01-12',
      featured: true,
    },
    {
      id: 3,
      title: 'Case Study: Political Deepfake Campaign',
      excerpt: 'Analysis of a real-world deepfake campaign and its detection.',
      category: 'case-studies',
      readTime: '8 min',
      difficulty: 'Intermediate',
      author: 'Lisa Thompson',
      date: '2024-01-10',
      featured: false,
    },
    {
      id: 4,
      title: 'Legal Implications of Deepfake Technology',
      excerpt: 'Understanding the legal framework around deepfake creation and distribution.',
      category: 'legal',
      readTime: '12 min',
      difficulty: 'Intermediate',
      author: 'Attorney James Wilson',
      date: '2024-01-08',
      featured: false,
    },
    {
      id: 5,
      title: 'How to Spot Deepfakes: Visual Cues',
      excerpt: 'Practical guide to identifying visual inconsistencies in deepfake videos.',
      category: 'detection',
      readTime: '6 min',
      difficulty: 'Beginner',
      author: 'Emma Davis',
      date: '2024-01-05',
      featured: false,
    },
    {
      id: 6,
      title: 'Future of Deepfake Detection Technology',
      excerpt: 'Exploring upcoming technologies and methods for detecting deepfakes.',
      category: 'future',
      readTime: '9 min',
      difficulty: 'Advanced',
      author: 'Dr. Alex Kumar',
      date: '2024-01-03',
      featured: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Articles', count: articles.length },
    { id: 'basics', name: 'Basics', count: articles.filter((a) => a.category === 'basics').length },
    { id: 'technical', name: 'Technical', count: articles.filter((a) => a.category === 'technical').length },
    { id: 'case-studies', name: 'Case Studies', count: articles.filter((a) => a.category === 'case-studies').length },
    { id: 'legal', name: 'Legal', count: articles.filter((a) => a.category === 'legal').length },
    { id: 'detection', name: 'Detection', count: articles.filter((a) => a.category === 'detection').length },
    { id: 'future', name: 'Future', count: articles.filter((a) => a.category === 'future').length },
  ];

  const filteredArticles = selectedCategory === 'all' ? articles : articles.filter((article) => article.category === selectedCategory);

  const featuredArticles = articles.filter((article) => article.featured);

  const card =
    'rounded-2xl border border-app-border bg-app-surface/90 p-6 shadow-sm backdrop-blur-md transition-all hover:border-app-accent/25';
  const btnCat = (active: boolean) =>
    active
      ? 'bg-app-accent px-6 py-3 font-semibold text-white shadow-md'
      : 'bg-app-bg-mid px-6 py-3 font-semibold text-app-muted hover:bg-app-surface-hover hover:text-app-text';

  const difficultyCls = (d: string) =>
    d === 'Beginner'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
      : d === 'Intermediate'
        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-400'
        : 'bg-red-500/15 text-red-700 dark:text-red-400';

  return (
    <AppBackground>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-app-text md:text-6xl">
            <span className="bg-gradient-to-r from-app-accent via-red-500 to-orange-400 bg-clip-text text-transparent">
              Knowledge Base
            </span>
          </h1>
          <p className="mb-8 text-xl text-app-muted">
            Learn about deepfakes, detection methods, and stay informed about the latest developments
          </p>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-app-text">⭐ Featured Articles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredArticles.map((article) => (
              <div key={article.id} className={`${card} hover:scale-[1.01]`}>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-amber-400/90 px-2 py-1 text-xs font-bold text-app-text">
                      FEATURED
                    </span>
                    <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${difficultyCls(article.difficulty)}`}>
                      {article.difficulty}
                    </span>
                  </div>
                  <span className="text-sm text-app-muted">{article.readTime}</span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-app-text transition-colors group-hover:text-app-accent">
                  {article.title}
                </h3>

                <p className="mb-4 leading-relaxed text-app-muted">{article.excerpt}</p>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-app-muted">
                    By {article.author} • {article.date}
                  </div>
                  <button type="button" className="text-app-accent hover:text-app-accent-hover">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${card} mb-8 p-6`}>
          <h3 className="mb-4 font-semibold text-app-text">📚 Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-xl transition-all duration-300 ${btnCat(selectedCategory === category.id)}`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="mb-6 text-2xl font-bold text-app-text">📖 All Articles</h2>
          {filteredArticles.map((article) => (
            <div key={article.id} className={`${card} hover:scale-[1.005]`}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-lg px-3 py-1 text-sm font-semibold ${difficultyCls(article.difficulty)}`}>
                    {article.difficulty}
                  </span>
                  <span className="text-sm text-app-muted">{article.readTime}</span>
                  <span className="text-sm capitalize text-app-muted">{article.category}</span>
                </div>
                <span className="text-sm text-app-muted">{article.date}</span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-app-text">{article.title}</h3>

              <p className="mb-4 leading-relaxed text-app-muted">{article.excerpt}</p>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-app-muted">By {article.author}</div>
                <button type="button" className="text-app-accent hover:text-app-accent-hover">
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-app-border bg-app-accent-soft/40 p-8 backdrop-blur-md">
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold text-app-text">📧 Stay Updated</h3>
            <p className="mb-6 text-app-muted">Get the latest articles and research updates delivered to your inbox</p>
            <div className="mx-auto flex max-w-md flex-col gap-4 md:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-app-border bg-app-surface px-4 py-3 text-app-text placeholder:text-app-muted focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/25"
              />
              <button
                type="button"
                className="rounded-xl bg-app-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-app-accent-hover"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}

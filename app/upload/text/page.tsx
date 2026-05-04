'use client';

import { useState } from 'react';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';
import { analyzeText } from '@/lib/api';

export default function TextUpload() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setError(null);
    setIsAnalyzing(true);

    try {
      const data = await analyzeText(text.trim());
      const id = data?.result?.id;
      if (id == null || id === undefined) {
        throw new Error('Invalid response: missing result id');
      }
      window.location.href = `/results/${id}`;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Text analysis failed';
      setError(message);
      setIsAnalyzing(false);
    }
  };

  const panelOuter =
    'rounded-3xl border border-app-border bg-app-surface/90 p-8 shadow-sm backdrop-blur-md transition-colors hover:bg-app-surface';

  const inputCls =
    'w-full rounded-xl border border-app-border bg-app-bg-mid p-6 text-app-text placeholder:text-app-muted/70 transition-colors focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/25';

  return (
    <AppBackground>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-app-text md:text-6xl">
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              Analyze Text
            </span>
          </h1>
          <p className="mb-8 text-xl text-app-muted">
            Paste text to detect AI-generated content and get detailed explanations
          </p>
        </div>

        <div className={panelOuter}>
          <div className="space-y-6">
            <div>
              <label htmlFor="text-input" className="mb-4 block font-semibold text-app-text">
                📝 Enter or paste your text here
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the text you want to analyze for AI-generated content..."
                className={`${inputCls} h-64 resize-none`}
              />
              <div className="mt-2 text-right text-sm text-app-muted">{text.length} characters</div>
            </div>

            <div className="rounded-xl border border-app-border bg-app-bg-mid/80 p-6">
              <h4 className="mb-4 font-semibold text-app-text">💡 Try these sample texts:</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      'The weather today is quite pleasant with clear skies and a gentle breeze. I think it would be perfect for a walk in the park.'
                    )
                  }
                  className="rounded-lg border border-app-border bg-app-surface/80 p-4 text-left text-app-muted transition-colors hover:border-app-accent/30 hover:bg-app-accent-soft hover:text-app-text"
                >
                  <div className="mb-2 font-semibold text-app-text">Human-written text</div>
                  <div className="text-sm">Natural, conversational style</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      'The meteorological conditions exhibit optimal parameters for outdoor recreational activities. Atmospheric clarity and wind velocity suggest favorable conditions for pedestrian locomotion in designated green spaces.'
                    )
                  }
                  className="rounded-lg border border-app-border bg-app-surface/80 p-4 text-left text-app-muted transition-colors hover:border-app-accent/30 hover:bg-app-accent-soft hover:text-app-text"
                >
                  <div className="mb-2 font-semibold text-app-text">AI-generated text</div>
                  <div className="text-sm">Formal, repetitive patterns</div>
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200"
              >
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className={`rounded-xl px-12 py-4 text-lg font-semibold text-white transition-all duration-300 ${
                  !text.trim() || isAnalyzing
                    ? 'cursor-not-allowed bg-app-muted'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500'
                }`}
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing Text...
                  </span>
                ) : (
                  'Analyze Text'
                )}
              </button>
            </div>

            <div className="rounded-xl border border-app-border bg-app-bg-mid/80 p-6">
              <h4 className="mb-4 font-semibold text-app-text">🔍 What We Analyze</h4>
              <div className="grid gap-4 text-sm text-app-muted md:grid-cols-2">
                <div>• Writing patterns and style</div>
                <div>• Repetitive phrasing detection</div>
                <div>• Vocabulary complexity analysis</div>
                <div>• Sentence structure patterns</div>
                <div>• Statistical language models</div>
                <div>• Processing time: 10-30 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}

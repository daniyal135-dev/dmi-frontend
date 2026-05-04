'use client';

import { useState } from 'react';
import { analyzeImage } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPEG, PNG, or WebP images.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 10MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await analyzeImage(selectedFile);
      router.push(`/results/${result.result.id}`);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      const message = err instanceof Error ? err.message : 'Failed to analyze image. Please make sure you are logged in.';
      setError(message);
      setIsUploading(false);
    }
  };

  const panelOuter =
    'rounded-3xl border border-app-border bg-app-surface/90 p-8 shadow-sm backdrop-blur-md transition-colors hover:bg-app-surface';

  return (
    <AppBackground>
      <SiteHeader />
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-app-text md:text-6xl">
            <span className="bg-gradient-to-r from-app-accent via-red-500 to-orange-400 bg-clip-text text-transparent">
              Upload Image
            </span>
          </h1>
          <p className="mb-8 text-xl text-app-muted">Upload an image to detect deepfakes and see manipulation heatmaps</p>
        </div>

        <div className={panelOuter}>
          <div
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-app-accent bg-app-accent-soft'
                : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-app-border hover:border-app-accent/40'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/90">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-2xl font-semibold text-app-text">File Selected!</h3>
                <p className="text-app-muted">{selectedFile.name}</p>
                <p className="text-sm text-app-muted/80">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-app-muted underline-offset-2 transition-colors hover:text-app-text"
                >
                  Choose Different File
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-app-accent to-red-700">
                  <span className="text-3xl">🖼️</span>
                </div>
                <h3 className="text-2xl font-semibold text-app-text">
                  {dragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                </h3>
                <p className="text-app-muted">or click to browse files</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary-glow inline-block cursor-pointer rounded-xl bg-app-accent px-8 py-4 font-semibold text-white transition-all hover:bg-app-accent-hover"
                >
                  Choose Image
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/15 p-4 text-red-700 dark:text-red-300">
              <p className="font-semibold">⚠️ Error</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {selectedFile && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className={`rounded-xl px-12 py-4 text-lg font-semibold text-white transition-all duration-300 ${
                  isUploading
                    ? 'cursor-not-allowed bg-app-muted'
                    : 'btn-primary-glow bg-app-accent hover:bg-app-accent-hover'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing Image...
                  </span>
                ) : (
                  'Analyze Image'
                )}
              </button>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-app-border bg-app-bg-mid/80 p-6">
            <h4 className="mb-4 font-semibold text-app-text">📋 File Requirements</h4>
            <div className="grid gap-4 text-sm text-app-muted md:grid-cols-2">
              <div>• Supported formats: JPEG, PNG, WebP</div>
              <div>• Maximum file size: 10MB</div>
              <div>• Recommended resolution: 1920x1080 or higher</div>
              <div>• Processing time: 30-60 seconds</div>
            </div>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}

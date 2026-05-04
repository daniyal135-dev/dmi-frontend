'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeVideo } from '@/lib/api';
import { AppBackground, SiteHeader } from '@/app/components/AppChrome';

export default function VideoUpload() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setError(null);

    const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/webm', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|webm|mkv)$/i)) {
      setError('Invalid file type. Please upload MP4, AVI, MOV, WebM, or MKV.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('File too large. Maximum size is 100MB.');
      return;
    }

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
    setProgress('Uploading video...');

    try {
      setProgress('Extracting frames and analyzing... This may take 1-2 minutes.');
      const response = await analyzeVideo(selectedFile);

      if (response.result && response.result.id) {
        router.push(`/results/${response.result.id}`);
      } else {
        throw new Error('No result ID returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video analysis failed. Please try again.');
      setIsUploading(false);
      setProgress('');
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
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Upload Video
            </span>
          </h1>
          <p className="mb-8 text-xl text-app-muted">Upload a video to detect deepfakes with frame-by-frame analysis</p>
        </div>

        <div className={panelOuter}>
          <div
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-emerald-400 bg-emerald-500/15'
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
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600/90">
                  <span className="text-3xl">🎥</span>
                </div>
                <h3 className="text-2xl font-semibold text-app-text">Video Selected!</h3>
                <p className="text-app-muted">{selectedFile.name}</p>
                <p className="text-sm text-app-muted/80">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-app-muted underline-offset-2 transition-colors hover:text-app-text"
                >
                  Choose Different Video
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700">
                  <span className="text-3xl">🎥</span>
                </div>
                <h3 className="text-2xl font-semibold text-app-text">
                  {dragActive ? 'Drop your video here' : 'Drag & drop your video here'}
                </h3>
                <p className="text-app-muted">or click to browse files</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="inline-block cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white transition-all hover:from-emerald-500 hover:to-teal-500"
                >
                  Choose Video
                </label>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className={`rounded-xl px-12 py-4 text-lg font-semibold text-white transition-all duration-300 ${
                  isUploading ? 'cursor-not-allowed bg-app-muted' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {progress || 'Processing Video...'}
                  </span>
                ) : (
                  'Analyze Video'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/15 p-4 text-red-700 dark:text-red-300">
              ⚠️ {error}
            </div>
          )}

          <div className="mt-8 rounded-xl border border-app-border bg-app-bg-mid/80 p-6">
            <h4 className="mb-4 font-semibold text-app-text">📋 Video Requirements</h4>
            <div className="grid gap-4 text-sm text-app-muted md:grid-cols-2">
              <div>• Supported formats: MP4, AVI, MOV, WebM, MKV</div>
              <div>• Maximum file size: 100MB</div>
              <div>• Recommended resolution: 1080p or higher</div>
              <div>• Processing time: 1-2 minutes (30 frames analyzed)</div>
            </div>
          </div>
        </div>
      </main>
    </AppBackground>
  );
}

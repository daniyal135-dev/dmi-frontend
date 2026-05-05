/**
 * API Configuration — Django backend
 *
 * - **Local:** uses NEXT_PUBLIC_API_URL or http://127.0.0.1:8000/api (direct to Django).
 * - **Production (Vercel etc.):** browser calls same-origin `/api/backend/...` → Route Handler
 *   proxies to Railway. Server needs BACKEND_API_BASE_URL or NEXT_PUBLIC_API_URL ending in `/api`.
 *   This avoids stale `NEXT_PUBLIC_*` in the client bundle causing HTML/JSON errors.
 */
function apiBase(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]';
    if (!isLocal) {
      return `${window.location.origin}/api/backend`;
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
  ).replace(/\/+$/, '');
}

/**
 * Django serves media at `/media/...` on the backend origin (not under `/api/`).
 *
 * - **Production (Vercel):** same-origin `/api/backend-media/...` proxies server-side so ngrok free
 *   HTML interstitial does not break `<img src>` (uses ngrok-skip-browser-warning like `/api/backend`).
 * - **Local dev:** direct `http://127.0.0.1:8000/media/...`.
 */
export function mediaFileUrl(relativePath: string): string {
  const p = relativePath.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]';
    if (!isLocal) {
      return `${window.location.origin}/api/backend-media/${p}`;
    }
  }
  const apiRoot = (
    process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
  ).replace(/\/+$/, '');
  const origin = apiRoot.endsWith('/api')
    ? apiRoot.slice(0, -4)
    : apiRoot.replace(/\/api\/?$/, '');
  return `${origin}/media/${p}`;
}

function parseApiJson<T>(text: string): T {
  const trimmed = text.trim();
  if (trimmed.startsWith('<')) {
    throw new Error(
      'Server returned HTML instead of JSON. On Vercel: set BACKEND_API_BASE_URL and NEXT_PUBLIC_API_URL to your API base ending in /api (e.g. ngrok https://xxx.ngrok-free.dev/api), save, Redeploy. Ngrok free sometimes serves an HTML warning unless the proxy skips it (latest frontend includes this). Check Vercel Function logs for /api/backend.'
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid response from server (not JSON).');
  }
}

/**
 * Get stored authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

/**
 * Store authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers = new Headers(options.headers ?? undefined);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiBase()}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    removeAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
    throw new Error('Unauthorized');
  }

  return response;
}

/**
 * API Functions
 */

// Authentication
export async function login(username: string, password: string) {
  const response = await fetch(`${apiBase()}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const text = await response.text();
  const data = parseApiJson<{ access?: string; detail?: string | string[] }>(text);

  if (!response.ok) {
    const d = data.detail;
    const msg =
      typeof d === 'string'
        ? d
        : Array.isArray(d)
          ? String(d[0])
          : 'Login failed';
    throw new Error(msg);
  }

  if (!data.access) {
    throw new Error('Login succeeded but no access token in response.');
  }
  setAuthToken(data.access);
  return data;
}

export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${apiBase()}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  const text = await response.text();
  const err = parseApiJson<
    Record<string, unknown> & {
      error?: string;
      username?: string | string[];
    }
  >(text);

  if (!response.ok) {
    const msg =
      err.error ||
      (err.username &&
        (Array.isArray(err.username) ? err.username[0] : err.username)) ||
      'Registration failed';
    throw new Error(String(msg));
  }

  return err;
}

// Image Analysis
export async function analyzeImage(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await apiRequest('/analysis/image/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Image analysis failed');
  }

  return await response.json();
}

// Text analysis — POST JSON; backend returns { result: { id, verdict, ... }, ... }
export async function analyzeText(text: string) {
  const response = await apiRequest('/analysis/text/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let message = 'Text analysis failed';
    try {
      const err = await response.json();
      message = (err.error as string) || (err.detail as string) || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return await response.json();
}

// Get analysis result by ID
export async function getAnalysisResult(id: string) {
  const response = await apiRequest(`/analysis/results/${id}/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch analysis result');
  }

  const data = await response.json();
  // Return in the format expected by the results page
  return { result: data };
}

/** One row from GET /analysis/results/ (DRF paginated list item). */
export type AnalysisResultRow = {
  id: number;
  file_type: string;
  file_path: string;
  verdict: string;
  confidence: number;
  created_at: string;
  updated_at?: string;
};

type PaginatedResults<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Get user's analysis history (first page only — see getAllAnalysisResults)
export async function getAnalysisHistory() {
  const response = await apiRequest('/analysis/results/');

  if (!response.ok) {
    throw new Error('Failed to fetch analysis history');
  }

  return await response.json();
}

const MAX_ANALYSIS_PAGES = 200;

/** Fetch all pages of analysis results for the current user (dashboard stats). */
export async function getAllAnalysisResults(): Promise<AnalysisResultRow[]> {
  const all: AnalysisResultRow[] = [];
  let page = 1;
  for (;;) {
    if (page > MAX_ANALYSIS_PAGES) break;
    const response = await apiRequest(`/analysis/results/?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch analysis history');
    }
    const data = (await response.json()) as
      | PaginatedResults<AnalysisResultRow>
      | AnalysisResultRow[];
    if (Array.isArray(data)) {
      return data;
    }
    const batch = data.results ?? [];
    all.push(...batch);
    if (!data.next || batch.length === 0) break;
    page += 1;
  }
  return all;
}

// Get current user profile
export async function getUserProfile() {
  const response = await apiRequest('/auth/profile/');
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json();
}

// Video Analysis
export async function analyzeVideo(videoFile: File) {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await apiRequest('/analysis/video/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Video analysis failed');
  }

  return await response.json();
}


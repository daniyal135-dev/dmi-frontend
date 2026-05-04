/**
 * API Configuration and Helper Functions
 * Connects frontend to Django backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  const data = await response.json();
  setAuthToken(data.access);
  return data;
}

export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    const msg =
      err.error ||
      (err.username && (Array.isArray(err.username) ? err.username[0] : err.username)) ||
      'Registration failed';
    throw new Error(msg);
  }

  return await response.json();
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

// Get user's analysis history
export async function getAnalysisHistory() {
  const response = await apiRequest('/analysis/results/');
  
  if (!response.ok) {
    throw new Error('Failed to fetch analysis history');
  }

  return await response.json();
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


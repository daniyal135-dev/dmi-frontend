import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Hobby plan may still cap at 10s; Pro+ allows up to 300s — helps if Railway is cold.
export const maxDuration = 60;

type RouteContext = { params: Promise<{ path?: string[] }> };

function backendBaseUrl(): string {
  const raw =
    process.env.BACKEND_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    '';
  return raw.replace(/\/+$/, '');
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const base = backendBaseUrl();
  if (!base) {
    return NextResponse.json(
      {
        error:
          'Missing BACKEND_API_BASE_URL or NEXT_PUBLIC_API_URL on the server (Vercel env).',
      },
      { status: 500 },
    );
  }

  const pathPart = pathSegments.length ? pathSegments.join('/') : '';
  const slug = pathPart
    ? pathPart.endsWith('/')
      ? pathPart
      : `${pathPart}/`
    : '';
  const incoming = new URL(req.url);
  const targetUrl = `${base}/${slug}${incoming.search}`;

  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) {
    headers.set('content-type', contentType);
  }
  const auth = req.headers.get('authorization');
  if (auth) {
    headers.set('authorization', auth);
  }
  // Ngrok free: server-side fetch otherwise gets HTML interstitial → "HTML instead of JSON" on Vercel.
  if (/ngrok/i.test(base)) {
    // Free ngrok: use a non-empty value; 69420 is the documented skip for programmatic clients.
    headers.set('ngrok-skip-browser-warning', '69420');
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    init.body = await req.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, init);
  } catch (e) {
    console.error('[api/backend proxy] fetch failed:', targetUrl, e);
    return NextResponse.json(
      {
        error: 'Backend unreachable',
        hint:
          'Is Railway online? Set NEXT_PUBLIC_API_URL for this deployment env (Preview vs Production). Cold Railway may need a retry.',
      },
      { status: 502 },
    );
  }

  // Buffer body — piping upstream.body into NextResponse often causes 500 on Vercel.
  const body = await upstream.arrayBuffer();
  const out = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) {
    out.set('content-type', ct);
  }

  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

async function handle(req: NextRequest, ctx: RouteContext) {
  try {
    const { path } = await ctx.params;
    return await proxy(req, path ?? []);
  } catch (e) {
    console.error('[api/backend proxy] error:', e);
    return NextResponse.json(
      { error: 'Proxy failed. Check Vercel Function logs.' },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;

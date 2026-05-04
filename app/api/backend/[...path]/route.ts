import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

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
    console.error('[api/backend proxy] fetch failed:', e);
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }

  const outHeaders = new Headers(upstream.headers);
  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}

async function handle(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxy(req, path ?? []);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;

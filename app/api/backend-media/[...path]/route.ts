import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type RouteContext = { params: Promise<{ path?: string[] }> };

function backendApiBase(): string {
  const raw =
    process.env.BACKEND_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    '';
  return raw.replace(/\/+$/, '');
}

/** Django MEDIA_URL is `/media/` on site root — strip trailing `/api` from …/api base. */
function backendOriginForMedia(): string | null {
  const base = backendApiBase();
  if (!base) return null;
  const trimmed = base.replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) return trimmed.slice(0, -4);
  const withoutApi = trimmed.replace(/\/api\/?$/, '');
  return withoutApi || null;
}

async function proxyMedia(req: NextRequest, pathSegments: string[]) {
  const origin = backendOriginForMedia();
  if (!origin) {
    return NextResponse.json(
      {
        error:
          'Missing BACKEND_API_BASE_URL or NEXT_PUBLIC_API_URL on the server (Vercel env).',
      },
      { status: 500 },
    );
  }

  if (pathSegments.some((s) => s.includes('..') || s.includes('\\'))) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const rel = pathSegments.join('/');
  if (!rel) {
    return NextResponse.json({ error: 'Missing media path' }, { status: 400 });
  }

  const targetUrl = `${origin}/media/${rel}${new URL(req.url).search}`;

  const headers = new Headers();
  if (/ngrok/i.test(origin)) {
    headers.set('ngrok-skip-browser-warning', '69420');
  }

  const method = req.method === 'HEAD' ? 'HEAD' : 'GET';

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers,
      redirect: 'manual',
    });
  } catch (e) {
    console.error('[api/backend-media] fetch failed:', targetUrl, e);
    return NextResponse.json({ error: 'Backend media unreachable' }, { status: 502 });
  }

  if (upstream.status >= 400) {
    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
    });
  }

  const out = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) out.set('content-type', ct);
  const len = upstream.headers.get('content-length');
  if (len) out.set('content-length', len);

  if (method === 'HEAD') {
    return new NextResponse(null, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: out,
    });
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

async function handle(req: NextRequest, ctx: RouteContext) {
  try {
    const { path } = await ctx.params;
    return await proxyMedia(req, path ?? []);
  } catch (e) {
    console.error('[api/backend-media] error:', e);
    return NextResponse.json({ error: 'Media proxy failed' }, { status: 500 });
  }
}

export const GET = handle;
export const HEAD = handle;

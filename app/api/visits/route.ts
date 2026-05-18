import { NextResponse } from 'next/server';

const PAGE_KEY = 'home';
const SUPABASE_TABLE = 'page_visits';
const UPSTASH_KEY = `visits:${PAGE_KEY}`;

type VisitResponse = { views: number; provider: 'supabase' | 'upstash' };

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

function getUpstashConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;
  return { url, token };
}

async function supabaseRequest(path: string, init: RequestInit) {
  const config = getSupabaseConfig();
  if (!config) throw new Error('SUPABASE_NOT_CONFIGURED');

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`SUPABASE_ERROR:${response.status}:${await response.text()}`);
  }

  return response.json();
}

async function getSupabaseViews() {
  const rows = await supabaseRequest(`${SUPABASE_TABLE}?page=eq.${PAGE_KEY}&select=count&limit=1`, { method: 'GET' });
  const current = Array.isArray(rows) && rows.length > 0 ? Number(rows[0]?.count ?? 0) : 0;
  return Number.isFinite(current) ? current : 0;
}

async function incrementSupabaseViews() {
  // Atomic increment on Postgres side via RPC function.
  const payload = await supabaseRequest('rpc/increment_page_visit', {
    method: 'POST',
    body: JSON.stringify({ p_page: PAGE_KEY }),
  });

  const value = Array.isArray(payload) ? payload[0] : payload;
  const next = Number(value?.count ?? value?.views ?? 0);

  if (!Number.isFinite(next)) {
    throw new Error('SUPABASE_INVALID_INCREMENT_RESPONSE');
  }

  return next;
}

async function upstashRequest(path: string, init?: RequestInit) {
  const config = getUpstashConfig();
  if (!config) throw new Error('UPSTASH_NOT_CONFIGURED');

  const response = await fetch(`${config.url}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`UPSTASH_ERROR:${response.status}:${await response.text()}`);
  }

  return response.json();
}

async function getUpstashViews() {
  const data = await upstashRequest(`/get/${encodeURIComponent(UPSTASH_KEY)}`);
  return Number(data?.result ?? 0) || 0;
}

async function incrementUpstashViews() {
  const data = await upstashRequest(`/incr/${encodeURIComponent(UPSTASH_KEY)}`, { method: 'POST' });
  return Number(data?.result ?? 0) || 0;
}

async function getViews(): Promise<VisitResponse> {
  if (getSupabaseConfig()) {
    return { views: await getSupabaseViews(), provider: 'supabase' };
  }

  if (getUpstashConfig()) {
    return { views: await getUpstashViews(), provider: 'upstash' };
  }

  throw new Error('NO_COUNTER_BACKEND_CONFIGURED');
}

async function incrementViews(): Promise<VisitResponse> {
  if (getSupabaseConfig()) {
    return { views: await incrementSupabaseViews(), provider: 'supabase' };
  }

  if (getUpstashConfig()) {
    return { views: await incrementUpstashViews(), provider: 'upstash' };
  }

  throw new Error('NO_COUNTER_BACKEND_CONFIGURED');
}

export async function GET() {
  try {
    return NextResponse.json(await getViews());
  } catch (error) {
    console.error('[api/visits][GET] Failed to fetch visits', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Visit counter backend is not configured or failed.' }, { status: 503 });
  }
}

export async function POST() {
  try {
    return NextResponse.json(await incrementViews());
  } catch (error) {
    console.error('[api/visits][POST] Failed to increment visits', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Visit counter backend is not configured or failed.' }, { status: 503 });
  }
}

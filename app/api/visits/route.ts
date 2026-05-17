import { NextResponse } from 'next/server';

const SITE_KEY = 'veda-music';
const TABLE = 'site_stats';

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return { url, serviceKey };
}

async function supabaseRequest(path: string, init: RequestInit) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

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
    const text = await response.text();
    throw new Error(`SUPABASE_ERROR:${response.status}:${text}`);
  }

  return response.json();
}

async function ensureRowExists() {
  await supabaseRequest(`${TABLE}?on_conflict=site_key`, {
    method: 'POST',
    body: JSON.stringify({ site_key: SITE_KEY, views: 0 }),
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });
}

async function getViews() {
  const rows = await supabaseRequest(`${TABLE}?site_key=eq.${SITE_KEY}&select=views&limit=1`, {
    method: 'GET',
  });

  const current = Array.isArray(rows) && rows.length > 0 ? Number(rows[0]?.views ?? 0) : 0;
  return Number.isFinite(current) ? current : 0;
}

export async function GET() {
  try {
    await ensureRowExists();
    const views = await getViews();
    return NextResponse.json({ views });
  } catch (error) {
    if (error instanceof Error && error.message === 'SUPABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to fetch visits.' }, { status: 500 });
  }
}

export async function POST() {
  try {
    await ensureRowExists();
    const current = await getViews();
    const next = current + 1;

    const updatedRows = await supabaseRequest(`${TABLE}?site_key=eq.${SITE_KEY}`, {
      method: 'PATCH',
      body: JSON.stringify({ views: next }),
    });

    const updated = Array.isArray(updatedRows) && updatedRows.length > 0 ? Number(updatedRows[0]?.views ?? next) : next;
    return NextResponse.json({ views: Number.isFinite(updated) ? updated : next });
  } catch (error) {
    if (error instanceof Error && error.message === 'SUPABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to update visits.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
const MAX_DURATION_SECONDS = 10;
const MIN_DURATION_SECONDS = 0.5;
const FRIENDLY_ERROR = 'No pude escuchar bien. Intenta otra vez o escríbeme.';

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 503 });
  }

  try {
    console.info('[voiceTranscribe] start');
    const formData = await request.formData();
    const audio = formData.get('audio');
    const durationRaw = formData.get('durationSeconds');

    if (!(audio instanceof File)) {
      return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 400 });
    }

    const durationSeconds = typeof durationRaw === 'string' ? Number(durationRaw) : NaN;
    if (Number.isFinite(durationSeconds) && (durationSeconds < MIN_DURATION_SECONDS || durationSeconds > MAX_DURATION_SECONDS + 1)) {
      return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 400 });
    }

    console.info('[voiceTranscribe] audio size', { bytes: audio.size });
    if (audio.size <= 0 || audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 400 });
    }

    const model = process.env.OPENAI_TRANSCRIBE_MODEL ?? 'gpt-4o-mini-transcribe';
    const payload = new FormData();
    payload.append('file', audio);
    payload.append('model', model);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: payload,
    });

    if (!response.ok) {
      console.error('[voiceTranscribe] fail', { status: response.status });
      return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 502 });
    }

    const data = (await response.json()) as { text?: string };
    const text = (data.text ?? '').trim();

    if (!text) {
      return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 422 });
    }

    console.info('[voiceTranscribe] success', { transcriptLength: text.length });
    return NextResponse.json({ ok: true, text });
  } catch {
    console.error('[voiceTranscribe] fail', { code: 'unexpected_error' });
    return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 500 });
  }
}

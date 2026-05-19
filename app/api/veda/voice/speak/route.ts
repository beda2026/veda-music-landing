import { NextRequest, NextResponse } from 'next/server';

const MAX_TEXT_LENGTH = 200;
const FRIENDLY_ERROR = 'No pude reproducir audio ahora. Sigue con el texto.';

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 503 });
  }

  try {
    const body = (await request.json().catch(() => null)) as { text?: string } | null;
    const text = body?.text?.replace(/\s+/g, ' ').trim() ?? '';

    if (!text || text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ ok: false, message: 'Ese mensaje es muy largo para leerlo en voz. Léelo en pantalla.' }, { status: 400 });
    }

    console.info('[voiceSpeak] start', { ttsTextLength: text.length });

    const model = process.env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts';
    const voice = process.env.OPENAI_TTS_VOICE ?? 'alloy';

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        voice,
        input: text,
        format: 'mp3',
      }),
    });

    if (!response.ok) {
      console.error('[voiceSpeak] fail', { status: response.status });
      return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 502 });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    console.error('[voiceSpeak] fail', { code: 'unexpected_error' });
    return NextResponse.json({ ok: false, message: FRIENDLY_ERROR }, { status: 500 });
  }
}

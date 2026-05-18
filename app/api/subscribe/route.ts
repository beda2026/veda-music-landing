import { NextResponse } from 'next/server';
import { escapeHtml, sendVedaEmail } from '@/lib/server/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json({ ok: false, error: 'El email es obligatorio.' }, { status: 400 });
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json({ ok: false, error: 'El email es demasiado largo.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ ok: false, error: 'Formato de email inválido.' }, { status: 400 });
    }

    const isoDate = new Date().toISOString();
    const safeEmail = escapeHtml(email);

    await sendVedaEmail({
      subject: 'Nueva suscripción Comunidad V.E.D.A.',
      text: `Nueva suscripción desde V.E.D.A. Music\n\nEmail suscrito:\n${email}\n\nFecha:\n${isoDate}`,
      html: `<div style="font-family:Arial,sans-serif;background:#0f0f12;color:#f2f2f2;padding:24px;border-radius:12px;"><h2 style="margin:0 0 16px;color:#f5b21b;">Nueva suscripción Comunidad V.E.D.A.</h2><p style="margin:0 0 8px;">Nueva suscripción desde V.E.D.A. Music</p><p style="margin:0 0 8px;"><strong>Email suscrito:</strong> ${safeEmail}</p><p style="margin:0;"><strong>Fecha:</strong> ${isoDate}</p></div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('RESEND_API_KEY')) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: false, error: 'No se pudo enviar la suscripción.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { escapeHtml, sendVedaEmail } from '@/lib/server/email';
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 180;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const jsonError = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

const logSecurityEvent = ({ status, code, missingEnv }: { status: number; code: string; missingEnv?: string }) => {
  console.error('[security]', {
    route: '/api/subscribe',
    status,
    code,
    missingEnv,
  });
};

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    logSecurityEvent({ status: 415, code: 'INVALID_CONTENT_TYPE' });
    return jsonError(415, 'Invalid content type.');
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit({
    route: '/api/subscribe',
    ip,
    maxRequests: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    logSecurityEvent({ status: 429, code: 'RATE_LIMIT_EXCEEDED' });
    return jsonError(429, 'Too many requests. Try again later.');
  }

  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      logSecurityEvent({ status: 400, code: 'EMPTY_BODY' });
      return jsonError(400, 'Invalid request body.');
    }

    const honeypot = typeof body?.company === 'string' ? body.company.trim() : '';
    if (honeypot) {
      logSecurityEvent({ status: 200, code: 'HONEYPOT_TRIGGERED' });
      return NextResponse.json({ ok: true });
    }

    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return jsonError(400, 'El email es obligatorio.');
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return jsonError(400, 'El email es demasiado largo.');
    }

    if (!EMAIL_REGEX.test(email)) {
      return jsonError(400, 'Formato de email inválido.');
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
      logSecurityEvent({ status: 500, code: 'MISSING_ENV', missingEnv: 'RESEND_API_KEY' });
      return jsonError(500, 'No se pudo procesar la suscripción.');
    }

    logSecurityEvent({ status: 500, code: 'INTERNAL_ERROR' });
    return jsonError(500, 'No se pudo enviar la suscripción.');
  }
}

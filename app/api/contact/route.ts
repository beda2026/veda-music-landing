import { NextResponse } from 'next/server';
import { escapeHtml, sendVedaEmail } from '@/lib/server/email';
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NOMBRE = 120;
const MAX_EMAIL = 180;
const MAX_TELEFONO = 60;
const MAX_TIPO = 80;
const MAX_MENSAJE = 2000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const jsonError = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

const logSecurityEvent = ({ status, code, missingEnv }: { status: number; code: string; missingEnv?: string }) => {
  console.error('[security]', {
    route: '/api/contact',
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
    route: '/api/contact',
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

    const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const telefono = typeof body?.telefono === 'string' ? body.telefono.trim() : '';
    const tipo = typeof body?.tipo === 'string' ? body.tipo.trim() : '';
    const mensaje = typeof body?.mensaje === 'string' ? body.mensaje.trim() : '';

    if (!nombre || !email || !tipo || !mensaje) {
      return jsonError(400, 'Completa todos los campos obligatorios.');
    }

    if (nombre.length > MAX_NOMBRE || email.length > MAX_EMAIL || telefono.length > MAX_TELEFONO || tipo.length > MAX_TIPO || mensaje.length > MAX_MENSAJE) {
      return jsonError(400, 'Uno o más campos exceden el límite permitido.');
    }

    if (!EMAIL_REGEX.test(email)) {
      return jsonError(400, 'Correo electrónico inválido.');
    }

    const isoDate = new Date().toISOString();

    await sendVedaEmail({
      subject: `VEDA MUSIC - ${tipo}`,
      replyTo: email,
      text: `Nueva solicitud desde V.E.D.A. MUSIC\n\nNombre: ${nombre}\nCorreo electrónico: ${email}\nTeléfono / WhatsApp: ${telefono || 'No indicado'}\nTipo de solicitud: ${tipo}\n\nMensaje:\n${mensaje}\n\nFecha:\n${isoDate}`,
      html: `<div style="font-family:Arial,sans-serif;background:#0f0f12;color:#f2f2f2;padding:24px;border-radius:12px;"><h2 style="margin:0 0 16px;color:#f5b21b;">Nueva solicitud comercial</h2><p style="margin:0 0 6px;"><strong>Nombre:</strong> ${escapeHtml(nombre)}</p><p style="margin:0 0 6px;"><strong>Correo electrónico:</strong> ${escapeHtml(email)}</p><p style="margin:0 0 6px;"><strong>Teléfono / WhatsApp:</strong> ${escapeHtml(telefono || 'No indicado')}</p><p style="margin:0 0 6px;"><strong>Tipo de solicitud:</strong> ${escapeHtml(tipo)}</p><p style="margin:12px 0 6px;"><strong>Mensaje:</strong></p><p style="margin:0 0 8px;white-space:pre-wrap;">${escapeHtml(mensaje)}</p><p style="margin:0;"><strong>Fecha:</strong> ${isoDate}</p></div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('RESEND_API_KEY')) {
      logSecurityEvent({ status: 500, code: 'MISSING_ENV', missingEnv: 'RESEND_API_KEY' });
      return jsonError(500, 'No se pudo procesar la solicitud.');
    }

    logSecurityEvent({ status: 500, code: 'INTERNAL_ERROR' });
    return jsonError(500, 'No se pudo enviar la solicitud.');
  }
}

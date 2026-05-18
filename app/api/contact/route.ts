import { NextResponse } from 'next/server';
import { escapeHtml, sendVedaEmail } from '@/lib/server/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NOMBRE = 100;
const MAX_EMAIL = 254;
const MAX_TELEFONO = 40;
const MAX_TIPO = 80;
const MAX_MENSAJE = 3000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const telefono = typeof body?.telefono === 'string' ? body.telefono.trim() : '';
    const tipo = typeof body?.tipo === 'string' ? body.tipo.trim() : '';
    const mensaje = typeof body?.mensaje === 'string' ? body.mensaje.trim() : '';

    if (!nombre || !email || !tipo || !mensaje) {
      return NextResponse.json({ ok: false, error: 'Completa todos los campos obligatorios.' }, { status: 400 });
    }

    if (nombre.length > MAX_NOMBRE || email.length > MAX_EMAIL || telefono.length > MAX_TELEFONO || tipo.length > MAX_TIPO || mensaje.length > MAX_MENSAJE) {
      return NextResponse.json({ ok: false, error: 'Uno o más campos exceden el límite permitido.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ ok: false, error: 'Correo electrónico inválido.' }, { status: 400 });
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
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: false, error: 'No se pudo enviar la solicitud.' }, { status: 500 });
  }
}

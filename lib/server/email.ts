const toEmail = process.env.VEDA_CONTACT_TO_EMAIL || 'vedamusicpr@gmail.com';
const fromEmail = process.env.VEDA_CONTACT_FROM_EMAIL || 'V.E.D.A. Music <onboarding@resend.dev>';

type SendVedaEmailParams = {
  to?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendVedaEmail({ to, subject, html, text, replyTo }: SendVedaEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('Falta configuración de correo en el servidor (RESEND_API_KEY).');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: to || toEmail,
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    throw new Error('No se pudo enviar el email con Resend.');
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

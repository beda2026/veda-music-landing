'use client';

import { FormEvent, useState } from 'react';

const requestTypes = [
  'Espacio publicitario',
  'Enviar música',
  'Entrevista / cobertura',
  'Alianza / sponsor',
  'Otro',
] as const;

export default function CommercialContactForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre.trim() || !email.trim() || !tipo.trim() || !mensaje.trim()) {
      setError('Por favor completa nombre, correo, tipo de solicitud y mensaje.');
      return;
    }

    const subject = `VEDA MUSIC - ${tipo}`;
    const body = [
      'Nueva solicitud desde V.E.D.A. MUSIC',
      '',
      `Nombre: ${nombre.trim()}`,
      `Correo electrónico: ${email.trim()}`,
      `Teléfono / WhatsApp: ${telefono.trim() || 'No indicado'}`,
      `Tipo de solicitud: ${tipo}`,
      '',
      'Mensaje:',
      mensaje.trim(),
    ].join('\n');

    setError('');

    // TODO: Replace mailto with POST /api/contact using Resend, SendGrid, or equivalent provider.
    window.location.href = `mailto:vedamusicpr@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} className="panel relative rounded-2xl p-5 sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_16%_20%,rgba(239,31,45,0.14),transparent_42%),radial-gradient(circle_at_85%_75%,rgba(245,178,27,0.12),transparent_40%)]" />
      <div className="relative grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-zinc-200">
          <span>Nombre *</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
        </label>

        <label className="space-y-2 text-sm text-zinc-200">
          <span>Correo electrónico *</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
        </label>

        <label className="space-y-2 text-sm text-zinc-200">
          <span>Teléfono / WhatsApp</span>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#f5b21b]" />
        </label>

        <label className="space-y-2 text-sm text-zinc-200">
          <span>Tipo de solicitud *</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#f5b21b]">
            <option value="">Selecciona una opción</option>
            {requestTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-zinc-200 md:col-span-2">
          <span>Mensaje *</span>
          <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={6} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-3 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
        </label>
      </div>

      {error ? <p className="relative mt-3 text-sm font-medium text-[#ef1f2d]">{error}</p> : null}

      <div className="relative mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-gold">Enviar solicitud</button>
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Respuesta por email en horario laboral.</p>
      </div>
    </form>
  );
}

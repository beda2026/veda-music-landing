'use client';

import { FormEvent, useEffect, useState } from 'react';

type InterestOption = 'Música / estrenos' | 'Entrevistas' | 'Eventos' | 'Promociones / regalos' | 'Publicidad / alianzas';

const interestOptions: InterestOption[] = [
  'Música / estrenos',
  'Entrevistas',
  'Eventos',
  'Promociones / regalos',
  'Publicidad / alianzas',
];

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // @vercel/analytics is not installed in this project yet.
    // TODO: When @vercel/analytics is installed, track "subscribe_form_view" here.
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailError('Ingresa tu correo electrónico.');
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      setEmailError('Ingresa un correo electrónico válido.');
      return;
    }

    setEmailError('');

    const timestamp = new Date().toISOString();
    const pageSource = typeof window !== 'undefined' ? window.location.href : 'Desconocido';

    const subject = 'Nuevo registro VEDA MUSIC';
    const body = [
      'Nuevo registro de comunidad V.E.D.A. MUSIC',
      '',
      `Correo electrónico: ${email.trim()}`,
      `Nombre: ${name.trim() || 'No compartido'}`,
      `Interés: ${interest || 'No especificado'}`,
      `Timestamp: ${timestamp}`,
      `Fuente (página): ${pageSource}`,
    ].join('\n');

    // @vercel/analytics is not installed in this project yet.
    // TODO: When @vercel/analytics is installed, track "subscribe_submit_click" and "subscribe_mailto_opened" before navigation.

    const mailto = `mailto:vedamusicpr@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <section className="panel relative overflow-hidden rounded-3xl border border-zinc-700/80 bg-[#101010]/95 p-6 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(239,31,45,0.22),transparent_46%),radial-gradient(circle_at_90%_85%,rgba(245,178,27,0.17),transparent_48%)]" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f5b21b]">COMUNIDAD V.E.D.A.</p>
          <h2 className="mt-3 text-3xl font-black text-zinc-50 sm:text-4xl">Únete al Movimiento</h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">Recibe avisos de entrevistas, estrenos, concursos, eventos, regalos y oportunidades para artistas y marcas.</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-700/80 bg-[#141414]/90 p-4 sm:p-5">
          {/* TODO: Upgrade this form to a real /api/subscribe route with database storage before public launch. */}
          <div className="space-y-3">
            <label className="block text-sm text-zinc-200">
              Correo electrónico
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-600 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#ef1f2d]"
                placeholder="tuemail@correo.com"
                required
              />
            </label>
            {emailError ? <p className="text-xs text-red-400">{emailError}</p> : null}

            <label className="block text-sm text-zinc-200">
              Nombre <span className="text-zinc-400">(opcional)</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-600 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#f5b21b]"
                placeholder="Tu nombre"
              />
            </label>

            <label className="block text-sm text-zinc-200">
              Me interesa <span className="text-zinc-400">(opcional)</span>
              <select
                name="interest"
                value={interest}
                onChange={(event) => setInterest(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-600 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#f5b21b]"
              >
                <option value="">Selecciona una opción</option>
                {interestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <p className="text-xs leading-relaxed text-zinc-400">Al registrarte aceptas recibir comunicaciones de V.E.D.A. MUSIC. Puedes solicitar removerte en cualquier momento.</p>

            <button type="submit" className="btn-red w-full justify-center">Registrarme</button>
          </div>
        </form>
      </div>
    </section>
  );
}

'use client';

import { FormEvent, useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), company: company.trim() }),
      });

      const data = await response.json();

      if (response.ok && data?.ok === true) {
        setStatus('success');
        setEmail('');
        setCompany('');
        return;
      }

      setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section aria-labelledby="comunidad-veda" className="panel rounded-2xl border border-zinc-700/70 bg-gradient-to-br from-[#0e0e0f] via-[#111113] to-[#1a1a1f] p-6 sm:p-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f5b21b]">Comunidad V.E.D.A.</p>
        <h2 id="comunidad-veda" className="text-3xl font-black leading-tight text-zinc-50 sm:text-4xl">Únete al Movimiento</h2>
        <p className="text-sm text-zinc-300 sm:text-base">Recibe estrenos, entrevistas y oportunidades para artistas directamente en tu correo.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="subscribe-email" className="sr-only">Correo electrónico</label>

          <input
            type="text"
            name="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />
          <input
            id="subscribe-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tuemail@ejemplo.com"
            className="h-12 w-full rounded-full border border-zinc-600 bg-black/40 backdrop-blur-md px-5 text-sm text-zinc-100 outline-none transition focus:border-[#f5b21b]"
          />
          <button type="submit" disabled={status === 'loading'} className="btn-gold h-12 w-full disabled:opacity-60 sm:w-auto sm:px-8">{status === 'loading' ? 'Enviando...' : 'Suscribirme'}</button>
        </form>

        {status === 'success' && (
          <p className="text-sm font-medium text-emerald-300">Gracias. Tu email fue enviado a la comunidad V.E.D.A.</p>
        )}

        {status === 'error' && (
          <p className="text-sm font-medium text-[#ef1f2d]">No se pudo completar la suscripción. Inténtalo nuevamente.</p>
        )}
      </div>
    </section>
  );
}

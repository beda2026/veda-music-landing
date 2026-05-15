'use client';

import { FormEvent, useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('success');
    setEmail('');
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
            id="subscribe-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tuemail@ejemplo.com"
            className="h-12 w-full rounded-full border border-zinc-600 bg-black/60 px-5 text-sm text-zinc-100 outline-none transition focus:border-[#f5b21b]"
          />
          <button type="submit" className="btn-gold h-12 w-full sm:w-auto sm:px-8">Suscribirme</button>
        </form>

        {status === 'success' && (
          <p className="text-sm font-medium text-emerald-300">¡Gracias por unirte a la comunidad V.E.D.A.!</p>
        )}
      </div>
    </section>
  );
}

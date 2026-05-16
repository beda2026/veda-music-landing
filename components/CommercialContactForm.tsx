'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

const requestTypes = [
  'Espacio publicitario',
  'Enviar música',
  'Entrevista / cobertura',
  'Alianza / sponsor',
  'Otro',
] as const;

const requestTypeBySlug: Record<string, (typeof requestTypes)[number]> = {
  'espacio-publicitario': 'Espacio publicitario',
  'enviar-musica': 'Enviar música',
  'entrevista-cobertura': 'Entrevista / cobertura',
};

export default function CommercialContactForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const [section, query] = window.location.hash.split('?');
    if (section !== '#contacto-comercial') return;

    if (query) {
      const params = new URLSearchParams(query);
      const tipoSlug = params.get('tipo');
      if (tipoSlug) {
        const selectedType = requestTypeBySlug[tipoSlug];
        if (selectedType) setTipo(selectedType);
      }
    }

    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onOpenCommercialContact = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('openCommercialContact', onOpenCommercialContact);
    return () => {
      window.removeEventListener('openCommercialContact', onOpenCommercialContact);
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    const onWindowScroll = () => {
      closeModal();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onWindowScroll);

    const triggerButton = triggerButtonRef.current;

    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onWindowScroll);
      triggerButton?.focus();
    };
  }, [isModalOpen]);

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
    closeModal();

    // TODO: Replace mailto with POST /api/contact using Resend, SendGrid, or equivalent provider.
    window.location.href = `mailto:vedamusicpr@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <div className="panel relative rounded-2xl border border-[#f5b21b]/30 bg-[#121212]/85 p-5 sm:p-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_18%,rgba(245,178,27,0.15),transparent_42%),radial-gradient(circle_at_82%_78%,rgba(239,31,45,0.1),transparent_40%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-zinc-100">Contacto Comercial</h3>
            <p className="mt-1 text-sm text-zinc-200">¿Quieres promocionar tu marca, evento o proyecto en V.E.D.A. Music?</p>
            <p className="mt-2 text-xs uppercase tracking-[0.1em] text-zinc-400">Envíanos tu solicitud y nuestro equipo la revisa por email.</p>
          </div>
          <button ref={triggerButtonRef} type="button" onClick={() => setIsModalOpen(true)} className="btn-gold shrink-0">Enviar solicitud</button>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm" onClick={closeModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contacto-comercial-title"
            className="panel relative w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-2xl border border-[#f5b21b]/30 bg-[#090909]/95 p-5 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Cerrar formulario"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full border border-zinc-600 px-2.5 py-1 text-zinc-300 transition hover:border-[#f5b21b] hover:text-zinc-100"
            >
              ✕
            </button>

            <h3 id="contacto-comercial-title" className="pr-10 text-2xl font-bold text-zinc-100">Contacto Comercial</h3>
            <p className="mt-1 text-sm text-zinc-300">Completa el formulario y te responderemos por email en horario laboral.</p>

            <form onSubmit={onSubmit} className="mt-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Nombre *</span>
                  <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
                </label>

                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Correo electrónico *</span>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
                </label>

                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Teléfono / WhatsApp</span>
                  <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#f5b21b]" />
                </label>

                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Tipo de solicitud *</span>
                  <select required value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#f5b21b]">
                    <option value="">Selecciona una opción</option>
                    {requestTypes.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-zinc-200 md:col-span-2">
                  <span>Mensaje *</span>
                  <textarea required value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4} className="w-full rounded-xl border border-zinc-700 bg-[#101010]/85 px-4 py-3 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
                </label>
              </div>

              {error ? <p className="mt-3 text-sm font-medium text-[#ef1f2d]">{error}</p> : null}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-gold">Enviar solicitud</button>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Respuesta por email en horario laboral.</p>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

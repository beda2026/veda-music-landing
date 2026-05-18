'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

const requestTypes = [
  'Espacio publicitario',
  'Enviar música',
  'Entrevista / cobertura',
  'Alianza / sponsor',
  'Otro',
] as const;

type OpenCommercialContactEventDetail = {
  selectedType?: (typeof requestTypes)[number];
};

const requestTypeBySlug: Record<string, (typeof requestTypes)[number]> = {
  'espacio-publicitario': 'Espacio publicitario',
  'enviar-musica': 'Enviar música',
  'entrevista-cobertura': 'Entrevista / cobertura',
};

const parseContactHash = (hashValue: string) => {
  const [section, query] = hashValue.split('?');
  if (section !== '#contacto-comercial') return null;

  const params = new URLSearchParams(query || '');
  const tipoSlug = params.get('tipo');
  const selectedType = tipoSlug ? requestTypeBySlug[tipoSlug] : undefined;

  return { selectedType };
};

export default function CommercialContactForm({ showTrigger = true }: { showTrigger?: boolean }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setError('');
    setSuccessMessage('');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const openFromHash = () => {
      const parsedHash = parseContactHash(window.location.hash);
      if (!parsedHash) return;

      if (parsedHash.selectedType) setTipo(parsedHash.selectedType);
      setIsModalOpen(true);
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onOpenCommercialContact = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<OpenCommercialContactEventDetail>;
      if (customEvent.detail?.selectedType) setTipo(customEvent.detail.selectedType);
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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre.trim() || !email.trim() || !tipo.trim() || !mensaje.trim()) {
      setError('Por favor completa nombre, correo, tipo de solicitud y mensaje.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          tipo: tipo.trim(),
          mensaje: mensaje.trim(),
          company: company.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data?.ok === true) {
        setNombre('');
        setEmail('');
        setTelefono('');
        setTipo('');
        setMensaje('');
        setCompany('');
        setSuccessMessage('Solicitud enviada. Te responderemos por email en horario laboral.');
      } else {
        setError('No se pudo enviar la solicitud. Inténtalo nuevamente.');
      }
    } catch {
      setError('No se pudo enviar la solicitud. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showTrigger ? (
        <div className="panel relative rounded-2xl border border-[#f5b21b]/30 bg-black/40 backdrop-blur-md p-5 sm:p-6">
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
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm" onClick={closeModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contacto-comercial-title"
            className="panel relative w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-2xl border border-[#f5b21b]/30 bg-black/45 backdrop-blur-lg p-5 sm:p-7"
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

              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Nombre *</span>
                  <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-black/35 backdrop-blur-md px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
                </label>

                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Correo electrónico *</span>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-black/35 backdrop-blur-md px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
                </label>

                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Teléfono / WhatsApp</span>
                  <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-black/35 backdrop-blur-md px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#f5b21b]" />
                </label>

                <label className="space-y-2 text-sm text-zinc-200">
                  <span>Tipo de solicitud *</span>
                  <select required value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-black/35 backdrop-blur-md px-4 py-2.5 text-zinc-100 outline-none transition focus:border-[#f5b21b]">
                    <option value="">Selecciona una opción</option>
                    {requestTypes.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-zinc-200 md:col-span-2">
                  <span>Mensaje *</span>
                  <textarea required value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4} className="w-full rounded-xl border border-zinc-700 bg-black/35 backdrop-blur-md px-4 py-3 text-zinc-100 outline-none transition focus:border-[#ef1f2d]" />
                </label>
              </div>

              {error ? <p className="mt-3 text-sm font-medium text-[#ef1f2d]">{error}</p> : null}
              {successMessage ? <p className="mt-3 text-sm font-medium text-emerald-300">{successMessage}</p> : null}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="submit" disabled={isSubmitting} className="btn-gold disabled:opacity-60">{isSubmitting ? 'Enviando...' : 'Enviar solicitud'}</button>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Respuesta por email en horario laboral.</p>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

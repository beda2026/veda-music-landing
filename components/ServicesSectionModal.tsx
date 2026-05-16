'use client';

import { useEffect, useRef, useState } from 'react';

type Service = { title: string; description: string };

export default function ServicesSectionModal({ services }: { services: Service[] }) {
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const servicesTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeServicesModal = () => setIsServicesModalOpen(false);

  const openCommercialContact = () => {
    closeServicesModal();
    window.dispatchEvent(new CustomEvent('openCommercialContact'));
    window.location.hash = 'contacto-comercial';
    document.getElementById('contacto-comercial')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!isServicesModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeServicesModal();
    };

    const onWindowScroll = () => closeServicesModal();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onWindowScroll);
    const triggerButton = servicesTriggerRef.current;

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onWindowScroll);
      triggerButton?.focus();
    };
  }, [isServicesModalOpen]);

  return (
    <>
      <section id="contacto" className="space-y-4">
        <div className="panel relative rounded-2xl border border-[#f5b21b]/25 bg-[#121212]/80 p-5 sm:p-6">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_18%_20%,rgba(245,178,27,0.14),transparent_45%),radial-gradient(circle_at_82%_72%,rgba(239,31,45,0.08),transparent_42%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="section-title">Nuestros Servicios</h2>
              <p className="mt-2 max-w-3xl text-sm text-zinc-300 sm:text-base">Promoción, entrevistas, cobertura, contenido digital y espacios publicitarios para artistas, marcas y eventos urbanos.</p>
            </div>
            <button ref={servicesTriggerRef} type="button" onClick={() => setIsServicesModalOpen(true)} className="btn-gold shrink-0">Ver servicios</button>
          </div>
        </div>
      </section>

      {isServicesModalOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm" onClick={closeServicesModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="servicios-modal-title" className="panel relative w-full max-w-[980px] max-h-[85vh] overflow-y-auto rounded-2xl border border-[#f5b21b]/30 bg-[#090909]/95 p-5 sm:p-7" onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-label="Cerrar servicios" onClick={closeServicesModal} className="absolute right-4 top-4 rounded-full border border-zinc-600 px-2.5 py-1 text-zinc-300 transition hover:border-[#f5b21b] hover:text-zinc-100">✕</button>
            <h2 id="servicios-modal-title" className="pr-10 text-2xl font-bold text-zinc-100">Nuestros Servicios</h2>
            <p className="mt-2 text-sm text-zinc-300 sm:text-base">Soluciones de visibilidad, contenido y conexión comercial para artistas, marcas y eventos.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="panel hover-card rounded-2xl p-4 service-card">
                  <h3 className="font-semibold text-zinc-100">{service.title === 'Banners / Ads' ? 'Banner / Ads' : service.title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{service.description}</p>
                </article>
              ))}
            </div>
            <div className="panel mt-6 rounded-2xl p-6">
              <h3 className="section-title">Sobre V.E.D.A. MUSIC</h3>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                <p>V.E.D.A. MUSIC es una plataforma digital enfocada en música, cultura urbana, entrevistas, estrenos y descubrimiento de talento. Nacemos para conectar artistas, creadores, marcas y público en un espacio visual, moderno y directo.</p>
                <p>Nuestro enfoque combina contenido editorial, promoción musical, espacios publicitarios y cobertura urbana para dar visibilidad a proyectos que forman parte del movimiento latino y caribeño.</p>
                <p>Más que una página de música, V.E.D.A. MUSIC funciona como un punto de encuentro para artistas emergentes, marcas locales, eventos, entrevistas y contenido que representa la calle, la cultura y la evolución del sonido urbano.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="panel hover-card rounded-2xl p-5"><h3 className="text-lg font-semibold text-zinc-100">Música &amp; Estrenos</h3><p className="mt-2 text-sm text-zinc-300">Espacio para destacar canciones, videos, playlists y nuevos lanzamientos.</p></article>
              <article className="panel hover-card rounded-2xl p-5"><h3 className="text-lg font-semibold text-zinc-100">Cultura Urbana</h3><p className="mt-2 text-sm text-zinc-300">Cobertura visual y editorial de movimientos, artistas, eventos y comunidades.</p></article>
              <article className="panel hover-card rounded-2xl p-5"><h3 className="text-lg font-semibold text-zinc-100">Publicidad &amp; Alianzas</h3><p className="mt-2 text-sm text-zinc-300">Opciones para marcas, negocios y proyectos que buscan visibilidad dentro del público urbano.</p></article>
            </div>
            <div className="panel mt-6 rounded-2xl p-5 text-center">
              <p className="mb-4 text-lg font-semibold text-zinc-100">¿Listo para llevar tu carrera al siguiente nivel?</p>
              <button type="button" onClick={openCommercialContact} className="btn-red">Contáctanos</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

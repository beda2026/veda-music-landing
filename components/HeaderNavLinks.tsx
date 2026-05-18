'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const navLinks = ['Noticias', 'Música', 'Videos', 'Artistas', 'Entrevistas', 'Nosotros', 'Contacto'] as const;

export default function HeaderNavLinks() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAboutOpen(false);
    };

    if (isAboutOpen) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [isAboutOpen]);

  return (
    <>
      <nav className="hide-scrollbar -mx-2 flex gap-3 overflow-x-auto px-2 text-sm font-medium text-zinc-200 lg:flex-wrap lg:overflow-visible">
        {navLinks.map((link) => {
          const hrefMap: Record<(typeof navLinks)[number], string> = {
            Noticias: '#noticias',
            Música: '#musica',
            Videos: '#videos',
            Artistas: '/artistas',
            Entrevistas: '#entrevistas',
            Nosotros: '#',
            Contacto: '#',
          };

          if (link === 'Nosotros') {
            return (
              <button
                key={link}
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className="whitespace-nowrap rounded-full border border-zinc-700 px-3 py-1.5 transition hover:border-[#8f2d37] hover:text-white"
              >
                {link}
              </button>
            );
          }

          if (link === 'Contacto') {
            return (
              <button
                key={link}
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('openCommercialContact'))}
                className="whitespace-nowrap rounded-full border border-zinc-700 px-3 py-1.5 transition hover:border-[#8f2d37] hover:text-white"
              >
                {link}
              </button>
            );
          }

          if (hrefMap[link].startsWith('/')) {
            return (
              <Link key={link} href={hrefMap[link]} className="whitespace-nowrap rounded-full border border-zinc-700 px-3 py-1.5 transition hover:border-[#8f2d37] hover:text-white">
                {link}
              </Link>
            );
          }

          return (
            <a key={link} href={hrefMap[link]} className="whitespace-nowrap rounded-full border border-zinc-700 px-3 py-1.5 transition hover:border-[#8f2d37] hover:text-white">
              {link}
            </a>
          );
        })}
      </nav>

      {isMounted && isAboutOpen && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" onClick={() => setIsAboutOpen(false)}>
          <div
            className="w-full max-w-[560px] rounded-2xl border border-[#c9a67a]/45 bg-zinc-950/95 p-5 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-veda-title"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 id="about-veda-title" className="text-xl font-bold text-[#f5d2a2]">Sobre V.E.D.A. MUSIC</h3>
              <button
                type="button"
                onClick={() => setIsAboutOpen(false)}
                aria-label="Cerrar modal"
                className="rounded-full border border-zinc-700 px-2.5 py-1 text-sm text-zinc-200 transition hover:border-[#f5b21b] hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-sm leading-relaxed text-zinc-200">
              V.E.D.A. MUSIC es una editorial digital de entretenimiento urbano enfocada en música, entrevistas, estrenos, cultura y proyectos independientes. Creamos un espacio visual y directo para destacar artistas, marcas, eventos y contenido que conecta la música y la comunidad.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>- Editorial urbana y entretenimiento digital.</li>
              <li>- Entrevistas, videos, música nueva y cobertura.</li>
              <li>- Espacio para artistas, marcas y auspiciadores.</li>
              <li>- Plataforma independiente con enfoque en Puerto Rico y la cultura urbana.</li>
            </ul>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAboutOpen(false)}
                className="rounded-full border border-[#c9a67a]/70 bg-[#c9a67a]/10 px-4 py-2 text-sm font-medium text-[#f5d2a2] transition hover:bg-[#c9a67a]/20"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

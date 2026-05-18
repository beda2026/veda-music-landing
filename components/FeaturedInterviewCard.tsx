'use client';

import { useEffect, useMemo, useState } from 'react';

type FeaturedInterview = {
  title: string;
  description: string;
  youtubeUrl: string;
};

const featuredInterview: FeaturedInterview = {
  title: 'Duran The Coach en Dímelo Kombete',
  description: 'La nueva entrevista de Dímelo Kombete con Duran The Coach ya está disponible.',
  youtubeUrl: 'https://www.youtube.com/watch?v=0BgXZz-TXy4',
};

export default function FeaturedInterviewCard() {
  const [activeInterview, setActiveInterview] = useState<FeaturedInterview | null>(null);

  const activeInterviewVideoId = useMemo(() => {
    if (!activeInterview) return null;
    const urlValue = activeInterview.youtubeUrl;
    if (!urlValue) return null;
    if (!urlValue.includes('http')) return urlValue;

    try {
      const parsedUrl = new URL(urlValue);
      if (parsedUrl.hostname.includes('youtu.be')) return parsedUrl.pathname.replace('/', '') || null;
      if (parsedUrl.hostname.includes('youtube.com')) {
        const queryVideoId = parsedUrl.searchParams.get('v');
        if (queryVideoId) return queryVideoId;
        const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
        return pathSegments[pathSegments.length - 1] || null;
      }
    } catch {
      return null;
    }

    return null;
  }, [activeInterview]);

  useEffect(() => {
    if (!activeInterview) return;

    const handleEscapeClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveInterview(null);
    };

    window.addEventListener('keydown', handleEscapeClose);
    return () => window.removeEventListener('keydown', handleEscapeClose);
  }, [activeInterview]);

  return (
    <>
      <article className="panel hover-card featured-card rounded-3xl p-4 lg:col-span-1 lg:max-h-[300px] lg:p-5">
        <span className="inline-block rounded-full border border-[#f5b21b] bg-[#f5b21b1a] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f5b21b]">ENTREVISTA · ESTRENO</span>
        <div className="featured-visual my-3 relative flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700 lg:h-28">
          <img
            src="/assets/dimelo-kombete-ad-336x280.png"
            alt="Dímelo Kombete entrevista con Duran The Coach"
            className="h-full w-full object-cover"
          />
          <span className="featured-play">▶</span>
        </div>
        <h2 className="text-xl font-bold leading-snug text-zinc-100">{featuredInterview.title}</h2>
        <p className="mt-1.5 text-sm text-zinc-300">{featuredInterview.description}</p>
        <button
          type="button"
          onClick={() => setActiveInterview(featuredInterview)}
          className="mt-3 inline-block rounded-full border border-zinc-600 px-3.5 py-1.5 text-sm font-semibold text-zinc-200 transition hover:border-[#ef1f2d]"
        >
          Ver entrevista
        </button>
      </article>

      {activeInterview && activeInterviewVideoId ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(0,0,0,0.82)] p-4 backdrop-blur-md"
          onClick={() => setActiveInterview(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-4xl rounded-2xl border border-[#d8ba7f]/60 bg-[#111111]/95 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-zinc-100 sm:text-lg">{activeInterview.title}</h3>
              <button
                type="button"
                className="rounded-full border border-zinc-500 px-3 py-1 text-sm text-zinc-100 transition hover:border-[#d8ba7f] hover:text-[#f2d7a2]"
                onClick={() => setActiveInterview(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl bg-black pt-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${activeInterviewVideoId}?autoplay=1`}
                title="Entrevista VEDA Music"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

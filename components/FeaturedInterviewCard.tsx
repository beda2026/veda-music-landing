'use client';

import { useMemo, useState } from 'react';
import EmbeddedVideoModal from '@/components/EmbeddedVideoModal';
import { extractYoutubeVideoId } from '@/lib/youtube';

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
    return extractYoutubeVideoId(activeInterview.youtubeUrl);
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
        <EmbeddedVideoModal
          isOpen={Boolean(activeInterview)}
          title={activeInterview.title}
          description={activeInterview.description}
          youtubeVideoId={activeInterviewVideoId}
          onClose={() => setActiveInterview(null)}
        />
      ) : null}
    </>
  );
}

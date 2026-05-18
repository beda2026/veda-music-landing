'use client';

import { useMemo, useState } from 'react';
import VideoThumbnail from '@/components/VideoThumbnail';
import EmbeddedVideoModal from '@/components/EmbeddedVideoModal';
import { videos } from '@/lib/veda-data';
import { extractYoutubeVideoId } from '@/lib/youtube';

type LatestVideo = {
  title: string;
  meta: string;
  category: string;
  thumbnail: string;
  fallbackThumbnail?: string;
  description?: string;
  youtubeVideoId: string;
};

const latestVideos: LatestVideo[] = videos
  .map((video) => {
    const youtubeVideoId = extractYoutubeVideoId(video.href ?? '');
    if (!youtubeVideoId) return null;

    return {
      title: video.title,
      meta: video.meta,
      category: video.category,
      thumbnail: video.thumbnail,
      fallbackThumbnail: video.fallbackThumbnail,
      description: `${video.category} · ${video.meta}`,
      youtubeVideoId,
    };
  })
  .filter((video): video is LatestVideo => Boolean(video));

export default function LatestVideosSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const activeVideo = useMemo(
    () => latestVideos.find((video) => video.youtubeVideoId === activeVideoId) ?? null,
    [activeVideoId],
  );

  return (
    <section id="videos" className="space-y-4">
      <h2 className="section-title">Últimos videos</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {latestVideos.map((video) => (
          <article key={video.youtubeVideoId} className="panel hover-card rounded-2xl p-4 media-card">
            <button
              type="button"
              onClick={() => setActiveVideoId(video.youtubeVideoId)}
              className="block w-full text-left"
              aria-label={`Abrir video ${video.title}`}
            >
              <VideoThumbnail title={video.title} thumbnail={video.thumbnail} fallbackThumbnail={video.fallbackThumbnail} />
              <h3 className="mt-3 font-semibold text-zinc-100">{video.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{video.category}</p>
              <p className="mt-1 text-sm text-zinc-300">{video.meta}</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveVideoId(video.youtubeVideoId)}
              className="mt-3 inline-block rounded-full border border-zinc-600 px-3.5 py-1.5 text-sm font-semibold text-zinc-200 transition hover:border-[#ef1f2d]"
            >
              Ver aquí
            </button>
          </article>
        ))}
      </div>

      {activeVideo ? (
        <EmbeddedVideoModal
          isOpen={Boolean(activeVideo)}
          title={activeVideo.title}
          description={activeVideo.description}
          youtubeVideoId={activeVideo.youtubeVideoId}
          onClose={() => setActiveVideoId(null)}
        />
      ) : null}
    </section>
  );
}

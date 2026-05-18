import VideoThumbnail from '@/components/VideoThumbnail';
import { videos } from '@/lib/veda-data';

export type LatestVideo = {
  title: string;
  meta: string;
  category: string;
  href?: string;
  thumbnail: string;
  fallbackThumbnail: string;
  youtubeVideoId: string;
};

function getYoutubeVideoId(href?: string): string | null {
  if (!href) return null;

  try {
    const parsed = new URL(href);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const fromQuery = parsed.searchParams.get('v');
      if (fromQuery) return fromQuery;

      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      return pathSegments[pathSegments.length - 1] || null;
    }
  } catch {
    return null;
  }

  return null;
}

export default function LatestVideosSection() {
  const latestVideos = videos.reduce<LatestVideo[]>((acc, video) => {
    const youtubeVideoId = getYoutubeVideoId(video.href);
    if (!youtubeVideoId) return acc;

    acc.push({
      title: video.title,
      meta: video.meta,
      category: video.category,
      href: video.href,
      thumbnail: video.thumbnail,
      fallbackThumbnail: video.fallbackThumbnail,
      youtubeVideoId,
    });

    return acc;
  }, []);

  return (
    <section id="videos" className="space-y-4">
      <h2 className="section-title">Últimos Videos</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {latestVideos.map((video) => (
          <a key={video.title} href={video.href} target="_blank" rel="noreferrer" className="block">
            <article className="panel hover-card rounded-2xl p-4 media-card">
              <VideoThumbnail title={video.title} thumbnail={video.thumbnail} fallbackThumbnail={video.fallbackThumbnail} />
              <h3 className="font-semibold text-zinc-100">{video.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{video.category}</p>
              <p className="mt-1 text-sm text-zinc-300">{video.meta}</p>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}

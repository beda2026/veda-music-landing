'use client';

import { useState } from 'react';

type VideoThumbnailProps = {
  title: string;
  thumbnail?: string;
  fallbackThumbnail?: string;
};

export default function VideoThumbnail({ title, thumbnail, fallbackThumbnail }: VideoThumbnailProps) {
  const [source, setSource] = useState<string | null>(thumbnail ?? fallbackThumbnail ?? null);
  const [attemptedFallback, setAttemptedFallback] = useState(false);
  const [showFallback, setShowFallback] = useState(!thumbnail && !fallbackThumbnail);

  const onError = () => {
    if (!attemptedFallback && fallbackThumbnail && source !== fallbackThumbnail) {
      setSource(fallbackThumbnail);
      setAttemptedFallback(true);
      return;
    }

    setSource(null);
    setShowFallback(true);
  };

  return (
    <div className="video-thumb mb-3 relative flex h-40 overflow-hidden rounded-xl border border-zinc-700" data-has-image={Boolean(source) && !showFallback}>
      {!showFallback && source ? (
        <img src={source} alt={title} className="h-full w-full object-cover" onError={onError} loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4">
          <span className="media-initial">{title.charAt(0)}</span>
        </div>
      )}
      <span className="video-play">▶</span>
      <span className="media-badge">VIDEO</span>
    </div>
  );
}

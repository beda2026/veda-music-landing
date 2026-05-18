'use client';

import { useEffect } from 'react';

type EmbeddedVideoModalProps = {
  isOpen: boolean;
  title: string;
  youtubeVideoId: string;
  description?: string;
  onClose: () => void;
};

export default function EmbeddedVideoModal({ isOpen, title, youtubeVideoId, description, onClose }: EmbeddedVideoModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscapeClose);
    return () => window.removeEventListener('keydown', handleEscapeClose);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(0,0,0,0.82)] p-4 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-4xl rounded-2xl border border-[#d8ba7f]/60 bg-[#111111]/95 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-100 sm:text-lg">{title}</h3>
            {description ? <p className="mt-1 text-sm text-zinc-300">{description}</p> : null}
          </div>
          <button
            type="button"
            className="rounded-full border border-zinc-500 px-3 py-1 text-sm text-zinc-100 transition hover:border-[#d8ba7f] hover:text-[#f2d7a2]"
            onClick={onClose}
            aria-label="Cerrar video"
          >
            ✕
          </button>
        </div>
        <div className="relative w-full overflow-hidden rounded-xl bg-black pt-[56.25%]">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

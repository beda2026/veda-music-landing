"use client";

import { useState } from 'react';
import { vedaStations } from '@/lib/veda-player';

const SPOTIFY_EMBED_URL =
  'https://open.spotify.com/embed/playlist/5EOsQIRYI2Ily29tygRg7T?utm_source=generator&theme=0';
const YOUTUBE_PLAYLIST_ID = "PL2Gc984KWtBqx0UsuUezfm9-Oz0xUQ1ry";
const YOUTUBE_VIDEO_ID = "iY-7SWY_iMQ";

type PlayerSource = 'radio' | 'youtube';

const YOUTUBE_EMBED_URL = YOUTUBE_VIDEO_ID
  ? `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?list=${YOUTUBE_PLAYLIST_ID}`
  : `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}`;

export default function VedaMusicPlayer() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<PlayerSource>('radio');

  const togglePlayerEmbed = () => {
    setIsPlayerOpen((prev) => !prev);
  };

  return (
    <section aria-label="VEDA Music Player" className="px-1">
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-yellow-500/20 bg-black/45 p-5 shadow-[0_0_35px_rgba(255,40,80,.14),0_0_40px_rgba(255,190,60,.12)] backdrop-blur-lg md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(244,63,94,.16),transparent_36%),radial-gradient(circle_at_88%_16%,rgba(245,158,11,.13),transparent_40%),linear-gradient(145deg,rgba(8,8,8,.76),rgba(17,17,17,.78))]" />

        <div className="relative grid items-center gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:gap-6">
          <div className="mx-auto">
            <div className="h-32 w-32 rounded-full border border-zinc-700 bg-[radial-gradient(circle_at_48%_45%,#2d2d2d,#090909_66%)] p-2.5 shadow-[inset_0_8px_20px_rgba(255,255,255,.06),inset_0_-10px_20px_rgba(0,0,0,.6),0_0_24px_rgba(239,68,68,.16)] md:h-36 md:w-36">
              <div className="flex h-full w-full items-center justify-center rounded-full border border-yellow-500/35 bg-[conic-gradient(from_0deg,rgba(245,158,11,.55),rgba(244,63,94,.43),rgba(245,158,11,.55))] p-3">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle,#0f0f0f_25%,#1e1e1e_62%,#080808_100%)] text-center">
                  <span className="text-sm font-black tracking-[0.22em] text-yellow-100">VEDA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
              <p className="text-lg font-bold text-white md:text-xl">V.E.D.A. Music Radio</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <button
                type="button"
                onClick={togglePlayerEmbed}
                className="inline-flex h-10 items-center justify-center rounded-full border border-yellow-500/60 bg-yellow-500/10 px-4 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/20 md:h-11 md:text-sm"
              >
                {isPlayerOpen ? 'Cerrar' : 'Escuchar aquí'}
              </button>

              <div className="inline-flex rounded-full border border-yellow-500/30 bg-black/55 p-1">
                <button
                  type="button"
                  onClick={() => setActiveSource('radio')}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition md:text-xs ${
                    activeSource === 'radio'
                      ? 'bg-yellow-500/20 text-yellow-100'
                      : 'text-zinc-300 hover:text-yellow-100'
                  }`}
                  aria-pressed={activeSource === 'radio'}
                >
                  Radio
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSource('youtube')}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition md:text-xs ${
                    activeSource === 'youtube'
                      ? 'bg-yellow-500/20 text-yellow-100'
                      : 'text-zinc-300 hover:text-yellow-100'
                  }`}
                  aria-pressed={activeSource === 'youtube'}
                >
                  YouTube
                </button>
              </div>
            </div>

            {isPlayerOpen ? (
              <div className="max-w-full overflow-hidden rounded-2xl border border-yellow-400/25 bg-gradient-to-br from-zinc-950/95 via-zinc-900/90 to-black/95 p-1 shadow-[0_0_20px_rgba(245,158,11,.16)] backdrop-blur-md">
                {activeSource === 'radio' ? (
                  <iframe
                    title="Radio embedded player"
                    src={SPOTIFY_EMBED_URL}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full rounded-2xl border-0 bg-black"
                  />
                ) : (
                  <iframe
                    title="VEDA Music YouTube player"
                    src={YOUTUBE_EMBED_URL}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    loading="lazy"
                    className="w-full rounded-2xl border-0 bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Conservamos la data de plataformas para uso futuro, sin render visible por ahora. */}
        <span className="sr-only">{vedaStations.length} estaciones cargadas para futuras versiones.</span>
        <span className="sr-only">Plataformas preparadas: Radio, Apple Music, YouTube y SoundCloud.</span>
      </div>
    </section>
  );
}

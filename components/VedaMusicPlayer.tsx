"use client";

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import type { VedaStation } from '@/lib/veda-player';
import { vedaStations } from '@/lib/veda-player';

const STORAGE_VOLUME_KEY = 'veda-player-volume';

const hasPlayableStream = (station: VedaStation) => Boolean(station.streamUrl.trim());

export default function VedaMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const platformModalRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const activeStation = vedaStations[activeIndex];
  const isComingSoon = !hasPlayableStream(activeStation);
  const [activePlatformId, setActivePlatformId] = useState<string | null>(null);

  const platformPlayers = [
    {
      id: 'spotify',
      label: 'Spotify',
      title: 'Spotify',
      description: 'Escucha playlists y música relacionada sin salir de V.E.D.A. Music.',
      embedUrl: 'https://open.spotify.com/embed/playlist/5EOsQIRYI2Ily29tygRg7T?utm_source=generator',
      externalUrl: 'https://open.spotify.com/playlist/5EOsQIRYI2Ily29tygRg7T',
      iframeTitle: 'Spotify embedded player',
      type: 'spotify',
    },
    {
      id: 'apple-music',
      label: 'Apple Music',
      title: 'Apple Music',
      description: 'Explora música y playlists desde Apple Music dentro de V.E.D.A.',
      embedUrl: 'https://embed.music.apple.com/us/playlist/energy/pl.u-9N9LXtdN5dB',
      externalUrl: 'https://music.apple.com/us/search?term=VEDA%20Music',
      iframeTitle: 'Apple Music embedded player',
      type: 'apple',
    },
    {
      id: 'youtube-music',
      label: 'YouTube Music',
      title: 'YouTube Music',
      description: 'Reproduce videos, canciones o playlists relacionados desde YouTube dentro de V.E.D.A.',
      embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLFgquLnL59amEA43CkLM1dVf8Wb28AY7i',
      externalUrl: 'https://music.youtube.com/search?q=VEDA%20Music',
      iframeTitle: 'YouTube embedded player',
      type: 'youtube',
    },
    {
      id: 'soundcloud',
      label: 'SoundCloud',
      title: 'SoundCloud',
      description: 'Escucha contenido y playlists desde SoundCloud sin salir de la landing.',
      embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/majesticcasual/majestic-casual-weekly-vibes-38&color=%23ff5500&inverse=false&auto_play=false&show_user=true',
      externalUrl: 'https://soundcloud.com/search?q=VEDA%20Music',
      iframeTitle: 'SoundCloud embedded player',
      type: 'soundcloud',
    },
  ];
  const activePlatform = platformPlayers.find((platform) => platform.id === activePlatformId) ?? null;

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_VOLUME_KEY);
    if (!saved) return;
    const parsed = Number(saved);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      setVolume(parsed);
      if (audioRef.current) audioRef.current.volume = parsed;
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    window.localStorage.setItem(STORAGE_VOLUME_KEY, String(volume));
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!activePlatform) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePlatformId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activePlatform]);

  const handleTogglePlay = async () => {
    if (!audioRef.current || isComingSoon) return;
    setError('');

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      if (audioRef.current.src !== activeStation.streamUrl) {
        audioRef.current.src = activeStation.streamUrl;
      }
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setError('No pudimos conectar esta señal ahora mismo. Intenta otra estación.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayForStation = async (streamUrl: string) => {
    if (!audioRef.current) return;
    try {
      setIsLoading(true);
      audioRef.current.src = streamUrl;
      await audioRef.current.play();
      setIsPlaying(true);
      setError('');
    } catch {
      setError('No pudimos conectar esta señal ahora mismo. Intenta otra estación.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStation = (nextIndex: number) => {
    if (!audioRef.current) return;
    const wasPlaying = isPlaying;
    audioRef.current.pause();
    setIsPlaying(false);
    setIsLoading(false);
    setError('');
    setActiveIndex(nextIndex);

    const nextStation = vedaStations[nextIndex];
    if (wasPlaying && hasPlayableStream(nextStation)) {
      setTimeout(() => {
        void handlePlayForStation(nextStation.streamUrl);
      }, 0);
    }
  };

  const closePlatformModal = () => setActivePlatformId(null);

  const handlePlatformOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === platformModalRef.current) {
      closePlatformModal();
    }
  };

  return (
    <section aria-label="VEDA Music Player" className="px-1">
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-yellow-500/20 bg-black/45 p-5 shadow-[0_0_35px_rgba(255,40,80,.14),0_0_40px_rgba(255,190,60,.12)] backdrop-blur-lg md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(244,63,94,.16),transparent_36%),radial-gradient(circle_at_88%_16%,rgba(245,158,11,.13),transparent_40%),linear-gradient(145deg,rgba(8,8,8,.76),rgba(17,17,17,.78))]" />

        <div className="relative grid items-center gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-6">
          <div className="mx-auto">
            <div className="h-32 w-32 rounded-full border border-zinc-700 bg-[radial-gradient(circle_at_48%_45%,#2d2d2d,#090909_66%)] p-2.5 shadow-[inset_0_8px_20px_rgba(255,255,255,.06),inset_0_-10px_20px_rgba(0,0,0,.6),0_0_24px_rgba(239,68,68,.16)] md:h-36 md:w-36">
              <div className={`flex h-full w-full items-center justify-center rounded-full border border-yellow-500/35 bg-[conic-gradient(from_0deg,rgba(245,158,11,.55),rgba(244,63,94,.43),rgba(245,158,11,.55))] p-3 ${isPlaying ? 'animate-[spin_16s_linear_infinite]' : ''}`}>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle,#0f0f0f_25%,#1e1e1e_62%,#080808_100%)] text-center">
                  <span className="text-sm font-black tracking-[0.22em] text-yellow-100">VEDA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400">NOW PLAYING</p>
              <p className="mt-1 text-lg font-bold text-white md:text-xl">{activeStation.name}</p>
              <p className="text-xs text-zinc-300 md:text-sm">{activeStation.tagline}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {vedaStations.map((station, idx) => {
                const selected = idx === activeIndex;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => selectStation(idx)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition md:text-sm ${selected ? 'border-yellow-400/75 bg-yellow-500/12 text-yellow-100 shadow-[0_0_16px_rgba(245,158,11,.24)]' : 'border-white/20 bg-black/45 text-zinc-300 hover:border-zinc-500'}`}
                  >
                    {station.name}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {hasPlayableStream(activeStation) ? (
                <button type="button" aria-label={isPlaying ? 'Pausar estación' : 'Reproducir estación'} disabled={isLoading} onClick={() => void handleTogglePlay()} className="inline-flex h-10 min-w-11 items-center justify-center rounded-full bg-rose-600 px-5 text-xs font-bold text-white shadow-[0_0_20px_rgba(244,63,94,.42)] transition hover:bg-rose-500 disabled:opacity-40 md:h-11 md:text-sm">{isLoading ? 'Conectando…' : isPlaying ? 'Pause' : 'Play'}</button>
              ) : activeStation.externalUrl ? (
                <a href={activeStation.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-full border border-yellow-500/60 bg-yellow-500/10 px-4 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/20 md:h-11 md:text-sm">Escuchar oficial</a>
              ) : null}
              <button type="button" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'} onClick={() => setIsMuted((prev) => !prev)} className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-600 px-2.5 text-[11px] text-zinc-100 md:h-10 md:px-3 md:text-xs">{isMuted ? 'Unmute' : 'Mute'}</button>
              <label className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-2 py-1 text-[11px] text-zinc-300 md:text-xs">Vol
                <input className="w-16 accent-yellow-500 md:w-20" aria-label="Control de volumen" type="range" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
              </label>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Plataformas</p>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {platformPlayers.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setActivePlatformId(platform.id)}
                    className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur-md transition hover:border-yellow-400/40 hover:text-yellow-200"
                  >
                    {platform.label}
                  </button>
                ))}
              </div>
            </div>
            {error ? <p className="text-center text-xs text-rose-300 md:text-left">{error}</p> : null}
          </div>
        </div>

        <audio ref={audioRef} preload="none" onWaiting={() => setIsLoading(true)} onPlaying={() => { setIsPlaying(true); setIsLoading(false); }} onPause={() => setIsPlaying(false)} onError={() => { setError('No pudimos conectar esta señal ahora mismo. Intenta otra estación.'); setIsLoading(false); setIsPlaying(false); }} />
      </div>

      {activePlatform ? (
        <div
          ref={platformModalRef}
          role="dialog"
          aria-modal="true"
          aria-label={activePlatform.title}
          onClick={handlePlatformOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
        >
          <div className="w-[92vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-yellow-500/15 bg-black/45 p-5 shadow-[0_0_35px_rgba(255,40,80,.14),0_0_40px_rgba(255,190,60,.12)] backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white md:text-xl">{activePlatform.title}</h3>
                <p className="mt-1 text-sm text-zinc-300">{activePlatform.description}</p>
              </div>
              <button type="button" onClick={closePlatformModal} aria-label="Cerrar modal" className="rounded-full border border-white/20 px-2.5 py-1 text-sm text-zinc-200 transition hover:border-yellow-400/45 hover:text-yellow-200">✕</button>
            </div>

            {activePlatform.type === 'spotify' ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <iframe
                  title={activePlatform.iframeTitle}
                  src={activePlatform.embedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full rounded-2xl border border-white/10 bg-black/40"
                />
              </div>
            ) : activePlatform.embedUrl ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <iframe
                  title={activePlatform.iframeTitle}
                  src={activePlatform.embedUrl}
                  className={`w-full rounded-2xl border border-white/10 bg-black/40 ${activePlatform.type === 'youtube' ? 'aspect-video h-auto' : ''}`}
                  height={activePlatform.type === 'apple' ? 450 : activePlatform.type === 'soundcloud' ? 300 : undefined}
                  allow={
                    activePlatform.type === 'apple'
                      ? 'encrypted-media *; fullscreen *; clipboard-write *;'
                      : activePlatform.type === 'soundcloud'
                        ? 'autoplay'
                        : 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                  }
                  allowFullScreen={activePlatform.type === 'youtube'}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
                Falta conectar el enlace embed oficial de esta plataforma.
              </div>
            )}

            <div className="mt-4">
              <a href={activePlatform.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-yellow-500/60 bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/20 md:text-sm">{activePlatform.type === 'spotify' ? 'Abrir en Spotify' : activePlatform.embedUrl ? 'Abrir en plataforma' : 'Abrir búsqueda'}</a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

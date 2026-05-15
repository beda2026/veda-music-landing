"use client";

import { useEffect, useRef, useState } from 'react';
import type { VedaStation } from '@/lib/veda-player';
import { vedaPlatformSources, vedaStations } from '@/lib/veda-player';

const STORAGE_VOLUME_KEY = 'veda-player-volume';

const hasPlayableStream = (station: VedaStation) => Boolean(station.streamUrl.trim());

export default function VedaMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePlatformId, setActivePlatformId] = useState('en-vivo');

  const activePlatform =
    vedaPlatformSources.find((platform) => platform.id === activePlatformId) ?? vedaPlatformSources[0];
  const usingLivePlatform = activePlatform.id === 'en-vivo';
  const activeStation = vedaStations[activeIndex];
  const isComingSoon = !hasPlayableStream(activeStation);
  const isLive = !isComingSoon && activeStation.status === 'live';

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

  const goPrev = () => selectStation((activeIndex - 1 + vedaStations.length) % vedaStations.length);
  const goNext = () => selectStation((activeIndex + 1) % vedaStations.length);

  const statusLabel = isLoading ? 'Conectando…' : isLive ? 'LIVE' : 'Próximamente';

  return (
    <section className="space-y-4 pb-24 md:pb-8" aria-label="VEDA Music Player">
      <div className="rounded-3xl border border-[#3a3326] bg-[linear-gradient(135deg,rgba(12,12,12,.95),rgba(22,22,22,.9))] p-5 shadow-[0_10px_40px_rgba(0,0,0,.45),inset_0_0_0_1px_rgba(245,178,27,.09)] md:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-[#f0d3a0]">VEDA Music Player</p>
        <h2 className="mt-2 text-2xl font-extrabold text-zinc-100 md:text-3xl">Música, estrenos y movimiento urbano en vivo.</h2>

        <div role="tablist" aria-label="Plataformas oficiales de VEDA Music Player" className="mt-5 flex flex-wrap gap-2">
          {vedaPlatformSources.map((platform) => {
            const selected = platform.id === activePlatform.id;
            return (
              <button
                key={platform.id}
                id={`veda-platform-tab-${platform.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`veda-platform-panel-${platform.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActivePlatformId(platform.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  selected
                    ? 'border-[#f5b21b] bg-[#2a2111] text-[#f5d186]'
                    : 'border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {platform.id === 'spotify' ? 'Spotify' : platform.title}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {usingLivePlatform ? (
            <div
              id={`veda-platform-panel-${activePlatform.id}`}
              role="tabpanel"
              aria-labelledby={`veda-platform-tab-${activePlatform.id}`}
              className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            >

          <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-4 md:p-5">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-700 shadow-[0_8px_25px_rgba(0,0,0,.45),inset_0_0_0_1px_rgba(245,178,27,.08)] bg-[radial-gradient(circle_at_25%_20%,rgba(239,31,45,.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(245,178,27,.3),transparent_50%),linear-gradient(145deg,#131313,#1f1f1f)] md:h-28 md:w-28">
                {activeStation.artwork ? (
                  <img
                    src={activeStation.artwork}
                    alt={`Artwork de ${activeStation.name}`}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <span className="absolute bottom-1 right-1 rounded-full border border-zinc-600 bg-black/60 px-2 py-0.5 text-[10px] uppercase text-zinc-200">V</span>
              </div>
              <div className="min-w-0 space-y-1.5 pt-0.5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Now Playing</p>
                <h3 className="text-xl font-bold leading-tight text-zinc-100 md:text-2xl">{activeStation.name}</h3>
                <p className="text-sm leading-snug text-zinc-300">{activeStation.tagline}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-[#f0d3a0]">{activeStation.genre}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="veda-bar"
                  style={{
                    height: `${10 + (i % 5) * 5}px`,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                    opacity: isPlaying ? 1 : 0.4,
                  }}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-zinc-600 px-2 py-1 text-zinc-200">Estado: {statusLabel}</span>
              {isComingSoon && <span className="text-zinc-300">Señal en preparación.</span>}
              {error && <span className="text-[#ff9898]">{error}</span>}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button type="button" aria-label="Estación anterior" onClick={goPrev} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600 text-xs text-zinc-100 transition hover:border-[#f5b21b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b21b]/70">◀</button>
              <button type="button" aria-label={isPlaying ? 'Pausar estación' : 'Reproducir estación'} disabled={isComingSoon || isLoading} onClick={() => void handleTogglePlay()} className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-[#ef1f2d] px-4 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(239,31,45,.35)] transition hover:bg-[#ff3342] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b76]/70 disabled:cursor-not-allowed disabled:opacity-40">
                {isLoading ? 'Conectando…' : isPlaying ? 'Pause' : 'Play'}
              </button>
              <button type="button" aria-label="Siguiente estación" onClick={goNext} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600 text-xs text-zinc-100 transition hover:border-[#f5b21b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b21b]/70">▶</button>
              <button type="button" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'} onClick={() => setIsMuted((prev) => !prev)} className="inline-flex h-8 items-center justify-center rounded-full border border-zinc-600 px-2.5 text-[11px] text-zinc-100 transition hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/70">{isMuted ? 'Unmute' : 'Mute'}</button>
              <label className="ml-0.5 flex items-center gap-2 rounded-full border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300">
                Vol
                <input className="w-20 accent-[#f5b21b] md:w-24" aria-label="Control de volumen" type="range" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
              </label>
            </div>
          </div>

          <div className="grid gap-2">
            {vedaStations.map((station, idx) => {
              const stationComingSoon = !hasPlayableStream(station);
              const selected = idx === activeIndex;
              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => selectStation(idx)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${selected ? 'border-[#f5b21b] bg-[#1d1911]' : 'border-zinc-700 bg-zinc-900/70 hover:border-zinc-500'}`}
                  aria-label={`Seleccionar estación ${station.name}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-zinc-100">{station.name}</span>
                    <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-zinc-300">{stationComingSoon ? 'Próximamente' : station.status === 'live' ? 'LIVE' : 'Ready'}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{station.tagline}</p>
                </button>
              );
            })}
          </div>
            </div>
          ) : activePlatform.id === 'spotify' && activePlatform.status === 'live' ? (
            <div
              id={`veda-platform-panel-${activePlatform.id}`}
              role="tabpanel"
              aria-labelledby={`veda-platform-tab-${activePlatform.id}`}
              className="space-y-4 rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-4 md:p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#f0d3a0]">Spotify · Playlist externa</p>
              <h3 className="text-xl font-semibold text-zinc-100">{activePlatform.title}</h3>
              <p className="text-sm text-zinc-300">{activePlatform.tagline}</p>
              <iframe
                src={activePlatform.embedUrl}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={activePlatform.title}
                className="rounded-xl border border-zinc-800"
              />
              <a
                href={activePlatform.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-[#1db954] bg-[#1db954]/10 px-4 py-2 text-sm font-semibold text-[#66ffa5] transition hover:bg-[#1db954]/20"
              >
                {activePlatform.ctaLabel ?? 'Escuchar en Spotify'}
              </a>
            </div>
          ) : (
            <div
              id={`veda-platform-panel-${activePlatform.id}`}
              role="tabpanel"
              aria-labelledby={`veda-platform-tab-${activePlatform.id}`}
              className="rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-6 text-center"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#f0d3a0]">{activePlatform.title}</p>
              <p className="mt-3 text-lg font-semibold text-zinc-100">Próximamente</p>
              <p className="mt-2 text-sm text-zinc-400">
                {activePlatform.tagline || 'Este contenedor oficial de VEDA Music Player estará disponible pronto.'}
              </p>
            </div>
          )}
        </div>
        <audio ref={audioRef} preload="none" onWaiting={() => setIsLoading(true)} onPlaying={() => { setIsPlaying(true); setIsLoading(false); }} onPause={() => setIsPlaying(false)} onError={() => { setError('No pudimos conectar esta señal ahora mismo. Intenta otra estación.'); setIsLoading(false); setIsPlaying(false); }} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3a3326] bg-black/80 p-2.5 backdrop-blur md:inset-x-auto md:bottom-5 md:right-5 md:w-[340px] md:rounded-2xl md:border md:p-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg border border-zinc-600 shadow-[0_6px_16px_rgba(0,0,0,.4)] bg-[radial-gradient(circle_at_25%_20%,rgba(239,31,45,.28),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(245,178,27,.24),transparent_50%),linear-gradient(135deg,#181818,#262626)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">{activeStation.name}</p>
            <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">{isComingSoon ? 'Próximamente' : isLive ? 'LIVE' : 'On Air'}</p>
          </div>
          <button type="button" aria-label={isPlaying ? 'Pausar mini player' : 'Reproducir mini player'} disabled={isComingSoon || isLoading} onClick={() => void handleTogglePlay()} className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#ef1f2d] px-2.5 text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(239,31,45,.35)] disabled:opacity-40">{isPlaying ? 'Pause' : 'Play'}</button>
          <button type="button" aria-label={isExpanded ? 'Colapsar mini player' : 'Expandir mini player'} onClick={() => setIsExpanded((prev) => !prev)} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-600 text-xs text-zinc-200">{isExpanded ? '−' : '+'}</button>
        </div>
        {isExpanded ? <p className="mt-2 text-xs text-zinc-300">{activeStation.tagline}</p> : null}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import type { VedaStation } from '@/lib/veda-player';
import { vedaPlatformSources, vedaStations } from '@/lib/veda-player';

const STORAGE_VOLUME_KEY = 'veda-player-volume';

type PlayerSource = 'live' | 'spotify' | 'youtube' | 'soundcloud';

const hasPlayableStream = (station: VedaStation) => Boolean(station.streamUrl.trim());

const sourceLabels: Record<PlayerSource, string> = {
  live: 'En Vivo',
  spotify: 'Spotify',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
};

const platformFallbackCopy: Record<Exclude<PlayerSource, 'live'>, string> = {
  spotify: 'Playlist oficial en preparación.',
  youtube: 'Canal y videos oficiales en preparación.',
  soundcloud: 'Mixes y drops oficiales en preparación.',
};

export default function VedaMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSource, setActiveSource] = useState<PlayerSource>('live');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeStation = vedaStations[activeIndex];
  const isComingSoon = !hasPlayableStream(activeStation);
  const isLive = !isComingSoon && activeStation.status === 'live';
  const statusLabel = isLoading ? 'Conectando…' : isLive ? 'LIVE' : 'Próximamente';

  const activePlatform = useMemo(() => {
    if (activeSource === 'live') return null;
    return vedaPlatformSources.find((source) => source.platform === activeSource) ?? null;
  }, [activeSource]);

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

  const hasEmbed = Boolean(activePlatform?.embedUrl?.trim());
  const hasExternal = Boolean(activePlatform?.externalUrl?.trim());

  return (
    <section className="space-y-4 pb-24 md:pb-8" aria-label="VEDA Music Player">
      <div className="rounded-3xl border border-[#3a3326] bg-[linear-gradient(135deg,rgba(12,12,12,.95),rgba(22,22,22,.9))] p-5 shadow-[0_10px_40px_rgba(0,0,0,.45),inset_0_0_0_1px_rgba(245,178,27,.09)] md:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-[#f0d3a0]">VEDA Music Player</p>
        <h2 className="mt-2 text-2xl font-extrabold text-zinc-100 md:text-3xl">Música, estrenos y movimiento urbano en vivo.</h2>

        <div className="mt-5 -mx-1 overflow-x-auto px-1" role="tablist" aria-label="Fuentes oficiales de VEDA Music">
          <div className="inline-flex min-w-full gap-2 pb-1 md:min-w-0">
            {(Object.keys(sourceLabels) as PlayerSource[]).map((source) => {
              const selected = activeSource === source;
              return (
                <button
                  key={source}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`veda-source-panel-${source}`}
                  id={`veda-source-tab-${source}`}
                  onClick={() => setActiveSource(source)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d3a0] ${
                    selected
                      ? 'border-[#f0d3a0] bg-[linear-gradient(145deg,rgba(245,178,27,.2),rgba(245,178,27,.08))] text-[#f4ddb9]'
                      : 'border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
                  }`}
                >
                  {sourceLabels[source]}
                </button>
              );
            })}
          </div>
        </div>

        {activeSource === 'live' ? (
          <div id="veda-source-panel-live" role="tabpanel" aria-labelledby="veda-source-tab-live" className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-[radial-gradient(circle_at_25%_20%,rgba(239,31,45,.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(245,178,27,.3),transparent_50%),linear-gradient(145deg,#131313,#1f1f1f)]">
                  {activeStation.artwork ? <img src={activeStation.artwork} alt={`Artwork de ${activeStation.name}`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : null}
                  <span className="absolute bottom-1 right-1 rounded-full border border-zinc-600 bg-black/60 px-2 py-0.5 text-[10px] uppercase text-zinc-200">V</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Now Playing</p>
                  <h3 className="text-xl font-bold text-zinc-100">{activeStation.name}</h3>
                  <p className="text-sm text-zinc-300">{activeStation.tagline}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#f0d3a0]">{activeStation.genre}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} className="veda-bar" style={{ height: `${10 + (i % 5) * 5}px`, animationPlayState: isPlaying ? 'running' : 'paused', opacity: isPlaying ? 1 : 0.4 }} />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-zinc-600 px-2 py-1 text-zinc-200">Estado: {statusLabel}</span>
                {isComingSoon && <span className="text-zinc-300">Señal en preparación.</span>}
                {error && <span className="text-[#ff9898]">{error}</span>}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button type="button" aria-label="Estación anterior" onClick={goPrev} className="rounded-full border border-zinc-600 px-3 py-2 text-sm text-zinc-100 hover:border-[#f5b21b]">◀</button>
                <button type="button" aria-label={isPlaying ? 'Pausar estación' : 'Reproducir estación'} disabled={isComingSoon || isLoading} onClick={() => void handleTogglePlay()} className="rounded-full bg-[#ef1f2d] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
                  {isLoading ? 'Conectando…' : isPlaying ? 'Pause' : 'Play'}
                </button>
                <button type="button" aria-label="Siguiente estación" onClick={goNext} className="rounded-full border border-zinc-600 px-3 py-2 text-sm text-zinc-100 hover:border-[#f5b21b]">▶</button>
                <button type="button" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'} onClick={() => setIsMuted((prev) => !prev)} className="rounded-full border border-zinc-600 px-3 py-2 text-sm text-zinc-100">{isMuted ? 'Unmute' : 'Mute'}</button>
                <label className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-2 text-xs text-zinc-300">
                  Vol
                  <input aria-label="Control de volumen" type="range" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              {vedaStations.map((station, idx) => {
                const stationComingSoon = !hasPlayableStream(station);
                const selected = idx === activeIndex;
                return (
                  <button key={station.id} type="button" onClick={() => selectStation(idx)} className={`rounded-xl border px-3 py-3 text-left transition ${selected ? 'border-[#f5b21b] bg-[#1d1911]' : 'border-zinc-700 bg-zinc-900/70 hover:border-zinc-500'}`} aria-label={`Seleccionar estación ${station.name}`}>
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
        ) : (
          <div id={`veda-source-panel-${activeSource}`} role="tabpanel" aria-labelledby={`veda-source-tab-${activeSource}`} className="mt-6 rounded-2xl border border-zinc-700/80 bg-zinc-950/70 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-zinc-200">{sourceLabels[activeSource]}</div>
                <h3 className="mt-3 text-2xl font-bold text-zinc-100">{activePlatform?.title}</h3>
                <p className="mt-1 text-sm text-zinc-300">{activePlatform?.tagline}</p>
              </div>
              <span className="rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-200">{hasEmbed || hasExternal ? 'Disponible' : 'Próximamente'}</span>
            </div>

            {hasEmbed && activePlatform ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-700">
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    src={activePlatform.embedUrl}
                    title={`${activePlatform.title} embed`}
                    loading="lazy"
                    allow="encrypted-media; picture-in-picture"
                    className="absolute left-0 top-0 h-full w-full"
                  />
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-300">{platformFallbackCopy[activeSource]}</p>
            )}

            <div className="mt-5">
              {hasExternal && activePlatform ? (
                <a href={activePlatform.externalUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-[#f0d3a0] bg-[linear-gradient(145deg,rgba(245,178,27,.2),rgba(245,178,27,.08))] px-4 py-2 text-sm font-semibold text-[#f4ddb9]">
                  Abrir {sourceLabels[activeSource]}
                </a>
              ) : (
                <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-400">Próximamente</span>
              )}
            </div>
          </div>
        )}

        <audio ref={audioRef} preload="none" onWaiting={() => setIsLoading(true)} onPlaying={() => { setIsPlaying(true); setIsLoading(false); }} onPause={() => setIsPlaying(false)} onError={() => { setError('No pudimos conectar esta señal ahora mismo. Intenta otra estación.'); setIsLoading(false); setIsPlaying(false); }} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3a3326] bg-black/85 p-3 backdrop-blur md:inset-x-auto md:bottom-5 md:right-5 md:w-[340px] md:rounded-2xl md:border md:p-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg border border-zinc-700 bg-[linear-gradient(135deg,#1a1a1a,#2a2a2a)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">{activeStation.name || 'VEDA Live'}</p>
            <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">{isComingSoon ? 'VEDA Live — Próximamente' : isLive ? 'LIVE' : 'On Air'}</p>
          </div>
          <button type="button" aria-label={isPlaying ? 'Pausar mini player' : 'Reproducir mini player'} disabled={isComingSoon || isLoading} onClick={() => void handleTogglePlay()} className="rounded-full bg-[#ef1f2d] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">{isPlaying ? 'Pause' : 'Play'}</button>
          <button type="button" aria-label={isExpanded ? 'Colapsar mini player' : 'Expandir mini player'} onClick={() => setIsExpanded((prev) => !prev)} className="rounded-full border border-zinc-600 px-2 py-1 text-xs text-zinc-200">{isExpanded ? '−' : '+'}</button>
        </div>
        {isExpanded ? <p className="mt-2 text-xs text-zinc-300">{activeStation.tagline}</p> : null}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from 'react';
import type { VedaStation } from '@/lib/veda-player';
import { vedaPlatformSources, vedaSpotifyPlaylists, vedaStations } from '@/lib/veda-player';

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
  const [activePlatformId, setActivePlatformId] = useState('en-vivo');

  const activePlatform = vedaPlatformSources.find((platform) => platform.id === activePlatformId) ?? vedaPlatformSources[0];
  const usingLivePlatform = activePlatform.id === 'en-vivo';
  const activeStation = vedaStations[activeIndex];
  const isComingSoon = !hasPlayableStream(activeStation);

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

  return (
    <section className="space-y-3" aria-label="VEDA Music Player">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-yellow-500/15 bg-black/30 px-5 py-6 shadow-[0_0_35px_rgba(255,40,80,.16),0_0_40px_rgba(255,190,60,.1)] backdrop-blur-xl md:px-6 md:py-8 xl:px-8 xl:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(244,63,94,.09),transparent_35%),radial-gradient(circle_at_88%_20%,rgba(245,158,11,.08),transparent_40%),linear-gradient(145deg,rgba(10,10,10,.45),rgba(20,20,20,.5))]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.24em] text-[#f0d3a0]">VEDA Music Player</p>
          <h2 className="mt-1.5 text-xl font-extrabold text-zinc-100 md:text-2xl xl:text-3xl">Música, estrenos y movimiento urbano en vivo.</h2>

          <div role="tablist" aria-label="Plataformas oficiales de VEDA Music Player" className="mt-4 flex flex-wrap gap-2">
            {vedaPlatformSources.map((platform) => {
              const selected = platform.id === activePlatform.id;
              return (
                <button key={platform.id} type="button" role="tab" aria-selected={selected} onClick={() => setActivePlatformId(platform.id)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${selected ? 'border-yellow-400/80 bg-yellow-500/10 text-yellow-200 shadow-[0_0_20px_rgba(245,158,11,.25)]' : 'border-white/10 bg-black/30 text-zinc-300 hover:border-zinc-500'}`}>
                  {platform.id === 'spotify' ? 'Spotify' : platform.title}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            {usingLivePlatform ? (
              <div className="grid gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
                <div className="space-y-2.5">
                  {vedaStations.map((station, idx) => {
                    const selected = idx === activeIndex;
                    return (
                      <button key={station.id} type="button" onClick={() => selectStation(idx)} className={`group w-full rounded-xl border px-4 py-3 text-left transition backdrop-blur-xl ${selected ? 'border-yellow-400/70 bg-neutral-950/45 shadow-[0_0_20px_rgba(245,158,11,.18)]' : 'border-white/10 bg-black/30 hover:border-rose-400/50 hover:bg-black/30'}`}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-600 bg-gradient-to-br from-zinc-950 to-zinc-800 text-sm font-black tracking-wider text-yellow-100 md:h-14 md:w-14">{station.name.split(' ').map((w) => w[0]).join('').slice(0, 3)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="truncate text-base font-bold text-white md:text-lg">{station.name}</h3>
                              <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-yellow-200">OFICIAL</span>
                            </div>
                            <p className="mt-0.5 text-xs text-zinc-300 md:text-sm">{station.tagline}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(160deg,rgba(24,24,24,.42),rgba(13,13,13,.36)_55%,rgba(31,27,20,.4))] p-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.05),inset_0_10px_40px_rgba(0,0,0,.32),0_14px_30px_rgba(0,0,0,.38)] backdrop-blur-xl md:p-4.5 lg:p-5">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(244,63,94,.11),transparent_45%),radial-gradient(circle_at_100%_20%,rgba(245,158,11,.10),transparent_42%)]" />
                  <div className="relative grid gap-2.5 md:grid-cols-[1fr_auto]">
                    <div className="rounded-lg border border-white/10 bg-black/30 p-2.5 backdrop-blur-xl">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400">Station</p>
                      <p className="mt-1.5 text-xl font-black text-yellow-100 md:text-2xl">{activeStation.name.split(' ').map((w) => w[0]).join('').slice(0, 4)}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/30 p-2.5 backdrop-blur-xl">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400">NOW PLAYING</p>
                      <p className="mt-1 text-base font-bold text-white md:text-lg">{activeStation.name}</p>
                      <p className="text-xs text-zinc-300 md:text-sm">{activeStation.tagline}</p>
                    </div>
                  </div>

                  <div className="relative mt-3 flex items-center justify-center">
                    <div className="h-36 w-36 rounded-full border border-zinc-700 bg-[radial-gradient(circle_at_48%_45%,#2d2d2d,#090909_66%)] p-3 shadow-[inset_0_8px_20px_rgba(255,255,255,.07),inset_0_-10px_20px_rgba(0,0,0,.6),0_0_24px_rgba(239,68,68,.18)] md:h-44 md:w-44 lg:h-48 lg:w-48">
                      <div className={`flex h-full w-full items-center justify-center rounded-full border border-yellow-500/30 bg-[conic-gradient(from_0deg,rgba(245,158,11,.6),rgba(244,63,94,.45),rgba(245,158,11,.6))] p-4 ${isPlaying ? 'animate-[spin_16s_linear_infinite]' : ''}`}>
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle,#0f0f0f_25%,#1e1e1e_62%,#080808_100%)] text-center">
                          <span className="text-sm font-black tracking-[0.22em] text-yellow-100 md:text-base">VEDA</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 hidden flex-wrap items-center justify-center gap-1.5 lg:flex">
                    <button type="button" disabled className="hidden rounded-lg border border-zinc-700 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-500 md:inline-block">AUDIO PROFILE</button>
                    <button type="button" disabled className="hidden rounded-lg border border-zinc-700 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-500 md:inline-block">DSP MODE</button>
                    <button type="button" disabled className="hidden rounded-lg border border-zinc-700 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-500 md:inline-block">NETWORK</button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    {hasPlayableStream(activeStation) ? (
                      <button type="button" aria-label={isPlaying ? 'Pausar estación' : 'Reproducir estación'} disabled={isLoading} onClick={() => void handleTogglePlay()} className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-rose-600 px-5 text-xs font-bold text-white shadow-[0_0_22px_rgba(244,63,94,.45)] transition hover:bg-rose-500 disabled:opacity-40 md:text-sm">{isLoading ? 'Conectando…' : isPlaying ? 'Pause' : 'Play'}</button>
                    ) : activeStation.externalUrl ? (
                      <a href={activeStation.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-full border border-yellow-500/60 bg-yellow-500/10 px-4 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/20 md:h-11 md:text-sm">Escuchar oficial</a>
                    ) : null}
                    <button type="button" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'} onClick={() => setIsMuted((prev) => !prev)} className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-600 px-2.5 text-[11px] text-zinc-100 md:h-10 md:px-3 md:text-xs">{isMuted ? 'Unmute' : 'Mute'}</button>
                    <label className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-2 py-1 text-[11px] text-zinc-300 md:text-xs">Vol
                      <input className="w-16 accent-yellow-500 md:w-20" aria-label="Control de volumen" type="range" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
                    </label>
                  </div>

                  <p className="mt-3 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-center text-[11px] text-zinc-300 backdrop-blur-xl md:text-xs">Estado: Externa oficial | Disponible vía enlace oficial.</p>
                  {error ? <p className="mt-2 text-center text-xs text-rose-300">{error}</p> : null}
                </div>
              </div>
            ) : activePlatform.id === 'spotify' && activePlatform.status === 'live' ? (
              <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl md:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#f0d3a0]">Spotify · Playlist externa</p>
                <h3 className="text-xl font-semibold text-zinc-100">{activePlatform.title}</h3>
                <p className="text-sm text-zinc-300">{activePlatform.tagline}</p>
                <div className="grid gap-4 lg:grid-cols-2">
                  {vedaSpotifyPlaylists.map((playlist) => (
                    <article key={playlist.id} className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-3.5 backdrop-blur-xl md:p-4">
                      <h4 className="text-lg font-semibold text-zinc-100">{playlist.title}</h4><p className="text-sm text-zinc-300">{playlist.tagline}</p>
                      <div className="overflow-hidden rounded-xl border border-zinc-800"><iframe src={playlist.embedUrl} width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title={playlist.title} className="block" /></div>
                      <a href={playlist.externalUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-[#1db954] bg-[#1db954]/10 px-4 py-2 text-sm font-semibold text-[#66ffa5] transition hover:bg-[#1db954]/20">{playlist.ctaLabel ?? 'Escuchar en Spotify'}</a>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.18em] text-[#f0d3a0]">{activePlatform.title}</p>
                <p className="mt-3 text-lg font-semibold text-zinc-100">Próximamente</p>
                <p className="mt-2 text-sm text-zinc-400">{activePlatform.tagline || 'Este contenedor oficial de VEDA Music Player estará disponible pronto.'}</p>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.1em] text-zinc-300">
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 backdrop-blur-xl">Enlaces oficiales</span>
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 backdrop-blur-xl">Contenido verificado</span>
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 backdrop-blur-xl">Transmitiendo 24/7</span>
          </div>
        </div>

        <audio ref={audioRef} preload="none" onWaiting={() => setIsLoading(true)} onPlaying={() => { setIsPlaying(true); setIsLoading(false); }} onPause={() => setIsPlaying(false)} onError={() => { setError('No pudimos conectar esta señal ahora mismo. Intenta otra estación.'); setIsLoading(false); setIsPlaying(false); }} />
      </div>
    </section>
  );
}

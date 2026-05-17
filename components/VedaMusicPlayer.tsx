"use client";

import { useEffect, useRef, useState } from 'react';
import type { VedaStation } from '@/lib/veda-player';
import { vedaStations } from '@/lib/veda-player';

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

            <p className="rounded-lg border border-white/10 bg-black/45 px-2.5 py-1.5 text-center text-[11px] text-zinc-300 backdrop-blur-md md:text-xs md:text-left">Estado: Externa oficial | Disponible vía enlace oficial.</p>
            {error ? <p className="text-center text-xs text-rose-300 md:text-left">{error}</p> : null}
          </div>
        </div>

        <audio ref={audioRef} preload="none" onWaiting={() => setIsLoading(true)} onPlaying={() => { setIsPlaying(true); setIsLoading(false); }} onPause={() => setIsPlaying(false)} onError={() => { setError('No pudimos conectar esta señal ahora mismo. Intenta otra estación.'); setIsLoading(false); setIsPlaying(false); }} />
      </div>
    </section>
  );
}

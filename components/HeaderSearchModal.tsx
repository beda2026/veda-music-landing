'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import EmbeddedVideoModal from '@/components/EmbeddedVideoModal';

type SearchResult = {
  title: string;
  type: 'artist' | 'video' | 'article' | 'social' | 'other';
  source: string;
  snippet: string;
  url: string;
  image?: string;
};

type ApiResponse = {
  ok: boolean;
  query?: string;
  results?: SearchResult[];
  error?: string;
};

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;

export default function HeaderSearchModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoToPlay, setVideoToPlay] = useState<{ title: string; videoId: string } | null>(null);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (videoToPlay) {
          setVideoToPlay(null);
          return;
        }
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, videoToPlay]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitized = query.trim();

    if (!sanitized) {
      setError('Escribe un artista o tema para buscar.');
      setResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/artist-search?q=${encodeURIComponent(sanitized)}`);
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok) {
        setResults([]);
        setError(data.error ?? 'No se pudo completar la búsqueda ahora mismo.');
        return;
      }

      setResults(data.results ?? []);
    } catch {
      setResults([]);
      setError('No se pudo completar la búsqueda ahora mismo.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = useMemo(() => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="header-search-title"
          className="w-full max-w-2xl rounded-3xl border border-[#c9a67a]/50 bg-zinc-950/95 p-4 shadow-[0_25px_90px_rgba(0,0,0,0.65)] sm:p-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 id="header-search-title" className="text-lg font-semibold text-[#f5d2a2] sm:text-xl">Buscar en V.E.D.A. MUSIC</h3>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-100 transition hover:border-[#f5b21b]">✕</button>
          </div>

          <form className="mb-4 flex flex-col gap-2 sm:flex-row" onSubmit={onSubmit}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca artistas, videos, entrevistas o música…"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/75 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-[#c9a67a]"
              maxLength={80}
            />
            <button type="submit" className="rounded-xl border border-[#c9a67a]/70 bg-[#c9a67a]/10 px-5 py-3 text-sm font-medium text-[#f5d2a2] transition hover:bg-[#c9a67a]/20">Buscar</button>
          </form>

          <div className="max-h-[58vh] space-y-3 overflow-y-auto pr-1">
            {!results && !isLoading && !error && <p className="text-sm text-zinc-300">Escribe un artista o tema para buscar.</p>}
            {isLoading && <p className="text-sm text-zinc-300">Buscando…</p>}
            {error && <p className="rounded-xl border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-200">{error}</p>}
            {results && !isLoading && results.length === 0 && !error && <p className="text-sm text-zinc-300">No encontramos resultados.</p>}

            {results?.map((result, index) => {
              const videoId = result.url.match(YOUTUBE_REGEX)?.[1] ?? null;

              return (
                <article key={`${result.url}-${index}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
                  <div className="flex gap-3">
                    {result.image ? <img src={result.image} alt={result.title} className="h-16 w-16 rounded-lg border border-zinc-700 object-cover" /> : null}
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-2 text-sm font-semibold text-zinc-100">{result.title}</h4>
                      <p className="mt-1 text-xs uppercase tracking-wide text-[#c9a67a]">{result.type} · {result.source}</p>
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-300">{result.snippet}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.url ? <a href={result.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-200 transition hover:border-[#c9a67a]">Abrir fuente</a> : null}
                        {videoId ? <button type="button" onClick={() => setVideoToPlay({ title: result.title, videoId })} className="rounded-full border border-[#c9a67a]/70 px-2.5 py-1 text-xs text-[#f5d2a2] transition hover:bg-[#c9a67a]/15">Ver video</button> : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {videoToPlay ? <EmbeddedVideoModal title={videoToPlay.title} youtubeVideoId={videoToPlay.videoId} onClose={() => setVideoToPlay(null)} /> : null}
      </div>
    );
  }, [error, isLoading, isOpen, onSubmit, query, results, videoToPlay]);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="self-start rounded-full border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-[#f5b21b]">
        ⌕
      </button>
      {isMounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}

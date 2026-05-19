'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVedaVoiceInput } from '@/hooks/useVedaVoiceInput';
import { useVedaVoiceReply } from '@/hooks/useVedaVoiceReply';
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
  mode?: 'guide' | 'search';
  query?: string;
  message?: string;
  quickActions?: string[];
  results?: SearchResult[];
  error?: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'veda';
  text: string;
  kind?: 'text' | 'results' | 'guide';
  results?: SearchResult[];
  quickActions?: string[];
};

const INITIAL_MESSAGE = 'Hola, bienvenido. ¿Cómo puedo ayudarte?';
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;

export default function HeaderSearchModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'veda', text: INITIAL_MESSAGE, kind: 'guide' }]);
  const [isThinking, setIsThinking] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState<{ title: string; videoId: string } | null>(null);
  const [hasUsedMic, setHasUsedMic] = useState(false);
  const [hasUsedAudioReply, setHasUsedAudioReply] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const voiceInput = useVedaVoiceInput();
  const voiceReply = useVedaVoiceReply();

  const clearVoiceErrors = useCallback(() => {
    voiceInput.cancelRecording();
    voiceReply.stop();
  }, [voiceInput, voiceReply]);

  const closeModal = useCallback(() => {
    clearVoiceErrors();
    setIsOpen(false);
  }, [clearVoiceErrors]);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (videoToPlay) {
          setVideoToPlay(null);
          return;
        }
        closeModal();
      }
    };

      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
      clearVoiceErrors();
      setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, videoToPlay, closeModal, clearVoiceErrors]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking]);

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const runIntentGate = useCallback(async (rawText: string) => {
    const sanitized = rawText.trim();
    if (!sanitized) return;
    clearVoiceErrors();

    appendMessage({ id: `u-${Date.now()}`, role: 'user', text: sanitized, kind: 'text' });
    setIsThinking(true);

    try {
      const response = await fetch(`/api/artist-search?q=${encodeURIComponent(sanitized)}`);
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok) {
        appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: 'No pude traer ese resultado ahora. Prueba con artista, canción o video específico.', kind: 'guide' });
        return;
      }

      if (data.mode === 'guide') {
        const message = data.message ?? 'Te guío rápido. ¿Buscas artista, canción, video o entrevista?';
        appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: message, kind: 'guide', quickActions: data.quickActions ?? [] });
        return;
      }

      const normalizedQuery = data.query ?? sanitized;
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: `Buscando ${normalizedQuery}…`, kind: 'text' });

      const found = data.results ?? [];
      if (found.length === 0) {
        appendMessage({ id: `v-empty-${Date.now()}`, role: 'veda', text: 'No encontré algo bueno con eso. Prueba con artista, canción o video específico.', kind: 'guide' });
        return;
      }

      appendMessage({ id: `v-r-${Date.now()}`, role: 'veda', text: 'Te encontré esto en VEDA:', kind: 'results', results: found });
    } catch {
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: 'No pude traer ese resultado ahora. Prueba con artista, canción o video específico.', kind: 'guide' });
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [clearVoiceErrors]);


  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = query.trim();
    if (!text || isThinking) return;
    clearVoiceErrors();
    setQuery('');
    await runIntentGate(text);
  };

  useEffect(() => {
    if (!voiceInput.transcript || isThinking) return;
    clearVoiceErrors();
    setQuery('');
    void runIntentGate(voiceInput.transcript);
  }, [voiceInput.transcript, isThinking, clearVoiceErrors, runIntentGate]);

  const handleMicButtonClick = () => {
    setHasUsedMic(true);
    if (voiceInput.isRecording) {
      void voiceInput.stopRecording();
      return;
    }
    void voiceInput.startRecording();
  };

  const handleAudioReplyButtonClick = () => {
    setHasUsedAudioReply(true);
    const latestVedaMessage = [...messages].reverse().find((message) => message.role === 'veda' && message.text.trim());
    if (!latestVedaMessage) return;
    void voiceReply.speak(latestVedaMessage.text);
  };

  const modalContent = useMemo(() => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:px-4" onClick={closeModal}>
        <div role="dialog" aria-modal="true" aria-labelledby="header-search-title" className="flex h-[88vh] w-full max-w-[520px] flex-col rounded-t-3xl border border-[#c9a67a]/50 bg-zinc-950/95 shadow-[0_25px_90px_rgba(0,0,0,0.65)] sm:h-[560px] sm:rounded-3xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#c9a67a]/30 px-4 py-3">
            <div>
              <h3 id="header-search-title" className="text-base font-semibold text-[#f5d2a2]">Guía VEDA</h3>
              <p className="text-xs text-zinc-400">Búsqueda y orientación musical.</p>
            </div>
            <button type="button" onClick={closeModal} className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-100 transition hover:border-[#f5b21b]">✕</button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_220ms_ease]`}>
                <div className={`max-w-[86%] rounded-2xl border px-3 py-2 text-sm ${message.role === 'user' ? 'border-[#c9a67a]/50 bg-[#c9a67a]/15 text-[#fae3c5]' : 'border-zinc-800 bg-zinc-900/80 text-zinc-100'}`}>
                  <p>{message.text}</p>
                  {message.kind === 'results' && message.results?.length ? (
                    <div className="mt-3 space-y-2">
                      {message.results.map((result, index) => {
                        const videoId = result.url.match(YOUTUBE_REGEX)?.[1] ?? null;
                        return (
                          <article key={`${result.url}-${index}`} className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 p-2.5">
                            <div className="flex gap-2.5">
                              {result.image ? <img src={result.image} alt={result.title} className="h-14 w-14 rounded-lg border border-zinc-700 object-cover" /> : null}
                              <div className="min-w-0 flex-1">
                                <h4 className="line-clamp-2 text-sm font-semibold text-zinc-100">{result.title}</h4>
                                <p className="mt-1 text-[10px] uppercase tracking-wide text-[#c9a67a]">{result.type} · {result.source}</p>
                                <p className="mt-1.5 line-clamp-3 text-xs text-zinc-300">{result.snippet}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {videoId ? <button type="button" onClick={() => setVideoToPlay({ title: result.title, videoId })} className="rounded-full border border-[#c9a67a]/70 px-2 py-0.5 text-[11px] text-[#f5d2a2] transition hover:bg-[#c9a67a]/15">Ver aquí</button> : null}
                                  {result.url ? <a href={result.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300">Fuente</a> : null}
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {isThinking ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-200">
                  <span className="mr-2 text-xs text-zinc-400">VEDA está respondiendo</span>
                  <span className="inline-flex gap-1 align-middle"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d2a97c] [animation-delay:-0.2s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d2a97c] [animation-delay:-0.1s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d2a97c]" /></span>
                </div>
              </div>
            ) : null}

            {hasUsedMic && voiceInput.error ? <p className="rounded-xl border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-200">{voiceInput.error}</p> : null}
            {hasUsedAudioReply && voiceReply.error ? <p className="rounded-xl border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-200">{voiceReply.error}</p> : null}
            <div ref={bottomRef} />
          </div>


          <form className="sticky bottom-0 flex items-center gap-2 border-t border-[#c9a67a]/30 bg-zinc-950/95 px-3 py-3 sm:px-4" onSubmit={onSubmit}>
            <input ref={inputRef} value={query} onChange={(event) => { clearVoiceErrors(); setQuery(event.target.value); }} placeholder="Escribe aquí…" className="w-full rounded-xl border border-zinc-700 bg-zinc-900/75 px-4 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-[#c9a67a]" maxLength={80} />
            <button type="button" disabled={isThinking || voiceInput.isProcessing} onClick={handleMicButtonClick} className="rounded-xl border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 transition hover:border-[#c9a67a] disabled:cursor-not-allowed disabled:opacity-50">{voiceInput.isRecording ? '⏹️' : '🎙️'}</button>
            <button type="button" disabled={isThinking || voiceReply.isLoadingAudio} onClick={handleAudioReplyButtonClick} className="rounded-xl border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 transition hover:border-[#c9a67a] disabled:cursor-not-allowed disabled:opacity-50">{voiceReply.isSpeaking ? '🔈' : '🔊'}</button>
            <button type="submit" disabled={isThinking} className="rounded-xl border border-[#c9a67a]/70 bg-[#c9a67a]/10 px-4 py-2.5 text-sm font-medium text-[#f5d2a2] transition hover:bg-[#c9a67a]/20 disabled:opacity-60">Enviar</button>
          </form>
        </div>

        {videoToPlay ? <EmbeddedVideoModal title={videoToPlay.title} youtubeVideoId={videoToPlay.videoId} onClose={() => setVideoToPlay(null)} /> : null}
      </div>
    );
  }, [hasUsedAudioReply, hasUsedMic, isOpen, messages, isThinking, voiceInput.error, voiceInput.isProcessing, voiceInput.isRecording, voiceReply.error, voiceReply.isLoadingAudio, voiceReply.isSpeaking, query, videoToPlay]);

  return (
    <>
      <>
        <button
          type="button"
          onClick={() => { clearVoiceErrors(); setIsOpen(true); }}
          aria-label="Abrir Guía VEDA"
          title="Busca música o recibe orientación."
          className="hidden items-center gap-2 rounded-full border border-[#c9a67a]/80 bg-zinc-950/90 px-4 py-2 text-sm font-medium text-[#f5d2a2] shadow-[0_0_18px_rgba(201,166,122,0.26)] transition hover:border-[#f5d2a2] hover:shadow-[0_0_24px_rgba(245,210,162,0.35)] md:inline-flex"
        >
          <span aria-hidden="true">🔎</span>
          <span>Guía VEDA</span>
        </button>

        <button
          type="button"
          onClick={() => { clearVoiceErrors(); setIsOpen(true); }}
          aria-label="Abrir Guía VEDA"
          title="Busca música o recibe orientación."
          className="fixed bottom-20 right-4 z-[210] inline-flex items-center gap-2 rounded-full border border-[#c9a67a]/80 bg-zinc-950/95 px-4 py-2 text-sm font-medium text-[#f5d2a2] shadow-[0_0_18px_rgba(201,166,122,0.3)] transition hover:border-[#f5d2a2] hover:shadow-[0_0_26px_rgba(245,210,162,0.35)] md:hidden"
        >
          <span aria-hidden="true">✨</span>
          <span>Guía VEDA</span>
        </button>
      </>
      {isMounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}

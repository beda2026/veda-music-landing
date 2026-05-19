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

type ConversationMode =
  | 'idle'
  | 'music_search'
  | 'platform_recommendation'
  | 'artist_lead'
  | 'business_lead'
  | 'sponsor_lead'
  | 'promotion_lead';

type LeadType = 'artist' | 'business' | 'sponsor' | 'promotion' | null;

type ApiResponse = {
  ok: boolean;
  query?: string;
  results?: SearchResult[];
  error?: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'veda';
  text: string;
  kind?: 'text' | 'results' | 'guide';
  results?: SearchResult[];
};

const INITIAL_MESSAGE = 'Hola, bienvenido. ¿Cómo puedo ayudarte?';
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;

const LEAD_FOLLOWUP_HINTS = ['música', 'musica', 'canción', 'cancion', 'video', 'mi tema', 'mi proyecto', 'cómo funciona', 'como funciona', 'aquí', 'aqui', 'eso'];

const titleCaseName = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => (part.toLowerCase() === 'dj' ? 'DJ' : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    .join(' ');

const normalizeSearchQuery = (text: string) => {
  const cleaned = text
    .toLowerCase()
    .replace(/^(buscame|búscame|dame|quiero ver|ponme|tráeme|traeme|enseñame|enséñame)\s+/i, '')
    .trim();
  return cleaned.replace(/\bdj\s+([a-záéíóúñ]+)/gi, (_, name: string) => `DJ ${titleCaseName(name)}`).replace(/\bdon omar\b/gi, 'Don Omar').replace(/\bsnoop dog\b/gi, 'Snoop Dog');
};

export default function HeaderSearchModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'veda', text: INITIAL_MESSAGE, kind: 'guide' }]);
  const [conversationMode, setConversationMode] = useState<ConversationMode>('idle');
  const [lastIntent, setLastIntent] = useState<string | null>(null);
  const [leadType, setLeadType] = useState<LeadType>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState<{ title: string; videoId: string } | null>(null);
  const [hasUsedMic, setHasUsedMic] = useState(false);
  const [hasUsedAudioReply, setHasUsedAudioReply] = useState(false);
  const [uiNotice, setUiNotice] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const voiceInput = useVedaVoiceInput();
  const voiceReply = useVedaVoiceReply();

  const clearUiNotice = useCallback(() => setUiNotice(null), []);

  const clearVoiceErrors = useCallback(() => {
    voiceInput.clearError();
    voiceReply.clearError();
  }, [voiceInput, voiceReply]);

  const stopAudioIfPlaying = useCallback(() => {
    voiceReply.stop();
  }, [voiceReply]);

  const cancelRecordingIfActive = useCallback(() => {
    if (voiceInput.isRecording) {
      void voiceInput.stopRecording();
    }
  }, [voiceInput]);

  const appendMessage = (message: ChatMessage) => setMessages((prev) => [...prev, message]);

  const resetGuideVedaChat = useCallback(() => {
    stopAudioIfPlaying();
    cancelRecordingIfActive();
    clearVoiceErrors();
    clearUiNotice();
    setMessages([{ id: crypto.randomUUID(), role: 'veda', text: INITIAL_MESSAGE, kind: 'guide' }]);
    setQuery('');
    setResults([]);
    setIsThinking(false);
    setVideoToPlay(null);
    setConversationMode('idle');
    setLastIntent(null);
    setLeadType(null);
    setHasUsedMic(false);
    setHasUsedAudioReply(false);
  }, [cancelRecordingIfActive, clearUiNotice, clearVoiceErrors, stopAudioIfPlaying]);

  const closeModal = useCallback(() => {
    resetGuideVedaChat();
    setIsOpen(false);
  }, [resetGuideVedaChat]);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (!uiNotice) return;
    const t = setTimeout(() => setUiNotice(null), 5000);
    return () => clearTimeout(t);
  }, [uiNotice]);

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
    clearUiNotice();
    setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, videoToPlay, closeModal, clearVoiceErrors, clearUiNotice]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking, uiNotice]);

  const isClearSearchIntent = (text: string) => /\b(videos?|entrevista|canci[oó]n|noticias?|biograf[ií]a|[uú]ltimo video)\b/i.test(text) && /\bde\b/i.test(text);

  const detectLead = (text: string): LeadType => {
    if (/\b(soy artista|soy cantante|soy productor|soy manager|tengo m[uú]sica|mi canci[oó]n|quiero mover mi m[uú]sica|quiero meter mi canci[oó]n)\b/i.test(text)) return 'artist';
    if (/\b(tengo un negocio|tengo una marca|tengo un evento|publicidad|colaboraci[oó]n)\b/i.test(text)) return 'business';
    if (/\b(quiero pautar|auspicio)\b/i.test(text)) return 'sponsor';
    if (/\b(quiero promocionar|quiero promoci[oó]n|quiero salir en la p[aá]gina|quiero aparecer en veda|c[oó]mo funciona|cu[aá]nto cuesta)\b/i.test(text)) return 'promotion';
    return null;
  };

  const runIntentGate = useCallback(async (rawText: string) => {
    const sanitized = rawText.trim();
    if (!sanitized) return;
    clearVoiceErrors();
    clearUiNotice();

    appendMessage({ id: `u-${Date.now()}`, role: 'user', text: sanitized, kind: 'text' });
    setIsThinking(true);

    const lowered = sanitized.toLowerCase();
    const activeLeadContext = ['artist_lead', 'business_lead', 'sponsor_lead', 'promotion_lead'].includes(conversationMode);
    const newLead = detectLead(sanitized);

    if (activeLeadContext && (LEAD_FOLLOWUP_HINTS.some((hint) => lowered.includes(hint)) || !isClearSearchIntent(sanitized))) {
      setLastIntent('lead_followup');
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: 'Perfecto. Envíanos nombre artístico, canción y link en Contacto.', kind: 'guide' });
      setIsThinking(false);
      return;
    }

    if (newLead) {
      setLeadType(newLead);
      setConversationMode(newLead === 'artist' ? 'artist_lead' : newLead === 'business' ? 'business_lead' : newLead === 'sponsor' ? 'sponsor_lead' : 'promotion_lead');
      setLastIntent('lead');
      const leadReply = newLead === 'artist'
        ? 'Perfecto. VEDA puede evaluar exposición para tu música. Déjanos tus datos en Contacto.'
        : newLead === 'business'
          ? 'Perfecto. VEDA ofrece visibilidad para negocios y auspicios. Escríbenos en Contacto.'
          : newLead === 'sponsor'
            ? 'Claro. Para pautas o auspicios, escríbenos en Contacto.'
            : 'Claro. Puedes enviar tu propuesta en Contacto.';
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: leadReply, kind: 'guide' });
      setIsThinking(false);
      return;
    }

    if (/\bfotos? de\b/i.test(lowered)) {
      setLastIntent('unsupported');
      setConversationMode('platform_recommendation');
      const who = titleCaseName(sanitized.replace(/.*fotos? de\s*/i, '').trim());
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: `Puedo ayudarte con videos, entrevistas, noticias o música de ${who}.`, kind: 'guide' });
      setIsThinking(false);
      return;
    }

    if (/^(hola|test|prueba|ayuda)$/i.test(lowered) || lowered.includes('que me recomiendas') || lowered.includes('qué me recomiendas') || lowered.includes('qué hay aquí') || lowered.includes('que hay aqui') || lowered.includes('qué puedo ver') || lowered.includes('que es veda') || lowered.includes('qué es veda') || lowered.includes('quiero ver lo nuevo') || lowered === 'música' || lowered === 'musica' || lowered === 'videos') {
      setLastIntent('platform_recommendation');
      setConversationMode('platform_recommendation');
      let reply = 'Hola, bienvenido. ¿Cómo puedo ayudarte?';
      if (lowered.includes('recomiendas')) reply = 'Puedes empezar por VEDA Radio, últimos videos o entrevistas destacadas.';
      else if (lowered.includes('qué hay aquí') || lowered.includes('que hay aqui')) reply = 'En VEDA encuentras música, videos, entrevistas, noticias urbanas y artistas destacados.';
      else if (lowered.includes('qué es veda') || lowered.includes('que es veda')) reply = 'VEDA es una plataforma urbana con música, videos, entrevistas, noticias y exposición para artistas.';
      else if (lowered.includes('quiero ver lo nuevo')) reply = 'Puedes revisar últimos videos, noticias recientes y lo más importante del mes.';
      else if (lowered === 'música' || lowered === 'musica') reply = 'Puedes escuchar VEDA Radio o buscar una canción, artista o playlist.';
      else if (lowered === 'videos') reply = 'Puedes ver últimos videos, entrevistas o buscar un artista específico.';
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: reply, kind: 'guide' });
      setIsThinking(false);
      return;
    }

    if (/^[a-záéíóúñ\s]+$/i.test(sanitized) && sanitized.trim().split(/\s+/).length <= 3 && !isClearSearchIntent(sanitized)) {
      const artist = titleCaseName(sanitized);
      setLastIntent('clarification');
      setConversationMode('music_search');
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: `¿Qué quieres ver de ${artist}: videos, canciones o noticias?`, kind: 'guide' });
      setIsThinking(false);
      return;
    }

    if (!isClearSearchIntent(sanitized)) {
      setLastIntent('clarification');
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: 'Entendido. ¿Qué artista o contenido quieres buscar?', kind: 'guide' });
      setIsThinking(false);
      return;
    }

    try {
      const normalizedQuery = normalizeSearchQuery(sanitized);
      setConversationMode('music_search');
      setLastIntent('clear_search');
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: `Buscando ${normalizedQuery}.`, kind: 'text' });

      const response = await fetch(`/api/artist-search?q=${encodeURIComponent(normalizedQuery)}&mode=music_search`);
      const data = (await response.json()) as ApiResponse;
      if (!response.ok || !data.ok) {
        appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: 'No pude traer ese resultado ahora. Inténtalo con una búsqueda más específica.', kind: 'guide' });
        return;
      }
      const found = data.results ?? [];
      setResults(found);
      if (found.length === 0) {
        appendMessage({ id: `v-empty-${Date.now()}`, role: 'veda', text: 'No encontré resultados útiles con esa búsqueda.', kind: 'guide' });
        return;
      }
      appendMessage({ id: `v-r-${Date.now()}`, role: 'veda', text: 'Te encontré esto en VEDA.', kind: 'results', results: found });
    } catch {
      appendMessage({ id: `v-${Date.now()}`, role: 'veda', text: 'No pude traer ese resultado ahora. Inténtalo nuevamente.', kind: 'guide' });
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [clearVoiceErrors, clearUiNotice, conversationMode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = query.trim();
    if (!text || isThinking) return;
    clearVoiceErrors();
    clearUiNotice();
    setQuery('');
    await runIntentGate(text);
  };

  useEffect(() => {
    if (!voiceInput.transcript || isThinking) return;
    clearVoiceErrors();
    clearUiNotice();
    setQuery('');
    void runIntentGate(voiceInput.transcript);
  }, [voiceInput.transcript, isThinking, clearVoiceErrors, clearUiNotice, runIntentGate]);

  const handleMicButtonClick = () => {
    setHasUsedMic(true);
    clearUiNotice();
    if (voiceInput.isRecording) {
      void voiceInput.stopRecording();
      return;
    }
    voiceInput.startRecording().catch(() => {
      setUiNotice('No pude activar el micrófono. Escríbeme y te guío igual.');
    });
  };

  const handleAudioReplyButtonClick = () => {
    setHasUsedAudioReply(true);
    clearUiNotice();
    const latestVedaMessage = [...messages].reverse().find((message) => message.role === 'veda' && message.text.trim());
    if (!latestVedaMessage) return;
    voiceReply.speak(latestVedaMessage.text).catch(() => {
      setUiNotice('No pude reproducir audio ahora.');
    });
  };

  const modalContent = useMemo(() => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:px-4" onClick={closeModal}>
        <div role="dialog" aria-modal="true" aria-labelledby="header-search-title" className="flex h-[88vh] w-full max-w-[520px] flex-col rounded-t-3xl border border-[#c9a67a]/50 bg-zinc-950/95 shadow-[0_25px_90px_rgba(0,0,0,0.65)] sm:h-[560px] sm:rounded-3xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[#c9a67a]/30 px-4 py-3">
            <div><h3 id="header-search-title" className="text-base font-semibold text-[#f5d2a2]">Guía VEDA</h3><p className="text-xs text-zinc-400">Búsqueda y orientación musical.</p></div>
            <button type="button" onClick={() => { resetGuideVedaChat(); setIsOpen(false); }} className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-100 transition hover:border-[#f5b21b]">✕</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_220ms_ease]`}>
                <div className={`max-w-[86%] rounded-2xl border px-3 py-2 text-sm ${message.role === 'user' ? 'border-[#c9a67a]/50 bg-[#c9a67a]/15 text-[#fae3c5]' : 'border-zinc-800 bg-zinc-900/80 text-zinc-100'}`}>
                  <p>{message.text}</p>
                  {message.kind === 'results' && message.results?.length ? <div className="mt-3 space-y-2">{message.results.map((result, index) => { const videoId = result.url.match(YOUTUBE_REGEX)?.[1] ?? null; return <article key={`${result.url}-${index}`} className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 p-2.5"><div className="flex gap-2.5">{result.image ? <img src={result.image} alt={result.title} className="h-14 w-14 rounded-lg border border-zinc-700 object-cover" /> : null}<div className="min-w-0 flex-1"><h4 className="line-clamp-2 text-sm font-semibold text-zinc-100">{result.title}</h4><p className="mt-1 text-[10px] uppercase tracking-wide text-[#c9a67a]">{result.type} · {result.source}</p><p className="mt-1.5 line-clamp-3 text-xs text-zinc-300">{result.snippet}</p><div className="mt-2">{videoId ? <button type="button" onClick={() => setVideoToPlay({ title: result.title, videoId })} className="rounded-full border border-[#c9a67a]/70 px-2 py-0.5 text-[11px] text-[#f5d2a2] transition hover:bg-[#c9a67a]/15">Ver aquí</button> : null}</div><p className="mt-2 text-[11px] text-zinc-500">vía {result.source || 'web'}</p></div></div></article>; })}</div> : null}
                </div>
              </div>
            ))}
            {isThinking ? <div className="flex justify-start"><div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-200"><span className="mr-2 text-xs text-zinc-400">VEDA está respondiendo</span><span className="inline-flex gap-1 align-middle"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d2a97c] [animation-delay:-0.2s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d2a97c] [animation-delay:-0.1s]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d2a97c]" /></span></div></div> : null}
            {uiNotice ? <p className="rounded-xl border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-200">{uiNotice}</p> : null}
            <div ref={bottomRef} />
          </div>
          <form className="sticky bottom-0 flex items-center gap-2 border-t border-[#c9a67a]/30 bg-zinc-950/95 px-3 py-3 sm:px-4" onSubmit={onSubmit}>
            <input ref={inputRef} value={query} onChange={(event) => { clearVoiceErrors(); clearUiNotice(); setQuery(event.target.value); }} placeholder="Escribe aquí…" className="w-full rounded-xl border border-zinc-700 bg-zinc-900/75 px-4 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-[#c9a67a]" maxLength={80} />
            <button type="button" disabled={isThinking || voiceInput.isProcessing} onClick={handleMicButtonClick} className="rounded-xl border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 transition hover:border-[#c9a67a] disabled:cursor-not-allowed disabled:opacity-50">{voiceInput.isRecording ? '⏹️' : '🎙️'}</button>
            <button type="button" disabled={isThinking || voiceReply.isLoadingAudio} onClick={handleAudioReplyButtonClick} className="rounded-xl border border-zinc-700 px-3 py-2.5 text-sm text-zinc-100 transition hover:border-[#c9a67a] disabled:cursor-not-allowed disabled:opacity-50">{voiceReply.isSpeaking ? '🔈' : '🔊'}</button>
            <button type="submit" disabled={isThinking} className="rounded-xl border border-[#c9a67a]/70 bg-[#c9a67a]/10 px-4 py-2.5 text-sm font-medium text-[#f5d2a2] transition hover:bg-[#c9a67a]/20 disabled:opacity-60">Enviar</button>
          </form>
        </div>
        {videoToPlay ? <EmbeddedVideoModal title={videoToPlay.title} youtubeVideoId={videoToPlay.videoId} onClose={() => setVideoToPlay(null)} /> : null}
      </div>
    );
  }, [clearUiNotice, closeModal, hasUsedAudioReply, hasUsedMic, isOpen, isThinking, messages, query, resetGuideVedaChat, uiNotice, videoToPlay, voiceInput.isProcessing, voiceInput.isRecording, voiceReply.isLoadingAudio, voiceReply.isSpeaking]);

  return (
    <>
      <button type="button" onClick={() => { resetGuideVedaChat(); setIsOpen(true); }} aria-label="Abrir Guía VEDA" title="Busca música o recibe orientación." className="hidden items-center gap-2 rounded-full border border-[#c9a67a]/80 bg-zinc-950/90 px-4 py-2 text-sm font-medium text-[#f5d2a2] shadow-[0_0_18px_rgba(201,166,122,0.26)] transition hover:border-[#f5d2a2] hover:shadow-[0_0_24px_rgba(245,210,162,0.35)] md:inline-flex"><span aria-hidden="true">🔎</span><span>Guía VEDA</span></button>
      <button type="button" onClick={() => { resetGuideVedaChat(); setIsOpen(true); }} aria-label="Abrir Guía VEDA" title="Busca música o recibe orientación." className="fixed bottom-20 right-4 z-[210] inline-flex items-center gap-2 rounded-full border border-[#c9a67a]/80 bg-zinc-950/95 px-4 py-2 text-sm font-medium text-[#f5d2a2] shadow-[0_0_18px_rgba(201,166,122,0.3)] transition hover:border-[#f5d2a67a] hover:shadow-[0_0_26px_rgba(245,210,162,0.35)] md:hidden"><span aria-hidden="true">✨</span><span>Guía VEDA</span></button>
      {isMounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}

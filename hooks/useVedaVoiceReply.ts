'use client';

import { useCallback, useRef, useState } from 'react';

const FRIENDLY_ERROR = 'No pude reproducir audio ahora. Sigue con el texto.';

export function useVedaVoiceReply() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const stop = useCallback(() => {
    setError(null);
    cleanupAudio();
  }, [cleanupAudio]);

  const speak = useCallback(async (text: string) => {
    const normalized = text.trim();
    if (!normalized) return;

    stop();
    setIsLoadingAudio(true);

    try {
      const response = await fetch('/api/veda/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: normalized }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message ?? FRIENDLY_ERROR);
        return;
      }

      const blob = await response.blob();
      if (!blob.size) {
        setError(FRIENDLY_ERROR);
        return;
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      urlRef.current = url;
      audioRef.current = audio;

      audio.onended = cleanupAudio;
      audio.onerror = () => {
        setError(FRIENDLY_ERROR);
        cleanupAudio();
      };

      setIsSpeaking(true);
      await audio.play();
    } catch {
      setError(FRIENDLY_ERROR);
      cleanupAudio();
    } finally {
      setIsLoadingAudio(false);
    }
  }, [cleanupAudio, stop]);

  return {
    isSpeaking,
    isLoadingAudio,
    error,
    speak,
    stop,
  };
}

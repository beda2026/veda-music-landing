'use client';

import { useCallback, useRef, useState } from 'react';

const MAX_RECORDING_MS = 10_000;
const MIN_RECORDING_MS = 500;
const MAX_BLOB_SIZE_BYTES = 6 * 1024 * 1024;
const FRIENDLY_ERROR = 'No pude escuchar bien. Intenta otra vez o escríbeme.';

function resolveSupportedMimeType(): string | undefined {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return undefined;

  const candidates = ['audio/webm', 'audio/mp4', 'audio/mpeg'];
  for (const candidate of candidates) {
    if (MediaRecorder.isTypeSupported(candidate)) return candidate;
  }

  return undefined;
}

export function useVedaVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSupported = typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
    chunksRef.current = [];
    startedAtRef.current = null;
    setIsRecording(false);
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;

    recorder.stop();
  }, []);

  const cancelRecording = useCallback(() => {
    setError(null);
    setTranscript(null);
    cleanup();
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    if (!isSupported || isRecording || isProcessing) {
      if (!isSupported) setError('No pude activar el micrófono. Escríbeme y te guío igual.');
      return;
    }

    setError(null);
    setTranscript(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = resolveSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setError(FRIENDLY_ERROR);
        cleanup();
      };

      recorder.onstop = async () => {
        setIsRecording(false);

        const durationMs = startedAtRef.current ? Date.now() - startedAtRef.current : 0;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        cleanup();

        if (durationMs < MIN_RECORDING_MS || blob.size === 0 || blob.size > MAX_BLOB_SIZE_BYTES) {
          setError(FRIENDLY_ERROR);
          return;
        }

        setIsProcessing(true);

        try {
          const formData = new FormData();
          formData.append('audio', blob, `veda-voice.${blob.type.includes('mp4') ? 'm4a' : 'webm'}`);
          formData.append('durationSeconds', String((durationMs / 1000).toFixed(2)));

          const response = await fetch('/api/veda/voice/transcribe', { method: 'POST', body: formData });
          const data = (await response.json()) as { ok: boolean; text?: string; message?: string };

          if (!response.ok || !data.ok || !data.text) {
            setError(data.message ?? FRIENDLY_ERROR);
            return;
          }

          setTranscript(data.text.trim());
        } catch {
          setError(FRIENDLY_ERROR);
        } finally {
          setIsProcessing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      timeoutRef.current = setTimeout(() => {
        void stopRecording();
      }, MAX_RECORDING_MS);
    } catch {
      setError('No pude activar el micrófono. Escríbeme y te guío igual.');
      cleanup();
    }
  }, [cleanup, isProcessing, isRecording, isSupported, stopRecording]);

  return {
    isRecording,
    isProcessing,
    error,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}

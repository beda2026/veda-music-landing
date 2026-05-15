'use client';

import { useEffect, useState } from 'react';

export default function VisitCounter() {
  const [mounted, setMounted] = useState(false);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const key = 'veda_music_visits';
    const stored = localStorage.getItem(key);
    const current = stored ? Number.parseInt(stored, 10) : 0;
    const next = Number.isNaN(current) ? 1 : current + 1;
    localStorage.setItem(key, String(next));
    setVisits(next);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <p className="text-sm text-zinc-400">Visitas en este navegador: {visits}</p>;
}

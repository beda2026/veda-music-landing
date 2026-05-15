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

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-[#0f0f10] via-[#141416] to-[#1a1310] px-4 py-2 shadow-[0_0_0_1px_rgba(220,38,38,0.25),0_8px_24px_rgba(0,0,0,0.35)]">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200">VISITAS DIGITALES:</span>
      <span className="text-sm font-bold text-amber-300">{visits}</span>
    </div>
  );
}

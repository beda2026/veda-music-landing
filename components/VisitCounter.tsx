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

  const formattedVisits = visits.toString().padStart(6, '0');

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-[#f5b21b66] bg-gradient-to-b from-[#0f0e0b] to-[#18130d] px-3 py-2 shadow-[0_0_0_1px_rgba(245,178,27,0.22),0_10px_22px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-zinc-200">VISITAS DIGITALES</span>
      <span className="rounded-md border border-[#f5b21b7a] bg-[#0c0b09] px-3 py-1 font-mono text-base font-bold tracking-[0.22em] text-[#f5b21b] shadow-[inset_0_0_10px_rgba(245,178,27,0.22)]">
        {formattedVisits}
      </span>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'veda-music-local-views';
const BASE_VIEWS = 350;

export default function VisitCounter() {
  const [mounted, setMounted] = useState(false);
  const [visits, setVisits] = useState(BASE_VIEWS);
  const countedRef = useRef(false);

  useEffect(() => {
    if (countedRef.current) return;
    countedRef.current = true;

    let nextVisits = BASE_VIEWS;

    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      const parsedValue = storedValue ? Number.parseInt(storedValue, 10) : Number.NaN;

      if (Number.isFinite(parsedValue)) {
        nextVisits = parsedValue;
      }

      nextVisits += 1;
      localStorage.setItem(STORAGE_KEY, nextVisits.toString());
    } catch {
      nextVisits += 1;
    }

    setVisits(nextVisits);
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

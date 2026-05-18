'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'veda-music-visit-counted';
const SESSION_LOCK_KEY = 'veda-music-visit-counted-lock';

export default function VisitCounter() {
  const [mounted, setMounted] = useState(false);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    let active = true;

    const updateViews = async () => {
      const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === '1';
      const countLocked = sessionStorage.getItem(SESSION_LOCK_KEY) === '1';
      const shouldCountVisit = !alreadyCounted && !countLocked;
      const method = shouldCountVisit ? 'POST' : 'GET';

      if (shouldCountVisit) {
        sessionStorage.setItem(SESSION_LOCK_KEY, '1');
      }

      try {
        const response = await fetch('/api/visits', {
          method,
          cache: 'no-store',
          headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
        });

        if (response.ok) {
          const data = (await response.json()) as { views?: number };
          if (typeof data.views === 'number' && active) {
            setVisits(data.views);
          }

          if (method === 'POST') {
            sessionStorage.setItem(SESSION_KEY, '1');
          }
        }
      } catch {
        // Silent fallback to avoid breaking the landing page UI.
      } finally {
        sessionStorage.removeItem(SESSION_LOCK_KEY);
        if (active) {
          setMounted(true);
        }
      }
    };

    updateViews();

    return () => {
      active = false;
    };
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

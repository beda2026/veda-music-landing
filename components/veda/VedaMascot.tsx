'use client';

import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Position = { x: number; y: number };

const POSITION_STORAGE_KEY = 'veda-floating-avatar-position-left-v1';
const TOOLTIP_TEXT = 'Ey, chequea los auspicios que apoyan el movimiento.';

const DESKTOP_SIZE = 96;
const MOBILE_SIZE = 76;
const MOBILE_BREAKPOINT = 768;

const MIN_X = 12;
const MIN_Y = 80;
const BOTTOM_SAFE_OFFSET = 150;

function isMobileViewport() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getAvatarSize() {
  return isMobileViewport() ? MOBILE_SIZE : DESKTOP_SIZE;
}

function getSafeInitialPosition(): Position {
  if (isMobileViewport()) {
    return { x: 18, y: window.innerHeight - 240 };
  }
  return { x: 32, y: window.innerHeight - 260 };
}

function clampPosition(raw: Position, avatarSize: number): Position {
  const maxX = Math.max(MIN_X, window.innerWidth - avatarSize - 12);
  const maxY = Math.max(MIN_Y, window.innerHeight - avatarSize - BOTTOM_SAFE_OFFSET);

  return {
    x: Math.min(Math.max(raw.x, MIN_X), maxX),
    y: Math.min(Math.max(raw.y, MIN_Y), maxY),
  };
}

function getValidatedPosition(avatarSize: number): Position {
  const fallback = clampPosition(getSafeInitialPosition(), avatarSize);

  const raw = window.localStorage.getItem(POSITION_STORAGE_KEY);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as Position;
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') {
      return fallback;
    }
    const clamped = clampPosition(parsed, avatarSize);
    const movedByClamp = clamped.x !== parsed.x || clamped.y !== parsed.y;
    return movedByClamp ? fallback : clamped;
  } catch {
    return fallback;
  }
}

export function VedaMascot() {
  const [position, setPosition] = useState<Position | null>(null);
  const [avatarSize, setAvatarSize] = useState<number>(DESKTOP_SIZE);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktopHovering, setIsDesktopHovering] = useState(false);
  const [canHoverTooltip, setCanHoverTooltip] = useState(false);

  const dragStateRef = useRef({
    pointerId: -1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
  });

  useEffect(() => {
    setCanHoverTooltip(window.matchMedia('(hover: hover) and (pointer: fine)').matches);

    const size = getAvatarSize();
    setAvatarSize(size);
    setPosition(getValidatedPosition(size));
  }, []);

  useEffect(() => {
    const onResize = () => {
      const nextSize = getAvatarSize();
      setAvatarSize(nextSize);
      setPosition((current) => {
        if (!current) return getValidatedPosition(nextSize);
        return clampPosition(current, nextSize);
      });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const endDrag = useCallback(() => {
    const drag = dragStateRef.current;
    if (!drag.dragging) return;

    drag.dragging = false;
    drag.pointerId = -1;
    setIsDragging(false);
    setPosition((current) => {
      if (!current) return current;
      const clamped = clampPosition(current, avatarSize);
      window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(clamped));
      return clamped;
    });
  }, [avatarSize]);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!position) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
      dragging: true,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDesktopHovering(false);
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag.dragging || drag.pointerId !== event.pointerId) return;

    const nextPosition = clampPosition(
      {
        x: event.clientX - drag.offsetX,
        y: event.clientY - drag.offsetY,
      },
      avatarSize
    );

    setPosition(nextPosition);
  };

  const showTooltip = canHoverTooltip && !isDragging && isDesktopHovering;

  return (
    <div
      className="fixed z-[9999]"
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${avatarSize}px`,
              height: `${avatarSize}px`,
              userSelect: 'none',
            }
          : { visibility: 'hidden' }
      }
    >
      {showTooltip ? (
        <div
          className="pointer-events-none absolute rounded-xl border border-amber-300/30 bg-black/80 px-3 py-2 text-xs text-amber-100"
          style={{
            bottom: 'calc(100% + 10px)',
            right: 0,
            maxWidth: '220px',
            lineHeight: 1.3,
          }}
        >
          {TOOLTIP_TEXT}
        </div>
      ) : null}

      <button
        type="button"
        aria-label="V.E.D.A. Music avatar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => setIsDesktopHovering(true)}
        onMouseLeave={() => setIsDesktopHovering(false)}
        className="relative block"
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none',
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <Image
          src="/assets/avatars/veda-avatar-listen.png"
          alt="V.E.D.A. Music mascot"
          fill
          priority
          sizes="(max-width: 767px) 76px, 96px"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </button>
    </div>
  );
}

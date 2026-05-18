'use client';

import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type Pose = 'idle' | 'wave' | 'point' | 'pointRight' | 'pointDown' | 'laugh' | 'troll' | 'mock' | 'dance' | 'clap' | 'celebrate';
type MascotVisualState = 'idle' | 'hover' | 'dragging';

const poseImageMap: Record<Pose, string> = {
  idle: '/assets/avatars/veda-avatar-listen.png',
  wave: '/assets/avatars/veda-avatar-wave.png',
  point: '/assets/avatars/veda-avatar-point.png',
  pointRight: '/assets/avatars/veda-avatar-point-right.png',
  pointDown: '/assets/avatars/veda-avatar-point-down.png',
  laugh: '/assets/avatars/veda-avatar-laugh.png',
  troll: '/assets/avatars/veda-avatar-troll.png',
  mock: '/assets/avatars/veda-avatar-mock.png',
  dance: '/assets/avatars/veda-avatar-dance.png',
  clap: '/assets/avatars/veda-avatar-clap.png',
  celebrate: '/assets/avatars/veda-avatar-celebrate.png',
};

const HOVER_POSE: Pose = 'point';
const celebrationPoses: Pose[] = ['dance', 'clap', 'celebrate'];

const speechBubbles = [
  'Ey, chequea los auspicios que apoyan el movimiento.',
  'Dale una mirada a los panas que están respaldando VEDA Music.',
  'Esto es parte del movimiento, mira quiénes están apoyando.',
  'Apoya a los que apoyan la cultura.',
];
const POSITION_STORAGE_KEY = 'veda-mascot-position';
const SCREEN_MARGIN = 12;
const DRAG_THRESHOLD = 6;

type Position = { x: number; y: number };

const clickSpeechBubbles = ['Pregunta por tu espacio.', 'Tu marca puede montarse aquí.', 'Activa tu auspicio con VEDA.'];

export function VedaMascot() {
  const mascotRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStateRef = useRef({
    pointerId: -1,
    isDragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const [currentPose, setCurrentPose] = useState<Pose>('idle');
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [visualState, setVisualState] = useState<MascotVisualState>('idle');

  const clampPosition = useCallback((nextX: number, nextY: number): Position => {
    if (!containerRef.current) return { x: nextX, y: nextY };
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = Math.max(SCREEN_MARGIN, window.innerWidth - rect.width - SCREEN_MARGIN);
    const maxY = Math.max(SCREEN_MARGIN, window.innerHeight - rect.height - SCREEN_MARGIN);

    return {
      x: Math.min(Math.max(nextX, SCREEN_MARGIN), maxX),
      y: Math.min(Math.max(nextY, SCREEN_MARGIN), maxY),
    };
  }, []);

  const getDefaultPosition = useCallback((): Position => {
    if (!containerRef.current) {
      return {
        x: window.innerWidth - SCREEN_MARGIN - 128,
        y: window.innerHeight - SCREEN_MARGIN - 128,
      };
    }

    const rect = containerRef.current.getBoundingClientRect();
    return clampPosition(
      window.innerWidth - SCREEN_MARGIN - rect.width,
      window.innerHeight - SCREEN_MARGIN - rect.height
    );
  }, [clampPosition]);

  // Detect if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const savedRaw = window.localStorage.getItem(POSITION_STORAGE_KEY);
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw) as Position;
        if (typeof saved.x === 'number' && typeof saved.y === 'number') {
          setPosition(clampPosition(saved.x, saved.y));
          return;
        }
      } catch {
        // Ignore invalid storage payload and fallback to default.
      }
    }
    setPosition(getDefaultPosition());
  }, [clampPosition, getDefaultPosition]);

  const { contextSafe } = useGSAP(
    () => {
      if (!mascotRef.current || !containerRef.current || !bubbleRef.current || isDragging) return;
      if (prefersReducedMotion) return;

      // Idle floating animation
      gsap.to(mascotRef.current, {
        y: -8,
        duration: 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Subtle idle rotation
      gsap.to(mascotRef.current, {
        rotation: 2,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, isDragging] }
  );

  const playClickAnimation = contextSafe(() => {
    if (!mascotRef.current || prefersReducedMotion) return;

    // Celebration animation: scale and rotate
    gsap.to(mascotRef.current, {
      scale: 1.2,
      rotation: 15,
      duration: 0.3,
      ease: 'back.out',
    });

    gsap.to(mascotRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      delay: 0.3,
      ease: 'elastic.out',
    });

    // Additional bounce
    gsap.to(mascotRef.current, {
      y: -15,
      duration: 0.2,
      ease: 'power2.out',
    });

    gsap.to(mascotRef.current, {
      y: 0,
      duration: 0.3,
      delay: 0.2,
      ease: 'bounce.out',
    });
  });

  const playBubbleAnimation = contextSafe(() => {
    if (!bubbleRef.current || prefersReducedMotion) return;

    gsap.fromTo(
      bubbleRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: -10,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'back.out',
      }
    );
  });

  const hideBubbleAnimation = contextSafe(() => {
    if (!bubbleRef.current || prefersReducedMotion) return;

    gsap.to(bubbleRef.current, {
      opacity: 0,
      scale: 0.8,
      y: -10,
      duration: 0.3,
      ease: 'back.in',
      onComplete: () => setShowBubble(false),
    });
  });

  const handleMouseEnter = () => {
    if (isDragging) return;
    setIsHovering(true);
    setCurrentPose(HOVER_POSE);
    setBubbleText(speechBubbles[0]);
    setShowBubble(true);
    playBubbleAnimation();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentPose('idle');
    if (prefersReducedMotion) {
      setShowBubble(false);
      return;
    }
    hideBubbleAnimation();
  };

  const handleClick = () => {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }

    const randomCelebration = celebrationPoses[Math.floor(Math.random() * celebrationPoses.length)];
    setCurrentPose(randomCelebration);

    const randomSpeech = clickSpeechBubbles[Math.floor(Math.random() * clickSpeechBubbles.length)];
    setBubbleText(randomSpeech);
    setShowBubble(true);
    playBubbleAnimation();

    playClickAnimation();

    if (!prefersReducedMotion) {
      setTimeout(() => {
        setCurrentPose('idle');
      }, 1500);
    } else {
      setCurrentPose('idle');
    }
  };

  const handleDoubleClick = () => {
    window.localStorage.removeItem(POSITION_STORAGE_KEY);
    const defaultPosition = getDefaultPosition();
    setPosition(defaultPosition);
    setBubbleText('Volví a mi esquina.');
    setShowBubble(true);
    playBubbleAnimation();
  };

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    dragStateRef.current = {
      pointerId: e.pointerId,
      isDragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - containerRect.left,
      offsetY: e.clientY - containerRect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsHovering(false);
    setShowBubble(false);
    setCurrentPose('idle');
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== e.pointerId) return;
    const next = clampPosition(e.clientX - dragState.offsetX, e.clientY - dragState.offsetY);
    if (!dragState.moved) {
      const dist = Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY);
      if (dist >= DRAG_THRESHOLD) {
        dragState.moved = true;
      }
    }
    setPosition(next);
  };

  const stopDragging = (pointerId: number) => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== pointerId) return;
    dragState.isDragging = false;
    setIsDragging(false);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const finalPosition = clampPosition(rect.left, rect.top);
      setPosition(finalPosition);
      if (dragState.moved) {
        window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(finalPosition));
      }
    }
    if (mascotRef.current?.matches(':hover')) {
      setIsHovering(true);
      setCurrentPose(HOVER_POSE);
      setBubbleText(speechBubbles[0]);
      setShowBubble(true);
    } else {
      setIsHovering(false);
      setCurrentPose('idle');
    }
  };

  useEffect(() => {
    if (isDragging) {
      setVisualState('dragging');
      return;
    }
    if (isHovering) {
      setVisualState('hover');
      return;
    }
    setVisualState('idle');
  }, [isDragging, isHovering]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => {
        if (!current) return current;
        return clampPosition(current.x, current.y);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

  return (
    <div
      ref={containerRef}
      className="fixed z-[60] flex flex-col items-center gap-2"
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              userSelect: isDragging ? 'none' : 'auto',
              transition: isDragging ? 'none' : 'left 180ms ease, top 180ms ease',
            }
          : { visibility: 'hidden' }
      }
    >
      {/* Speech Bubble */}
      {showBubble && bubbleText && (
        <div
          ref={bubbleRef}
          className="mb-2 rounded-2xl border border-amber-300/30 bg-black/75 px-3 py-2 text-sm text-amber-100 backdrop-blur-md"
          style={{
            maxWidth: '160px',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {bubbleText}
        </div>
      )}

      {/* Avatar Button */}
      <button
        ref={mascotRef}
        type="button"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => stopDragging(e.pointerId)}
        onPointerCancel={(e) => stopDragging(e.pointerId)}
        aria-label="V.E.D.A. Music avatar"
        data-avatar-state={visualState}
        className="relative flex h-20 w-20 items-center justify-center rounded-full transition-shadow duration-300 hover:drop-shadow-[0_0_12px_rgba(245,178,27,0.4)] sm:h-28 sm:w-28 lg:h-32 lg:w-32"
        style={{
          filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(245, 178, 27, 0.2))',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        <Image
          ref={imageRef}
          src={poseImageMap[currentPose]}
          alt="V.E.D.A. Music mascot"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 128px"
        />
      </button>
    </div>
  );
}

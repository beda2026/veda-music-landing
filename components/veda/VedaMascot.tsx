'use client';

import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type Pose = 'idle' | 'wave' | 'point' | 'pointRight' | 'pointDown' | 'laugh' | 'troll' | 'mock' | 'dance' | 'clap' | 'celebrate';

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

const hoverPoses: Pose[] = ['troll', 'mock', 'laugh', 'point', 'pointRight'];
const celebrationPoses: Pose[] = ['dance', 'clap', 'celebrate'];

const speechBubbles = [
  '¿Vas a darle play o qué?',
  'Eso quedó duro.',
  'No me ignores.',
  'Dale scroll, jefe.',
  'Aquí hay movimiento.',
  'Mira eso ahí abajo.',
];
const POSITION_STORAGE_KEY = 'veda-mascot-position';
const SCREEN_MARGIN = 12;
const DRAG_THRESHOLD = 6;

type Position = { x: number; y: number };

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
  }, [clampPosition, getDefaultPosition]);

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
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (!mascotRef.current || !containerRef.current || !bubbleRef.current) return;
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
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  const playHoverAnimation = contextSafe(() => {
    if (!mascotRef.current || prefersReducedMotion) return;

    // Quick shake/bounce on hover
    gsap.to(mascotRef.current, {
      x: -4,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: 'power2.inOut',
    });
  });

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
    playHoverAnimation();

    // Random hover pose
    const randomPose = hoverPoses[Math.floor(Math.random() * hoverPoses.length)];
    setCurrentPose(randomPose);

    // Show speech bubble with random text
    const randomSpeech = speechBubbles[Math.floor(Math.random() * speechBubbles.length)];
    setBubbleText(randomSpeech);
    setShowBubble(true);
    playBubbleAnimation();
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion) {
      setTimeout(() => {
        setCurrentPose('idle');
        hideBubbleAnimation();
      }, 1000);
    } else {
      setCurrentPose('idle');
      setShowBubble(false);
    }
  };

  const handleClick = () => {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }

    const randomCelebration = celebrationPoses[Math.floor(Math.random() * celebrationPoses.length)];
    setCurrentPose(randomCelebration);
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
    if (position && dragState.moved) {
      window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
    }
  };

  // Subtle parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || prefersReducedMotion) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * 0.02;
      const distY = (e.clientY - centerY) * 0.02;

      gsap.to(containerRef.current, {
        x: distX,
        y: distY,
        duration: 0.5,
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

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
            }
          : { visibility: 'hidden' }
      }
    >
      {/* Speech Bubble */}
      {showBubble && (
        <div
          ref={bubbleRef}
          className="mb-2 rounded-2xl border border-amber-300/30 bg-black/75 px-3 py-2 text-sm text-amber-100 backdrop-blur-md"
          style={{
            maxWidth: '160px',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            textAlign: 'center',
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

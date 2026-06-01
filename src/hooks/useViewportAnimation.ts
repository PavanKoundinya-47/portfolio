'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

interface UseViewportAnimationOptions {
  delay?: number;
  duration?: number;
  direction?: 'up' | 'left' | 'right';
}

function getDirectionalOffset(direction: 'up' | 'left' | 'right') {
  switch (direction) {
    case 'up':
      return { y: 20 };
    case 'left':
      return { x: -20 };
    case 'right':
      return { x: 20 };
  }
}

/**
 * Returns Framer Motion animation props for viewport-triggered fade-in animations.
 * Respects the user's reduced motion preference.
 *
 * - Triggers when element is at least 20% visible in viewport (once)
 * - Supports configurable delay, duration (default 400ms), and direction (up, left, right)
 * - When reduced motion is active, returns final state immediately with no animation
 */
export function useViewportAnimation(options?: UseViewportAnimationOptions) {
  const { delay = 0, duration = 0.4, direction = 'up' } = options ?? {};
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      ref,
      initial: { opacity: 1, x: 0, y: 0 },
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0 },
    };
  }

  const offset = getDirectionalOffset(direction);

  const initial = {
    opacity: 0,
    ...offset,
  };

  const animate = isInView
    ? { opacity: 1, x: 0, y: 0 }
    : initial;

  const transition = {
    duration,
    delay,
    ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number], // cubic-bezier easing
  };

  return {
    ref,
    initial,
    animate,
    transition,
  };
}

export default useViewportAnimation;

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  layer: 'far' | 'near';
  twinkleOffset: number;
  driftSpeed: number;
}

export interface StarfieldProps {
  starCount?: number;
  className?: string;
}

/**
 * Generates an array of Star objects distributed across two depth layers.
 * Far stars (60% of count): smaller (0.5-1px), slower drift.
 * Near stars (40% of count): larger (1-2px), faster drift.
 *
 * Exported separately for property-based testing (Property 1).
 */
export function generateStars(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): Star[] {
  const clampedCount = Math.max(50, Math.min(200, count));
  const farCount = Math.round(clampedCount * 0.6);
  const nearCount = clampedCount - farCount;
  const stars: Star[] = [];

  for (let i = 0; i < farCount; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 0.5 + Math.random() * 0.5, // 0.5-1px
      opacity: 0.3 + Math.random() * 0.4, // 0.3-0.7
      layer: 'far',
      twinkleOffset: Math.random() * Math.PI * 2,
      driftSpeed: 0.05 + Math.random() * 0.1, // slow drift
    });
  }

  for (let i = 0; i < nearCount; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 1 + Math.random() * 1, // 1-2px
      opacity: 0.5 + Math.random() * 0.5, // 0.5-1.0
      layer: 'near',
      twinkleOffset: Math.random() * Math.PI * 2,
      driftSpeed: 0.15 + Math.random() * 0.2, // faster drift
    });
  }

  return stars;
}

const FRAME_TIME = 1000 / 30; // 30fps throttle (~33ms)

export default function Starfield({ starCount = 150, className = '' }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const drawStars = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const star of starsRef.current) {
        // Calculate twinkling opacity variation
        const twinkle = prefersReducedMotion
          ? star.opacity
          : star.opacity * (0.7 + 0.3 * Math.sin(time * 0.001 + star.twinkleOffset));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.fill();
      }
    },
    [prefersReducedMotion]
  );

  const updateStars = useCallback((width: number, height: number) => {
    for (const star of starsRef.current) {
      // Slow upward drift to simulate gentle movement
      star.y -= star.driftSpeed;

      // Wrap around when star goes off screen
      if (star.y < -star.size) {
        star.y = height + star.size;
        star.x = Math.random() * width;
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size at device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Generate stars
    starsRef.current = generateStars(starCount, rect.width, rect.height);

    // If reduced motion, draw static stars and return
    if (prefersReducedMotion) {
      drawStars(ctx, rect.width, rect.height, 0);
      return;
    }

    // Animation loop with 30fps throttle
    const animate = (time: number) => {
      if (document.hidden) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = time - lastFrameTimeRef.current;

      if (elapsed >= FRAME_TIME) {
        lastFrameTimeRef.current = time - (elapsed % FRAME_TIME);
        updateStars(rect.width, rect.height);
        drawStars(ctx, rect.width, rect.height, time);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Pause/resume on visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Animation loop will skip rendering when hidden
      } else {
        // Reset frame time to avoid large delta on resume
        lastFrameTimeRef.current = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [starCount, prefersReducedMotion, drawStars, updateStars]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Regenerate stars for new dimensions
      starsRef.current = generateStars(starCount, rect.width, rect.height);

      if (prefersReducedMotion) {
        drawStars(ctx, rect.width, rect.height, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [starCount, prefersReducedMotion, drawStars]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
      aria-hidden="true"
      data-testid="starfield-canvas"
    />
  );
}

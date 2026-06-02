'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function SatelliteCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Don't show custom cursor on touch devices or if reduced motion
    if (prefersReducedMotion || 'ontouchstart' in window) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;

    // Direct cursor follow - no lag, instant positioning
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
      if (cursor) {
        cursor.style.transform = `translate(${mouseX - 12}px, ${mouseY - 12}px)`;
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, textarea, select, [tabindex], .group, [data-hoverable]')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, [role="button"], input, textarea, select, [tabindex], .group, [data-hoverable]')
      ) {
        setIsHovering(false);
      }
    };

    // Also detect hover via mouseover on any non-background element
    const handleMouseDown = () => setIsHovering(true);
    const handleMouseUp = () => setIsHovering(false);

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseOut);
    };
  }, [isVisible, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Signal transmission rings - always visible */}
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="absolute w-10 h-10 rounded-full border border-green-400/40 animate-[ping_1.5s_ease-out_infinite]" />
        <span className="absolute w-7 h-7 rounded-full border border-green-400/30 animate-[ping_1.5s_ease-out_0.3s_infinite]" />
        <span className="absolute w-4 h-4 rounded-full border border-green-400/20 animate-[ping_1.5s_ease-out_0.6s_infinite]" />
      </div>

      {/* Satellite dish PNG */}
      <img
        src="/sattelite-dish.png"
        alt=""
        width={24}
        height={24}
        className={`transition-transform duration-200 ${
          isHovering ? 'scale-110' : 'scale-100'
        }`}
        draggable={false}
      />
    </div>
  );
}

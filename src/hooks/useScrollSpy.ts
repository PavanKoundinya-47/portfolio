'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Monitors which section is currently in the viewport using Intersection Observer.
 * Returns the ID of the currently active section for navigation highlighting.
 *
 * @param sectionIds - Array of section element IDs to observe
 * @param options - Optional IntersectionObserver configuration
 * @returns The ID of the section whose top boundary is closest to the viewport top, or null
 */
export function useScrollSpy(
  sectionIds: string[],
  options?: IntersectionObserverInit
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const intersectingRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    if (sectionIds.length === 0) return;

    // Reset tracking when section IDs change
    intersectingRef.current = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          intersectingRef.current.set(id, entry);
        } else {
          intersectingRef.current.delete(id);
        }
      });

      if (intersectingRef.current.size === 0) {
        setActiveId(null);
        return;
      }

      // Find the section whose top boundary is closest to the viewport top
      let closestId: string | null = null;
      let closestDistance = Infinity;

      intersectingRef.current.forEach((entry, id) => {
        const distance = Math.abs(entry.boundingClientRect.top);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      });

      setActiveId(closestId);
    }, {
      root: options?.root ?? null,
      rootMargin: options?.rootMargin ?? '0px 0px -60% 0px',
      threshold: options?.threshold ?? 0,
    });

    // Observe each section element that exists in the DOM
    const elements: Element[] = [];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        elements.push(element);
      }
    });

    // Cleanup observer on unmount
    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(','), options?.root, options?.rootMargin, options?.threshold]);

  return activeId;
}

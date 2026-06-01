import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getInitialState(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * Returns a reactive boolean indicating whether the user has enabled
 * the "prefers-reduced-motion: reduce" OS accessibility setting.
 *
 * Handles SSR by returning false when window is undefined.
 * Listens for changes to the media query so the value updates
 * if the user toggles the setting while the page is open.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;

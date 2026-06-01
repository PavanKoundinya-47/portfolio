import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock framer-motion's useInView
vi.mock('framer-motion', () => ({
  useInView: vi.fn(() => false),
}));

// Mock useReducedMotion
vi.mock('./useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useViewportAnimation } from './useViewportAnimation';
import { useInView } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

describe('useViewportAnimation', () => {
  beforeEach(() => {
    vi.mocked(useInView).mockReturnValue(false);
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useViewportAnimation());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('returns initial state with opacity 0 and upward offset by default', () => {
    const { result } = renderHook(() => useViewportAnimation());
    expect(result.current.initial).toEqual({ opacity: 0, y: 20 });
  });

  it('returns non-animated state when element is not in view', () => {
    vi.mocked(useInView).mockReturnValue(false);
    const { result } = renderHook(() => useViewportAnimation());
    expect(result.current.animate).toEqual({ opacity: 0, y: 20 });
  });

  it('returns animated state when element is in view', () => {
    vi.mocked(useInView).mockReturnValue(true);
    const { result } = renderHook(() => useViewportAnimation());
    expect(result.current.animate).toEqual({ opacity: 1, x: 0, y: 0 });
  });

  it('uses default duration of 0.4s (400ms)', () => {
    const { result } = renderHook(() => useViewportAnimation());
    expect(result.current.transition.duration).toBe(0.4);
  });

  it('uses default delay of 0', () => {
    const { result } = renderHook(() => useViewportAnimation());
    expect(result.current.transition.delay).toBe(0);
  });

  it('supports custom delay', () => {
    const { result } = renderHook(() => useViewportAnimation({ delay: 0.2 }));
    expect(result.current.transition.delay).toBe(0.2);
  });

  it('supports custom duration', () => {
    const { result } = renderHook(() => useViewportAnimation({ duration: 0.5 }));
    expect(result.current.transition.duration).toBe(0.5);
  });

  describe('direction support', () => {
    it('direction "up" uses translateY(20px) offset', () => {
      const { result } = renderHook(() => useViewportAnimation({ direction: 'up' }));
      expect(result.current.initial).toEqual({ opacity: 0, y: 20 });
    });

    it('direction "left" uses translateX(-20px) offset', () => {
      const { result } = renderHook(() => useViewportAnimation({ direction: 'left' }));
      expect(result.current.initial).toEqual({ opacity: 0, x: -20 });
    });

    it('direction "right" uses translateX(20px) offset', () => {
      const { result } = renderHook(() => useViewportAnimation({ direction: 'right' }));
      expect(result.current.initial).toEqual({ opacity: 0, x: 20 });
    });
  });

  describe('reduced motion', () => {
    it('returns final state immediately when reduced motion is active', () => {
      vi.mocked(useReducedMotion).mockReturnValue(true);
      const { result } = renderHook(() => useViewportAnimation());
      expect(result.current.initial).toEqual({ opacity: 1, x: 0, y: 0 });
      expect(result.current.animate).toEqual({ opacity: 1, x: 0, y: 0 });
      expect(result.current.transition.duration).toBe(0);
    });

    it('ignores direction when reduced motion is active', () => {
      vi.mocked(useReducedMotion).mockReturnValue(true);
      const { result } = renderHook(() => useViewportAnimation({ direction: 'left' }));
      expect(result.current.initial).toEqual({ opacity: 1, x: 0, y: 0 });
      expect(result.current.animate).toEqual({ opacity: 1, x: 0, y: 0 });
    });
  });

  it('passes amount: 0.2 and once: true to useInView', () => {
    renderHook(() => useViewportAnimation());
    expect(useInView).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ amount: 0.2, once: true })
    );
  });

  it('includes easing in transition', () => {
    const { result } = renderHook(() => useViewportAnimation());
    expect(result.current.transition.ease).toBeDefined();
    expect(Array.isArray(result.current.transition.ease)).toBe(true);
  });
});

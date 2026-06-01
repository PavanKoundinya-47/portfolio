import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let listeners: Map<string, (event: MediaQueryListEvent) => void>;
  let matchesValue: boolean;

  beforeEach(() => {
    listeners = new Map();
    matchesValue = false;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: matchesValue,
        media: query,
        addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
          listeners.set(event, handler);
        }),
        removeEventListener: vi.fn((event: string) => {
          listeners.delete(event);
        }),
      })),
    });
  });

  it('returns false when prefers-reduced-motion is not set', () => {
    matchesValue = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when prefers-reduced-motion is reduce', () => {
    matchesValue = true;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('reacts to changes in the media query', () => {
    matchesValue = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // Simulate the OS setting changing
    act(() => {
      const handler = listeners.get('change');
      if (handler) {
        handler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it('cleans up the event listener on unmount', () => {
    const removeEventListenerSpy = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
          listeners.set(event, handler);
        }),
        removeEventListener: removeEventListenerSpy,
      })),
    });

    const { unmount } = renderHook(() => useReducedMotion());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

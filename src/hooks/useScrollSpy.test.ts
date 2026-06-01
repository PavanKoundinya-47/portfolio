import { renderHook, act } from '@testing-library/react';
import { useScrollSpy } from './useScrollSpy';

describe('useScrollSpy', () => {
  let observerCallback: IntersectionObserverCallback;
  let observerOptions: IntersectionObserverInit | undefined;
  let observedElements: Element[] = [];
  let disconnectMock: ReturnType<typeof vi.fn>;
  let unobserveMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observedElements = [];
    disconnectMock = vi.fn();
    unobserveMock = vi.fn();

    class MockIntersectionObserver {
      root = null;
      rootMargin = '';
      thresholds: number[] = [];

      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerCallback = callback;
        observerOptions = options;
      }

      observe(el: Element) {
        observedElements.push(el);
      }

      unobserve = unobserveMock;
      disconnect = disconnectMock;
      takeRecords() { return []; }
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  function createSection(id: string): HTMLElement {
    const section = document.createElement('section');
    section.id = id;
    document.body.appendChild(section);
    return section;
  }

  function simulateIntersection(entries: Partial<IntersectionObserverEntry>[]) {
    act(() => {
      observerCallback(
        entries as IntersectionObserverEntry[],
        {} as IntersectionObserver
      );
    });
  }

  it('returns null when no sections are intersecting', () => {
    createSection('about');
    createSection('projects');

    const { result } = renderHook(() =>
      useScrollSpy(['about', 'projects'])
    );

    expect(result.current).toBeNull();
  });

  it('returns the ID of the intersecting section', () => {
    const aboutEl = createSection('about');
    createSection('projects');

    const { result } = renderHook(() =>
      useScrollSpy(['about', 'projects'])
    );

    simulateIntersection([
      {
        target: aboutEl,
        isIntersecting: true,
        boundingClientRect: { top: 50 } as DOMRectReadOnly,
      },
    ]);

    expect(result.current).toBe('about');
  });

  it('returns the section closest to viewport top when multiple are intersecting', () => {
    const aboutEl = createSection('about');
    const projectsEl = createSection('projects');

    const { result } = renderHook(() =>
      useScrollSpy(['about', 'projects'])
    );

    simulateIntersection([
      {
        target: aboutEl,
        isIntersecting: true,
        boundingClientRect: { top: 200 } as DOMRectReadOnly,
      },
      {
        target: projectsEl,
        isIntersecting: true,
        boundingClientRect: { top: 50 } as DOMRectReadOnly,
      },
    ]);

    expect(result.current).toBe('projects');
  });

  it('removes section from tracking when it stops intersecting', () => {
    const aboutEl = createSection('about');
    const projectsEl = createSection('projects');

    const { result } = renderHook(() =>
      useScrollSpy(['about', 'projects'])
    );

    // Both intersecting
    simulateIntersection([
      {
        target: aboutEl,
        isIntersecting: true,
        boundingClientRect: { top: 200 } as DOMRectReadOnly,
      },
      {
        target: projectsEl,
        isIntersecting: true,
        boundingClientRect: { top: 50 } as DOMRectReadOnly,
      },
    ]);

    expect(result.current).toBe('projects');

    // Projects leaves viewport
    simulateIntersection([
      {
        target: projectsEl,
        isIntersecting: false,
        boundingClientRect: { top: -100 } as DOMRectReadOnly,
      },
    ]);

    expect(result.current).toBe('about');
  });

  it('handles sections that do not exist in the DOM', () => {
    createSection('about');
    // 'nonexistent' is not in the DOM

    const { result } = renderHook(() =>
      useScrollSpy(['about', 'nonexistent'])
    );

    // Should only observe the existing element
    expect(observedElements).toHaveLength(1);
    expect(observedElements[0].id).toBe('about');
    expect(result.current).toBeNull();
  });

  it('returns null for empty section IDs array', () => {
    const { result } = renderHook(() => useScrollSpy([]));
    expect(result.current).toBeNull();
  });

  it('cleans up observer on unmount', () => {
    createSection('about');

    const { unmount } = renderHook(() => useScrollSpy(['about']));

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('uses default rootMargin when no options provided', () => {
    createSection('about');

    renderHook(() => useScrollSpy(['about']));

    expect(observerOptions?.rootMargin).toBe('0px 0px -60% 0px');
  });

  it('uses custom options when provided', () => {
    createSection('about');

    renderHook(() =>
      useScrollSpy(['about'], {
        rootMargin: '-100px 0px 0px 0px',
        threshold: 0.5,
      })
    );

    expect(observerOptions?.rootMargin).toBe('-100px 0px 0px 0px');
    expect(observerOptions?.threshold).toBe(0.5);
  });

  it('considers absolute distance from viewport top (handles negative values)', () => {
    const aboutEl = createSection('about');
    const projectsEl = createSection('projects');

    const { result } = renderHook(() =>
      useScrollSpy(['about', 'projects'])
    );

    simulateIntersection([
      {
        target: aboutEl,
        isIntersecting: true,
        boundingClientRect: { top: -20 } as DOMRectReadOnly,
      },
      {
        target: projectsEl,
        isIntersecting: true,
        boundingClientRect: { top: 100 } as DOMRectReadOnly,
      },
    ]);

    // -20 has absolute distance 20, which is closer than 100
    expect(result.current).toBe('about');
  });
});

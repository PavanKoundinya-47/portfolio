import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useScrollSpy } from './useScrollSpy';

/**
 * Property 2: Scroll spy identifies active section
 *
 * For any set of section DOM elements with known vertical positions and any scroll offset,
 * the scroll spy hook SHALL return the ID of the section whose top boundary is closest to
 * (but not below) the current viewport top, or null if no section is in view.
 *
 * Validates: Requirements 5.8
 */
describe('Feature: portfolio-website, Property 2: Scroll spy identifies active section', () => {
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    class MockIntersectionObserver {
      root = null;
      rootMargin = '';
      thresholds: number[] = [];

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  /**
   * Arbitrary: generates a non-empty array of section entries, each with a unique ID
   * and a random boundingClientRect.top value representing its position relative to viewport.
   */
  const sectionEntryArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-z0-9-]*$/.test(s)),
    top: fc.double({ min: -5000, max: 5000, noNaN: true, noDefaultInfinity: true }),
    isIntersecting: fc.boolean(),
  });

  const sectionEntriesArb = fc
    .array(sectionEntryArb, { minLength: 1, maxLength: 10 })
    .map(entries => {
      // Ensure unique IDs
      const seen = new Set<string>();
      return entries.filter(e => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
    })
    .filter(entries => entries.length >= 1);

  it('returns the section with smallest absolute distance to viewport top among intersecting sections', () => {
    fc.assert(
      fc.property(sectionEntriesArb, (entries) => {
        // Clean up DOM from previous iteration
        document.body.innerHTML = '';

        // Create DOM elements for all sections
        const sectionIds = entries.map(e => e.id);
        sectionIds.forEach(id => {
          const el = document.createElement('section');
          el.id = id;
          document.body.appendChild(el);
        });

        // Render the hook
        const { result } = renderHook(() => useScrollSpy(sectionIds));

        // Simulate intersection entries
        const observerEntries = entries.map(e => ({
          target: document.getElementById(e.id)!,
          isIntersecting: e.isIntersecting,
          boundingClientRect: { top: e.top } as DOMRectReadOnly,
        }));

        act(() => {
          observerCallback(
            observerEntries as unknown as IntersectionObserverEntry[],
            {} as IntersectionObserver
          );
        });

        // Compute expected result
        const intersecting = entries.filter(e => e.isIntersecting);

        if (intersecting.length === 0) {
          // No sections in view → should return null
          return result.current === null;
        }

        // Find the section with smallest Math.abs(top)
        let expectedId = intersecting[0].id;
        let minDistance = Math.abs(intersecting[0].top);

        for (let i = 1; i < intersecting.length; i++) {
          const distance = Math.abs(intersecting[i].top);
          if (distance < minDistance) {
            minDistance = distance;
            expectedId = intersecting[i].id;
          }
        }

        return result.current === expectedId;
      }),
      { numRuns: 100 }
    );
  });

  it('returns null when no sections are intersecting regardless of positions', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-z0-9-]*$/.test(s)),
            top: fc.double({ min: -5000, max: 5000, noNaN: true, noDefaultInfinity: true }),
          }),
          { minLength: 1, maxLength: 10 }
        ).map(entries => {
          const seen = new Set<string>();
          return entries.filter(e => {
            if (seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
          });
        }).filter(entries => entries.length >= 1),
        (entries) => {
          document.body.innerHTML = '';

          const sectionIds = entries.map(e => e.id);
          sectionIds.forEach(id => {
            const el = document.createElement('section');
            el.id = id;
            document.body.appendChild(el);
          });

          const { result } = renderHook(() => useScrollSpy(sectionIds));

          // All entries are NOT intersecting
          const observerEntries = entries.map(e => ({
            target: document.getElementById(e.id)!,
            isIntersecting: false,
            boundingClientRect: { top: e.top } as DOMRectReadOnly,
          }));

          act(() => {
            observerCallback(
              observerEntries as unknown as IntersectionObserverEntry[],
              {} as IntersectionObserver
            );
          });

          return result.current === null;
        }
      ),
      { numRuns: 100 }
    );
  });
});

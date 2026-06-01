import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import React from 'react';
import * as fs from 'fs';
import * as path from 'path';

// Mock framer-motion to render elements without animation
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, variants, whileInView, viewport, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(
          ([key]) =>
            !key.startsWith('on') ||
            key === 'onClick' ||
            key === 'onMouseEnter' ||
            key === 'onMouseLeave' ||
            key === 'onTouchStart' ||
            key === 'onSubmit' ||
            key === 'onChange'
        )
      );
      return <div {...filteredProps}>{children}</div>;
    },
    h1: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, variants, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <h1 {...filteredProps}>{children}</h1>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, variants, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <p {...filteredProps}>{children}</p>;
    },
  },
  useInView: () => true,
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock useScrollSpy hook
vi.mock('../hooks/useScrollSpy', () => ({
  useScrollSpy: () => null,
}));

// Mock useViewportAnimation hook
vi.mock('../hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => ({
    ref: { current: null },
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  }),
  default: () => ({
    ref: { current: null },
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  }),
}));

// Track reduced motion mock value
let mockReducedMotion = false;

// Mock useReducedMotion hook
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockReducedMotion,
  default: () => mockReducedMotion,
}));

// Mock fetch for ResumeSection
global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true } as Response)
);

// Mock canvas for Starfield
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  scale: vi.fn(),
  fillStyle: '',
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

import Home from './page';

/**
 * Property 12: Heading hierarchy is valid
 *
 * For any rendered page state, there SHALL be exactly one h1 element,
 * and heading levels SHALL not skip (e.g., an h2 SHALL not be followed
 * by an h4 without an intervening h3).
 *
 * Validates: Requirements 16.3
 */
describe('Feature: portfolio-website, Property 12: Heading hierarchy is valid', () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it('the page has exactly one h1 element', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container, unmount } = render(<Home />);

        const h1Elements = container.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('heading levels do not skip (no h2 followed by h4 without h3)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container, unmount } = render(<Home />);

        // Collect all headings in document order
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const levels = Array.from(headings).map((h) =>
          parseInt(h.tagName.charAt(1), 10)
        );

        // Track which heading levels have been seen
        const seenLevels = new Set<number>();

        for (let i = 0; i < levels.length; i++) {
          const currentLevel = levels[i];

          // A heading level is valid if:
          // 1. It's the first heading (h1)
          // 2. It's the same or lower level than the previous
          // 3. It's at most one level deeper than the deepest ancestor seen
          if (i > 0) {
            const prevLevel = levels[i - 1];
            // If going deeper, it should only go one level deeper at a time
            if (currentLevel > prevLevel) {
              expect(currentLevel).toBeLessThanOrEqual(prevLevel + 1);
            }
          }

          seenLevels.add(currentLevel);
        }

        // Verify h1 exists
        expect(seenLevels.has(1)).toBe(true);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 13: Reduced motion disables non-essential animations
 *
 * For any animated component, when the `prefers-reduced-motion: reduce` media query
 * is active, the component SHALL render in its final visual state without motion
 * transitions or animation loops.
 *
 * Validates: Requirements 16.7, 20.6
 */
describe('Feature: portfolio-website, Property 13: Reduced motion disables non-essential animations', () => {
  it('when reduced motion is active, no animate-float class is present', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        mockReducedMotion = true;

        const { container, unmount } = render(<Home />);

        // Check that no element has the animate-float class (used for satellite animation)
        const floatingElements = container.querySelectorAll('.animate-float');
        expect(floatingElements.length).toBe(0);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('when reduced motion is active, no animate-twinkle class is present', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        mockReducedMotion = true;

        const { container, unmount } = render(<Home />);

        // Check that no element has the animate-twinkle class
        const twinklingElements = container.querySelectorAll('.animate-twinkle');
        expect(twinklingElements.length).toBe(0);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('when reduced motion is NOT active, animation classes may be present', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        mockReducedMotion = false;

        const { container, unmount } = render(<Home />);

        // When reduced motion is off, the satellite should have animate-float
        // (it's hidden on mobile but present in DOM on md+ breakpoints)
        // We just verify the page renders without error in this state
        const allElements = container.querySelectorAll('*');
        expect(allElements.length).toBeGreaterThan(0);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 14: No animation exceeds maximum duration
 *
 * For any Framer Motion animation configuration in the application,
 * the specified duration SHALL not exceed 1000 milliseconds.
 *
 * Validates: Requirements 20.4
 */
describe('Feature: portfolio-website, Property 14: No animation exceeds maximum duration', () => {
  /**
   * Scan source files for animation duration values.
   * This property test verifies that all duration configurations in the codebase
   * are within the 1000ms (1 second) limit.
   */
  it('all animation durations in source files are ≤ 1000ms (1 second)', () => {
    const srcDir = path.resolve(__dirname, '..');
    const componentDir = path.join(srcDir, 'components');
    const hooksDir = path.join(srcDir, 'hooks');

    // Collect all .tsx and .ts source files (not test files)
    const sourceFiles: string[] = [];

    function collectFiles(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          collectFiles(fullPath);
        } else if (
          (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) &&
          !entry.name.includes('.test.') &&
          !entry.name.includes('.property.')
        ) {
          sourceFiles.push(fullPath);
        }
      }
    }

    collectFiles(componentDir);
    collectFiles(hooksDir);

    // Also check the app directory
    const appDir = path.join(srcDir, 'app');
    const appEntries = fs.readdirSync(appDir, { withFileTypes: true });
    for (const entry of appEntries) {
      if (
        (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) &&
        !entry.name.includes('.test.') &&
        !entry.name.includes('.property.')
      ) {
        sourceFiles.push(path.join(appDir, entry.name));
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...sourceFiles),
        (filePath) => {
          const content = fs.readFileSync(filePath, 'utf-8');

          // Match duration values in animation configs
          // Patterns: duration: X, duration: X.Y, "duration": X
          const durationRegex = /duration['"]*\s*[:=]\s*(\d+\.?\d*)/g;
          let match;

          while ((match = durationRegex.exec(content)) !== null) {
            const durationValue = parseFloat(match[1]);

            // Framer Motion uses seconds, so 1 second = 1000ms
            // Values > 1.0 in seconds would exceed 1000ms
            // But we also need to handle cases where duration might be in ms
            // In this codebase, Framer Motion durations are in seconds
            if (durationValue > 1.0) {
              // Check if this could be milliseconds (values like 200, 300, etc.)
              // Framer Motion uses seconds, so values > 10 are likely CSS ms values
              // in className strings (e.g., "duration-200")
              // Only flag values between 1.0 and 10 as potential violations
              // (these would be Framer Motion seconds exceeding 1s)
              if (durationValue < 10) {
                return false; // Violation: duration exceeds 1 second
              }
              // Values >= 10 are likely CSS utility class numbers (duration-200 = 200ms)
              // which are fine
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('the useViewportAnimation hook default duration does not exceed 1000ms', () => {
    fc.assert(
      fc.property(
        fc.record({
          delay: fc.double({ min: 0, max: 2, noNaN: true }),
          duration: fc.double({ min: 0.1, max: 2, noNaN: true }),
        }),
        (options) => {
          // The hook clamps/uses the provided duration directly
          // We verify that the default and typical values used in the codebase are ≤ 1s
          // The design specifies 300-500ms for viewport animations and max 1000ms overall
          const hooksFile = fs.readFileSync(
            path.resolve(__dirname, '..', 'hooks', 'useViewportAnimation.ts'),
            'utf-8'
          );

          // Extract the default duration value
          const defaultMatch = hooksFile.match(/duration\s*=\s*(\d+\.?\d*)/);
          if (defaultMatch) {
            const defaultDuration = parseFloat(defaultMatch[1]);
            // Default duration in seconds should be ≤ 1.0 (1000ms)
            return defaultDuration <= 1.0;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('HeroSection stagger animation total duration does not exceed 1500ms', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const heroFile = fs.readFileSync(
          path.resolve(__dirname, '..', 'components', 'HeroSection.tsx'),
          'utf-8'
        );

        // Extract staggerChildren and item duration
        const staggerMatch = heroFile.match(/staggerChildren:\s*(\d+\.?\d*)/);
        const durationMatch = heroFile.match(
          /itemVariants[\s\S]*?duration:\s*(\d+\.?\d*)/
        );

        if (staggerMatch && durationMatch) {
          const staggerDelay = parseFloat(staggerMatch[1]);
          const itemDuration = parseFloat(durationMatch[1]);

          // HeroSection has ~5 staggered items (h1, subtitle, tagline, buttons, social)
          // Total time = delayChildren + (numItems - 1) * staggerChildren + itemDuration
          const delayChildrenMatch = heroFile.match(/delayChildren:\s*(\d+\.?\d*)/);
          const delayChildren = delayChildrenMatch
            ? parseFloat(delayChildrenMatch[1])
            : 0;

          const numItems = 5;
          const totalDuration =
            delayChildren + (numItems - 1) * staggerDelay + itemDuration;

          // Total should not exceed 1.5 seconds (1500ms) per requirement 6.9
          expect(totalDuration).toBeLessThanOrEqual(1.5);
        }
      }),
      { numRuns: 100 }
    );
  });
});

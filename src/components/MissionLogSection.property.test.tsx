import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import type { Achievement } from '../data/achievements';

/**
 * Property 9: Achievement records display all fields
 *
 * For any Achievement object, the rendered mission log record SHALL display
 * the mission identifier (id), description, and category label.
 *
 * Validates: Requirements 11.1
 */
describe('Feature: portfolio-website, Property 9: Achievement records display all fields', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  // Generator for Achievement objects with non-empty, printable strings
  const achievementArb = fc.record({
    id: fc.stringMatching(/^[A-Z]{2,5}-\d{1,4}$/),
    description: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
    category: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  });

  it('renders mission id, description, and category for any Achievement object', async () => {
    await fc.assert(
      fc.asyncProperty(
        achievementArb,
        async (achievement: Achievement) => {
          vi.resetModules();

          // Mock framer-motion
          vi.doMock('framer-motion', () => ({
            motion: {
              div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
                const { variants, initial, whileInView, viewport, animate, ...rest } = props;
                void variants; void initial; void whileInView; void viewport; void animate;
                const filteredProps = Object.fromEntries(
                  Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
                );
                return <div {...(filteredProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
              },
            },
          }));

          // Mock useReducedMotion
          vi.doMock('../hooks/useReducedMotion', () => ({
            useReducedMotion: () => false,
            default: () => false,
          }));

          // Mock achievements data with the generated achievement
          vi.doMock('../data/achievements', () => ({
            achievements: [achievement],
          }));

          const { default: MissionLogSection } = await import('./MissionLogSection');
          const { container, unmount } = render(<MissionLogSection />);

          // Verify mission ID is displayed (prefixed with ">")
          const idText = container.textContent;
          expect(idText).toContain(achievement.id);

          // Verify description is displayed
          expect(idText).toContain(achievement.description);

          // Verify category label is displayed
          expect(idText).toContain(achievement.category);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('renders all fields for multiple achievements simultaneously', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(achievementArb, { minLength: 1, maxLength: 5 }),
        async (achievements: Achievement[]) => {
          vi.resetModules();

          vi.doMock('framer-motion', () => ({
            motion: {
              div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
                const { variants, initial, whileInView, viewport, animate, ...rest } = props;
                void variants; void initial; void whileInView; void viewport; void animate;
                const filteredProps = Object.fromEntries(
                  Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
                );
                return <div {...(filteredProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
              },
            },
          }));

          vi.doMock('../hooks/useReducedMotion', () => ({
            useReducedMotion: () => false,
            default: () => false,
          }));

          vi.doMock('../data/achievements', () => ({
            achievements,
          }));

          const { default: MissionLogSection } = await import('./MissionLogSection');
          const { container, unmount } = render(<MissionLogSection />);

          const fullText = container.textContent || '';

          for (const achievement of achievements) {
            expect(fullText).toContain(achievement.id);
            expect(fullText).toContain(achievement.description);
            expect(fullText).toContain(achievement.category);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

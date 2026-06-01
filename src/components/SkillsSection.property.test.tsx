import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as fc from 'fast-check';
import React from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(
          ([key]) => !key.startsWith('on') || key === 'onClick' || key === 'onMouseEnter' || key === 'onMouseLeave' || key === 'onTouchStart'
        )
      );
      return <div {...filteredProps}>{children}</div>;
    },
  },
  useInView: () => true,
}));

// Mock useViewportAnimation hook
vi.mock('../hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => ({
    ref: { current: null },
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  }),
}));

// Mock useReducedMotion hook
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
  default: () => false,
}));

// We need to mock the skills data module so we can inject random data
vi.mock('../data/skills', () => ({
  skillsData: [],
}));

import * as skillsModule from '../data/skills';
import SkillsSection from './SkillsSection';

// --- Arbitraries ---

/** Generate a valid skill name (non-empty alphanumeric string) */
const skillNameArb = fc.stringMatching(/^[A-Za-z][A-Za-z0-9 .+#/]{0,19}$/);

/** Generate a valid proficiency value between 0 and 100 */
const proficiencyArb = fc.integer({ min: 0, max: 100 });

/** Generate a Skill object */
const skillArb = fc.record({
  name: skillNameArb,
  proficiency: proficiencyArb,
});

/** Generate a category name (non-empty string) */
const categoryNameArb = fc.stringMatching(/^[A-Za-z][A-Za-z0-9 &]{0,24}$/);

/** Generate a SkillCategory with 1-8 unique skills */
const skillCategoryArb = fc.record({
  category: categoryNameArb,
  skills: fc.array(skillArb, { minLength: 1, maxLength: 8 }),
});

/** Generate SkillsData: 1-6 categories with unique category names */
const skillsDataArb = fc
  .array(skillCategoryArb, { minLength: 1, maxLength: 6 })
  .map((categories) => {
    // Ensure unique category names
    const seen = new Set<string>();
    return categories.filter((cat) => {
      if (seen.has(cat.category)) return false;
      seen.add(cat.category);
      return true;
    });
  })
  .filter((arr) => arr.length >= 1);

/**
 * Property 7: Skills are grouped by category
 *
 * For any SkillsData array, each category SHALL be rendered as a distinct visual group
 * with its category label, and every skill within that category SHALL appear inside that group.
 *
 * Validates: Requirements 10.1
 */
describe('Feature: portfolio-website, Property 7: Skills are grouped by category', () => {
  it('each category is rendered as a distinct group with its label and all its skills', () => {
    fc.assert(
      fc.property(skillsDataArb, (data) => {
        // Inject the random data into the mocked module
        (skillsModule as { skillsData: typeof data }).skillsData = data;

        const { container, unmount } = render(<SkillsSection />);

        // Each category should have an h3 heading with its name
        const headings = container.querySelectorAll('h3');
        const headingTexts = Array.from(headings).map((h) => h.textContent);

        for (const category of data) {
          // Category label must be present as an h3
          if (!headingTexts.includes(category.category)) {
            unmount();
            return false;
          }

          // Find the category group container (parent of the h3)
          const categoryHeading = Array.from(headings).find(
            (h) => h.textContent === category.category
          );
          if (!categoryHeading) {
            unmount();
            return false;
          }

          const groupContainer = categoryHeading.closest('div');
          if (!groupContainer) {
            unmount();
            return false;
          }

          // Every skill in this category should appear inside the group
          for (const skill of category.skills) {
            const skillElements = groupContainer.querySelectorAll(
              `[data-proficiency="${skill.proficiency}"]`
            );
            // Find the badge that contains this skill's name
            const found = Array.from(skillElements).some((el) =>
              el.textContent?.includes(skill.name)
            );
            if (!found) {
              unmount();
              return false;
            }
          }
        }

        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 8: Skill proficiency displays correct value
 *
 * For any Skill object with a proficiency value p where 0 ≤ p ≤ 100,
 * the hover/tap interaction SHALL display exactly the value p as a percentage.
 *
 * Validates: Requirements 10.3
 */
describe('Feature: portfolio-website, Property 8: Skill proficiency displays correct value', () => {
  it('the data-proficiency attribute matches the input proficiency value for every skill', () => {
    fc.assert(
      fc.property(skillsDataArb, (data) => {
        // Inject the random data into the mocked module
        (skillsModule as { skillsData: typeof data }).skillsData = data;

        const { container, unmount } = render(<SkillsSection />);

        for (const category of data) {
          for (const skill of category.skills) {
            // Find badge elements with matching data-proficiency
            const badges = container.querySelectorAll(
              `[data-proficiency="${skill.proficiency}"]`
            );
            // At least one badge should have this proficiency and contain the skill name
            const found = Array.from(badges).some((badge) =>
              badge.textContent?.includes(skill.name)
            );
            if (!found) {
              unmount();
              return false;
            }

            // Verify the proficiency percentage text is present in the badge
            const matchingBadge = Array.from(badges).find((badge) =>
              badge.textContent?.includes(skill.name)
            );
            if (!matchingBadge) {
              unmount();
              return false;
            }

            // The badge should contain the proficiency as "{p}%"
            const proficiencyText = `${skill.proficiency}%`;
            if (!matchingBadge.textContent?.includes(proficiencyText)) {
              unmount();
              return false;
            }
          }
        }

        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

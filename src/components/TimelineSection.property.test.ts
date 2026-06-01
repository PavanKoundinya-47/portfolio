import * as fc from 'fast-check';
import { parseStartDate, sortExperienceByDate } from './TimelineSection';
import { ExperienceEntry } from '../data/experience';

/**
 * Property 3: Timeline entries are reverse chronologically ordered
 *
 * For any list of ExperienceEntry objects with valid date strings, the timeline rendering
 * logic SHALL output entries sorted by start date in descending order (most recent first).
 *
 * Validates: Requirements 8.1
 */
describe('Feature: portfolio-website, Property 3: Timeline entries are reverse chronologically ordered', () => {
  const VALID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /**
   * Arbitrary: generates a valid "MMM YYYY" date string
   */
  const dateStringArb = fc.tuple(
    fc.constantFrom(...VALID_MONTHS),
    fc.integer({ min: 1990, max: 2030 })
  ).map(([month, year]) => `${month} ${year}`);

  /**
   * Arbitrary: generates a valid ExperienceEntry with a random start date
   */
  const experienceEntryArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    company: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    role: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    startDate: dateStringArb,
    endDate: fc.oneof(dateStringArb, fc.constant(null)),
    isCurrent: fc.boolean(),
    description: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
    achievements: fc.oneof(
      fc.constant(undefined),
      fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 0, maxLength: 5 })
    ),
  }) as fc.Arbitrary<ExperienceEntry>;

  /**
   * Arbitrary: generates a non-empty array of ExperienceEntry objects
   */
  const experienceArrayArb = fc.array(experienceEntryArb, { minLength: 1, maxLength: 10 });

  it('sorts entries by startDate in descending order (most recent first)', () => {
    fc.assert(
      fc.property(experienceArrayArb, (entries) => {
        const sorted = sortExperienceByDate(entries);

        // Verify descending chronological order
        for (let i = 0; i < sorted.length - 1; i++) {
          const currentDate = parseStartDate(sorted[i].startDate);
          const nextDate = parseStartDate(sorted[i + 1].startDate);
          if (currentDate.getTime() < nextDate.getTime()) {
            return false; // Not in descending order
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('preserves all original entries after sorting (no entries lost or duplicated)', () => {
    fc.assert(
      fc.property(experienceArrayArb, (entries) => {
        const sorted = sortExperienceByDate(entries);

        // Same length
        if (sorted.length !== entries.length) return false;

        // Every entry in the original is present in sorted (by reference)
        for (const entry of entries) {
          if (!sorted.includes(entry)) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('single entry array remains unchanged', () => {
    fc.assert(
      fc.property(experienceEntryArb, (entry) => {
        const sorted = sortExperienceByDate([entry]);
        return sorted.length === 1 && sorted[0] === entry;
      }),
      { numRuns: 100 }
    );
  });
});

import * as fc from 'fast-check';
import { generateStars } from './Starfield';

/**
 * Property 1: Starfield generates correct star count
 *
 * For any starCount value between 50 and 200 (inclusive), the Starfield star generation
 * function SHALL produce exactly that many star objects distributed across its depth layers.
 *
 * Validates: Requirements 4.1
 */
describe('Feature: portfolio-website, Property 1: Starfield generates correct star count', () => {
  it('generates exactly starCount stars for any count between 50 and 200', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50, max: 200 }),
        fc.integer({ min: 100, max: 3840 }),
        fc.integer({ min: 100, max: 2160 }),
        (starCount, canvasWidth, canvasHeight) => {
          const stars = generateStars(starCount, canvasWidth, canvasHeight);
          return stars.length === starCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('distributes stars as 60% far and 40% near layers', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50, max: 200 }),
        fc.integer({ min: 100, max: 3840 }),
        fc.integer({ min: 100, max: 2160 }),
        (starCount, canvasWidth, canvasHeight) => {
          const stars = generateStars(starCount, canvasWidth, canvasHeight);
          const farStars = stars.filter(s => s.layer === 'far');
          const nearStars = stars.filter(s => s.layer === 'near');

          const expectedFar = Math.round(starCount * 0.6);
          const expectedNear = starCount - expectedFar;

          return (
            farStars.length === expectedFar &&
            nearStars.length === expectedNear &&
            farStars.length + nearStars.length === starCount
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

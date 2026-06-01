import { describe, it, expect } from 'vitest';
import { generateStars } from './Starfield';

describe('Starfield', () => {
  describe('generateStars', () => {
    it('generates the default star count of 150', () => {
      const stars = generateStars(150, 1920, 1080);
      expect(stars).toHaveLength(150);
    });

    it('distributes stars across two depth layers (60% far, 40% near)', () => {
      const stars = generateStars(100, 1920, 1080);
      const farStars = stars.filter((s) => s.layer === 'far');
      const nearStars = stars.filter((s) => s.layer === 'near');
      expect(farStars).toHaveLength(60);
      expect(nearStars).toHaveLength(40);
    });

    it('clamps star count to minimum of 50', () => {
      const stars = generateStars(10, 1920, 1080);
      expect(stars).toHaveLength(50);
    });

    it('clamps star count to maximum of 200', () => {
      const stars = generateStars(300, 1920, 1080);
      expect(stars).toHaveLength(200);
    });

    it('generates far stars with size between 0.5 and 1', () => {
      const stars = generateStars(150, 1920, 1080);
      const farStars = stars.filter((s) => s.layer === 'far');
      for (const star of farStars) {
        expect(star.size).toBeGreaterThanOrEqual(0.5);
        expect(star.size).toBeLessThanOrEqual(1);
      }
    });

    it('generates near stars with size between 1 and 2', () => {
      const stars = generateStars(150, 1920, 1080);
      const nearStars = stars.filter((s) => s.layer === 'near');
      for (const star of nearStars) {
        expect(star.size).toBeGreaterThanOrEqual(1);
        expect(star.size).toBeLessThanOrEqual(2);
      }
    });

    it('generates stars within canvas bounds', () => {
      const width = 800;
      const height = 600;
      const stars = generateStars(150, width, height);
      for (const star of stars) {
        expect(star.x).toBeGreaterThanOrEqual(0);
        expect(star.x).toBeLessThanOrEqual(width);
        expect(star.y).toBeGreaterThanOrEqual(0);
        expect(star.y).toBeLessThanOrEqual(height);
      }
    });

    it('generates stars with valid opacity values', () => {
      const stars = generateStars(150, 1920, 1080);
      for (const star of stars) {
        expect(star.opacity).toBeGreaterThanOrEqual(0);
        expect(star.opacity).toBeLessThanOrEqual(1);
      }
    });

    it('generates far stars with slower drift speed than near stars', () => {
      const stars = generateStars(200, 1920, 1080);
      const farStars = stars.filter((s) => s.layer === 'far');
      const nearStars = stars.filter((s) => s.layer === 'near');

      const maxFarDrift = Math.max(...farStars.map((s) => s.driftSpeed));
      const minNearDrift = Math.min(...nearStars.map((s) => s.driftSpeed));

      // Far stars max drift (0.15) should be <= near stars min drift (0.15)
      expect(maxFarDrift).toBeLessThanOrEqual(minNearDrift);
    });
  });
});

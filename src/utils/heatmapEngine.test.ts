import { describe, it, expect } from 'vitest';
import {
  createColorLUT,
  getBaselinePoints,
  exportClicksToCsv
} from './heatmapEngine';

describe('heatmapEngine', () => {
  it('creates a 256-step color lookup table for thermal palette', () => {
    const lut = createColorLUT('thermal');
    expect(lut).toBeInstanceOf(Uint8ClampedArray);
    expect(lut.length).toBe(256 * 4);
  });

  it('provides realistic baseline points for each tracked page of techgylink.com', () => {
    const homePoints = getBaselinePoints('home');
    const contactPoints = getBaselinePoints('contact');
    const propPoints = getBaselinePoints('property-launch');

    expect(homePoints.length).toBeGreaterThan(50);
    expect(contactPoints.length).toBeGreaterThan(40);
    expect(propPoints.length).toBeGreaterThan(40);

    // Coordinate ranges check
    homePoints.forEach(pt => {
      expect(pt.x).toBeGreaterThanOrEqual(0);
      expect(pt.x).toBeLessThanOrEqual(100);
      expect(pt.y).toBeGreaterThanOrEqual(0);
      expect(pt.y).toBeLessThanOrEqual(100);
      expect(pt.pageId).toBe('home');
    });
  });

  it('exports click points to valid CSV format', () => {
    const points = getBaselinePoints('contact').slice(0, 5);
    const csv = exportClicksToCsv(points, '/contact/');

    expect(csv).toContain('Point ID');
    expect(csv).toContain('https://techgylink.com/contact/');
    expect(csv.split('\n').length).toBe(6); // Header + 5 rows
  });
});


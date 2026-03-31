import { describe, it, expect } from 'vitest';
import { leastSquares } from '../src/leastSquares';

describe('leastSquares', () => {
  it('fits y = 2x + 1', () => {
    const points = [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 5 },
    ];
    const result = leastSquares(points);
    expect(result.m).toBeCloseTo(2);
    expect(result.b).toBeCloseTo(1);
  });

  it('fits y = x', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const result = leastSquares(points);
    expect(result.m).toBeCloseTo(1);
    expect(result.b).toBeCloseTo(0);
  });

  it('fits a negative slope', () => {
    const points = [
      { x: 0, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ];
    const result = leastSquares(points);
    expect(result.m).toBeCloseTo(-1);
    expect(result.b).toBeCloseTo(3);
  });

  it('inverted regression fits a steep line', () => {
    // y = 10x - 5 — high slope, suitable for inverted regression
    const points = [
      { x: 0, y: -5 },
      { x: 1, y: 5 },
      { x: 2, y: 15 },
    ];
    const result = leastSquares(points, true);
    expect(result.m).toBeCloseTo(10);
    expect(result.b).toBeCloseTo(-5);
  });
});

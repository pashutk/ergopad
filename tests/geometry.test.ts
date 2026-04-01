import { describe, it, expect } from 'vitest';
import {
  slopeInterceptFormToStandardForm,
  projectPointToLine,
} from '../src/geometry';

describe('slopeInterceptFormToStandardForm', () => {
  it('returns {a: m, b: -1, c: b}', () => {
    expect(slopeInterceptFormToStandardForm({ m: 3, b: -5 })).toEqual({
      a: 3,
      b: -1,
      c: -5,
    });
  });

  it('points on y = 2x + 3 satisfy the returned standard form', () => {
    const line = slopeInterceptFormToStandardForm({ m: 2, b: 3 });
    // (0, 3) and (1, 5) are on the line
    expect(line.a * 0 + line.b * 3 + line.c).toBeCloseTo(0);
    expect(line.a * 1 + line.b * 5 + line.c).toBeCloseTo(0);
  });

  it('points on y = -x satisfy the returned standard form', () => {
    const line = slopeInterceptFormToStandardForm({ m: -1, b: 0 });
    expect(line.a * 1 + line.b * -1 + line.c).toBeCloseTo(0);
    expect(line.a * 3 + line.b * -3 + line.c).toBeCloseTo(0);
  });
});

describe('projectPointToLine', () => {
  const line = slopeInterceptFormToStandardForm({ m: 2, b: 3 }); // y = 2x + 3
  const project = projectPointToLine(line);

  it('projected point lies on the line', () => {
    const projected = project({ x: 1, y: 8 }); // (1, 8) is not on the line
    expect(
      Math.abs(line.a * projected.x + line.b * projected.y + line.c),
    ).toBeLessThan(1e-10);
  });

  it('a point already on the line projects to itself', () => {
    // (0, 3) is on y = 2x + 3
    const projected = project({ x: 0, y: 3 });
    expect(projected.x).toBeCloseTo(0);
    expect(projected.y).toBeCloseTo(3);
  });

  it('the projection vector is perpendicular to the line', () => {
    const point = { x: 5, y: 0 };
    const projected = project(point);
    // Line direction vector: (1, slope) = (1, 2)
    // Vector from point to projected must be perpendicular: dot product = 0
    const dx = projected.x - point.x;
    const dy = projected.y - point.y;
    expect(Math.abs(dx * 1 + dy * 2)).toBeLessThan(1e-10);
  });
});

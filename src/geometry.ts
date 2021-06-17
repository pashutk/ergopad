export type Point2D = { x: number; y: number };

export type StandardFormLine2D = {
  a: number;
  b: number;
  c: number;
};

export type SlopeInterceptFormLine2D = {
  m: number;
  b: number;
};

type Vec2D = Point2D;

const line2DIntersection = (
  { a: a1, b: b1, c: c1 }: StandardFormLine2D,
  { a: a2, b: b2, c: c2 }: StandardFormLine2D,
): Point2D => ({
  x: (-c1 * b2 + c2 * b1) / (a1 * b2 - a2 * b1),
  y: (-a1 * c2 + a2 * c1) / (a1 * b2 - a2 * b1),
});

export const projectPointToLine =
  (line: StandardFormLine2D) =>
  (point: Point2D): Point2D => {
    const nVec: Vec2D = {
      x: line.a,
      y: line.b,
    };

    // (x - point.x) / nVec.x = (y - point.y) / nVec.y;
    // (x / nVec.x) - (point.x / nVec.x) - (y / nVec.y) + (point.y / nVec.y) = 0
    const perpendicularLine: StandardFormLine2D = {
      a: 1 / nVec.x,
      b: -1 / nVec.y,
      c: point.y / nVec.y - point.x / nVec.x,
    };

    return line2DIntersection(line, perpendicularLine);
  };

export const slopeInterceptFormToStandardForm: (
  a: SlopeInterceptFormLine2D,
) => StandardFormLine2D = ({ m, b }) => ({
  a: m,
  b: -1,
  c: b,
});

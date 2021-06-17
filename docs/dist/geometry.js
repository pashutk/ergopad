const line2DIntersection = ({a: a1, b: b1, c: c1}, {a: a2, b: b2, c: c2}) => ({
  x: (-c1 * b2 + c2 * b1) / (a1 * b2 - a2 * b1),
  y: (-a1 * c2 + a2 * c1) / (a1 * b2 - a2 * b1)
});
export const projectPointToLine = (line) => (point) => {
  const nVec = {
    x: line.a,
    y: line.b
  };
  const perpendicularLine = {
    a: 1 / nVec.x,
    b: -1 / nVec.y,
    c: point.y / nVec.y - point.x / nVec.x
  };
  return line2DIntersection(line, perpendicularLine);
};
export const slopeInterceptFormToStandardForm = ({m, b}) => ({
  a: m,
  b: -1,
  c: b
});

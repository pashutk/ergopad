import type { Point2D, SlopeInterceptFormLine2D } from './geometry';
import SimpleLinearRegression from 'ml-regression-simple-linear';

// TODO: check "verticality" uusing standard deviation
export const leastSquares = (
  points: Point2D[],
  shouldUseInvertedRegression = false,
): SlopeInterceptFormLine2D => {
  const X = points.map(({ x, y }) => x);
  const Y = points.map(({ x, y }) => y);

  if (shouldUseInvertedRegression) {
    const res = new SimpleLinearRegression(Y, X);
    return { m: 1 / res.slope, b: -res.intercept / res.slope };
  }

  const res = new SimpleLinearRegression(X, Y);
  return { m: res.slope, b: res.intercept };
};

import SimpleLinearRegression from "../_snowpack/pkg/ml-regression-simple-linear.js";
export const leastSquares = (points, shouldUseInvertedRegression = false) => {
  const X = points.map(({x, y}) => x);
  const Y = points.map(({x, y}) => y);
  if (shouldUseInvertedRegression) {
    const res2 = new SimpleLinearRegression(Y, X);
    return {m: 1 / res2.slope, b: -res2.intercept / res2.slope};
  }
  const res = new SimpleLinearRegression(X, Y);
  return {m: res.slope, b: res.intercept};
};

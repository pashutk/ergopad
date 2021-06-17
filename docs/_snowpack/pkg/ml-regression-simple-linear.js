const toString = Object.prototype.toString;

function isAnyArray(object) {
  return toString.call(object).endsWith('Array]');
}

function maybeToPrecision(value, digits) {
  if (value < 0) {
    value = 0 - value;
    if (typeof digits === 'number') {
      return `- ${value.toPrecision(digits)}`;
    } else {
      return `- ${value.toString()}`;
    }
  } else {
    if (typeof digits === 'number') {
      return value.toPrecision(digits);
    } else {
      return value.toString();
    }
  }
}

function checkArraySize(x, y) {
  if (!isAnyArray(x) || !isAnyArray(y)) {
    throw new TypeError('x and y must be arrays');
  }
  if (x.length !== y.length) {
    throw new RangeError('x and y arrays must have the same length');
  }
}

class BaseRegression {
  constructor() {
    if (new.target === BaseRegression) {
      throw new Error('BaseRegression must be subclassed');
    }
  }

  predict(x) {
    if (typeof x === 'number') {
      return this._predict(x);
    } else if (isAnyArray(x)) {
      const y = [];
      for (let i = 0; i < x.length; i++) {
        y.push(this._predict(x[i]));
      }
      return y;
    } else {
      throw new TypeError('x must be a number or array');
    }
  }

  _predict() {
    throw new Error('_predict must be implemented');
  }

  train() {
    // Do nothing for this package
  }

  toString() {
    return '';
  }

  toLaTeX() {
    return '';
  }

  /**
   * Return the correlation coefficient of determination (r) and chi-square.
   * @param {Array<number>} x
   * @param {Array<number>} y
   * @return {object}
   */
  score(x, y) {
    if (!isAnyArray(x) || !isAnyArray(y) || x.length !== y.length) {
      throw new Error('x and y must be arrays of the same length');
    }

    const n = x.length;
    const y2 = new Array(n);
    for (let i = 0; i < n; i++) {
      y2[i] = this._predict(x[i]);
    }

    let xSum = 0;
    let ySum = 0;
    let chi2 = 0;
    let rmsd = 0;
    let xSquared = 0;
    let ySquared = 0;
    let xY = 0;
    for (let i = 0; i < n; i++) {
      xSum += y2[i];
      ySum += y[i];
      xSquared += y2[i] * y2[i];
      ySquared += y[i] * y[i];
      xY += y2[i] * y[i];
      if (y[i] !== 0) {
        chi2 += ((y[i] - y2[i]) * (y[i] - y2[i])) / y[i];
      }
      rmsd += (y[i] - y2[i]) * (y[i] - y2[i]);
    }

    const r =
      (n * xY - xSum * ySum) /
      Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));

    return {
      r: r,
      r2: r * r,
      chi2: chi2,
      rmsd: Math.sqrt(rmsd / n),
    };
  }
}

class SimpleLinearRegression extends BaseRegression {
  constructor(x, y) {
    super();
    if (x === true) {
      this.slope = y.slope;
      this.intercept = y.intercept;
      this.coefficients = [y.intercept, y.slope];
    } else {
      checkArraySize(x, y);
      regress(this, x, y);
    }
  }

  toJSON() {
    return {
      name: 'simpleLinearRegression',
      slope: this.slope,
      intercept: this.intercept,
    };
  }

  _predict(x) {
    return this.slope * x + this.intercept;
  }

  computeX(y) {
    return (y - this.intercept) / this.slope;
  }

  toString(precision) {
    let result = 'f(x) = ';
    if (this.slope !== 0) {
      const xFactor = maybeToPrecision(this.slope, precision);
      result += `${xFactor === '1' ? '' : `${xFactor} * `}x`;
      if (this.intercept !== 0) {
        const absIntercept = Math.abs(this.intercept);
        const operator = absIntercept === this.intercept ? '+' : '-';
        result += ` ${operator} ${maybeToPrecision(absIntercept, precision)}`;
      }
    } else {
      result += maybeToPrecision(this.intercept, precision);
    }
    return result;
  }

  toLaTeX(precision) {
    return this.toString(precision);
  }

  static load(json) {
    if (json.name !== 'simpleLinearRegression') {
      throw new TypeError('not a SLR model');
    }
    return new SimpleLinearRegression(true, json);
  }
}

function regress(slr, x, y) {
  const n = x.length;
  let xSum = 0;
  let ySum = 0;

  let xSquared = 0;
  let xY = 0;

  for (let i = 0; i < n; i++) {
    xSum += x[i];
    ySum += y[i];
    xSquared += x[i] * x[i];
    xY += x[i] * y[i];
  }

  const numerator = n * xY - xSum * ySum;
  slr.slope = numerator / (n * xSquared - xSum * xSum);
  slr.intercept = (1 / n) * ySum - slr.slope * (1 / n) * xSum;
  slr.coefficients = [slr.intercept, slr.slope];
}

export default SimpleLinearRegression;

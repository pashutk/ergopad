import { g as getDefaultExportFromCjs, c as createCommonjsModule } from '../common/_commonjsHelpers-8c19dec8.js';
import { _ as _function, O as Option } from '../common/Option-70c2f69f.js';

var _Number = createCommonjsModule(function (module, exports) {
/**
 * Various functions to aid in working with numbers.
 *
 * @since 0.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.negate = exports.mod = exports.rem = exports.divide = exports.subtract = exports.multiply = exports.add = exports.decrement = exports.increment = exports.floatFromString = exports.fromString = exports.fromStringWithRadix = exports.isValid = void 0;


/**
 * Check if a number is actually valid. Specifically, all this function is
 * doing is checking whether or not the number is `NaN`.
 *
 * @example
 * import { isValid } from 'fp-ts-std/Number';
 *
 * const valid = 123;
 * const invalid = NaN;
 *
 * assert.strictEqual(isValid(valid), true);
 * assert.strictEqual(isValid(invalid), false);
 *
 * @since 0.7.0
 */
exports.isValid = _function.not(Number.isNaN);
/**
 * Convert a string to a number.
 *
 * @example
 * import { fromStringWithRadix } from 'fp-ts-std/Number';
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromStringWithRadix(16)('0xF'), some(15));
 * assert.deepStrictEqual(fromStringWithRadix(16)('xyz'), none);
 *
 * @since 0.1.0
 */
const fromStringWithRadix = (radix) => (string) => _function.pipe(Number.parseInt(string, radix), Option.fromPredicate(exports.isValid));
exports.fromStringWithRadix = fromStringWithRadix;
/**
 * Convert a string to a number.
 *
 * @example
 * import { fromString } from 'fp-ts-std/Number';
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(fromString('3'), some(3));
 * assert.deepStrictEqual(fromString('abc'), none);
 *
 * @since 0.1.0
 */
exports.fromString = exports.fromStringWithRadix(10);
/**
 * Convert a string to a floating point number.
 *
 * @example
 * import { floatFromString } from 'fp-ts-std/Number';
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(floatFromString('3.3'), some(3.3));
 * assert.deepStrictEqual(floatFromString('abc'), none);
 *
 * @since 0.1.0
 */
exports.floatFromString = _function.flow(Number.parseFloat, Option.fromPredicate(exports.isValid));
/**
 * Increment a number.
 *
 * @example
 * import { increment } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(increment(3), 4);
 *
 * @since 0.1.0
 */
const increment = x => x + 1;
exports.increment = increment;
/**
 * Decrement a number.
 *
 * @example
 * import { decrement } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(decrement(3), 2);
 *
 * @since 0.1.0
 */
const decrement = x => x - 1;
exports.decrement = decrement;
/**
 * Add two numbers together.
 *
 * @example
 * import { add } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(add(2)(3), 5);
 *
 * @since 0.1.0
 */
const add = (x) => y => x + y;
exports.add = add;
/**
 * Multiply two numbers together.
 *
 * @example
 * import { multiply } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(multiply(2)(3), 6);
 *
 * @since 0.2.0
 */
const multiply = (x) => y => x * y;
exports.multiply = multiply;
/**
 * Subtract the first number (the _subtrahend_) from the second number (the
 * _minuend_).
 *
 * @example
 * import { subtract } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(subtract(2)(3), 1);
 * assert.strictEqual(subtract(3)(2), -1);
 *
 * @since 0.2.0
 */
const subtract = (subtrahend) => minuend => minuend - subtrahend;
exports.subtract = subtract;
/**
 * Divide the second number (the _dividend_) by the first number (the
 * _divisor_).
 *
 * @example
 * import { divide } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(divide(2)(4), 2);
 * assert.strictEqual(divide(4)(2), .5);
 *
 * @since 0.2.0
 */
const divide = (divisor) => dividend => dividend / divisor;
exports.divide = divide;
/**
 * Calculates the remainder. See also `mod`.
 *
 * @example
 * import { rem } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(rem(2)(5.5), 1.5);
 * assert.strictEqual(rem(-4)(2), 2);
 * assert.strictEqual(rem(5)(-12), -2);
 *
 * @since 0.7.0
 */
const rem = (divisor) => dividend => dividend % divisor;
exports.rem = rem;
/**
 * Calculate the modulus. See also `rem`.
 *
 * @example
 * import { mod } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(mod(2)(5.5), 1.5);
 * assert.strictEqual(mod(-4)(2), -2);
 * assert.strictEqual(mod(5)(-12), 3);
 *
 * @since 0.7.0
 */
const mod = (divisor) => dividend => ((dividend % divisor) + divisor) % divisor;
exports.mod = mod;
/**
 * Unary negation.
 *
 * @example
 * import { negate } from 'fp-ts-std/Number';
 *
 * assert.strictEqual(negate(42), -42);
 * assert.strictEqual(negate(-42), 42);
 *
 * @since 0.7.0
 */
const negate = n => -n;
exports.negate = negate;
});

var __pika_web_default_export_for_treeshaking__ = /*@__PURE__*/getDefaultExportFromCjs(_Number);

var add = _Number.add;
var decrement = _Number.decrement;
export default __pika_web_default_export_for_treeshaking__;
var divide = _Number.divide;
var floatFromString = _Number.floatFromString;
var fromString = _Number.fromString;
var fromStringWithRadix = _Number.fromStringWithRadix;
var increment = _Number.increment;
var isValid = _Number.isValid;
var mod = _Number.mod;
var multiply = _Number.multiply;
var negate = _Number.negate;
var rem = _Number.rem;
var subtract = _Number.subtract;
export { _Number as __moduleExports, add, decrement, divide, floatFromString, fromString, fromStringWithRadix, increment, isValid, mod, multiply, negate, rem, subtract };

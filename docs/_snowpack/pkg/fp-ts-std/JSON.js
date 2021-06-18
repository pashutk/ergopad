import { c as createCommonjsModule, g as getDefaultExportFromCjs } from '../common/_commonjsHelpers-8c19dec8.js';
import { p as pipe$1, h as has$2, i as identity, g as getSemigroup$5, f as fromReadonlyNonEmptyArray$1, s as some$5, n as none, a as flap$5, b as apFirst$3, c as apSecond$3, d as chainFirst$3, e as bindTo$3, j as bind$3, k as apS$3, l as getMonoid$6, m as getEndomorphismMonoid$1, o as isSome, q as separated, u as unsafeCoerce, r as isLeft$1, t as flow, v as getApplySemigroup$1, w as getApplicativeMonoid, x as map$7, y as isNone, z as isSome$1, A as getOrElse$1, B as chain$3, C as fold$5, D as fromEither, E as constant$1, F as fromNullable$3, G as fromPredicate$2, H as option, I as getFirstMonoid, _ as _function, O as Option } from '../common/Option-70c2f69f.js';

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
function fromEquals(equals) {
    return {
        equals: function (x, y) { return x === y || equals(x, y); }
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
var eqStrict = {
    equals: function (a, b) { return a === b; }
};
/**
 * Use [`Eq`](./boolean.ts.html#Eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eqBoolean = eqStrict;
/**
 * Use [`Eq`](./string.ts.html#Eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eqString = eqStrict;
/**
 * Use [`Eq`](./number.ts.html#Eq) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var eqNumber = eqStrict;

// -------------------------------------------------------------------------------------
// defaults
// -------------------------------------------------------------------------------------
/**
 * @category defaults
 * @since 2.10.0
 */
var equalsDefault = function (compare) { return function (first, second) {
    return first === second || compare(first, second) === 0;
}; };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
var fromCompare = function (compare) { return ({
    equals: equalsDefault(compare),
    compare: function (first, second) { return (first === second ? 0 : compare(first, second)); }
}); };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Given a tuple of `Ord`s returns an `Ord` for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Ord'
 * import * as B from 'fp-ts/boolean'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 *
 * const O = tuple(S.Ord, N.Ord, B.Ord)
 * assert.strictEqual(O.compare(['a', 1, true], ['b', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 2, true]), -1)
 * assert.strictEqual(O.compare(['a', 1, true], ['a', 1, false]), 1)
 *
 * @category combinators
 * @since 2.10.0
 */
var tuple = function () {
    var ords = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ords[_i] = arguments[_i];
    }
    return fromCompare(function (first, second) {
        var i = 0;
        for (; i < ords.length - 1; i++) {
            var r = ords[i].compare(first[i], second[i]);
            if (r !== 0) {
                return r;
            }
        }
        return ords[i].compare(first[i], second[i]);
    });
};
/**
 * @category combinators
 * @since 2.10.0
 */
var reverse = function (O) { return fromCompare(function (first, second) { return O.compare(second, first); }); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var contramap_ = function (fa, f) { return pipe$1(fa, contramap(f)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Contravariant
 * @since 2.0.0
 */
var contramap = function (f) { return function (fa) {
    return fromCompare(function (first, second) { return fa.compare(f(first), f(second)); });
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI = 'Ord';
/**
 * @category instances
 * @since 2.0.0
 */
var getSemigroup = function () { return ({
    concat: function (first, second) {
        return fromCompare(function (a, b) {
            var ox = first.compare(a, b);
            return ox !== 0 ? ox : second.compare(a, b);
        });
    }
}); };
/**
 * Returns a `Monoid` such that:
 *
 * - its `concat(ord1, ord2)` operation will order first by `ord1`, and then by `ord2`
 * - its `empty` value is an `Ord` that always considers compared elements equal
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import { contramap, reverse, getMonoid } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as B from 'fp-ts/boolean'
 * import { pipe } from 'fp-ts/function'
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface User {
 *   readonly id: number
 *   readonly name: string
 *   readonly age: number
 *   readonly rememberMe: boolean
 * }
 *
 * const byName = pipe(
 *   S.Ord,
 *   contramap((p: User) => p.name)
 * )
 *
 * const byAge = pipe(
 *   N.Ord,
 *   contramap((p: User) => p.age)
 * )
 *
 * const byRememberMe = pipe(
 *   B.Ord,
 *   contramap((p: User) => p.rememberMe)
 * )
 *
 * const M = getMonoid<User>()
 *
 * const users: Array<User> = [
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true }
 * ]
 *
 * // sort by name, then by age, then by `rememberMe`
 * const O1 = concatAll(M)([byName, byAge, byRememberMe])
 * assert.deepStrictEqual(sort(O1)(users), [
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * // now `rememberMe = true` first, then by name, then by age
 * const O2 = concatAll(M)([reverse(byRememberMe), byName, byAge])
 * assert.deepStrictEqual(sort(O2)(users), [
 *   { id: 4, name: 'Giulio', age: 44, rememberMe: true },
 *   { id: 2, name: 'Guido', age: 46, rememberMe: true },
 *   { id: 3, name: 'Giulio', age: 44, rememberMe: false },
 *   { id: 1, name: 'Guido', age: 47, rememberMe: false }
 * ])
 *
 * @category instances
 * @since 2.4.0
 */
var getMonoid = function () { return ({
    concat: getSemigroup().concat,
    empty: fromCompare(function () { return 0; })
}); };
/**
 * @category instances
 * @since 2.7.0
 */
var Contravariant = {
    URI: URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
// TODO: curry in v3
/**
 * Test whether one value is _strictly less than_ another
 *
 * @since 2.0.0
 */
var lt = function (O) { return function (first, second) { return O.compare(first, second) === -1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _strictly greater than_ another
 *
 * @since 2.0.0
 */
var gt = function (O) { return function (first, second) { return O.compare(first, second) === 1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly less than_ another
 *
 * @since 2.0.0
 */
var leq = function (O) { return function (first, second) { return O.compare(first, second) !== 1; }; };
// TODO: curry in v3
/**
 * Test whether one value is _non-strictly greater than_ another
 *
 * @since 2.0.0
 */
var geq = function (O) { return function (first, second) { return O.compare(first, second) !== -1; }; };
// TODO: curry in v3
/**
 * Take the minimum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var min = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) < 1 ? first : second;
}; };
// TODO: curry in v3
/**
 * Take the maximum of two values. If they are considered equal, the first argument is chosen
 *
 * @since 2.0.0
 */
var max = function (O) { return function (first, second) {
    return first === second || O.compare(first, second) > -1 ? first : second;
}; };
/**
 * Clamp a value between a minimum and a maximum
 *
 * @since 2.0.0
 */
var clamp = function (O) {
    var minO = min(O);
    var maxO = max(O);
    return function (low, hi) { return function (a) { return maxO(minO(a, hi), low); }; };
};
/**
 * Test whether a value is between a minimum and a maximum (inclusive)
 *
 * @since 2.0.0
 */
var between = function (O) {
    var ltO = lt(O);
    var gtO = gt(O);
    return function (low, hi) { return function (a) { return (ltO(a, low) || gtO(a, hi) ? false : true); }; };
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getTupleOrd = tuple;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getDualOrd = reverse;
/**
 * Use [`Contravariant`](#contravariant) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ord = Contravariant;
// default compare for primitive types
function compare(first, second) {
    return first < second ? -1 : first > second ? 1 : 0;
}
var strictOrd = {
    equals: eqStrict.equals,
    compare: compare
};
/**
 * Use [`Ord`](./boolean.ts.html#Ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordBoolean = strictOrd;
/**
 * Use [`Ord`](./string.ts.html#Ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordString = strictOrd;
/**
 * Use [`Ord`](./number.ts.html#Ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordNumber = strictOrd;
/**
 * Use [`Ord`](./Date.ts.html#Ord) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var ordDate = 
/*#__PURE__*/
pipe$1(
// tslint:disable-next-line: deprecation
ordNumber, 
/*#__PURE__*/
contramap(function (date) { return date.valueOf(); }));

var Ord = /*#__PURE__*/Object.freeze({
    __proto__: null,
    equalsDefault: equalsDefault,
    fromCompare: fromCompare,
    tuple: tuple,
    reverse: reverse,
    contramap: contramap,
    URI: URI,
    getSemigroup: getSemigroup,
    getMonoid: getMonoid,
    Contravariant: Contravariant,
    lt: lt,
    gt: gt,
    leq: leq,
    geq: geq,
    min: min,
    max: max,
    clamp: clamp,
    between: between,
    getTupleOrd: getTupleOrd,
    getDualOrd: getDualOrd,
    ord: ord,
    ordBoolean: ordBoolean,
    ordString: ordString,
    ordNumber: ordNumber,
    ordDate: ordDate
});

/**
 * If a type `A` can form a `Semigroup` it has an **associative** binary operation.
 *
 * ```ts
 * interface Semigroup<A> {
 *   readonly concat: (x: A, y: A) => A
 * }
 * ```
 *
 * Associativity means the following equality must hold for any choice of `x`, `y`, and `z`.
 *
 * ```ts
 * concat(x, concat(y, z)) = concat(concat(x, y), z)
 * ```
 *
 * A common example of a semigroup is the type `string` with the operation `+`.
 *
 * ```ts
 * import { Semigroup } from 'fp-ts/Semigroup'
 *
 * const semigroupString: Semigroup<string> = {
 *   concat: (x, y) => x + y
 * }
 *
 * const x = 'x'
 * const y = 'y'
 * const z = 'z'
 *
 * semigroupString.concat(x, y) // 'xy'
 *
 * semigroupString.concat(x, semigroupString.concat(y, z)) // 'xyz'
 *
 * semigroupString.concat(semigroupString.concat(x, y), z) // 'xyz'
 * ```
 *
 * *Adapted from https://typelevel.org/cats*
 *
 * @since 2.0.0
 */
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get a semigroup where `concat` will return the minimum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.min(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 1)
 *
 * @category constructors
 * @since 2.10.0
 */
var min$1 = function (O) { return ({
    concat: min(O)
}); };
/**
 * Get a semigroup where `concat` will return the maximum, based on the provided order.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/Semigroup'
 *
 * const S1 = S.max(N.Ord)
 *
 * assert.deepStrictEqual(S1.concat(1, 2), 2)
 *
 * @category constructors
 * @since 2.10.0
 */
var max$1 = function (O) { return ({
    concat: max(O)
}); };
/**
 * @category constructors
 * @since 2.10.0
 */
var constant = function (a) { return ({
    concat: function () { return a; }
}); };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Semigroup`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(reverse(S.Semigroup).concat('a', 'b'), 'ba')
 *
 * @category combinators
 * @since 2.10.0
 */
var reverse$1 = function (S) { return ({
    concat: function (x, y) { return S.concat(y, x); }
}); };
/**
 * Given a struct of semigroups returns a semigroup for the struct.
 *
 * @example
 * import { struct } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const S = struct<Point>({
 *   x: N.SemigroupSum,
 *   y: N.SemigroupSum
 * })
 *
 * assert.deepStrictEqual(S.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @category combinators
 * @since 2.10.0
 */
var struct = function (semigroups) { return ({
    concat: function (first, second) {
        var r = {};
        for (var k in semigroups) {
            if (has$2.call(semigroups, k)) {
                r[k] = semigroups[k].concat(first[k], second[k]);
            }
        }
        return r;
    }
}); };
/**
 * Given a tuple of semigroups returns a semigroup for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Semigroup'
 * import * as B from 'fp-ts/boolean'
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/string'
 *
 * const S1 = tuple(S.Semigroup, N.SemigroupSum)
 * assert.deepStrictEqual(S1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const S2 = tuple(S.Semigroup, N.SemigroupSum, B.SemigroupAll)
 * assert.deepStrictEqual(S2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @category combinators
 * @since 2.10.0
 */
var tuple$1 = function () {
    var semigroups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        semigroups[_i] = arguments[_i];
    }
    return ({
        concat: function (first, second) { return semigroups.map(function (s, i) { return s.concat(first[i], second[i]); }); }
    });
};
/**
 * Between each pair of elements insert `middle`.
 *
 * @example
 * import { intercalate } from 'fp-ts/Semigroup'
 * import * as S from 'fp-ts/string'
 * import { pipe } from 'fp-ts/function'
 *
 * const S1 = pipe(S.Semigroup, intercalate(' + '))
 *
 * assert.strictEqual(S1.concat('a', 'b'), 'a + b')
 *
 * @category combinators
 * @since 2.10.0
 */
var intercalate = function (middle) { return function (S) { return ({
    concat: function (x, y) { return S.concat(x, S.concat(middle, y)); }
}); }; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * Always return the first argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.first<number>().concat(1, 2), 1)
 *
 * @category instances
 * @since 2.10.0
 */
var first = function () { return ({ concat: identity }); };
/**
 * Always return the last argument.
 *
 * @example
 * import * as S from 'fp-ts/Semigroup'
 *
 * assert.deepStrictEqual(S.last<number>().concat(1, 2), 2)
 *
 * @category instances
 * @since 2.10.0
 */
var last = function () { return ({ concat: function (_, y) { return y; } }); };
/**
 * @category instances
 * @since 2.0.0
 */
var semigroupVoid = constant(undefined);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the provided `startWith` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Semigroup'
 * import * as N from 'fp-ts/number'
 *
 * const sum = concatAll(N.SemigroupSum)(0)
 *
 * assert.deepStrictEqual(sum([1, 2, 3]), 6)
 * assert.deepStrictEqual(sum([]), 0)
 *
 * @since 2.10.0
 */
var concatAll = function (S) { return function (startWith) { return function (as) {
    return as.reduce(S.concat, startWith);
}; }; };
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`getAssignSemigroup`](./struct.ts.html#getAssignSemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getObjectSemigroup = function () { return ({
    concat: function (first, second) { return Object.assign({}, first, second); }
}); };
/**
 * Use [`last`](#last) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getLastSemigroup = last;
/**
 * Use [`first`](#first) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getFirstSemigroup = first;
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getTupleSemigroup = tuple$1;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getStructSemigroup = struct;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getDualSemigroup = reverse$1;
/**
 * Use [`max`](#max) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var getJoinSemigroup = max$1;
/**
 * Use [`min`](#min) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var getMeetSemigroup = min$1;
/**
 * Use [`intercalate`](#intercalate) instead.
 *
 * @category combinators
 * @since 2.5.0
 * @deprecated
 */
var getIntercalateSemigroup = intercalate;
function fold(S) {
    var concatAllS = concatAll(S);
    return function (startWith, as) { return (as === undefined ? concatAllS(startWith) : concatAllS(startWith)(as)); };
}
/**
 * Use [`SemigroupAll`](./boolean.ts.html#SemigroupAll) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupAll = {
    concat: function (x, y) { return x && y; }
};
/**
 * Use [`SemigroupAny`](./boolean.ts.html#SemigroupAny) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupAny = {
    concat: function (x, y) { return x || y; }
};
/**
 * Use [`getSemigroup`](./function.ts.html#getSemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getFunctionSemigroup = getSemigroup$5;
/**
 * Use [`Semigroup`](./string.ts.html#Semigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupString = {
    concat: function (x, y) { return x + y; }
};
/**
 * Use [`SemigroupSum`](./number.ts.html#SemigroupSum) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupSum = {
    concat: function (x, y) { return x + y; }
};
/**
 * Use [`SemigroupProduct`](./number.ts.html#SemigroupProduct) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var semigroupProduct = {
    concat: function (x, y) { return x * y; }
};

var Semigroup = /*#__PURE__*/Object.freeze({
    __proto__: null,
    min: min$1,
    max: max$1,
    constant: constant,
    reverse: reverse$1,
    struct: struct,
    tuple: tuple$1,
    intercalate: intercalate,
    first: first,
    last: last,
    semigroupVoid: semigroupVoid,
    concatAll: concatAll,
    getObjectSemigroup: getObjectSemigroup,
    getLastSemigroup: getLastSemigroup,
    getFirstSemigroup: getFirstSemigroup,
    getTupleSemigroup: getTupleSemigroup,
    getStructSemigroup: getStructSemigroup,
    getDualSemigroup: getDualSemigroup,
    getJoinSemigroup: getJoinSemigroup,
    getMeetSemigroup: getMeetSemigroup,
    getIntercalateSemigroup: getIntercalateSemigroup,
    fold: fold,
    semigroupAll: semigroupAll,
    semigroupAny: semigroupAny,
    getFunctionSemigroup: getFunctionSemigroup,
    semigroupString: semigroupString,
    semigroupSum: semigroupSum,
    semigroupProduct: semigroupProduct
});

var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
/**
 * @internal
 */
var isNonEmpty = function (as) { return as.length > 0; };
/**
 * @internal
 */
var isOutOfBound = function (i, as) { return i < 0 || i >= as.length; };
/**
 * @internal
 */
var unsafeUpdateAt = function (i, a, as) {
    if (as[i] === a) {
        return as;
    }
    else {
        var xs = fromReadonlyNonEmptyArray$1(as);
        xs[i] = a;
        return xs;
    }
};
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduce = function (b, f) {
    return reduceWithIndex(b, function (_, b, a) { return f(b, a); });
};
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category Foldable
 * @since 2.5.0
 */
var foldMap = function (S) { return function (f) { return function (as) {
    return as.slice(1).reduce(function (s, a) { return S.concat(s, f(a)); }, f(as[0]));
}; }; };
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduceRight = function (b, f) {
    return reduceRightWithIndex(b, function (_, b, a) { return f(b, a); });
};
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceWithIndex = function (b, f) { return function (as) {
    return as.reduce(function (b, a, i) { return f(i, b, a); }, b);
}; };
/**
 * **Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.
 *
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var foldMapWithIndex = function (S) { return function (f) { return function (as) { return as.slice(1).reduce(function (s, a, i) { return S.concat(s, f(i + 1, a)); }, f(0, as[0])); }; }; };
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceRightWithIndex = function (b, f) { return function (as) { return as.reduceRight(function (b, a, i) { return f(i, a, b); }, b); }; };
/**
 * @category Comonad
 * @since 2.6.3
 */
var extract = function (as) { return as[0]; };
/**
 * @category instances
 * @since 2.5.0
 */
var getShow = function (S) { return ({
    show: function (as) { return "[" + as.map(S.show).join(', ') + "]"; }
}); };
/**
 * @example
 * import { getEq } from 'fp-ts/ReadonlyNonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.5.0
 */
var getEq = function (E) {
    return fromEquals(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.5.0
 */
var head = extract;
/**
 * @since 2.5.0
 */
var last$1 = function (as) { return as[as.length - 1]; };
/**
 * @since 2.5.0
 */
var min$2 = function (O) {
    var S = min$1(O);
    return function (as) { return as.reduce(S.concat); };
};
/**
 * @since 2.5.0
 */
var max$2 = function (O) {
    var S = max$1(O);
    return function (as) { return as.reduce(S.concat); };
};
/**
 * @since 2.10.0
 */
var concatAll$1 = function (S) { return function (as) { return as.reduce(S.concat); }; };

var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
var isNonEmpty$1 = function (as) { return as.length > 0; };
/**
 * @internal
 */
var isOutOfBound$1 = function (i, as) { return i < 0 || i >= as.length; };
/**
 * @internal
 */
var prepend = function (head) { return function (tail) { return __spreadArray$1([head], tail); }; };
/**
 * @internal
 */
var append = function (end) { return function (init) { return concat(init, [end]); }; };
/**
 * @internal
 */
var unsafeInsertAt = function (i, a, as) {
    if (isNonEmpty$1(as)) {
        var xs = fromReadonlyNonEmptyArray(as);
        xs.splice(i, 0, a);
        return xs;
    }
    return [a];
};
/**
 * @internal
 */
var unsafeUpdateAt$1 = function (i, a, as) {
    var xs = fromReadonlyNonEmptyArray(as);
    xs[i] = a;
    return xs;
};
/**
 * @internal
 */
var uniq = function (E) { return function (as) {
    if (as.length === 1) {
        return copy(as);
    }
    var out = [head$1(as)];
    var rest = tail(as);
    var _loop_1 = function (a) {
        if (out.every(function (o) { return !E.equals(o, a); })) {
            out.push(a);
        }
    };
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var a = rest_1[_i];
        _loop_1(a);
    }
    return out;
}; };
/**
 * @internal
 */
var sortBy = function (ords) {
    if (isNonEmpty$1(ords)) {
        var M = getMonoid();
        return sort(ords.reduce(M.concat, M.empty));
    }
    return copy;
};
/**
 * @internal
 */
var union = function (E) {
    var uniqE = uniq(E);
    return function (first, second) { return uniqE(concat(first, second)); };
};
/**
 * @internal
 */
var rotate = function (n) { return function (as) {
    var len = as.length;
    var m = Math.round(n) % len;
    if (isOutOfBound$1(Math.abs(m), as) || m === 0) {
        return copy(as);
    }
    if (m < 0) {
        var _a = splitAt(-m)(as), f = _a[0], s = _a[1];
        return concat(s, f);
    }
    else {
        return rotate(m - len)(as);
    }
}; };
/**
 * @internal
 */
var makeBy = function (n, f) {
    var j = Math.max(0, Math.floor(n));
    var out = [f(0)];
    for (var i = 1; i < j; i++) {
        out.push(f(i));
    }
    return out;
};
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
var fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray$1;
/**
 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
 *
 * @category constructors
 * @since 2.0.0
 */
var fromArray = function (as) { return (isNonEmpty$1(as) ? some$5(as) : none); };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Return the tuple of the `head` and the `tail`.
 *
 * @example
 * import { unprepend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unprepend([1, 2, 3]), [1, [2, 3]])
 *
 * @category destructors
 * @since 2.9.0
 */
var unprepend = function (as) { return [head$1(as), tail(as)]; };
/**
 * Return the tuple of the `init` and the `last`.
 *
 * @example
 * import { unappend } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
 *
 * @category destructors
 * @since 2.9.0
 */
var unappend = function (as) { return [init(as), last$2(as)]; };
function concat(first, second) {
    return first.concat(second);
}
/**
 * @category combinators
 * @since 2.0.0
 */
var reverse$2 = function (as) { return __spreadArray$1([last$2(as)], as.slice(0, -1).reverse()); };
function group(E) {
    return function (as) {
        var len = as.length;
        if (len === 0) {
            return [];
        }
        var out = [];
        var head = as[0];
        var nea = [head];
        for (var i = 1; i < len; i++) {
            var a = as[i];
            if (E.equals(a, head)) {
                nea.push(a);
            }
            else {
                out.push(nea);
                head = a;
                nea = [head];
            }
        }
        out.push(nea);
        return out;
    };
}
function groupSort(O) {
    var sortO = sort(O);
    var groupO = group(O);
    return function (as) { return (isNonEmpty$1(as) ? groupO(sortO(as)) : []); };
}
/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { groupBy } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['a', 'b', 'ab']), {
 *   '1': ['a', 'b'],
 *   '2': ['ab']
 * })
 *
 * @category combinators
 * @since 2.0.0
 */
var groupBy = function (f) { return function (as) {
    var out = {};
    for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
        var a = as_1[_i];
        var k = f(a);
        if (out.hasOwnProperty(k)) {
            out[k].push(a);
        }
        else {
            out[k] = [a];
        }
    }
    return out;
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var sort = function (O) { return function (as) {
    return as.slice().sort(O.compare);
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var insertAt = function (i, a) { return function (as) {
    return i < 0 || i > as.length ? none : some$5(unsafeInsertAt(i, a, as));
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var updateAt = function (i, a) {
    return modifyAt(i, function () { return a; });
};
/**
 * @category combinators
 * @since 2.0.0
 */
var modifyAt = function (i, f) { return function (as) {
    return isOutOfBound$1(i, as) ? none : some$5(unsafeUpdateAt$1(i, f(as[i]), as));
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var copy = fromReadonlyNonEmptyArray;
/**
 * @category Pointed
 * @since 2.0.0
 */
var of = function (a) { return [a]; };
/**
 * @category combinators
 * @since 2.5.1
 */
var zipWith = function (as, bs, f) {
    var cs = [f(as[0], bs[0])];
    var len = Math.min(as.length, bs.length);
    for (var i = 1; i < len; i++) {
        cs[i] = f(as[i], bs[i]);
    }
    return cs;
};
function zip(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip(bs, as); };
    }
    return zipWith(as, bs, function (a, b) { return [a, b]; });
}
/**
 * @category combinators
 * @since 2.5.1
 */
var unzip = function (abs) {
    var fa = [abs[0][0]];
    var fb = [abs[0][1]];
    for (var i = 1; i < abs.length; i++) {
        fa[i] = abs[i][0];
        fb[i] = abs[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.10.0
 */
var prependAll = function (middle) { return function (as) {
    var out = [middle, as[0]];
    for (var i = 1; i < as.length; i++) {
        out.push(middle, as[i]);
    }
    return out;
}; };
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.9.0
 */
var intersperse = function (middle) { return function (as) {
    var rest = tail(as);
    return isNonEmpty$1(rest) ? pipe$1(rest, prependAll(middle), prepend(head$1(as))) : copy(as);
}; };
/**
 * @category combinators
 * @since 2.0.0
 */
var foldMapWithIndex$1 = foldMapWithIndex;
/**
 * @category combinators
 * @since 2.0.0
 */
var foldMap$1 = foldMap;
/**
 * @category combinators
 * @since 2.10.0
 */
var chainWithIndex = function (f) { return function (as) {
    var out = fromReadonlyNonEmptyArray(f(0, head$1(as)));
    for (var i = 1; i < as.length; i++) {
        out.push.apply(out, f(i, as[i]));
    }
    return out;
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var chop = function (f) { return function (as) {
    var _a = f(as), b = _a[0], rest = _a[1];
    var out = [b];
    var next = rest;
    while (isNonEmpty$1(next)) {
        var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
        out.push(b_1);
        next = rest_2;
    }
    return out;
}; };
/**
 * Splits a `NonEmptyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category combinators
 * @since 2.10.0
 */
var splitAt = function (n) { return function (as) {
    var m = Math.max(1, n);
    return m >= as.length ? [copy(as), []] : [pipe$1(as.slice(1, m), prepend(head$1(as))), as.slice(m)];
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var chunksOf = function (n) { return chop(splitAt(n)); };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return pipe$1(fa, map(f)); };
/* istanbul ignore next */
var _mapWithIndex = function (fa, f) { return pipe$1(fa, mapWithIndex(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return pipe$1(fab, ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return pipe$1(ma, chain(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return pipe$1(wa, extend(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return pipe$1(fa, reduce$1(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = foldMap$1(M);
    return function (fa, f) { return pipe$1(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return pipe$1(fa, reduceRight$1(b, f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = traverse(F);
    return function (ta, f) { return pipe$1(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _alt = function (fa, that) { return pipe$1(fa, alt(that)); };
/* istanbul ignore next */
var _reduceWithIndex = function (fa, b, f) {
    return pipe$1(fa, reduceWithIndex$1(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$1(M);
    return function (fa, f) { return pipe$1(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex = function (fa, b, f) {
    return pipe$1(fa, reduceRightWithIndex$1(b, f));
};
/* istanbul ignore next */
var _traverseWithIndex = function (F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (ta, f) { return pipe$1(ta, traverseWithIndexF(f)); };
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW = function (that) { return function (as) {
    return concat(as, that());
}; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.6.2
 */
var alt = altW;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap = function (as) {
    return chain(function (f) { return pipe$1(as, map(f)); });
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) {
    return chainWithIndex(function (_, a) { return f(a); });
};
/**
 * @category Extend
 * @since 2.0.0
 */
var extend = function (f) { return function (as) {
    var next = tail(as);
    var out = [f(as)];
    while (isNonEmpty$1(next)) {
        out.push(f(next));
        next = tail(next);
    }
    return out;
}; };
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.5.0
 */
var duplicate = 
/*#__PURE__*/
extend(identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var flatten = 
/*#__PURE__*/
chain(identity);
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map = function (f) { return mapWithIndex(function (_, a) { return f(a); }); };
/**
 * @category FunctorWithIndex
 * @since 2.0.0
 */
var mapWithIndex = function (f) { return function (as) {
    var out = [f(0, head$1(as))];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i]));
    }
    return out;
}; };
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduce$1 = reduce;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceWithIndex$1 = reduceWithIndex;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight$1 = reduceRight;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceRightWithIndex$1 = reduceRightWithIndex;
/**
 * @since 2.6.3
 */
var traverse = function (F) {
    var traverseWithIndexF = traverseWithIndex(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
/**
 * @since 2.6.3
 */
var sequence = function (F) { return traverseWithIndex(F)(function (_, a) { return a; }); };
/**
 * @since 2.6.3
 */
var traverseWithIndex = function (F) { return function (f) { return function (as) {
    var out = F.map(f(0, head$1(as)), of);
    for (var i = 1; i < as.length; i++) {
        out = F.ap(F.map(out, function (bs) { return function (b) { return pipe$1(bs, append(b)); }; }), f(i, as[i]));
    }
    return out;
}; }; };
/**
 * @since 2.7.0
 */
var extract$1 = head;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$1 = 'NonEmptyArray';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow$1 = getShow;
/**
 * Builds a `Semigroup` instance for `NonEmptyArray`
 *
 * @category instances
 * @since 2.0.0
 */
var getSemigroup$1 = function () { return ({
    concat: concat
}); };
/**
 * @example
 * import { getEq } from 'fp-ts/NonEmptyArray'
 * import * as N from 'fp-ts/number'
 *
 * const E = getEq(N.Eq)
 * assert.strictEqual(E.equals([1, 2], [1, 2]), true)
 * assert.strictEqual(E.equals([1, 2], [1, 3]), false)
 *
 * @category instances
 * @since 2.0.0
 */
var getEq$1 = getEq;
/**
 * @category instances
 * @since 2.7.0
 */
var Functor = {
    URI: URI$1,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap = 
/*#_PURE_*/
flap$5(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed = {
    URI: URI$1,
    of: of
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex = {
    URI: URI$1,
    map: _map,
    mapWithIndex: _mapWithIndex
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply = {
    URI: URI$1,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apFirst = 
/*#__PURE__*/
apFirst$3(Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apSecond = 
/*#__PURE__*/
apSecond$3(Apply);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative = {
    URI: URI$1,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain = {
    URI: URI$1,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var chainFirst = 
/*#__PURE__*/
chainFirst$3(Chain);
/**
 * @category instances
 * @since 2.7.0
 */
var Monad = {
    URI: URI$1,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable = {
    URI: URI$1,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex = {
    URI: URI$1,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable = {
    URI: URI$1,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence
};
/**
 * @category instances
 * @since 2.7.0
 */
var TraversableWithIndex = {
    URI: URI$1,
    map: _map,
    mapWithIndex: _mapWithIndex,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt = {
    URI: URI$1,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.7.0
 */
var Comonad = {
    URI: URI$1,
    map: _map,
    extend: _extend,
    extract: extract$1
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do = 
/*#__PURE__*/
of({});
/**
 * @since 2.8.0
 */
var bindTo = 
/*#__PURE__*/
bindTo$3(Functor);
/**
 * @since 2.8.0
 */
var bind = 
/*#__PURE__*/
bind$3(Chain);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS = 
/*#__PURE__*/
apS$3(Apply);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
var head$1 = head;
/**
 * @since 2.0.0
 */
var tail = function (as) { return as.slice(1); };
/**
 * @since 2.0.0
 */
var last$2 = last$1;
/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * import { init } from 'fp-ts/NonEmptyArray'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 *
 * @since 2.2.0
 */
var init = function (as) { return as.slice(0, -1); };
/**
 * @since 2.0.0
 */
var min$3 = min$2;
/**
 * @since 2.0.0
 */
var max$3 = max$2;
/**
 * @since 2.10.0
 */
var concatAll$2 = function (S) { return function (as) { return as.reduce(S.concat); }; };
function filter(predicate) {
    // tslint:disable-next-line: deprecation
    return filterWithIndex(function (_, a) { return predicate(a); });
}
/**
 * Use [`filterWithIndex`](./Array.ts.html#filterWithIndex) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var filterWithIndex = function (predicate) { return function (as) { return fromArray(as.filter(function (a, i) { return predicate(i, a); })); }; };
/**
 * Use [`unprepend`](#unprepend) instead.
 *
 * @category destructors
 * @since 2.9.0
 * @deprecated
 */
var uncons = unprepend;
/**
 * Use [`unappend`](#unappend) instead.
 *
 * @category destructors
 * @since 2.9.0
 * @deprecated
 */
var unsnoc = unappend;
function cons(head, tail) {
    return tail === undefined ? prepend(head) : pipe$1(tail, prepend(head));
}
/**
 * Use [`append`](./Array.ts.html#append) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var snoc = function (init, end) { return pipe$1(init, append(end)); };
/**
 * Use [`prependAll`](#prependall) instead.
 *
 * @category combinators
 * @since 2.9.0
 * @deprecated
 */
var prependToAll = prependAll;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
var fold$1 = concatAll$1;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var nonEmptyArray = {
    URI: URI$1,
    of: of,
    map: _map,
    mapWithIndex: _mapWithIndex,
    ap: _ap,
    chain: _chain,
    extend: _extend,
    extract: extract$1,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: sequence,
    reduceWithIndex: _reduceWithIndex,
    foldMapWithIndex: _foldMapWithIndex,
    reduceRightWithIndex: _reduceRightWithIndex,
    traverseWithIndex: _traverseWithIndex,
    alt: _alt
};

var NonEmptyArray = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isNonEmpty: isNonEmpty$1,
    isOutOfBound: isOutOfBound$1,
    prepend: prepend,
    append: append,
    unsafeInsertAt: unsafeInsertAt,
    unsafeUpdateAt: unsafeUpdateAt$1,
    uniq: uniq,
    sortBy: sortBy,
    union: union,
    rotate: rotate,
    makeBy: makeBy,
    fromReadonlyNonEmptyArray: fromReadonlyNonEmptyArray,
    fromArray: fromArray,
    unprepend: unprepend,
    unappend: unappend,
    concat: concat,
    reverse: reverse$2,
    group: group,
    groupSort: groupSort,
    groupBy: groupBy,
    sort: sort,
    insertAt: insertAt,
    updateAt: updateAt,
    modifyAt: modifyAt,
    copy: copy,
    of: of,
    zipWith: zipWith,
    zip: zip,
    unzip: unzip,
    prependAll: prependAll,
    intersperse: intersperse,
    foldMapWithIndex: foldMapWithIndex$1,
    foldMap: foldMap$1,
    chainWithIndex: chainWithIndex,
    chop: chop,
    splitAt: splitAt,
    chunksOf: chunksOf,
    altW: altW,
    alt: alt,
    ap: ap,
    chain: chain,
    extend: extend,
    duplicate: duplicate,
    flatten: flatten,
    map: map,
    mapWithIndex: mapWithIndex,
    reduce: reduce$1,
    reduceWithIndex: reduceWithIndex$1,
    reduceRight: reduceRight$1,
    reduceRightWithIndex: reduceRightWithIndex$1,
    traverse: traverse,
    sequence: sequence,
    traverseWithIndex: traverseWithIndex,
    extract: extract$1,
    URI: URI$1,
    getShow: getShow$1,
    getSemigroup: getSemigroup$1,
    getEq: getEq$1,
    Functor: Functor,
    flap: flap,
    Pointed: Pointed,
    FunctorWithIndex: FunctorWithIndex,
    Apply: Apply,
    apFirst: apFirst,
    apSecond: apSecond,
    Applicative: Applicative,
    Chain: Chain,
    chainFirst: chainFirst,
    Monad: Monad,
    Foldable: Foldable,
    FoldableWithIndex: FoldableWithIndex,
    Traversable: Traversable,
    TraversableWithIndex: TraversableWithIndex,
    Alt: Alt,
    Comonad: Comonad,
    Do: Do,
    bindTo: bindTo,
    bind: bind,
    apS: apS,
    head: head$1,
    tail: tail,
    last: last$2,
    init: init,
    min: min$3,
    max: max$3,
    concatAll: concatAll$2,
    filter: filter,
    filterWithIndex: filterWithIndex,
    uncons: uncons,
    unsnoc: unsnoc,
    cons: cons,
    snoc: snoc,
    prependToAll: prependToAll,
    fold: fold$1,
    nonEmptyArray: nonEmptyArray
});

/**
 * The `Bounded` type class represents totally ordered types that have an upper and lower boundary.
 *
 * Instances should satisfy the following law in addition to the `Ord` laws:
 *
 * - Bounded: `bottom <= a <= top`
 *
 * @since 2.0.0
 */
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Bounded`](./number.ts.html#Bounded) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var boundedNumber = {
    // tslint:disable-next-line: deprecation
    equals: ordNumber.equals,
    // tslint:disable-next-line: deprecation
    compare: ordNumber.compare,
    top: Infinity,
    bottom: -Infinity
};

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Field`](./number.ts.html#Field) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var fieldNumber = {
    add: function (x, y) { return x + y; },
    zero: 0,
    mul: function (x, y) { return x * y; },
    one: 1,
    sub: function (x, y) { return x - y; },
    degree: function (_) { return 1; },
    div: function (x, y) { return x / y; },
    mod: function (x, y) { return x % y; }
};

/**
 * The `Show` type class represents those types which can be converted into
 * a human-readable `string` representation.
 *
 * While not required, it is recommended that for any expression `x`, the
 * string `show(x)` be executable TypeScript code which evaluates to the same
 * value as the expression `x`.
 *
 * @since 2.0.0
 */
/**
 * Use [`Show`](./boolean.ts.html#Show) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var showBoolean = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * Use [`Show`](./string.ts.html#Show) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var showString = {
    show: function (a) { return JSON.stringify(a); }
};
/**
 * Use [`Show`](./number.ts.html#Show) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var showNumber = {
    show: function (a) { return JSON.stringify(a); }
};

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get a monoid where `concat` will return the minimum, based on the provided bounded order.
 *
 * The `empty` value is the `top` value.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as M from 'fp-ts/Monoid'
 *
 * const M1 = M.min(N.Bounded)
 *
 * assert.deepStrictEqual(M1.concat(1, 2), 1)
 *
 * @category constructors
 * @since 2.10.0
 */
var min$4 = function (B) { return ({
    concat: min$1(B).concat,
    empty: B.top
}); };
/**
 * Get a monoid where `concat` will return the maximum, based on the provided bounded order.
 *
 * The `empty` value is the `bottom` value.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as M from 'fp-ts/Monoid'
 *
 * const M1 = M.max(N.Bounded)
 *
 * assert.deepStrictEqual(M1.concat(1, 2), 2)
 *
 * @category constructors
 * @since 2.10.0
 */
var max$4 = function (B) { return ({
    concat: max$1(B).concat,
    empty: B.bottom
}); };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Monoid`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse } from 'fp-ts/Monoid'
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(reverse(S.Monoid).concat('a', 'b'), 'ba')
 *
 * @category combinators
 * @since 2.10.0
 */
var reverse$3 = function (M) { return ({
    concat: reverse$1(M).concat,
    empty: M.empty
}); };
/**
 * Given a struct of monoids returns a monoid for the struct.
 *
 * @example
 * import { struct } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const M = struct<Point>({
 *   x: N.MonoidSum,
 *   y: N.MonoidSum
 * })
 *
 * assert.deepStrictEqual(M.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @category combinators
 * @since 2.10.0
 */
var struct$1 = function (monoids) {
    var empty = {};
    for (var k in monoids) {
        if (has$2.call(monoids, k)) {
            empty[k] = monoids[k].empty;
        }
    }
    return {
        concat: struct(monoids).concat,
        empty: empty
    };
};
/**
 * Given a tuple of monoids returns a monoid for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Monoid'
 * import * as B from 'fp-ts/boolean'
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/string'
 *
 * const M1 = tuple(S.Monoid, N.MonoidSum)
 * assert.deepStrictEqual(M1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const M2 = tuple(S.Monoid, N.MonoidSum, B.MonoidAll)
 * assert.deepStrictEqual(M2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @category combinators
 * @since 2.10.0
 */
var tuple$2 = function () {
    var monoids = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        monoids[_i] = arguments[_i];
    }
    return ({
        concat: tuple$1.apply(Semigroup, monoids).concat,
        empty: monoids.map(function (m) { return m.empty; })
    });
};
/**
 * @category instances
 * @since 2.0.0
 */
var monoidVoid = {
    concat: semigroupVoid.concat,
    empty: undefined
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the monoid `empty` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(concatAll(N.MonoidSum)([1, 2, 3]), 6)
 * assert.deepStrictEqual(concatAll(N.MonoidSum)([]), 0)
 *
 * @since 2.10.0
 */
var concatAll$3 = function (M) { return concatAll(M)(M.empty); };
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getTupleMonoid = tuple$2;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getStructMonoid = struct$1;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var getDualMonoid = reverse$3;
/**
 * Use [`max`](#max) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var getJoinMonoid = max$4;
/**
 * Use [`min`](#min) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var getMeetMonoid = min$4;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var fold$2 = concatAll$3;
/**
 * Use [`MonoidAll`](./boolean.ts.html#monoidall) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var monoidAll = {
    // tslint:disable-next-line: deprecation
    concat: semigroupAll.concat,
    empty: true
};
/**
 * Use [`MonoidAny`](./boolean.ts.html#MonoidAny) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var monoidAny = {
    // tslint:disable-next-line: deprecation
    concat: semigroupAny.concat,
    empty: false
};
/**
 * Use [`getMonoid`](./function.ts.html#getMonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getFunctionMonoid = getMonoid$6;
/**
 * Use [`getEndomorphismMonoid`](./function.ts.html#getEndomorphismMonoid) instead.
 *
 * **Note**. The execution order in [`getEndomorphismMonoid`](./function.ts.html#getEndomorphismMonoid) is reversed.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getEndomorphismMonoid = function () { return reverse$3(getEndomorphismMonoid$1()); };
/**
 * Use [`Monoid`](./string.ts.html#Monoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var monoidString = {
    // tslint:disable-next-line: deprecation
    concat: semigroupString.concat,
    empty: ''
};
/**
 * Use [`MonoidSum`](./number.ts.html#MonoidSum) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var monoidSum = {
    // tslint:disable-next-line: deprecation
    concat: semigroupSum.concat,
    empty: 0
};
/**
 * Use [`MonoidProduct`](./number.ts.html#MonoidProduct) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var monoidProduct = {
    // tslint:disable-next-line: deprecation
    concat: semigroupProduct.concat,
    empty: 1
};

var Monoid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    min: min$4,
    max: max$4,
    reverse: reverse$3,
    struct: struct$1,
    tuple: tuple$2,
    monoidVoid: monoidVoid,
    concatAll: concatAll$3,
    getTupleMonoid: getTupleMonoid,
    getStructMonoid: getStructMonoid,
    getDualMonoid: getDualMonoid,
    getJoinMonoid: getJoinMonoid,
    getMeetMonoid: getMeetMonoid,
    fold: fold$2,
    monoidAll: monoidAll,
    monoidAny: monoidAny,
    getFunctionMonoid: getFunctionMonoid,
    getEndomorphismMonoid: getEndomorphismMonoid,
    monoidString: monoidString,
    monoidSum: monoidSum,
    monoidProduct: monoidProduct
});

/**
 * @since 2.10.0
 */
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Eq = eqNumber;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Ord$1 = ordNumber;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Bounded = boundedNumber;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Field = fieldNumber;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Show = showNumber;
/**
 * `number` semigroup under addition.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupSum.concat(2, 3), 5)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var SemigroupSum = semigroupSum;
/**
 * `number` semigroup under multiplication.
 *
 * @example
 * import { SemigroupProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupProduct.concat(2, 3), 6)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var SemigroupProduct = semigroupProduct;
/**
 * `number` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @example
 * import { MonoidSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidSum.concat(2, MonoidSum.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var MonoidSum = monoidSum;
/**
 * `number` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @example
 * import { MonoidProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidProduct.concat(2, MonoidProduct.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var MonoidProduct = monoidProduct;

var number = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Eq: Eq,
    Ord: Ord$1,
    Bounded: Bounded,
    Field: Field,
    Show: Show,
    SemigroupSum: SemigroupSum,
    SemigroupProduct: SemigroupProduct,
    MonoidSum: MonoidSum,
    MonoidProduct: MonoidProduct
});

/**
 * Test whether a `ReadonlyArray` is empty.
 *
 * @example
 * import { isEmpty } from 'fp-ts/ReadonlyArray'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @since 2.5.0
 */
var isEmpty = function (as) { return as.length === 0; };
/**
 * Test whether a `ReadonlyArray` is non empty.
 *
 * @category guards
 * @since 2.5.0
 */
var isNonEmpty$2 = isNonEmpty;
/**
 * Test whether an array contains a particular index
 *
 * @since 2.5.0
 */
var isOutOfBound$2 = isOutOfBound;
function lookup(i, as) {
    return as === undefined ? function (as) { return lookup(i, as); } : isOutOfBound$2(i, as) ? none : some$5(as[i]);
}
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 2.5.0
 */
var head$2 = function (as) { return (isNonEmpty$2(as) ? some$5(head(as)) : none); };
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 2.5.0
 */
var last$3 = function (as) { return (isNonEmpty$2(as) ? some$5(last$1(as)) : none); };
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.5.0
 */
var findIndex = function (predicate) { return function (as) {
    for (var i = 0; i < as.length; i++) {
        if (predicate(as[i])) {
            return some$5(i);
        }
    }
    return none;
}; };
function findFirst(predicate) {
    return function (as) {
        for (var i = 0; i < as.length; i++) {
            if (predicate(as[i])) {
                return some$5(as[i]);
            }
        }
        return none;
    };
}
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @since 2.5.0
 */
var findFirstMap = function (f) { return function (as) {
    for (var i = 0; i < as.length; i++) {
        var out = f(as[i]);
        if (isSome(out)) {
            return out;
        }
    }
    return none;
}; };
function findLast(predicate) {
    return function (as) {
        for (var i = as.length - 1; i >= 0; i--) {
            if (predicate(as[i])) {
                return some$5(as[i]);
            }
        }
        return none;
    };
}
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @since 2.5.0
 */
var findLastMap = function (f) { return function (as) {
    for (var i = as.length - 1; i >= 0; i--) {
        var out = f(as[i]);
        if (isSome(out)) {
            return out;
        }
    }
    return none;
}; };
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/ReadonlyArray'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: ReadonlyArray<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.5.0
 */
var findLastIndex = function (predicate) { return function (as) {
    for (var i = as.length - 1; i >= 0; i--) {
        if (predicate(as[i])) {
            return some$5(i);
        }
    }
    return none;
}; };
function elem(E) {
    return function (a, as) {
        if (as === undefined) {
            var elemE_1 = elem(E);
            return function (as) { return elemE_1(a, as); };
        }
        var predicate = function (element) { return E.equals(element, a); };
        var i = 0;
        for (; i < as.length; i++) {
            if (predicate(as[i])) {
                return true;
            }
        }
        return false;
    };
}
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var foldMapWithIndex$2 = function (M) { return function (f) { return function (fa) {
    return fa.reduce(function (b, a, i) { return M.concat(b, f(i, a)); }, M.empty);
}; }; };
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduce$2 = function (b, f) {
    return reduceWithIndex$2(b, function (_, b, a) { return f(b, a); });
};
/**
 * @category Foldable
 * @since 2.5.0
 */
var foldMap$2 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$2(M);
    return function (f) { return foldMapWithIndexM(function (_, a) { return f(a); }); };
};
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceWithIndex$2 = function (b, f) { return function (fa) {
    var len = fa.length;
    var out = b;
    for (var i = 0; i < len; i++) {
        out = f(i, out, fa[i]);
    }
    return out;
}; };
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduceRight$2 = function (b, f) {
    return reduceRightWithIndex$2(b, function (_, a, b) { return f(a, b); });
};
/**
 * @category FoldableWithIndex
 * @since 2.5.0
 */
var reduceRightWithIndex$2 = function (b, f) { return function (fa) { return fa.reduceRight(function (b, a, i) { return f(i, a, b); }, b); }; };
/**
 * @category instances
 * @since 2.5.0
 */
var getShow$2 = function (S) { return ({
    show: function (as) { return "[" + as.map(S.show).join(', ') + "]"; }
}); };
/**
 * Derives an `Eq` over the `ReadonlyArray` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/ReadonlyArray'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.5.0
 */
var getEq$2 = function (E) {
    return fromEquals(function (xs, ys) { return xs.length === ys.length && xs.every(function (x, i) { return E.equals(x, ys[i]); }); });
};
/**
 * Derives an `Ord` over the `ReadonlyArray` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/ReadonlyArray'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 *
 * @category instances
 * @since 2.5.0
 */
var getOrd = function (O) {
    return fromCompare(function (a, b) {
        var aLen = a.length;
        var bLen = b.length;
        var len = Math.min(aLen, bLen);
        for (var i = 0; i < len; i++) {
            var ordering = O.compare(a[i], b[i]);
            if (ordering !== 0) {
                return ordering;
            }
        }
        return Ord$1.compare(aLen, bLen);
    });
};
/**
 * @category unsafe
 * @since 2.5.0
 */
var unsafeUpdateAt$2 = function (i, a, as) {
    return isNonEmpty$2(as) ? unsafeUpdateAt(i, a, as) : as;
};
/**
 * Check if a predicate holds true for every array member.
 *
 * @example
 * import { every } from 'fp-ts/ReadonlyArray'
 * import { pipe } from 'fp-ts/function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], every(isPositive)), true)
 * assert.deepStrictEqual(pipe([1, 2, -3], every(isPositive)), false)
 *
 * @since 2.9.0
 */
var every = function (predicate) { return function (as) { return as.every(predicate); }; };

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Prepend an element to the front of a `Array`, creating a new `NonEmptyArray`.
 *
 * @example
 * import { prepend } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([2, 3, 4], prepend(1)), [1, 2, 3, 4])
 *
 * @category constructors
 * @since 2.10.0
 */
var prepend$1 = prepend;
/**
 * Append an element to the end of a `Array`, creating a new `NonEmptyArray`.
 *
 * @example
 * import { append } from 'fp-ts/Array'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @category constructors
 * @since 2.10.0
 */
var append$1 = append;
/**
 * Return a `Array` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { makeBy } from 'fp-ts/Array'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(makeBy(5, double), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 2.0.0
 */
var makeBy$1 = function (n, f) { return (n <= 0 ? [] : makeBy(n, f)); };
/**
 * Create an `Array` containing a range of integers, including both endpoints.
 *
 * @example
 * import { range } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 2.0.0
 */
var range = function (start, end) {
    return start <= end ? makeBy$1(end - start + 1, function (i) { return start + i; }) : [start];
};
/**
 * Create a `Array` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { replicate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(replicate(3, 'a'), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 2.0.0
 */
var replicate = function (n, a) { return makeBy$1(n, function () { return a; }); };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Break an array into its first element and remaining elements
 *
 * @example
 * import { matchLeft } from 'fp-ts/Array'
 *
 * const len: <A>(as: Array<A>) => number = matchLeft(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @category destructors
 * @since 2.10.0
 */
var matchLeft = function (onEmpty, onNonEmpty) { return function (as) {
    return isNonEmpty$3(as) ? onNonEmpty(head$1(as), tail(as)) : onEmpty();
}; };
/**
 * Alias of [`matchLeft`](#matchleft).
 *
 * @category destructors
 * @since 2.0.0
 */
var foldLeft = matchLeft;
/**
 * Break an array into its initial elements and the last element
 *
 * @category destructors
 * @since 2.10.0
 */
var matchRight = function (onEmpty, onNonEmpty) { return function (as) {
    return isNonEmpty$3(as) ? onNonEmpty(init(as), last$2(as)) : onEmpty();
}; };
/**
 * Alias of [`matchRight`](#matchright).
 *
 * @category destructors
 * @since 2.0.0
 */
var foldRight = matchRight;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.7.0
 */
var chainWithIndex$1 = function (f) { return function (as) {
    var out = [];
    for (var i = 0; i < as.length; i++) {
        out.push.apply(out, f(i, as[i]));
    }
    return out;
}; };
/**
 * Same as `reduce` but it carries over the intermediate steps
 *
 * @example
 * import { scanLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @category combinators
 * @since 2.0.0
 */
var scanLeft = function (b, f) { return function (as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[0] = b;
    for (var i = 0; i < len; i++) {
        out[i + 1] = f(out[i], as[i]);
    }
    return out;
}; };
/**
 * Fold an array from the right, keeping all intermediate results instead of only the final result
 *
 * @example
 * import { scanRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @category combinators
 * @since 2.0.0
 */
var scanRight = function (b, f) { return function (as) {
    var len = as.length;
    var out = new Array(len + 1);
    out[len] = b;
    for (var i = len - 1; i >= 0; i--) {
        out[i] = f(as[i], out[i + 1]);
    }
    return out;
}; };
/**
 * Test whether an array is empty
 *
 * @example
 * import { isEmpty } from 'fp-ts/Array'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @since 2.0.0
 */
var isEmpty$1 = isEmpty;
/**
 * Test whether an array is non empty narrowing down the type to `NonEmptyArray<A>`
 *
 * @category guards
 * @since 2.0.0
 */
var isNonEmpty$3 = isNonEmpty$1;
/**
 * Calculate the number of elements in a `Array`.
 *
 * @since 2.10.0
 */
var size = function (as) { return as.length; };
/**
 * Test whether an array contains a particular index
 *
 * @since 2.0.0
 */
var isOutOfBound$3 = isOutOfBound$1;
// TODO: remove non-curried overloading in v3
/**
 * This function provides a safe way to read a value at a particular index from an array
 *
 * @example
 * import { lookup } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(1)), some(2))
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(3)), none)
 *
 * @since 2.0.0
 */
var lookup$1 = lookup;
/**
 * Get the first element in an array, or `None` if the array is empty
 *
 * @example
 * import { head } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var head$3 = head$2;
/**
 * Get the last element in an array, or `None` if the array is empty
 *
 * @example
 * import { last } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var last$4 = last$3;
/**
 * Get all but the first element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { tail } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var tail$1 = function (as) { return (isNonEmpty$3(as) ? some$5(tail(as)) : none); };
/**
 * Get all but the last element of an array, creating a new array, or `None` if the array is empty
 *
 * @example
 * import { init } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @category destructors
 * @since 2.0.0
 */
var init$1 = function (as) { return (isNonEmpty$3(as) ? some$5(init(as)) : none); };
/**
 * Keep only a max number of elements from the start of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { takeLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(takeLeft(2)([1, 2, 3]), [1, 2])
 *
 * @category combinators
 * @since 2.0.0
 */
var takeLeft = function (n) { return function (as) { return (isOutOfBound$3(n, as) ? copy$1(as) : as.slice(0, n)); }; };
/**
 * Keep only a max number of elements from the end of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { takeRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(takeRight(2)([1, 2, 3, 4, 5]), [4, 5])
 *
 * @category combinators
 * @since 2.0.0
 */
var takeRight = function (n) { return function (as) {
    return isOutOfBound$3(n, as) ? copy$1(as) : n === 0 ? [] : as.slice(-n);
}; };
function takeLeftWhile(predicate) {
    return function (as) {
        var out = [];
        for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
            var a = as_1[_i];
            if (!predicate(a)) {
                break;
            }
            out.push(a);
        }
        return out;
    };
}
var spanLeftIndex = function (as, predicate) {
    var l = as.length;
    var i = 0;
    for (; i < l; i++) {
        if (!predicate(as[i])) {
            break;
        }
    }
    return i;
};
function spanLeft(predicate) {
    return function (as) {
        var _a = splitAt$1(spanLeftIndex(as, predicate))(as), init = _a[0], rest = _a[1];
        return { init: init, rest: rest };
    };
}
/**
 * Drop a max number of elements from the start of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { dropLeft } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(dropLeft(2)([1, 2, 3]), [3])
 *
 * @category combinators
 * @since 2.0.0
 */
var dropLeft = function (n) { return function (as) {
    return n <= 0 || isEmpty$1(as) ? copy$1(as) : n >= as.length ? [] : as.slice(n, as.length);
}; };
/**
 * Drop a max number of elements from the end of an `Array`, creating a new `Array`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @example
 * import { dropRight } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(dropRight(2)([1, 2, 3, 4, 5]), [1, 2, 3])
 *
 * @category combinators
 * @since 2.0.0
 */
var dropRight = function (n) { return function (as) {
    return n <= 0 || isEmpty$1(as) ? copy$1(as) : n >= as.length ? [] : as.slice(0, as.length - n);
}; };
/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new array
 *
 * @example
 * import { dropLeftWhile } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(dropLeftWhile((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]), [2, 4, 5])
 *
 * @category combinators
 * @since 2.0.0
 */
var dropLeftWhile = function (predicate) { return function (as) {
    return as.slice(spanLeftIndex(as, predicate));
}; };
/**
 * Find the first index for which a predicate holds
 *
 * @example
 * import { findIndex } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 2.0.0
 */
var findIndex$1 = findIndex;
function findFirst$1(predicate) {
    return findFirst(predicate);
}
/**
 * Find the first element returned by an option based selector function
 *
 * @example
 * import { findFirstMap } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @category destructors
 * @since 2.0.0
 */
var findFirstMap$1 = findFirstMap;
function findLast$1(predicate) {
    return findLast(predicate);
}
/**
 * Find the last element returned by an option based selector function
 *
 * @example
 * import { findLastMap } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age?: number
 * }
 *
 * const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @category destructors
 * @since 2.0.0
 */
var findLastMap$1 = findLastMap;
/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @example
 * import { findLastIndex } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * interface X {
 *   readonly a: number
 *   readonly b: number
 * }
 * const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { readonly a: number }) => x.a === 4)(xs), none)
 *
 *
 * @since 2.0.0
 */
var findLastIndex$1 = findLastIndex;
/**
 * @category combinators
 * @since 2.0.0
 */
var copy$1 = function (as) { return as.slice(); };
/**
 * Insert an element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { insertAt } from 'fp-ts/Array'
 * import { some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 2.0.0
 */
var insertAt$1 = function (i, a) { return function (as) {
    return i < 0 || i > as.length ? none : some$5(unsafeInsertAt$1(i, a, as));
}; };
/**
 * Change the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { updateAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 2.0.0
 */
var updateAt$1 = function (i, a) { return modifyAt$1(i, function () { return a; }); };
/**
 * Delete the element at the specified index, creating a new array, or returning `None` if the index is out of bounds
 *
 * @example
 * import { deleteAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 2.0.0
 */
var deleteAt = function (i) { return function (as) {
    return isOutOfBound$3(i, as) ? none : some$5(unsafeDeleteAt(i, as));
}; };
/**
 * Apply a function to the element at the specified index, creating a new array, or returning `None` if the index is out
 * of bounds
 *
 * @example
 * import { modifyAt } from 'fp-ts/Array'
 * import { some, none } from 'fp-ts/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 2.0.0
 */
var modifyAt$1 = function (i, f) { return function (as) {
    return isOutOfBound$3(i, as) ? none : some$5(unsafeUpdateAt$3(i, f(as[i]), as));
}; };
/**
 * Reverse an array, creating a new array
 *
 * @example
 * import { reverse } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @category combinators
 * @since 2.0.0
 */
var reverse$4 = function (as) { return (isEmpty$1(as) ? [] : as.slice().reverse()); };
/**
 * Extracts from an array of `Either` all the `Right` elements. All the `Right` elements are extracted in order
 *
 * @example
 * import { rights } from 'fp-ts/Array'
 * import { right, left } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(rights([right(1), left('foo'), right(2)]), [1, 2])
 *
 * @category combinators
 * @since 2.0.0
 */
var rights = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Right') {
            r.push(a.right);
        }
    }
    return r;
};
/**
 * Extracts from an array of `Either` all the `Left` elements. All the `Left` elements are extracted in order
 *
 * @example
 * import { lefts } from 'fp-ts/Array'
 * import { left, right } from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(lefts([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @category combinators
 * @since 2.0.0
 */
var lefts = function (as) {
    var r = [];
    for (var i = 0; i < as.length; i++) {
        var a = as[i];
        if (a._tag === 'Left') {
            r.push(a.left);
        }
    }
    return r;
};
/**
 * Sort the elements of an array in increasing order, creating a new array
 *
 * @example
 * import { sort } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(sort(N.Ord)([3, 2, 1]), [1, 2, 3])
 *
 * @category combinators
 * @since 2.0.0
 */
var sort$1 = function (O) { return function (as) {
    return as.length <= 1 ? copy$1(as) : as.slice().sort(O.compare);
}; };
/**
 * Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
 * input array is short, excess elements of the longer array are discarded.
 *
 * @example
 * import { zipWith } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n), ['a1', 'b2', 'c3'])
 *
 * @category combinators
 * @since 2.0.0
 */
var zipWith$1 = function (fa, fb, f) {
    var fc = [];
    var len = Math.min(fa.length, fb.length);
    for (var i = 0; i < len; i++) {
        fc[i] = f(fa[i], fb[i]);
    }
    return fc;
};
function zip$1(as, bs) {
    if (bs === undefined) {
        return function (bs) { return zip$1(bs, as); };
    }
    return zipWith$1(as, bs, function (a, b) { return [a, b]; });
}
/**
 * The function is reverse of `zip`. Takes an array of pairs and return two corresponding arrays
 *
 * @example
 * import { unzip } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 2.0.0
 */
var unzip$1 = function (as) {
    var fa = [];
    var fb = [];
    for (var i = 0; i < as.length; i++) {
        fa[i] = as[i][0];
        fb[i] = as[i][1];
    }
    return [fa, fb];
};
/**
 * Prepend an element to every member of an array
 *
 * @example
 * import { prependAll } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(prependAll(9)([1, 2, 3, 4]), [9, 1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.10.0
 */
var prependAll$1 = function (middle) {
    var f = prependAll(middle);
    return function (as) { return (isNonEmpty$3(as) ? f(as) : []); };
};
/**
 * Places an element in between members of an array
 *
 * @example
 * import { intersperse } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(intersperse(9)([1, 2, 3, 4]), [1, 9, 2, 9, 3, 9, 4])
 *
 * @category combinators
 * @since 2.9.0
 */
var intersperse$1 = function (middle) {
    var f = intersperse(middle);
    return function (as) { return (isNonEmpty$3(as) ? f(as) : copy$1(as)); };
};
/**
 * Rotate a `Array` by `n` steps.
 *
 * @example
 * import { rotate } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 *
 * @category combinators
 * @since 2.0.0
 */
var rotate$1 = function (n) {
    var f = rotate(n);
    return function (as) { return (isNonEmpty$3(as) ? f(as) : copy$1(as)); };
};
// TODO: remove non-curried overloading in v3
/**
 * Test if a value is a member of an array. Takes a `Eq<A>` as a single
 * argument which returns the function to use to search for a value of type `A` in
 * an array of type `Array<A>`.
 *
 * @example
 * import { elem } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(2)), true)
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(0)), false)
 *
 * @since 2.0.0
 */
var elem$1 = elem;
/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @example
 * import { uniq } from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @category combinators
 * @since 2.0.0
 */
var uniq$1 = function (E) {
    var f = uniq(E);
    return function (as) { return (isNonEmpty$3(as) ? f(as) : copy$1(as)); };
};
/**
 * Sort the elements of an array in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @example
 * import { sortBy } from 'fp-ts/Array'
 * import { contramap } from 'fp-ts/Ord'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 * const byName = pipe(S.Ord, contramap((p: Person) => p.name))
 * const byAge = pipe(N.Ord, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @category combinators
 * @since 2.0.0
 */
var sortBy$1 = function (ords) {
    var f = sortBy(ords);
    return function (as) { return (isNonEmpty$3(as) ? f(as) : copy$1(as)); };
};
/**
 * A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
 * array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
 * value and the rest of the array.
 *
 * @example
 * import { Eq } from 'fp-ts/Eq'
 * import * as A from 'fp-ts/Array'
 * import * as N from 'fp-ts/number'
 * import { pipe } from 'fp-ts/function'
 *
 * const group = <A>(S: Eq<A>): ((as: Array<A>) => Array<Array<A>>) => {
 *   return A.chop(as => {
 *     const { init, rest } = pipe(as, A.spanLeft((a: A) => S.equals(a, as[0])))
 *     return [init, rest]
 *   })
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @category combinators
 * @since 2.0.0
 */
var chop$1 = function (f) {
    var g = chop(f);
    return function (as) { return (isNonEmpty$3(as) ? g(as) : []); };
};
/**
 * Splits an `Array` into two pieces, the first piece has max `n` elements.
 *
 * @example
 * import { splitAt } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @category combinators
 * @since 2.0.0
 */
var splitAt$1 = function (n) { return function (as) {
    return n >= 1 && isNonEmpty$3(as) ? splitAt(n)(as) : isEmpty$1(as) ? [copy$1(as), []] : [[], copy$1(as)];
}; };
/**
 * Splits an array into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the array. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `xs`.
 *
 * @example
 * import { chunksOf } from 'fp-ts/Array'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @category combinators
 * @since 2.0.0
 */
var chunksOf$1 = function (n) {
    var f = chunksOf(n);
    return function (as) { return (isNonEmpty$3(as) ? f(as) : []); };
};
function comprehension(input, f, g) {
    if (g === void 0) { g = function () { return true; }; }
    var go = function (scope, input) {
        return isNonEmpty$3(input)
            ? pipe$1(head$1(input), chain$1(function (x) { return go(pipe$1(scope, append$1(x)), tail(input)); }))
            : g.apply(void 0, scope) ? [f.apply(void 0, scope)]
                : [];
    };
    return go([], input);
}
function union$1(E) {
    var unionE = union(E);
    return function (first, second) {
        if (second === undefined) {
            var unionE_1 = union$1(E);
            return function (ys) { return unionE_1(ys, first); };
        }
        return isNonEmpty$3(first) && isNonEmpty$3(second)
            ? unionE(first, second)
            : isNonEmpty$3(first)
                ? copy$1(first)
                : copy$1(second);
    };
}
function intersection(E) {
    var elemE = elem$1(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var intersectionE_1 = intersection(E);
            return function (ys) { return intersectionE_1(ys, xs); };
        }
        return xs.filter(function (a) { return elemE(a, ys); });
    };
}
function difference(E) {
    var elemE = elem$1(E);
    return function (xs, ys) {
        if (ys === undefined) {
            var differenceE_1 = difference(E);
            return function (ys) { return differenceE_1(ys, xs); };
        }
        return xs.filter(function (a) { return !elemE(a, ys); });
    };
}
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$1 = function (fa, f) { return pipe$1(fa, map$1(f)); };
/* istanbul ignore next */
var _mapWithIndex$1 = function (fa, f) { return pipe$1(fa, mapWithIndex$1(f)); };
var _ap$1 = function (fab, fa) { return pipe$1(fab, ap$1(fa)); };
var _chain$1 = function (ma, f) { return pipe$1(ma, chain$1(f)); };
/* istanbul ignore next */
var _filter = function (fa, predicate) { return pipe$1(fa, filter$1(predicate)); };
/* istanbul ignore next */
var _filterMap = function (fa, f) { return pipe$1(fa, filterMap(f)); };
/* istanbul ignore next */
var _partition = function (fa, predicate) {
    return pipe$1(fa, partition(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) { return pipe$1(fa, partitionMap(f)); };
/* istanbul ignore next */
var _partitionWithIndex = function (fa, predicateWithIndex) { return pipe$1(fa, partitionWithIndex(predicateWithIndex)); };
/* istanbul ignore next */
var _partitionMapWithIndex = function (fa, f) { return pipe$1(fa, partitionMapWithIndex(f)); };
/* istanbul ignore next */
var _alt$1 = function (fa, that) { return pipe$1(fa, alt$1(that)); };
var _reduce$1 = function (fa, b, f) { return pipe$1(fa, reduce$3(b, f)); };
/* istanbul ignore next */
var _foldMap$1 = function (M) {
    var foldMapM = foldMap$3(M);
    return function (fa, f) { return pipe$1(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight$1 = function (fa, b, f) { return pipe$1(fa, reduceRight$3(b, f)); };
/* istanbul ignore next */
var _reduceWithIndex$1 = function (fa, b, f) {
    return pipe$1(fa, reduceWithIndex$3(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex$1 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$3(M);
    return function (fa, f) { return pipe$1(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex$1 = function (fa, b, f) {
    return pipe$1(fa, reduceRightWithIndex$3(b, f));
};
/* istanbul ignore next */
var _filterMapWithIndex = function (fa, f) { return pipe$1(fa, filterMapWithIndex(f)); };
/* istanbul ignore next */
var _filterWithIndex = function (fa, predicateWithIndex) { return pipe$1(fa, filterWithIndex$1(predicateWithIndex)); };
/* istanbul ignore next */
var _extend$1 = function (fa, f) { return pipe$1(fa, extend$1(f)); };
/* istanbul ignore next */
var _traverse$1 = function (F) {
    var traverseF = traverse$1(F);
    return function (ta, f) { return pipe$1(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _traverseWithIndex$1 = function (F) {
    var traverseWithIndexF = traverseWithIndex$1(F);
    return function (ta, f) { return pipe$1(ta, traverseWithIndexF(f)); };
};
/* istanbul ignore next */
var _wither = function (F) {
    var witherF = wither(F);
    return function (fa, f) { return pipe$1(fa, witherF(f)); };
};
/* istanbul ignore next */
var _wilt = function (F) {
    var wiltF = wilt(F);
    return function (fa, f) { return pipe$1(fa, wiltF(f)); };
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Pointed
 * @since 2.0.0
 */
var of$1 = of;
/**
 * @category Alternative
 * @since 2.7.0
 */
var zero = function () { return []; };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map$1 = function (f) { return function (fa) { return fa.map(function (a) { return f(a); }); }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap$1 = function (fa) { return chain$1(function (f) { return pipe$1(fa, map$1(f)); }); };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain$1 = function (f) { return function (ma) {
    return pipe$1(ma, chainWithIndex$1(function (_, a) { return f(a); }));
}; };
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.5.0
 */
var flatten$1 = 
/*#__PURE__*/
chain$1(identity);
/**
 * @category FunctorWithIndex
 * @since 2.0.0
 */
var mapWithIndex$1 = function (f) { return function (fa) {
    return fa.map(function (a, i) { return f(i, a); });
}; };
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var filterMapWithIndex = function (f) { return function (fa) {
    var out = [];
    for (var i = 0; i < fa.length; i++) {
        var optionB = f(i, fa[i]);
        if (isSome(optionB)) {
            out.push(optionB.value);
        }
    }
    return out;
}; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var filterMap = function (f) {
    return filterMapWithIndex(function (_, a) { return f(a); });
};
/**
 * @category Compactable
 * @since 2.0.0
 */
var compact = 
/*#__PURE__*/
filterMap(identity);
/**
 * @category Compactable
 * @since 2.0.0
 */
var separate = function (fa) {
    var left = [];
    var right = [];
    for (var _i = 0, fa_1 = fa; _i < fa_1.length; _i++) {
        var e = fa_1[_i];
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
};
/**
 * @category Filterable
 * @since 2.0.0
 */
var filter$1 = function (predicate) { return function (fa) { return fa.filter(predicate); }; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var partition = function (predicate) {
    return partitionWithIndex(function (_, a) { return predicate(a); });
};
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var partitionWithIndex = function (predicateWithIndex) { return function (fa) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var a = fa[i];
        if (predicateWithIndex(i, a)) {
            right.push(a);
        }
        else {
            left.push(a);
        }
    }
    return separated(left, right);
}; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var partitionMap = function (f) { return partitionMapWithIndex(function (_, a) { return f(a); }); };
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var partitionMapWithIndex = function (f) { return function (fa) {
    var left = [];
    var right = [];
    for (var i = 0; i < fa.length; i++) {
        var e = f(i, fa[i]);
        if (e._tag === 'Left') {
            left.push(e.left);
        }
        else {
            right.push(e.right);
        }
    }
    return separated(left, right);
}; };
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW$1 = function (that) { return function (fa) { return fa.concat(that()); }; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
var alt$1 = altW$1;
/**
 * @category FilterableWithIndex
 * @since 2.0.0
 */
var filterWithIndex$1 = function (predicateWithIndex) { return function (fa) {
    return fa.filter(function (a, i) { return predicateWithIndex(i, a); });
}; };
/**
 * @category Extend
 * @since 2.0.0
 */
var extend$1 = function (f) { return function (wa) {
    return wa.map(function (_, i) { return f(wa.slice(i)); });
}; };
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
var duplicate$1 = 
/*#__PURE__*/
extend$1(identity);
/**
 * @category Foldable
 * @since 2.0.0
 */
var foldMap$3 = foldMap$2;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var foldMapWithIndex$3 = foldMapWithIndex$2;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduce$3 = reduce$2;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceWithIndex$3 = reduceWithIndex$2;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight$3 = reduceRight$2;
/**
 * @category FoldableWithIndex
 * @since 2.0.0
 */
var reduceRightWithIndex$3 = reduceRightWithIndex$2;
/**
 * @category Traversable
 * @since 2.6.3
 */
var traverse$1 = function (F) {
    var traverseWithIndexF = traverseWithIndex$1(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
};
/**
 * @category Traversable
 * @since 2.6.3
 */
var sequence$1 = function (F) { return function (ta) {
    return _reduce$1(ta, F.of(zero()), function (fas, fa) {
        return F.ap(F.map(fas, function (as) { return function (a) { return pipe$1(as, append$1(a)); }; }), fa);
    });
}; };
/**
 * @category TraversableWithIndex
 * @since 2.6.3
 */
var traverseWithIndex$1 = function (F) { return function (f) {
    return reduceWithIndex$3(F.of(zero()), function (i, fbs, a) {
        return F.ap(F.map(fbs, function (bs) { return function (b) { return pipe$1(bs, append$1(b)); }; }), f(i, a));
    });
}; };
/**
 * @category Witherable
 * @since 2.6.5
 */
var wither = function (F) {
    var traverseF = traverse$1(F);
    return function (f) { return function (fa) { return F.map(pipe$1(fa, traverseF(f)), compact); }; };
};
/**
 * @category Witherable
 * @since 2.6.5
 */
var wilt = function (F) {
    var traverseF = traverse$1(F);
    return function (f) { return function (fa) { return F.map(pipe$1(fa, traverseF(f)), separate); }; };
};
/**
 * @category Unfoldable
 * @since 2.6.6
 */
var unfold = function (b, f) {
    var out = [];
    var bb = b;
    while (true) {
        var mt = f(bb);
        if (isSome(mt)) {
            var _a = mt.value, a = _a[0], b_1 = _a[1];
            out.push(a);
            bb = b_1;
        }
        else {
            break;
        }
    }
    return out;
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$2 = 'Array';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow$3 = getShow$2;
/**
 * @category instances
 * @since 2.10.0
 */
var getSemigroup$2 = function () { return ({
    concat: function (first, second) { return first.concat(second); }
}); };
/**
 * Returns a `Monoid` for `Array<A>`
 *
 * @example
 * import { getMonoid } from 'fp-ts/Array'
 *
 * const M = getMonoid<number>()
 * assert.deepStrictEqual(M.concat([1, 2], [3, 4]), [1, 2, 3, 4])
 *
 * @category instances
 * @since 2.0.0
 */
var getMonoid$1 = function () { return ({
    concat: getSemigroup$2().concat,
    empty: []
}); };
/**
 * Derives an `Eq` over the `Array` of a given element type from the `Eq` of that type. The derived `Eq` defines two
 * arrays as equal if all elements of both arrays are compared equal pairwise with the given `E`. In case of arrays of
 * different lengths, the result is non equality.
 *
 * @example
 * import * as S from 'fp-ts/string'
 * import { getEq } from 'fp-ts/Array'
 *
 * const E = getEq(S.Eq)
 * assert.strictEqual(E.equals(['a', 'b'], ['a', 'b']), true)
 * assert.strictEqual(E.equals(['a'], []), false)
 *
 * @category instances
 * @since 2.0.0
 */
var getEq$3 = getEq$2;
/**
 * Derives an `Ord` over the `Array` of a given element type from the `Ord` of that type. The ordering between two such
 * arrays is equal to: the first non equal comparison of each arrays elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest array is considered the greatest, if both arrays have
 * the same length, the result is equality.
 *
 * @example
 * import { getOrd } from 'fp-ts/Array'
 * import * as S from 'fp-ts/string'
 *
 * const O = getOrd(S.Ord)
 * assert.strictEqual(O.compare(['b'], ['a']), 1)
 * assert.strictEqual(O.compare(['a'], ['a']), 0)
 * assert.strictEqual(O.compare(['a'], ['b']), -1)
 *
 * @category instances
 * @since 2.0.0
 */
var getOrd$1 = getOrd;
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$1 = {
    URI: URI$2,
    map: _map$1
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$1 = 
/*#_PURE_*/
flap$5(Functor$1);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$1 = {
    URI: URI$2,
    of: of$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex$1 = {
    URI: URI$2,
    map: _map$1,
    mapWithIndex: _mapWithIndex$1
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$1 = {
    URI: URI$2,
    map: _map$1,
    ap: _ap$1
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apFirst$1 = 
/*#__PURE__*/
apFirst$3(Apply$1);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.5.0
 */
var apSecond$1 = 
/*#__PURE__*/
apSecond$3(Apply$1);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$1 = {
    URI: URI$2,
    map: _map$1,
    ap: _ap$1,
    of: of$1
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$1 = {
    URI: URI$2,
    map: _map$1,
    ap: _ap$1,
    chain: _chain$1
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var chainFirst$1 = 
/*#__PURE__*/
chainFirst$3(Chain$1);
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$1 = {
    URI: URI$2,
    map: _map$1,
    ap: _ap$1,
    of: of$1,
    chain: _chain$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Unfoldable = {
    URI: URI$2,
    unfold: unfold
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$1 = {
    URI: URI$2,
    map: _map$1,
    alt: _alt$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alternative = {
    URI: URI$2,
    map: _map$1,
    ap: _ap$1,
    of: of$1,
    alt: _alt$1,
    zero: zero
};
/**
 * @category instances
 * @since 2.7.0
 */
var Extend = {
    URI: URI$2,
    map: _map$1,
    extend: _extend$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Compactable = {
    URI: URI$2,
    compact: compact,
    separate: separate
};
/**
 * @category instances
 * @since 2.7.0
 */
var Filterable = {
    URI: URI$2,
    map: _map$1,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category instances
 * @since 2.7.0
 */
var FilterableWithIndex = {
    URI: URI$2,
    map: _map$1,
    mapWithIndex: _mapWithIndex$1,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$1 = {
    URI: URI$2,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex$1 = {
    URI: URI$2,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    reduceWithIndex: _reduceWithIndex$1,
    foldMapWithIndex: _foldMapWithIndex$1,
    reduceRightWithIndex: _reduceRightWithIndex$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$1 = {
    URI: URI$2,
    map: _map$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    traverse: _traverse$1,
    sequence: sequence$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var TraversableWithIndex$1 = {
    URI: URI$2,
    map: _map$1,
    mapWithIndex: _mapWithIndex$1,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    reduceWithIndex: _reduceWithIndex$1,
    foldMapWithIndex: _foldMapWithIndex$1,
    reduceRightWithIndex: _reduceRightWithIndex$1,
    traverse: _traverse$1,
    sequence: sequence$1,
    traverseWithIndex: _traverseWithIndex$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Witherable = {
    URI: URI$2,
    map: _map$1,
    compact: compact,
    separate: separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    traverse: _traverse$1,
    sequence: sequence$1,
    wither: _wither,
    wilt: _wilt
};
// -------------------------------------------------------------------------------------
// unsafe
// -------------------------------------------------------------------------------------
/**
 * @category unsafe
 * @since 2.0.0
 */
var unsafeInsertAt$1 = unsafeInsertAt;
/**
 * @category unsafe
 * @since 2.0.0
 */
var unsafeUpdateAt$3 = function (i, a, as) {
    return isNonEmpty$3(as) ? unsafeUpdateAt$1(i, a, as) : [];
};
/**
 * @category unsafe
 * @since 2.0.0
 */
var unsafeDeleteAt = function (i, as) {
    var xs = as.slice();
    xs.splice(i, 1);
    return xs;
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var every$1 = every;
/**
 * @since 2.9.0
 */
var some = function (predicate) { return function (as) { return as.some(predicate); }; };
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$1 = 
/*#__PURE__*/
of$1({});
/**
 * @since 2.8.0
 */
var bindTo$1 = 
/*#__PURE__*/
bindTo$3(Functor$1);
/**
 * @since 2.8.0
 */
var bind$1 = 
/*#__PURE__*/
bind$3(Chain$1);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$1 = 
/*#__PURE__*/
apS$3(Apply$1);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use a new `[]` instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var empty = [];
/**
 * Use `prepend` instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var cons$1 = cons;
/**
 * Use `append` instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var snoc$1 = snoc;
/**
 * Use `prependAll` instead
 *
 * @category combinators
 * @since 2.9.0
 * @deprecated
 */
var prependToAll$1 = prependAll$1;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var array = {
    URI: URI$2,
    compact: compact,
    separate: separate,
    map: _map$1,
    ap: _ap$1,
    of: of$1,
    chain: _chain$1,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap,
    mapWithIndex: _mapWithIndex$1,
    partitionMapWithIndex: _partitionMapWithIndex,
    partitionWithIndex: _partitionWithIndex,
    filterMapWithIndex: _filterMapWithIndex,
    filterWithIndex: _filterWithIndex,
    alt: _alt$1,
    zero: zero,
    unfold: unfold,
    reduce: _reduce$1,
    foldMap: _foldMap$1,
    reduceRight: _reduceRight$1,
    traverse: _traverse$1,
    sequence: sequence$1,
    reduceWithIndex: _reduceWithIndex$1,
    foldMapWithIndex: _foldMapWithIndex$1,
    reduceRightWithIndex: _reduceRightWithIndex$1,
    traverseWithIndex: _traverseWithIndex$1,
    extend: _extend$1,
    wither: _wither,
    wilt: _wilt
};

var _Array = /*#__PURE__*/Object.freeze({
    __proto__: null,
    prepend: prepend$1,
    append: append$1,
    makeBy: makeBy$1,
    range: range,
    replicate: replicate,
    matchLeft: matchLeft,
    foldLeft: foldLeft,
    matchRight: matchRight,
    foldRight: foldRight,
    chainWithIndex: chainWithIndex$1,
    scanLeft: scanLeft,
    scanRight: scanRight,
    isEmpty: isEmpty$1,
    isNonEmpty: isNonEmpty$3,
    size: size,
    isOutOfBound: isOutOfBound$3,
    lookup: lookup$1,
    head: head$3,
    last: last$4,
    tail: tail$1,
    init: init$1,
    takeLeft: takeLeft,
    takeRight: takeRight,
    takeLeftWhile: takeLeftWhile,
    spanLeft: spanLeft,
    dropLeft: dropLeft,
    dropRight: dropRight,
    dropLeftWhile: dropLeftWhile,
    findIndex: findIndex$1,
    findFirst: findFirst$1,
    findFirstMap: findFirstMap$1,
    findLast: findLast$1,
    findLastMap: findLastMap$1,
    findLastIndex: findLastIndex$1,
    copy: copy$1,
    insertAt: insertAt$1,
    updateAt: updateAt$1,
    deleteAt: deleteAt,
    modifyAt: modifyAt$1,
    reverse: reverse$4,
    rights: rights,
    lefts: lefts,
    sort: sort$1,
    zipWith: zipWith$1,
    zip: zip$1,
    unzip: unzip$1,
    prependAll: prependAll$1,
    intersperse: intersperse$1,
    rotate: rotate$1,
    elem: elem$1,
    uniq: uniq$1,
    sortBy: sortBy$1,
    chop: chop$1,
    splitAt: splitAt$1,
    chunksOf: chunksOf$1,
    comprehension: comprehension,
    union: union$1,
    intersection: intersection,
    difference: difference,
    of: of$1,
    zero: zero,
    map: map$1,
    ap: ap$1,
    chain: chain$1,
    flatten: flatten$1,
    mapWithIndex: mapWithIndex$1,
    filterMapWithIndex: filterMapWithIndex,
    filterMap: filterMap,
    compact: compact,
    separate: separate,
    filter: filter$1,
    partition: partition,
    partitionWithIndex: partitionWithIndex,
    partitionMap: partitionMap,
    partitionMapWithIndex: partitionMapWithIndex,
    altW: altW$1,
    alt: alt$1,
    filterWithIndex: filterWithIndex$1,
    extend: extend$1,
    duplicate: duplicate$1,
    foldMap: foldMap$3,
    foldMapWithIndex: foldMapWithIndex$3,
    reduce: reduce$3,
    reduceWithIndex: reduceWithIndex$3,
    reduceRight: reduceRight$3,
    reduceRightWithIndex: reduceRightWithIndex$3,
    traverse: traverse$1,
    sequence: sequence$1,
    traverseWithIndex: traverseWithIndex$1,
    wither: wither,
    wilt: wilt,
    unfold: unfold,
    URI: URI$2,
    getShow: getShow$3,
    getSemigroup: getSemigroup$2,
    getMonoid: getMonoid$1,
    getEq: getEq$3,
    getOrd: getOrd$1,
    Functor: Functor$1,
    flap: flap$1,
    Pointed: Pointed$1,
    FunctorWithIndex: FunctorWithIndex$1,
    Apply: Apply$1,
    apFirst: apFirst$1,
    apSecond: apSecond$1,
    Applicative: Applicative$1,
    Chain: Chain$1,
    chainFirst: chainFirst$1,
    Monad: Monad$1,
    Unfoldable: Unfoldable,
    Alt: Alt$1,
    Alternative: Alternative,
    Extend: Extend,
    Compactable: Compactable,
    Filterable: Filterable,
    FilterableWithIndex: FilterableWithIndex,
    Foldable: Foldable$1,
    FoldableWithIndex: FoldableWithIndex$1,
    Traversable: Traversable$1,
    TraversableWithIndex: TraversableWithIndex$1,
    Witherable: Witherable,
    unsafeInsertAt: unsafeInsertAt$1,
    unsafeUpdateAt: unsafeUpdateAt$3,
    unsafeDeleteAt: unsafeDeleteAt,
    every: every$1,
    some: some,
    Do: Do$1,
    bindTo: bindTo$1,
    bind: bind$1,
    apS: apS$1,
    empty: empty,
    cons: cons$1,
    snoc: snoc$1,
    prependToAll: prependToAll$1,
    array: array
});

/**
 * @category constructors
 * @since 2.0.0
 */
var make = unsafeCoerce;
/**
 * @category instances
 * @since 2.0.0
 */
function getApply(S) {
    return {
        URI: URI$3,
        _E: undefined,
        map: _map$2,
        ap: function (fab, fa) { return make(S.concat(fab, fa)); }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getApplicative(M) {
    var A = getApply(M);
    return {
        URI: URI$3,
        _E: undefined,
        map: A.map,
        ap: A.ap,
        of: function () { return make(M.empty); }
    };
}
/* istanbul ignore next */
var _map$2 = function (fa, f) { return pipe$1(fa, map$2()); };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map$2 = function () { return unsafeCoerce; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$3 = 'Const';

/**
 * Use [`pipe`](https://gcanti.github.io/fp-ts/modules/function.ts.html#flow) from `function` module instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var pipe = pipe$1;

/**
 * @since 2.0.0
 */
var tailRec = function (startWith, f) {
    var ab = f(startWith);
    while (ab._tag === 'Left') {
        ab = f(ab.left);
    }
    return ab.right;
};

// -------------------------------------------------------------------------------------
// guards
// -------------------------------------------------------------------------------------
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category guards
 * @since 2.0.0
 */
var isLeft = isLeft$1;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category guards
 * @since 2.0.0
 */
var isRight = function (ma) { return ma._tag === 'Right'; };
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var left = function (e) { return ({ _tag: 'Left', left: e }); };
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 2.0.0
 */
var right = function (a) { return ({ _tag: 'Right', right: a }); };
/**
 * @example
 * import { fromOption, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import { none, some } from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     some(1),
 *     fromOption(() => 'error')
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     none,
 *     fromOption(() => 'error')
 *   ),
 *   left('error')
 * )
 *
 * @category constructors
 * @since 2.0.0
 */
var fromOption = function (onNone) { return function (ma) {
    return ma._tag === 'None' ? left(onNone()) : right(ma.value);
}; };
/**
 * @example
 * import { fromPredicate, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     fromPredicate(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('error')
 * )
 *
 * @category constructors
 * @since 2.0.0
 */
var fromPredicate = function (predicate, onFalse) { return function (a) { return (predicate(a) ? right(a) : left(onFalse(a))); }; };
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW = function (onLeft, onRight) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
}; };
/**
 * Alias of [`matchW`](#matchww).
 *
 * @category destructors
 * @since 2.10.0
 */
var foldW = matchW;
/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import { match, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * function onLeft(errors: Array<string>): string {
 *   return `Errors: ${errors.join(', ')}`
 * }
 *
 * function onRight(value: number): string {
 *   return `Ok: ${value}`
 * }
 *
 * assert.strictEqual(
 *   pipe(
 *     right(1),
 *     match(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     left(['error 1', 'error 2']),
 *     match(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
var match = matchW;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.0.0
 */
var fold$3 = match;
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
var getOrElseW = function (onLeft) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : ma.right;
}; };
/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import { getOrElse, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     right(1),
 *     getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     left('error'),
 *     getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category destructors
 * @since 2.0.0
 */
var getOrElse = getOrElseW;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
// TODO: make lazy in v3
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import { fromNullable, left, right } from 'fp-ts/Either'
 *
 * const parse = fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), right(1))
 * assert.deepStrictEqual(parse(null), left('nully'))
 *
 * @category interop
 * @since 2.0.0
 */
var fromNullable = function (e) { return function (a) {
    return a == null ? left(e) : right(a);
}; };
/**
 * Constructs a new `Either` from a function that might throw.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<Error, A> =>
 *   E.tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onThrow) {
    try {
        return right(f());
    }
    catch (e) {
        return left(onThrow(e));
    }
};
/**
 * Converts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f, onThrow) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return tryCatch(function () { return f.apply(void 0, a); }, onThrow);
}; };
/**
 * @category interop
 * @since 2.9.0
 */
var fromNullableK = function (e) {
    var from = fromNullable(e);
    return function (f) { return flow(f, from); };
};
/**
 * @category interop
 * @since 2.9.0
 */
var chainNullableK = function (e) {
    var from = fromNullableK(e);
    return function (f) { return chain$2(from(f)); };
};
/**
 * @category interop
 * @since 2.10.0
 */
var toUnion = 
/*#__PURE__*/
foldW(identity, identity);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.10.0
 */
var fromOptionK = function (onNone) {
    var from = fromOption(onNone);
    return function (f) { return flow(f, from); };
};
/**
 * @category combinators
 * @since 2.10.0
 */
var chainOptionK = function (onNone) {
    var from = fromOptionK(onNone);
    return function (f) { return chain$2(from(f)); };
};
/**
 * Returns a `Right` if is a `Left` (and vice versa).
 *
 * @category combinators
 * @since 2.0.0
 */
function swap(ma) {
    return isLeft(ma) ? right(ma.left) : left(ma.right);
}
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
var orElseW = function (onLeft) { return function (ma) {
    return isLeft(ma) ? onLeft(ma.left) : ma;
}; };
/**
 * Useful for recovering from errors.
 *
 * @category combinators
 * @since 2.0.0
 */
var orElse = orElseW;
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
var filterOrElseW = function (predicate, onFalse) {
    return chainW(function (a) { return (predicate(a) ? right(a) : left(onFalse(a))); });
};
/**
 * @example
 * import { filterOrElse as filterOrElse, left, right } from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     right(1),
 *     filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     right(-1),
 *     filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     left('a'),
 *     filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   left('a')
 * )
 *
 * @category combinators
 * @since 2.0.0
 */
var filterOrElse = filterOrElseW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$3 = function (fa, f) { return pipe$1(fa, map$3(f)); };
var _ap$2 = function (fab, fa) { return pipe$1(fab, ap$2(fa)); };
/* istanbul ignore next */
var _chain$2 = function (ma, f) { return pipe$1(ma, chain$2(f)); };
/* istanbul ignore next */
var _reduce$2 = function (fa, b, f) { return pipe$1(fa, reduce$4(b, f)); };
/* istanbul ignore next */
var _foldMap$2 = function (M) { return function (fa, f) {
    var foldMapM = foldMap$4(M);
    return pipe$1(fa, foldMapM(f));
}; };
/* istanbul ignore next */
var _reduceRight$2 = function (fa, b, f) { return pipe$1(fa, reduceRight$4(b, f)); };
var _traverse$2 = function (F) {
    var traverseF = traverse$2(F);
    return function (ta, f) { return pipe$1(ta, traverseF(f)); };
};
var _bimap = function (fa, f, g) { return pipe$1(fa, bimap(f, g)); };
var _mapLeft = function (fa, f) { return pipe$1(fa, mapLeft(f)); };
/* istanbul ignore next */
var _alt$2 = function (fa, that) { return pipe$1(fa, alt$2(that)); };
/* istanbul ignore next */
var _extend$2 = function (wa, f) { return pipe$1(wa, extend$2(f)); };
var _chainRec = function (a, f) {
    return tailRec(f(a), function (e) {
        return isLeft(e) ? right(left(e.left)) : isLeft(e.right) ? left(f(e.right.left)) : right(right(e.right.right));
    });
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map$3 = function (f) { return function (fa) {
    return isLeft(fa) ? fa : right(f(fa.right));
}; };
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
var bimap = function (f, g) { return function (fa) { return (isLeft(fa) ? left(f(fa.left)) : right(g(fa.right))); }; };
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
var mapLeft = function (f) { return function (fa) {
    return isLeft(fa) ? left(f(fa.left)) : fa;
}; };
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
var apW = function (fa) { return function (fab) { return (isLeft(fab) ? fab : isLeft(fa) ? fa : right(fab.right(fa.right))); }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap$2 = apW;
/**
 * @category Pointed
 * @since 2.7.0
 */
var of$2 = right;
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
var chainW = function (f) { return function (ma) {
    return isLeft(ma) ? ma : f(ma.right);
}; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain$2 = chainW;
/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * Derivable from `Chain`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category combinators
 * @since 2.0.0
 */
var flatten$2 = 
/*#__PURE__*/
chain$2(identity);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
var altW$2 = function (that) { return function (fa) { return (isLeft(fa) ? that() : fa); }; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
var alt$2 = altW$2;
/**
 * @category Extend
 * @since 2.0.0
 */
var extend$2 = function (f) { return function (wa) {
    return isLeft(wa) ? wa : right(f(wa));
}; };
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.0.0
 */
var duplicate$2 = 
/*#__PURE__*/
extend$2(identity);
/**
 * Left-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'prefix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduce(startWith, concat)),
 *   'prefix:a'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduce(startWith, concat)),
 *   'prefix'
 * )
 *
 * @category Foldable
 * @since 2.0.0
 */
var reduce$4 = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(b, fa.right);
}; };
/**
 * Map each element of the structure to a monoid, and combine the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as S from 'fp-ts/string'
 *
 * const yell = (a: string) => `${a}!`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.foldMap(S.Monoid)(yell)),
 *   'a!'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.foldMap(S.Monoid)(yell)),
 *   S.Monoid.empty
 * )
 *
 * @category Foldable
 * @since 2.0.0
 */
var foldMap$4 = function (M) { return function (f) { return function (fa) {
    return isLeft(fa) ? M.empty : f(fa.right);
}; }; };
/**
 * Right-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'postfix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduceRight(startWith, concat)),
 *   'a:postfix'
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduceRight(startWith, concat)),
 *   'postfix'
 * )
 *
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight$4 = function (b, f) { return function (fa) {
    return isLeft(fa) ? b : f(fa.right, b);
}; };
/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as RA from 'fp-ts/ReadonlyArray'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Applicative)(RA.head)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Applicative)(RA.head)),
 *   O.none
 * )
 *
 * @category Traversable
 * @since 2.6.3
 */
var traverse$2 = function (F) { return function (f) { return function (ta) { return (isLeft(ta) ? F.of(left(ta.left)) : F.map(f(ta.right), right)); }; }; };
/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.some('a')), E.sequence(O.Applicative)),
 *   O.some(E.right('a'))
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.none), E.sequence(O.Applicative)),
 *   O.none
 * )
 *
 * @category Traversable
 * @since 2.6.3
 */
var sequence$2 = function (F) { return function (ma) {
    return isLeft(ma) ? F.of(left(ma.left)) : F.map(ma.right, right);
}; };
/**
 * @category MonadThrow
 * @since 2.6.3
 */
var throwError = left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$4 = 'Either';
/**
 * @category instances
 * @since 2.0.0
 */
function getShow$4(SE, SA) {
    return {
        show: function (ma) { return (isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")"); }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getEq$4(EL, EA) {
    return {
        equals: function (x, y) {
            return x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right));
        }
    };
}
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/Either'
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * const S = getSemigroup<string, number>(SemigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 * @category instances
 * @since 2.0.0
 */
function getSemigroup$3(S) {
    return {
        concat: function (x, y) { return (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right))); }
    };
}
/**
 * Builds a `Compactable` instance for `Either` given `Monoid` for the left side.
 *
 * @category instances
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var empty = left(M.empty);
    return {
        URI: URI$4,
        _E: undefined,
        compact: function (ma) { return (isLeft(ma) ? ma : ma.right._tag === 'None' ? empty : right(ma.right.value)); },
        separate: function (ma) {
            return isLeft(ma)
                ? separated(ma, ma)
                : isLeft(ma.right)
                    ? separated(right(ma.right.left), empty)
                    : separated(empty, right(ma.right.right));
        }
    };
};
/**
 * Builds a `Filterable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 2.10.0
 */
function getFilterable(M) {
    var empty = left(M.empty);
    var _a = getCompactable(M), compact = _a.compact, separate = _a.separate;
    var filter = function (ma, predicate) {
        return isLeft(ma) ? ma : predicate(ma.right) ? ma : empty;
    };
    var partition = function (ma, p) {
        return isLeft(ma)
            ? separated(ma, ma)
            : p(ma.right)
                ? separated(empty, right(ma.right))
                : separated(right(ma.right), empty);
    };
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$3,
        compact: compact,
        separate: separate,
        filter: filter,
        filterMap: function (ma, f) {
            if (isLeft(ma)) {
                return ma;
            }
            var ob = f(ma.right);
            return ob._tag === 'None' ? empty : right(ob.value);
        },
        partition: partition,
        partitionMap: function (ma, f) {
            if (isLeft(ma)) {
                return separated(ma, ma);
            }
            var e = f(ma.right);
            return isLeft(e) ? separated(right(e.left), empty) : separated(empty, right(e.right));
        }
    };
}
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 2.0.0
 */
function getWitherable(M) {
    var F_ = getFilterable(M);
    var wither = function (F) {
        var traverseF = _traverse$2(F);
        return function (ma, f) { return F.map(traverseF(ma, f), F_.compact); };
    };
    var wilt = function (F) {
        var traverseF = _traverse$2(F);
        return function (ma, f) { return F.map(traverseF(ma, f), F_.separate); };
    };
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$3,
        compact: F_.compact,
        separate: F_.separate,
        filter: F_.filter,
        filterMap: F_.filterMap,
        partition: F_.partition,
        partitionMap: F_.partitionMap,
        traverse: _traverse$2,
        sequence: sequence$2,
        reduce: _reduce$2,
        foldMap: _foldMap$2,
        reduceRight: _reduceRight$2,
        wither: wither,
        wilt: wilt
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicativeValidation(SE) {
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$3,
        ap: function (fab, fa) {
            return isLeft(fab)
                ? isLeft(fa)
                    ? left(SE.concat(fab.left, fa.left))
                    : fab
                : isLeft(fa)
                    ? fa
                    : right(fab.right(fa.right));
        },
        of: of$2
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
function getAltValidation(SE) {
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$3,
        alt: function (me, that) {
            if (isRight(me)) {
                return me;
            }
            var ea = that();
            return isLeft(ea) ? left(SE.concat(me.left, ea.left)) : ea;
        }
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$2 = {
    URI: URI$4,
    map: _map$3
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$2 = 
/*#_PURE_*/
flap$5(Functor$2);
/**
 * @category instances
 * @since 2.10.0
 */
var Pointed$2 = {
    URI: URI$4,
    of: of$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var Apply$2 = {
    URI: URI$4,
    map: _map$3,
    ap: _ap$2
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apFirst$2 = 
/*#__PURE__*/
apFirst$3(Apply$2);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
var apSecond$2 = 
/*#__PURE__*/
apSecond$3(Apply$2);
/**
 * @category instances
 * @since 2.7.0
 */
var Applicative$2 = {
    URI: URI$4,
    map: _map$3,
    ap: _ap$2,
    of: of$2
};
/**
 * @category instances
 * @since 2.10.0
 */
var Chain$2 = {
    URI: URI$4,
    map: _map$3,
    ap: _ap$2,
    chain: _chain$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Monad$2 = {
    URI: URI$4,
    map: _map$3,
    ap: _ap$2,
    of: of$2,
    chain: _chain$2
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
var chainFirst$2 = 
/*#__PURE__*/
chainFirst$3(Chain$2);
/**
 * Less strict version of [`chainFirst`](#chainfirst)
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
var chainFirstW = chainFirst$2;
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$2 = {
    URI: URI$4,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$2 = {
    URI: URI$4,
    map: _map$3,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2,
    traverse: _traverse$2,
    sequence: sequence$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Bifunctor = {
    URI: URI$4,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
var Alt$2 = {
    URI: URI$4,
    map: _map$3,
    alt: _alt$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Extend$1 = {
    URI: URI$4,
    map: _map$3,
    extend: _extend$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var ChainRec = {
    URI: URI$4,
    map: _map$3,
    ap: _ap$2,
    chain: _chain$2,
    chainRec: _chainRec
};
/**
 * @category instances
 * @since 2.7.0
 */
var MonadThrow = {
    URI: URI$4,
    map: _map$3,
    ap: _ap$2,
    of: of$2,
    chain: _chain$2,
    throwError: throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
var FromEither = {
    URI: URI$4,
    fromEither: identity
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
function toError(e) {
    return e instanceof Error ? e : new Error(String(e));
}
/**
 * @since 2.0.0
 */
function elem$2(E) {
    return function (a, ma) { return (isLeft(ma) ? false : E.equals(a, ma.right)); };
}
/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import { exists, left, right } from 'fp-ts/Either'
 *
 * const gt2 = exists((n: number) => n > 2)
 *
 * assert.strictEqual(gt2(left('a')), false)
 * assert.strictEqual(gt2(right(1)), false)
 * assert.strictEqual(gt2(right(3)), true)
 *
 * @since 2.0.0
 */
function exists(predicate) {
    return function (ma) { return (isLeft(ma) ? false : predicate(ma.right)); };
}
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
var Do$2 = 
/*#__PURE__*/
of$2({});
/**
 * @since 2.8.0
 */
var bindTo$2 = 
/*#__PURE__*/
bindTo$3(Functor$2);
/**
 * @since 2.8.0
 */
var bind$2 = 
/*#__PURE__*/
bind$3(Chain$2);
/**
 * @since 2.8.0
 */
var bindW = bind$2;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
var apS$2 = 
/*#__PURE__*/
apS$3(Apply$2);
/**
 * @since 2.8.0
 */
var apSW = apS$2;
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.9.0
 */
var traverseArrayWithIndex = function (f) { return function (as) {
    var out = [];
    for (var i = 0; i < as.length; i++) {
        var e = f(i, as[i]);
        if (isLeft(e)) {
            return e;
        }
        out.push(e.right);
    }
    return right(out);
}; };
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @since 2.9.0
 */
var traverseArray = function (f) { return traverseArrayWithIndex(function (_, a) { return f(a); }); };
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @since 2.9.0
 */
var sequenceArray = 
/*#__PURE__*/
traverseArray(identity);
/**
 * Use [`parse`](./Json.ts.html#parse) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
function parseJSON(s, onError) {
    return tryCatch(function () { return JSON.parse(s); }, onError);
}
/**
 * Use [`stringify`](./Json.ts.html#stringify) instead.
 *
 * @category constructors
 * @since 2.0.0
 * @deprecated
 */
var stringifyJSON = function (u, onError) {
    return tryCatch(function () {
        var s = JSON.stringify(u);
        if (typeof s !== 'string') {
            throw new Error('Converting unsupported structure to JSON');
        }
        return s;
    }, onError);
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var either = {
    URI: URI$4,
    map: _map$3,
    of: of$2,
    ap: _ap$2,
    chain: _chain$2,
    reduce: _reduce$2,
    foldMap: _foldMap$2,
    reduceRight: _reduceRight$2,
    traverse: _traverse$2,
    sequence: sequence$2,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt$2,
    extend: _extend$2,
    chainRec: _chainRec,
    throwError: throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getApplySemigroup) instead.
 *
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplySemigroup = 
/*#__PURE__*/
getApplySemigroup$1(Apply$2);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getApplicativeMonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getApplyMonoid = 
/*#__PURE__*/
getApplicativeMonoid(Applicative$2);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getApplySemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getValidationSemigroup = function (SE, SA) {
    return getApplySemigroup$1(getApplicativeValidation(SE))(SA);
};
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getApplicativeMonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getValidationMonoid = function (SE, MA) {
    return getApplicativeMonoid(getApplicativeValidation(SE))(MA);
};
/**
 * Use [`getApplicativeValidation`](#getapplicativevalidation) and [`getAltValidation`](#getaltvalidation) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getValidation(SE) {
    var ap = getApplicativeValidation(SE).ap;
    var alt = getAltValidation(SE).alt;
    return {
        URI: URI$4,
        _E: undefined,
        map: _map$3,
        of: of$2,
        chain: _chain$2,
        bimap: _bimap,
        mapLeft: _mapLeft,
        reduce: _reduce$2,
        foldMap: _foldMap$2,
        reduceRight: _reduceRight$2,
        extend: _extend$2,
        traverse: _traverse$2,
        sequence: sequence$2,
        chainRec: _chainRec,
        throwError: throwError,
        ap: ap,
        alt: alt
    };
}

var Either = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isLeft: isLeft,
    isRight: isRight,
    left: left,
    right: right,
    fromOption: fromOption,
    fromPredicate: fromPredicate,
    matchW: matchW,
    foldW: foldW,
    match: match,
    fold: fold$3,
    getOrElseW: getOrElseW,
    getOrElse: getOrElse,
    fromNullable: fromNullable,
    tryCatch: tryCatch,
    tryCatchK: tryCatchK,
    fromNullableK: fromNullableK,
    chainNullableK: chainNullableK,
    toUnion: toUnion,
    fromOptionK: fromOptionK,
    chainOptionK: chainOptionK,
    swap: swap,
    orElseW: orElseW,
    orElse: orElse,
    filterOrElseW: filterOrElseW,
    filterOrElse: filterOrElse,
    map: map$3,
    bimap: bimap,
    mapLeft: mapLeft,
    apW: apW,
    ap: ap$2,
    of: of$2,
    chainW: chainW,
    chain: chain$2,
    flatten: flatten$2,
    altW: altW$2,
    alt: alt$2,
    extend: extend$2,
    duplicate: duplicate$2,
    reduce: reduce$4,
    foldMap: foldMap$4,
    reduceRight: reduceRight$4,
    traverse: traverse$2,
    sequence: sequence$2,
    throwError: throwError,
    URI: URI$4,
    getShow: getShow$4,
    getEq: getEq$4,
    getSemigroup: getSemigroup$3,
    getCompactable: getCompactable,
    getFilterable: getFilterable,
    getWitherable: getWitherable,
    getApplicativeValidation: getApplicativeValidation,
    getAltValidation: getAltValidation,
    Functor: Functor$2,
    flap: flap$2,
    Pointed: Pointed$2,
    Apply: Apply$2,
    apFirst: apFirst$2,
    apSecond: apSecond$2,
    Applicative: Applicative$2,
    Chain: Chain$2,
    Monad: Monad$2,
    chainFirst: chainFirst$2,
    chainFirstW: chainFirstW,
    Foldable: Foldable$2,
    Traversable: Traversable$2,
    Bifunctor: Bifunctor,
    Alt: Alt$2,
    Extend: Extend$1,
    ChainRec: ChainRec,
    MonadThrow: MonadThrow,
    FromEither: FromEither,
    toError: toError,
    elem: elem$2,
    exists: exists,
    Do: Do$2,
    bindTo: bindTo$2,
    bind: bind$2,
    bindW: bindW,
    apS: apS$2,
    apSW: apSW,
    traverseArrayWithIndex: traverseArrayWithIndex,
    traverseArray: traverseArray,
    sequenceArray: sequenceArray,
    parseJSON: parseJSON,
    stringifyJSON: stringifyJSON,
    either: either,
    getApplySemigroup: getApplySemigroup,
    getApplyMonoid: getApplyMonoid,
    getValidationSemigroup: getValidationSemigroup,
    getValidationMonoid: getValidationMonoid,
    getValidation: getValidation
});

/**
 * @category instances
 * @since 2.5.0
 */
function getShow$5(SK, SA) {
    return {
        show: function (m) {
            var entries = [];
            m.forEach(function (a, k) {
                entries.push("[" + SK.show(k) + ", " + SA.show(a) + "]");
            });
            return "new Map([" + entries.sort().join(', ') + "])";
        }
    };
}
/**
 * Calculate the number of key/value pairs in a map
 *
 * @since 2.5.0
 */
function size$1(d) {
    return d.size;
}
/**
 * Test whether or not a map is empty
 *
 * @since 2.5.0
 */
function isEmpty$2(d) {
    return d.size === 0;
}
function member(E) {
    var lookupE = lookup$2(E);
    return function (k, m) {
        if (m === undefined) {
            var memberE_1 = member(E);
            return function (m) { return memberE_1(k, m); };
        }
        return isSome(lookupE(k, m));
    };
}
function elem$3(E) {
    return function (a, m) {
        if (m === undefined) {
            var elemE_1 = elem$3(E);
            return function (m) { return elemE_1(a, m); };
        }
        var values = m.values();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = values.next()).done) {
            var v = e.value;
            if (E.equals(a, v)) {
                return true;
            }
        }
        return false;
    };
}
function lookupWithKey(E) {
    return function (k, m) {
        if (m === undefined) {
            var lookupWithKeyE_1 = lookupWithKey(E);
            return function (m) { return lookupWithKeyE_1(k, m); };
        }
        var entries = m.entries();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = entries.next()).done) {
            var _a = e.value, ka = _a[0], a = _a[1];
            if (E.equals(ka, k)) {
                return some$5([ka, a]);
            }
        }
        return none;
    };
}
function lookup$2(E) {
    var lookupWithKeyE = lookupWithKey(E);
    return function (k, m) {
        if (m === undefined) {
            var lookupE_1 = lookup$2(E);
            return function (m) { return lookupE_1(k, m); };
        }
        return pipe$1(lookupWithKeyE(k, m), map$7(function (_a) {
            var _ = _a[0], a = _a[1];
            return a;
        }));
    };
}
function isSubmap(SK, SA) {
    var lookupWithKeyS = lookupWithKey(SK);
    return function (me, that) {
        if (that === undefined) {
            var isSubmapSKSA_1 = isSubmap(SK, SA);
            return function (that) { return isSubmapSKSA_1(that, me); };
        }
        var entries = me.entries();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = entries.next()).done) {
            var _a = e.value, k = _a[0], a = _a[1];
            var d2OptA = lookupWithKeyS(k, that);
            if (isNone(d2OptA) || !SK.equals(k, d2OptA.value[0]) || !SA.equals(a, d2OptA.value[1])) {
                return false;
            }
        }
        return true;
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
function getEq$5(SK, SA) {
    var isSubmapSKSA = isSubmap(SK, SA);
    return fromEquals(function (x, y) { return isSubmapSKSA(x, y) && isSubmapSKSA(y, x); });
}

/**
 * Calculate the number of key/value pairs in a `ReadonlyRecord`,
 *
 * @since 2.5.0
 */
var size$2 = function (r) { return Object.keys(r).length; };
/**
 * Test whether a `ReadonlyRecord` is empty.
 *
 * @since 2.5.0
 */
var isEmpty$3 = function (r) {
    for (var k in r) {
        if (has$2.call(r, k)) {
            return false;
        }
    }
    return true;
};
/**
 * @since 2.5.0
 */
var keys = function (r) {
    return Object.keys(r).sort();
};
/**
 * Map a `ReadonlyRecord` into an `ReadonlyArray`.
 *
 * @example
 * import { collect } from 'fp-ts/ReadonlyRecord'
 *
 * const x: { readonly a: string, readonly b: boolean } = { a: 'c', b: false }
 * assert.deepStrictEqual(
 *   collect((key, val) => ({ key: key, value: val }))(x),
 *   [{ key: 'a', value: 'c' }, { key: 'b', value: false }]
 * )
 *
 * @since 2.5.0
 */
var collect = function (f) { return function (r) {
    var out = [];
    for (var _i = 0, _a = keys(r); _i < _a.length; _i++) {
        var key = _a[_i];
        out.push(f(key, r[key]));
    }
    return out;
}; };
/**
 * Insert or replace a key/value pair in a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.10.0
 */
var upsertAt = function (k, a) { return function (r) {
    if (has$2.call(r, k) && r[k] === a) {
        return r;
    }
    var out = Object.assign({}, r);
    out[k] = a;
    return out;
}; };
/**
 * Test whether or not a key exists in a `ReadonlyRecord`.
 *
 * Note. This function is not pipeable because is a custom type guard.
 *
 * @since 2.10.0
 */
var has = function (k, r) { return has$2.call(r, k); };
function deleteAt$1(k) {
    return function (r) {
        if (!has$2.call(r, k)) {
            return r;
        }
        var out = Object.assign({}, r);
        delete out[k];
        return out;
    };
}
function isSubrecord(E) {
    return function (me, that) {
        if (that === undefined) {
            var isSubrecordE_1 = isSubrecord(E);
            return function (that) { return isSubrecordE_1(that, me); };
        }
        for (var k in me) {
            if (!has$2.call(that, k) || !E.equals(me[k], that[k])) {
                return false;
            }
        }
        return true;
    };
}
function lookup$3(k, r) {
    if (r === undefined) {
        return function (r) { return lookup$3(k, r); };
    }
    return has$2.call(r, k) ? some$5(r[k]) : none;
}
/**
 * @since 2.5.0
 */
var empty$1 = {};
function mapWithIndex$2(f) {
    return function (r) {
        var out = {};
        for (var k in r) {
            if (has$2.call(r, k)) {
                out[k] = f(k, r[k]);
            }
        }
        return out;
    };
}
function map$4(f) {
    return mapWithIndex$2(function (_, a) { return f(a); });
}
function reduceWithIndex$4(b, f) {
    return function (fa) {
        var out = b;
        var ks = keys(fa);
        var len = ks.length;
        for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = f(k, out, fa[k]);
        }
        return out;
    };
}
function foldMapWithIndex$4(M) {
    return function (f) { return function (fa) {
        var out = M.empty;
        var ks = keys(fa);
        var len = ks.length;
        for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = M.concat(out, f(k, fa[k]));
        }
        return out;
    }; };
}
function reduceRightWithIndex$4(b, f) {
    return function (fa) {
        var out = b;
        var ks = keys(fa);
        var len = ks.length;
        for (var i = len - 1; i >= 0; i--) {
            var k = ks[i];
            out = f(k, fa[k], out);
        }
        return out;
    };
}
/**
 * Create a `ReadonlyRecord` with one key/value pair.
 *
 * @category constructors
 * @since 2.5.0
 */
var singleton = function (k, a) {
    var _a;
    return (_a = {}, _a[k] = a, _a);
};
function traverseWithIndex$2(F) {
    return function (f) { return function (ta) {
        var ks = keys(ta);
        if (ks.length === 0) {
            return F.of(empty$1);
        }
        var fr = F.of({});
        var _loop_1 = function (key) {
            fr = F.ap(F.map(fr, function (r) { return function (b) {
                r[key] = b;
                return r;
            }; }), f(key, ta[key]));
        };
        for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
            var key = ks_1[_i];
            _loop_1(key);
        }
        return fr;
    }; };
}
function traverse$3(F) {
    var traverseWithIndexF = traverseWithIndex$2(F);
    return function (f) { return traverseWithIndexF(function (_, a) { return f(a); }); };
}
function sequence$3(F) {
    return traverseWithIndex$2(F)(function (_, a) { return a; });
}
function partitionMapWithIndex$1(f) {
    return function (r) {
        var left = {};
        var right = {};
        for (var k in r) {
            if (has$2.call(r, k)) {
                var e = f(k, r[k]);
                switch (e._tag) {
                    case 'Left':
                        left[k] = e.left;
                        break;
                    case 'Right':
                        right[k] = e.right;
                        break;
                }
            }
        }
        return separated(left, right);
    };
}
function partitionWithIndex$1(predicateWithIndex) {
    return function (r) {
        var left = {};
        var right = {};
        for (var k in r) {
            if (has$2.call(r, k)) {
                var a = r[k];
                if (predicateWithIndex(k, a)) {
                    right[k] = a;
                }
                else {
                    left[k] = a;
                }
            }
        }
        return separated(left, right);
    };
}
function filterMapWithIndex$1(f) {
    return function (r) {
        var out = {};
        for (var k in r) {
            if (has$2.call(r, k)) {
                var ob = f(k, r[k]);
                if (isSome$1(ob)) {
                    out[k] = ob.value;
                }
            }
        }
        return out;
    };
}
function filterWithIndex$2(predicateWithIndex) {
    return function (fa) {
        var out = {};
        var changed = false;
        for (var key in fa) {
            if (has$2.call(fa, key)) {
                var a = fa[key];
                if (predicateWithIndex(key, a)) {
                    out[key] = a;
                }
                else {
                    changed = true;
                }
            }
        }
        return changed ? out : fa;
    };
}
function fromFoldable(M, F) {
    var fromFoldableMapM = fromFoldableMap(M, F);
    return function (fka) { return fromFoldableMapM(fka, identity); };
}
function fromFoldableMap(M, F) {
    return function (ta, f) {
        return F.reduce(ta, {}, function (r, a) {
            var _a = f(a), k = _a[0], b = _a[1];
            r[k] = has$2.call(r, k) ? M.concat(r[k], b) : b;
            return r;
        });
    };
}
/**
 * @since 2.5.0
 */
function every$2(predicate) {
    return function (r) {
        for (var k in r) {
            if (!predicate(r[k])) {
                return false;
            }
        }
        return true;
    };
}
/**
 * @since 2.5.0
 */
function some$1(predicate) {
    return function (r) {
        for (var k in r) {
            if (predicate(r[k])) {
                return true;
            }
        }
        return false;
    };
}
function elem$4(E) {
    return function (a, fa) {
        if (fa === undefined) {
            var elemE_1 = elem$4(E);
            return function (fa) { return elemE_1(a, fa); };
        }
        for (var k in fa) {
            if (E.equals(fa[k], a)) {
                return true;
            }
        }
        return false;
    };
}
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Filterable
 * @since 2.5.0
 */
var filter$2 = function (predicate) {
    return filterWithIndex$2(function (_, a) { return predicate(a); });
};
/**
 * @category Filterable
 * @since 2.5.0
 */
var filterMap$1 = function (f) { return filterMapWithIndex$1(function (_, a) { return f(a); }); };
/**
 * @category Filterable
 * @since 2.5.0
 */
var partition$1 = function (predicate) {
    return partitionWithIndex$1(function (_, a) { return predicate(a); });
};
/**
 * @category Filterable
 * @since 2.5.0
 */
var partitionMap$1 = function (f) {
    return partitionMapWithIndex$1(function (_, a) { return f(a); });
};
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduce$5 = function (b, f) {
    return reduceWithIndex$4(b, function (_, b, a) { return f(b, a); });
};
/**
 * @category Foldable
 * @since 2.5.0
 */
var foldMap$5 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$4(M);
    return function (f) { return foldMapWithIndexM(function (_, a) { return f(a); }); };
};
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduceRight$5 = function (b, f) {
    return reduceRightWithIndex$4(b, function (_, a, b) { return f(a, b); });
};
/**
 * @category Compactable
 * @since 2.5.0
 */
var compact$1 = function (r) {
    var out = {};
    for (var k in r) {
        if (has$2.call(r, k)) {
            var oa = r[k];
            if (isSome$1(oa)) {
                out[k] = oa.value;
            }
        }
    }
    return out;
};
/**
 * @category Compactable
 * @since 2.5.0
 */
var separate$1 = function (r) {
    var left = {};
    var right = {};
    for (var k in r) {
        if (has$2.call(r, k)) {
            var e = r[k];
            if (isLeft$1(e)) {
                left[k] = e.left;
            }
            else {
                right[k] = e.right;
            }
        }
    }
    return separated(left, right);
};
/**
 * @category instances
 * @since 2.5.0
 */
function getShow$6(S) {
    return {
        show: function (r) {
            var elements = collect(function (k, a) { return JSON.stringify(k) + ": " + S.show(a); })(r).join(', ');
            return elements === '' ? '{}' : "{ " + elements + " }";
        }
    };
}
function getEq$6(E) {
    var isSubrecordE = isSubrecord(E);
    return fromEquals(function (x, y) { return isSubrecordE(x)(y) && isSubrecordE(y)(x); });
}
function getMonoid$2(S) {
    return {
        concat: function (first, second) {
            if (isEmpty$3(first)) {
                return second;
            }
            if (isEmpty$3(second)) {
                return first;
            }
            var r = Object.assign({}, first);
            for (var k in second) {
                if (has$2.call(second, k)) {
                    r[k] = has$2.call(first, k) ? S.concat(first[k], second[k]) : second[k];
                }
            }
            return r;
        },
        empty: empty$1
    };
}
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category combinators
 * @since 2.5.0
 * @deprecated
 */
var insertAt$2 = upsertAt;
function hasOwnProperty(k, r) {
    return has$2.call(r === undefined ? this : r, k);
}

var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// -------------------------------------------------------------------------------------
// Iso
// -------------------------------------------------------------------------------------
/** @internal */
var iso = function (get, reverseGet) { return ({
    get: get,
    reverseGet: reverseGet
}); };
/** @internal */
var isoAsLens = function (sa) { return lens(sa.get, flow(sa.reverseGet, constant$1)); };
/** @internal */
var isoAsPrism = function (sa) { return prism(flow(sa.get, some$5), sa.reverseGet); };
/** @internal */
var isoAsOptional = function (sa) {
    return optional(flow(sa.get, some$5), flow(sa.reverseGet, constant$1));
};
/** @internal */
var isoAsTraversal = function (sa) {
    return traversal(function (F) { return function (f) { return function (s) {
        return F.map(f(sa.get(s)), function (a) { return sa.reverseGet(a); });
    }; }; });
};
// -------------------------------------------------------------------------------------
// Lens
// -------------------------------------------------------------------------------------
/** @internal */
var lens = function (get, set) { return ({ get: get, set: set }); };
/** @internal */
var lensAsOptional = function (sa) { return optional(flow(sa.get, some$5), sa.set); };
/** @internal */
var lensAsTraversal = function (sa) {
    return traversal(function (F) { return function (f) { return function (s) { return F.map(f(sa.get(s)), function (a) { return sa.set(a)(s); }); }; }; });
};
/** @internal */
var lensComposeLens = function (ab) { return function (sa) {
    return lens(function (s) { return ab.get(sa.get(s)); }, function (b) { return function (s) { return sa.set(ab.set(b)(sa.get(s)))(s); }; });
}; };
/** @internal */
var prismComposePrism = function (ab) { return function (sa) {
    return prism(flow(sa.getOption, chain$3(ab.getOption)), flow(ab.reverseGet, sa.reverseGet));
}; };
/** @internal */
var lensComposePrism = function (ab) { return function (sa) {
    return optionalComposeOptional(prismAsOptional(ab))(lensAsOptional(sa));
}; };
/** @internal */
var lensId = function () { return lens(identity, constant$1); };
/** @internal */
var lensProp = function (prop) { return function (sa) {
    return lens(function (s) { return sa.get(s)[prop]; }, function (ap) { return function (s) {
        var _a;
        var oa = sa.get(s);
        if (ap === oa[prop]) {
            return s;
        }
        return sa.set(Object.assign({}, oa, (_a = {}, _a[prop] = ap, _a)))(s);
    }; });
}; };
/** @internal */
var lensProps = function () {
    var props = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        props[_i] = arguments[_i];
    }
    return function (sa) {
        return lens(function (s) {
            var a = sa.get(s);
            var r = {};
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var k = props_1[_i];
                r[k] = a[k];
            }
            return r;
        }, function (a) { return function (s) {
            var oa = sa.get(s);
            for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
                var k = props_2[_i];
                if (a[k] !== oa[k]) {
                    return sa.set(Object.assign({}, oa, a))(s);
                }
            }
            return s;
        }; });
    };
};
/** @internal */
var lensComponent = function (prop) { return function (sa) {
    return lens(function (s) { return sa.get(s)[prop]; }, function (ap) { return function (s) {
        var oa = sa.get(s);
        if (ap === oa[prop]) {
            return s;
        }
        var copy = oa.slice();
        copy[prop] = ap;
        return sa.set(copy)(s);
    }; });
}; };
/** @internal */
var lensAtKey = function (key) { return function (sa) {
    return pipe(sa, lensComposeLens(atReadonlyRecord().at(key)));
}; };
// -------------------------------------------------------------------------------------
// Prism
// -------------------------------------------------------------------------------------
/** @internal */
var prism = function (getOption, reverseGet) { return ({ getOption: getOption, reverseGet: reverseGet }); };
/** @internal */
var prismAsOptional = function (sa) { return optional(sa.getOption, function (a) { return prismSet(a)(sa); }); };
/** @internal */
var prismAsTraversal = function (sa) {
    return traversal(function (F) { return function (f) { return function (s) {
        return pipe(sa.getOption(s), fold$5(function () { return F.of(s); }, function (a) { return F.map(f(a), function (a) { return prismSet(a)(sa)(s); }); }));
    }; }; });
};
/** @internal */
var prismModifyOption = function (f) { return function (sa) { return function (s) {
    return pipe(sa.getOption(s), map$7(function (o) {
        var n = f(o);
        return n === o ? s : sa.reverseGet(n);
    }));
}; }; };
/** @internal */
var prismModify = function (f) { return function (sa) {
    var g = prismModifyOption(f)(sa);
    return function (s) {
        return pipe(g(s), getOrElse$1(function () { return s; }));
    };
}; };
/** @internal */
var prismSet = function (a) { return prismModify(function () { return a; }); };
/** @internal */
var prismComposeLens = function (ab) { return function (sa) {
    return optionalComposeOptional(lensAsOptional(ab))(prismAsOptional(sa));
}; };
/** @internal */
var prismFromNullable = function () { return prism(fromNullable$3, identity); };
/** @internal */
var prismFromPredicate = function (predicate) {
    return prism(fromPredicate$2(predicate), identity);
};
/** @internal */
var prismSome = function () { return prism(identity, some$5); };
/** @internal */
var prismRight = function () { return prism(fromEither, right); };
/** @internal */
var prismLeft = function () {
    return prism(function (s) { return (isLeft(s) ? some$5(s.left) : none); }, // TODO: replace with E.getLeft in v3
    left);
};
// -------------------------------------------------------------------------------------
// Optional
// -------------------------------------------------------------------------------------
/** @internal */
var optional = function (getOption, set) { return ({
    getOption: getOption,
    set: set
}); };
/** @internal */
var optionalAsTraversal = function (sa) {
    return traversal(function (F) { return function (f) { return function (s) {
        return pipe(sa.getOption(s), fold$5(function () { return F.of(s); }, function (a) { return F.map(f(a), function (a) { return sa.set(a)(s); }); }));
    }; }; });
};
/** @internal */
var optionalModifyOption = function (f) { return function (optional) { return function (s) {
    return pipe(optional.getOption(s), map$7(function (a) {
        var n = f(a);
        return n === a ? s : optional.set(n)(s);
    }));
}; }; };
/** @internal */
var optionalModify = function (f) { return function (optional) {
    var g = optionalModifyOption(f)(optional);
    return function (s) {
        return pipe(g(s), getOrElse$1(function () { return s; }));
    };
}; };
/** @internal */
var optionalComposeOptional = function (ab) { return function (sa) {
    return optional(flow(sa.getOption, chain$3(ab.getOption)), function (b) { return optionalModify(ab.set(b))(sa); });
}; };
/** @internal */
var optionalIndex = function (i) { return function (sa) {
    return pipe(sa, optionalComposeOptional(indexReadonlyArray().index(i)));
}; };
/** @internal */
var optionalIndexNonEmpty = function (i) { return function (sa) { return pipe(sa, optionalComposeOptional(indexReadonlyNonEmptyArray().index(i))); }; };
/** @internal */
var optionalKey = function (key) { return function (sa) {
    return pipe(sa, optionalComposeOptional(indexReadonlyRecord().index(key)));
}; };
/** @internal */
var optionalFindFirst = function (predicate) {
    return optional(findFirst(predicate), function (a) { return function (s) {
        return pipe(findIndex(predicate)(s), fold$5(function () { return s; }, function (i) { return unsafeUpdateAt$2(i, a, s); }));
    }; });
};
var unsafeUpdateAt$4 = function (i, a, as) {
    if (as[i] === a) {
        return as;
    }
    else {
        var xs = __spreadArrays([as[0]], as.slice(1));
        xs[i] = a;
        return xs;
    }
};
/** @internal */
var optionalFindFirstNonEmpty = function (predicate) {
    return optional(findFirst(predicate), function (a) { return function (as) {
        return pipe(findIndex(predicate)(as), fold$5(function () { return as; }, function (i) { return unsafeUpdateAt$4(i, a, as); }));
    }; });
};
// -------------------------------------------------------------------------------------
// Traversal
// -------------------------------------------------------------------------------------
/** @internal */
var traversal = function (modifyF) { return ({
    modifyF: modifyF
}); };
/** @internal */
function traversalComposeTraversal(ab) {
    return function (sa) { return traversal(function (F) { return function (f) { return sa.modifyF(F)(ab.modifyF(F)(f)); }; }); };
}
/** @internal */
var ApplicativeIdentity = {
    URI: 'Identity',
    map: function (fa, f) { return f(fa); },
    of: identity,
    ap: 
    /* istanbul ignore next */
    function (fab, fa) { return fab(fa); }
};
var isIdentity = function (F) { return F.URI === 'Identity'; };
function fromTraversable(T) {
    return function () {
        return traversal(function (F) {
            // if `F` is `Identity` then `traverseF = map`
            var traverseF = isIdentity(F)
                ? T.map
                : T.traverse(F);
            return function (f) { return function (s) { return traverseF(s, f); }; };
        });
    };
}
/** @internal */
function traversalTraverse(T) {
    return traversalComposeTraversal(fromTraversable(T)());
}
// -------------------------------------------------------------------------------------
// Ix
// -------------------------------------------------------------------------------------
/** @internal */
var index = function (index) { return ({ index: index }); };
/** @internal */
var indexReadonlyArray = function () {
    return index(function (i) {
        return optional(function (as) { return lookup(i, as); }, function (a) { return function (as) {
            return pipe(lookup(i, as), fold$5(function () { return as; }, function () { return unsafeUpdateAt$2(i, a, as); }));
        }; });
    });
};
/** @internal */
var indexReadonlyNonEmptyArray = function () {
    return index(function (i) {
        return optional(function (as) { return lookup(i, as); }, function (a) { return function (as) {
            return pipe(lookup(i, as), fold$5(function () { return as; }, function () { return unsafeUpdateAt$4(i, a, as); }));
        }; });
    });
};
/** @internal */
var indexReadonlyRecord = function () {
    return index(function (k) {
        return optional(function (r) { return lookup$3(k, r); }, function (a) { return function (r) {
            if (r[k] === a || isNone(lookup$3(k, r))) {
                return r;
            }
            return insertAt$2(k, a)(r);
        }; });
    });
};
// -------------------------------------------------------------------------------------
// At
// -------------------------------------------------------------------------------------
/** @internal */
var at = function (at) { return ({ at: at }); };
/** @internal */
function atReadonlyRecord() {
    return at(function (key) {
        return lens(function (r) { return lookup$3(key, r); }, fold$5(function () { return deleteAt$1(key); }, function (a) { return insertAt$2(key, a); }));
    });
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.3.8
 */
var iso$1 = iso;
// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------
/**
 * View an `Iso` as a `Lens`.
 *
 * @category converters
 * @since 2.3.0
 */
var asLens = isoAsLens;
/**
 * View an `Iso` as a `Prism`.
 *
 * @category converters
 * @since 2.3.0
 */
var asPrism = isoAsPrism;
/**
 * View an `Iso` as a `Optional`.
 *
 * @category converters
 * @since 2.3.0
 */
var asOptional = isoAsOptional;
/**
 * View an `Iso` as a `Traversal`.
 *
 * @category converters
 * @since 2.3.0
 */
var asTraversal = isoAsTraversal;
// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------
/**
 * Compose an `Iso` with an `Iso`.
 *
 * @category compositions
 * @since 2.3.0
 */
var compose = function (ab) { return function (sa) {
    return iso$1(flow(sa.get, ab.get), flow(ab.reverseGet, sa.reverseGet));
}; };
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.3.0
 */
var reverse$5 = function (sa) { return iso$1(sa.reverseGet, sa.get); };
/**
 * @category combinators
 * @since 2.3.0
 */
var modify = function (f) { return function (sa) { return function (s) { return sa.reverseGet(f(sa.get(s))); }; }; };

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.3.8
 */
var lens$1 = lens;
/**
 * @category constructors
 * @since 2.3.0
 */
var id = lensId;
// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------
/**
 * View a `Lens` as a `Optional`.
 *
 * @category converters
 * @since 2.3.0
 */
var asOptional$1 = lensAsOptional;
/**
 * View a `Lens` as a `Traversal`.
 *
 * @category converters
 * @since 2.3.0
 */
var asTraversal$1 = lensAsTraversal;
// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------
/**
 * Compose a `Lens` with a `Lens`.
 *
 * @category compositions
 * @since 2.3.0
 */
var compose$1 = lensComposeLens;
/**
 * Alias of `compose`.
 *
 * @category compositions
 * @since 2.3.8
 */
var composeLens = compose$1;
/**
 * Compose a `Lens` with a `Iso`.
 *
 * @category compositions
 * @since 2.3.8
 */
var composeIso = 
/*#__PURE__*/
flow(isoAsLens, compose$1);
/**
 * Compose a `Lens` with a `Prism`.
 *
 * @category compositions
 * @since 2.3.0
 */
var composePrism = lensComposePrism;
/**
 * Compose a `Lens` with an `Optional`.
 *
 * @category compositions
 * @since 2.3.0
 */
var composeOptional = function (ab) {
    return flow(asOptional$1, optionalComposeOptional(ab));
};
/**
 * Compose a `Lens` with an `Traversal`.
 *
 * @category compositions
 * @since 2.3.8
 */
var composeTraversal = function (ab) {
    return flow(asTraversal$1, traversalComposeTraversal(ab));
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.3.0
 */
var modify$1 = function (f) { return function (sa) { return function (s) {
    var o = sa.get(s);
    var n = f(o);
    return o === n ? s : sa.set(n)(s);
}; }; };
function modifyF(F) {
    return function (f) { return function (sa) { return function (s) { return pipe(sa.get(s), f, function (fa) { return F.map(fa, function (a) { return sa.set(a)(s); }); }); }; }; };
}
/**
 * Return a `Optional` from a `Lens` focused on a nullable value.
 *
 * @category combinators
 * @since 2.3.0
 */
var fromNullable$1 = function (sa) {
    return composePrism(prismFromNullable())(sa);
};
function filter$3(predicate) {
    return composePrism(prismFromPredicate(predicate));
}
/**
 * Return a `Lens` from a `Lens` and a prop.
 *
 * @category combinators
 * @since 2.3.0
 */
var prop = lensProp;
/**
 * Return a `Lens` from a `Lens` and a list of props.
 *
 * @category combinators
 * @since 2.3.0
 */
var props = lensProps;
/**
 * Return a `Lens` from a `Lens` focused on a component of a tuple.
 *
 * @category combinators
 * @since 2.3.0
 */
var component = lensComponent;
/**
 * Return a `Optional` from a `Lens` focused on an index of a `ReadonlyArray`.
 *
 * @category combinators
 * @since 2.3.0
 */
var index$1 = function (i) {
    return flow(asOptional$1, optionalIndex(i));
};
/**
 * Return a `Optional` from a `Lens` focused on an index of a `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.3.8
 */
var indexNonEmpty = function (i) {
    return flow(asOptional$1, optionalIndexNonEmpty(i));
};
/**
 * Return a `Optional` from a `Lens` focused on a key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
var key = function (key) {
    return flow(asOptional$1, optionalKey(key));
};
/**
 * Return a `Lens` from a `Lens` focused on a required key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
var atKey = lensAtKey;
/**
 * Return a `Optional` from a `Lens` focused on the `Some` of a `Option` type.
 *
 * @category combinators
 * @since 2.3.0
 */
var some$2 = 
/*#__PURE__*/
composePrism(prismSome());
/**
 * Return a `Optional` from a `Lens` focused on the `Right` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
var right$1 = 
/*#__PURE__*/
composePrism(prismRight());
/**
 * Return a `Optional` from a `Lens` focused on the `Left` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
var left$1 = 
/*#__PURE__*/
composePrism(prismLeft());
/**
 * Return a `Traversal` from a `Lens` focused on a `Traversable`.
 *
 * @category combinators
 * @since 2.3.0
 */
function traverse$4(T) {
    return flow(asTraversal$1, traversalTraverse(T));
}
function findFirst$2(predicate) {
    return composeOptional(optionalFindFirst(predicate));
}
function findFirstNonEmpty(predicate) {
    return composeOptional(optionalFindFirstNonEmpty(predicate));
}
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Invariant
 * @since 2.3.0
 */
var imap = function (f, g) { return function (ea) {
    return imap_(ea, f, g);
}; };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var imap_ = function (ea, ab, ba) { return lens$1(flow(ea.get, ab), flow(ba, ea.set)); };
/**
 * @category instances
 * @since 2.3.0
 */
var URI$5 = 'monocle-ts/Lens';
/**
 * @category instances
 * @since 2.3.0
 */
var Invariant = {
    URI: URI$5,
    imap: imap_
};
/**
 * @category instances
 * @since 2.3.8
 */
var Semigroupoid = {
    URI: URI$5,
    compose: function (ab, ea) { return compose$1(ab)(ea); }
};
/**
 * @category instances
 * @since 2.3.0
 */
var Category = {
    URI: URI$5,
    compose: Semigroupoid.compose,
    id: id
};

var lens$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    lens: lens$1,
    id: id,
    asOptional: asOptional$1,
    asTraversal: asTraversal$1,
    compose: compose$1,
    composeLens: composeLens,
    composeIso: composeIso,
    composePrism: composePrism,
    composeOptional: composeOptional,
    composeTraversal: composeTraversal,
    modify: modify$1,
    modifyF: modifyF,
    fromNullable: fromNullable$1,
    filter: filter$3,
    prop: prop,
    props: props,
    component: component,
    index: index$1,
    indexNonEmpty: indexNonEmpty,
    key: key,
    atKey: atKey,
    some: some$2,
    right: right$1,
    left: left$1,
    traverse: traverse$4,
    findFirst: findFirst$2,
    findFirstNonEmpty: findFirstNonEmpty,
    imap: imap,
    URI: URI$5,
    Invariant: Invariant,
    Semigroupoid: Semigroupoid,
    Category: Category
});

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------
/**
 * View a `Optional` as a `Traversal`.
 *
 * @category converters
 * @since 2.3.0
 */
var asTraversal$2 = optionalAsTraversal;
// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------
/**
 * Compose a `Optional` with a `Optional`.
 *
 * @category compositions
 * @since 2.3.0
 */
var compose$2 = optionalComposeOptional;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.3.0
 */
var modifyOption = optionalModifyOption;
/**
 * @category combinators
 * @since 2.3.0
 */
var modify$2 = optionalModify;
/**
 * Return an `Optional` from a `Optional` focused on a nullable value.
 *
 * @category combinators
 * @since 2.3.3
 */
var fromNullable$2 = 
/*#__PURE__*/
compose$2(prismAsOptional(prismFromNullable()));
/**
 * Return a `Optional` from a `Optional` focused on the `Some` of a `Option` type.
 *
 * @category combinators
 * @since 2.3.0
 */
var some$3 = 
/*#__PURE__*/
compose$2(prismAsOptional(prismSome()));
/**
 * Return a `Optional` from a `Optional` focused on the `Right` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
var right$2 = 
/*#__PURE__*/
compose$2(prismAsOptional(prismRight()));
/**
 * Return a `Optional` from a `Optional` focused on the `Left` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
var left$2 = 
/*#__PURE__*/
compose$2(prismAsOptional(prismLeft()));

/**
 * @category constructors
 * @since 2.3.0
 */
var fromPredicate$1 = prismFromPredicate;
// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------
/**
 * View a `Prism` as a `Optional`.
 *
 * @category converters
 * @since 2.3.0
 */
var asOptional$2 = prismAsOptional;
/**
 * View a `Prism` as a `Traversal`.
 *
 * @category converters
 * @since 2.3.0
 */
var asTraversal$3 = prismAsTraversal;
// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------
/**
 * Compose a `Prism` with a `Prism`.
 *
 * @category compositions
 * @since 2.3.0
 */
var compose$3 = prismComposePrism;
/**
 * Compose a `Prism` with a `Lens`.
 *
 * @category compositions
 * @since 2.3.0
 */
var composeLens$1 = prismComposeLens;

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------
/**
 * Compose a `Traversal` with a `Traversal`.
 *
 * @category compositions
 * @since 2.3.0
 */
var compose$4 = traversalComposeTraversal;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.3.0
 */
var modify$3 = function (f) { return function (sa) {
    return sa.modifyF(ApplicativeIdentity)(f);
}; };
/**
 * @category combinators
 * @since 2.3.0
 */
var set = function (a) { return modify$3(function () { return a; }); };
function filter$4(predicate) {
    return compose$4(prismAsTraversal(prismFromPredicate(predicate)));
}

/**
 * @since 1.0.0
 */
//
// compat
//
var fromIso = function (iso) { return new Iso(iso.get, iso.reverseGet); };
var fromLens = function (lens) { return new Lens(lens.get, lens.set); };
var fromPrism = function (prism) { return new Prism(prism.getOption, prism.reverseGet); };
var fromOptional = function (optional) {
    return new Optional(optional.getOption, optional.set);
};
var fromTraversal = function (traversal) { return new Traversal(traversal.modifyF); };
//
// old APIs
//
var update = function (o, k, a) {
    var _a;
    return a === o[k] ? o : Object.assign({}, o, (_a = {}, _a[k] = a, _a));
};
/**
 * Laws:
 * 1. `reverseGet(get(s)) = s`
 * 2. `get(reversetGet(a)) = a`
 *
 * @category constructor
 * @since 1.0.0
 */
var Iso = /** @class */ (function () {
    function Iso(get, reverseGet) {
        this.get = get;
        this.reverseGet = reverseGet;
        /**
         * @since 1.0.0
         */
        this._tag = 'Iso';
        /**
         * @since 1.0.0
         */
        this.unwrap = this.get;
        /**
         * @since 1.0.0
         */
        this.to = this.get;
        /**
         * @since 1.0.0
         */
        this.wrap = this.reverseGet;
        /**
         * @since 1.0.0
         */
        this.from = this.reverseGet;
    }
    /**
     * reverse the `Iso`: the source becomes the target and the target becomes the source
     * @since 1.0.0
     */
    Iso.prototype.reverse = function () {
        return fromIso(reverse$5(this));
    };
    /**
     * @since 1.0.0
     */
    Iso.prototype.modify = function (f) {
        return modify(f)(this);
    };
    /**
     * view an `Iso` as a `Lens`
     *
     * @since 1.0.0
     */
    Iso.prototype.asLens = function () {
        return fromLens(asLens(this));
    };
    /**
     * view an `Iso` as a `Prism`
     *
     * @since 1.0.0
     */
    Iso.prototype.asPrism = function () {
        return fromPrism(asPrism(this));
    };
    /**
     * view an `Iso` as a `Optional`
     *
     * @since 1.0.0
     */
    Iso.prototype.asOptional = function () {
        return fromOptional(asOptional(this));
    };
    /**
     * view an `Iso` as a `Traversal`
     *
     * @since 1.0.0
     */
    Iso.prototype.asTraversal = function () {
        return fromTraversal(asTraversal(this));
    };
    /**
     * view an `Iso` as a `Fold`
     *
     * @since 1.0.0
     */
    Iso.prototype.asFold = function () {
        var _this = this;
        return new Fold(function () { return function (f) { return function (s) { return f(_this.get(s)); }; }; });
    };
    /**
     * view an `Iso` as a `Getter`
     *
     * @since 1.0.0
     */
    Iso.prototype.asGetter = function () {
        var _this = this;
        return new Getter(function (s) { return _this.get(s); });
    };
    /**
     * view an `Iso` as a `Setter`
     *
     * @since 1.0.0
     */
    Iso.prototype.asSetter = function () {
        var _this = this;
        return new Setter(function (f) { return _this.modify(f); });
    };
    /**
     * compose an `Iso` with an `Iso`
     *
     * @since 1.0.0
     */
    Iso.prototype.compose = function (ab) {
        return fromIso(compose(ab)(this));
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Iso.prototype.composeIso = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose an `Iso` with a `Lens `
     *
     * @since 1.0.0
     */
    Iso.prototype.composeLens = function (ab) {
        return fromLens(pipe(this, asLens, compose$1(ab)));
    };
    /**
     * compose an `Iso` with a `Prism`
     *
     * @since 1.0.0
     */
    Iso.prototype.composePrism = function (ab) {
        return fromPrism(pipe(this, asPrism, compose$3(ab)));
    };
    /**
     * compose an `Iso` with an `Optional`
     *
     * @since 1.0.0
     */
    Iso.prototype.composeOptional = function (ab) {
        return fromOptional(pipe(this, asOptional, compose$2(ab)));
    };
    /**
     * compose an `Iso` with a `Traversal`
     *
     * @since 1.0.0
     */
    Iso.prototype.composeTraversal = function (ab) {
        return fromTraversal(pipe(this, asTraversal, compose$4(ab)));
    };
    /**
     * compose an `Iso` with a `Fold`
     *
     * @since 1.0.0
     */
    Iso.prototype.composeFold = function (ab) {
        return this.asFold().compose(ab);
    };
    /**
     * compose an `Iso` with a `Getter`
     *
     * @since 1.0.0
     */
    Iso.prototype.composeGetter = function (ab) {
        return this.asGetter().compose(ab);
    };
    /**
     * compose an `Iso` with a `Setter`
     *
     * @since 1.0.0
     */
    Iso.prototype.composeSetter = function (ab) {
        return this.asSetter().compose(ab);
    };
    return Iso;
}());
/**
 * Laws:
 * 1. `get(set(a)(s)) = a`
 * 2. `set(get(s))(s) = s`
 * 3. `set(a)(set(a)(s)) = set(a)(s)`
 *
 * @category constructor
 * @since 1.0.0
 */
var Lens = /** @class */ (function () {
    function Lens(get, set) {
        this.get = get;
        this.set = set;
        /**
         * @since 1.0.0
         */
        this._tag = 'Lens';
    }
    /**
     * @example
     * import { Lens } from 'monocle-ts'
     *
     * type Person = {
     *   name: string
     *   age: number
     *   address: {
     *     city: string
     *   }
     * }
     *
     * const city = Lens.fromPath<Person>()(['address', 'city'])
     *
     * const person: Person = { name: 'Giulio', age: 43, address: { city: 'Milan' } }
     *
     * assert.strictEqual(city.get(person), 'Milan')
     * assert.deepStrictEqual(city.set('London')(person), { name: 'Giulio', age: 43, address: { city: 'London' } })
     *
     * @since 1.0.0
     */
    Lens.fromPath = function () {
        var fromProp = Lens.fromProp();
        return function (path) {
            var lens = fromProp(path[0]);
            return path.slice(1).reduce(function (acc, prop) { return acc.compose(fromProp(prop)); }, lens);
        };
    };
    /**
     * Returns a `Lens` from a type and a prop
     *
     * @example
     * import { Lens } from 'monocle-ts'
     *
     * type Person = {
     *   name: string
     *   age: number
     * }
     *
     * const age = Lens.fromProp<Person>()('age')
     *
     * const person: Person = { name: 'Giulio', age: 43 }
     *
     * assert.strictEqual(age.get(person), 43)
     * assert.deepStrictEqual(age.set(44)(person), { name: 'Giulio', age: 44 })
     *
     * @since 1.0.0
     */
    Lens.fromProp = function () {
        return function (prop$1) { return fromLens(pipe(id(), prop(prop$1))); };
    };
    Lens.fromProps = function () {
        return function (props$1) { return fromLens(pipe(id(), props.apply(lens$2, props$1))); };
    };
    /**
     * Returns a `Lens` from a nullable (`A | null | undefined`) prop
     *
     * @example
     * import { Lens } from 'monocle-ts'
     *
     * interface Outer {
     *   inner?: Inner
     * }
     *
     * interface Inner {
     *   value: number
     *   foo: string
     * }
     *
     * const inner = Lens.fromNullableProp<Outer>()('inner', { value: 0, foo: 'foo' })
     * const value = Lens.fromProp<Inner>()('value')
     * const lens = inner.compose(value)
     *
     * assert.deepStrictEqual(lens.set(1)({}), { inner: { value: 1, foo: 'foo' } })
     * assert.strictEqual(lens.get({}), 0)
     * assert.deepStrictEqual(lens.set(1)({ inner: { value: 1, foo: 'bar' } }), { inner: { value: 1, foo: 'bar' } })
     * assert.strictEqual(lens.get({ inner: { value: 1, foo: 'bar' } }), 1)
     *
     * @since 1.0.0
     */
    Lens.fromNullableProp = function () {
        return function (k, defaultValue) {
            return new Lens(function (s) {
                var osk = fromNullable$3(s[k]);
                if (isNone(osk)) {
                    return defaultValue;
                }
                else {
                    return osk.value;
                }
            }, function (a) { return function (s) { return update(s, k, a); }; });
        };
    };
    /**
     * @since 1.0.0
     */
    Lens.prototype.modify = function (f) {
        return modify$1(f)(this);
    };
    /**
     * view a `Lens` as a Optional
     *
     * @since 1.0.0
     */
    Lens.prototype.asOptional = function () {
        return fromOptional(asOptional$1(this));
    };
    /**
     * view a `Lens` as a `Traversal`
     *
     * @since 1.0.0
     */
    Lens.prototype.asTraversal = function () {
        return fromTraversal(asTraversal$1(this));
    };
    /**
     * view a `Lens` as a `Setter`
     *
     * @since 1.0.0
     */
    Lens.prototype.asSetter = function () {
        var _this = this;
        return new Setter(function (f) { return _this.modify(f); });
    };
    /**
     * view a `Lens` as a `Getter`
     *
     * @since 1.0.0
     */
    Lens.prototype.asGetter = function () {
        var _this = this;
        return new Getter(function (s) { return _this.get(s); });
    };
    /**
     * view a `Lens` as a `Fold`
     *
     * @since 1.0.0
     */
    Lens.prototype.asFold = function () {
        var _this = this;
        return new Fold(function () { return function (f) { return function (s) { return f(_this.get(s)); }; }; });
    };
    /**
     * compose a `Lens` with a `Lens`
     *
     * @since 1.0.0
     */
    Lens.prototype.compose = function (ab) {
        return fromLens(compose$1(ab)(this));
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Lens.prototype.composeLens = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose a `Lens` with a `Getter`
     *
     * @since 1.0.0
     */
    Lens.prototype.composeGetter = function (ab) {
        return this.asGetter().compose(ab);
    };
    /**
     * compose a `Lens` with a `Fold`
     *
     * @since 1.0.0
     */
    Lens.prototype.composeFold = function (ab) {
        return this.asFold().compose(ab);
    };
    /**
     * compose a `Lens` with an `Optional`
     *
     * @since 1.0.0
     */
    Lens.prototype.composeOptional = function (ab) {
        return fromOptional(pipe(this, asOptional$1, compose$2(ab)));
    };
    /**
     * compose a `Lens` with an `Traversal`
     *
     * @since 1.0.0
     */
    Lens.prototype.composeTraversal = function (ab) {
        return fromTraversal(pipe(this, asTraversal$1, compose$4(ab)));
    };
    /**
     * compose a `Lens` with an `Setter`
     *
     * @since 1.0.0
     */
    Lens.prototype.composeSetter = function (ab) {
        return this.asSetter().compose(ab);
    };
    /**
     * compose a `Lens` with an `Iso`
     *
     * @since 1.0.0
     */
    Lens.prototype.composeIso = function (ab) {
        return fromLens(pipe(this, compose$1(pipe(ab, asLens))));
    };
    /**
     * compose a `Lens` with a `Prism`
     *
     * @since 1.0.0
     */
    Lens.prototype.composePrism = function (ab) {
        return fromOptional(composePrism(ab)(this));
    };
    return Lens;
}());
/**
 * Laws:
 * 1. `pipe(getOption(s), fold(() => s, reverseGet)) = s`
 * 2. `getOption(reverseGet(a)) = some(a)`
 *
 * @category constructor
 * @since 1.0.0
 */
var Prism = /** @class */ (function () {
    function Prism(getOption, reverseGet) {
        this.getOption = getOption;
        this.reverseGet = reverseGet;
        /**
         * @since 1.0.0
         */
        this._tag = 'Prism';
    }
    Prism.fromPredicate = function (predicate) {
        return fromPrism(fromPredicate$1(predicate));
    };
    /**
     * @since 1.0.0
     */
    Prism.some = function () {
        return somePrism;
    };
    /**
     * @since 1.0.0
     */
    Prism.prototype.modify = function (f) {
        var _this = this;
        return function (s) {
            var os = _this.modifyOption(f)(s);
            if (isNone(os)) {
                return s;
            }
            else {
                return os.value;
            }
        };
    };
    /**
     * @since 1.0.0
     */
    Prism.prototype.modifyOption = function (f) {
        var _this = this;
        return function (s) {
            return option.map(_this.getOption(s), function (v) {
                var n = f(v);
                return n === v ? s : _this.reverseGet(n);
            });
        };
    };
    /**
     * set the target of a `Prism` with a value
     *
     * @since 1.0.0
     */
    Prism.prototype.set = function (a) {
        return this.modify(function () { return a; });
    };
    /**
     * view a `Prism` as a `Optional`
     *
     * @since 1.0.0
     */
    Prism.prototype.asOptional = function () {
        return fromOptional(asOptional$2(this));
    };
    /**
     * view a `Prism` as a `Traversal`
     *
     * @since 1.0.0
     */
    Prism.prototype.asTraversal = function () {
        return fromTraversal(asTraversal$3(this));
    };
    /**
     * view a `Prism` as a `Setter`
     *
     * @since 1.0.0
     */
    Prism.prototype.asSetter = function () {
        var _this = this;
        return new Setter(function (f) { return _this.modify(f); });
    };
    /**
     * view a `Prism` as a `Fold`
     *
     * @since 1.0.0
     */
    Prism.prototype.asFold = function () {
        var _this = this;
        return new Fold(function (M) { return function (f) { return function (s) {
            var oa = _this.getOption(s);
            return isNone(oa) ? M.empty : f(oa.value);
        }; }; });
    };
    /**
     * compose a `Prism` with a `Prism`
     *
     * @since 1.0.0
     */
    Prism.prototype.compose = function (ab) {
        return fromPrism(compose$3(ab)(this));
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Prism.prototype.composePrism = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose a `Prism` with a `Optional`
     *
     * @since 1.0.0
     */
    Prism.prototype.composeOptional = function (ab) {
        return fromOptional(pipe(this, asOptional$2, compose$2(ab)));
    };
    /**
     * compose a `Prism` with a `Traversal`
     *
     * @since 1.0.0
     */
    Prism.prototype.composeTraversal = function (ab) {
        return fromTraversal(pipe(this, asTraversal$3, compose$4(ab)));
    };
    /**
     * compose a `Prism` with a `Fold`
     *
     * @since 1.0.0
     */
    Prism.prototype.composeFold = function (ab) {
        return this.asFold().compose(ab);
    };
    /**
     * compose a `Prism` with a `Setter`
     *
     * @since 1.0.0
     */
    Prism.prototype.composeSetter = function (ab) {
        return this.asSetter().compose(ab);
    };
    /**
     * compose a `Prism` with a `Iso`
     *
     * @since 1.0.0
     */
    Prism.prototype.composeIso = function (ab) {
        return fromPrism(pipe(this, compose$3(pipe(ab, asPrism))));
    };
    /**
     * compose a `Prism` with a `Lens`
     *
     * @since 1.0.0
     */
    Prism.prototype.composeLens = function (ab) {
        return fromOptional(composeLens$1(ab)(this));
    };
    /**
     * compose a `Prism` with a `Getter`
     *
     * @since 1.0.0
     */
    Prism.prototype.composeGetter = function (ab) {
        return this.asFold().compose(ab.asFold());
    };
    return Prism;
}());
var somePrism = new Prism(identity, some$5);
/**
 * Laws:
 * 1. `pipe(getOption(s), fold(() => s, a => set(a)(s))) = s`
 * 2. `getOption(set(a)(s)) = pipe(getOption(s), map(_ => a))`
 * 3. `set(a)(set(a)(s)) = set(a)(s)`
 *
 * @category constructor
 * @since 1.0.0
 */
var Optional = /** @class */ (function () {
    function Optional(getOption, set) {
        this.getOption = getOption;
        this.set = set;
        /**
         * @since 1.0.0
         */
        this._tag = 'Optional';
    }
    /**
     * Returns an `Optional` from a nullable (`A | null | undefined`) prop
     *
     * @example
     * import { Optional } from 'monocle-ts'
     *
     * interface Phone {
     *   number: string
     * }
     * interface Employment {
     *   phone?: Phone
     * }
     * interface Info {
     *   employment?: Employment
     * }
     * interface Response {
     *   info?: Info
     * }
     *
     * const numberFromResponse = Optional.fromPath<Response>()(['info', 'employment', 'phone', 'number'])
     *
     * const response1: Response = {
     *   info: {
     *     employment: {
     *       phone: {
     *         number: '555-1234'
     *       }
     *     }
     *   }
     * }
     * const response2: Response = {
     *   info: {
     *     employment: {}
     *   }
     * }
     *
     * numberFromResponse.getOption(response1) // some('555-1234')
     * numberFromResponse.getOption(response2) // none
     *
     * @since 2.1.0
     */
    Optional.fromPath = function () {
        var fromNullableProp = Optional.fromNullableProp();
        return function (path) {
            var optional = fromNullableProp(path[0]);
            return path.slice(1).reduce(function (acc, prop) { return acc.compose(fromNullableProp(prop)); }, optional);
        };
    };
    /**
     * @example
     * import { Optional } from 'monocle-ts'
     *
     * interface S {
     *   a: number | undefined | null
     * }
     *
     * const optional = Optional.fromNullableProp<S>()('a')
     *
     * const s1: S = { a: undefined }
     * const s2: S = { a: null }
     * const s3: S = { a: 1 }
     *
     * assert.deepStrictEqual(optional.set(2)(s1), s1)
     * assert.deepStrictEqual(optional.set(2)(s2), s2)
     * assert.deepStrictEqual(optional.set(2)(s3), { a: 2 })
     *
     * @since 1.0.0
     */
    Optional.fromNullableProp = function () {
        return function (k) {
            return new Optional(function (s) { return fromNullable$3(s[k]); }, function (a) { return function (s) { return (s[k] == null ? s : update(s, k, a)); }; });
        };
    };
    /**
     * Returns an `Optional` from an option (`Option<A>`) prop
     *
     * @example
     * import { Optional } from 'monocle-ts'
     * import * as O from 'fp-ts/es6/Option'
     *
     * interface S {
     *   a: O.Option<number>
     * }
     *
     * const optional = Optional.fromOptionProp<S>()('a')
     * const s1: S = { a: O.none }
     * const s2: S = { a: O.some(1) }
     * assert.deepStrictEqual(optional.set(2)(s1), s1)
     * assert.deepStrictEqual(optional.set(2)(s2), { a: O.some(2) })
     *
     * @since 1.0.0
     */
    Optional.fromOptionProp = function () {
        var formProp = Lens.fromProp();
        return function (prop) { return formProp(prop).composePrism(somePrism); };
    };
    /**
     * @since 1.0.0
     */
    Optional.prototype.modify = function (f) {
        return modify$2(f)(this);
    };
    /**
     * @since 1.0.0
     */
    Optional.prototype.modifyOption = function (f) {
        return modifyOption(f)(this);
    };
    /**
     * view a `Optional` as a `Traversal`
     *
     * @since 1.0.0
     */
    Optional.prototype.asTraversal = function () {
        return fromTraversal(asTraversal$2(this));
    };
    /**
     * view an `Optional` as a `Fold`
     *
     * @since 1.0.0
     */
    Optional.prototype.asFold = function () {
        var _this = this;
        return new Fold(function (M) { return function (f) { return function (s) {
            var oa = _this.getOption(s);
            return isNone(oa) ? M.empty : f(oa.value);
        }; }; });
    };
    /**
     * view an `Optional` as a `Setter`
     *
     * @since 1.0.0
     */
    Optional.prototype.asSetter = function () {
        var _this = this;
        return new Setter(function (f) { return _this.modify(f); });
    };
    /**
     * compose a `Optional` with a `Optional`
     *
     * @since 1.0.0
     */
    Optional.prototype.compose = function (ab) {
        return fromOptional(compose$2(ab)(this));
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Optional.prototype.composeOptional = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose an `Optional` with a `Traversal`
     *
     * @since 1.0.0
     */
    Optional.prototype.composeTraversal = function (ab) {
        return fromTraversal(pipe(this, asTraversal$2, compose$4(ab)));
    };
    /**
     * compose an `Optional` with a `Fold`
     *
     * @since 1.0.0
     */
    Optional.prototype.composeFold = function (ab) {
        return this.asFold().compose(ab);
    };
    /**
     * compose an `Optional` with a `Setter`
     *
     * @since 1.0.0
     */
    Optional.prototype.composeSetter = function (ab) {
        return this.asSetter().compose(ab);
    };
    /**
     * compose an `Optional` with a `Lens`
     *
     * @since 1.0.0
     */
    Optional.prototype.composeLens = function (ab) {
        return fromOptional(pipe(this, compose$2(pipe(ab, asOptional$1))));
    };
    /**
     * compose an `Optional` with a `Prism`
     *
     * @since 1.0.0
     */
    Optional.prototype.composePrism = function (ab) {
        return fromOptional(pipe(this, compose$2(pipe(ab, asOptional$2))));
    };
    /**
     * compose an `Optional` with a `Iso`
     *
     * @since 1.0.0
     */
    Optional.prototype.composeIso = function (ab) {
        return fromOptional(pipe(this, compose$2(pipe(ab, asOptional))));
    };
    /**
     * compose an `Optional` with a `Getter`
     *
     * @since 1.0.0
     */
    Optional.prototype.composeGetter = function (ab) {
        return this.asFold().compose(ab.asFold());
    };
    return Optional;
}());
/**
 * @category constructor
 * @since 1.0.0
 */
var Traversal = /** @class */ (function () {
    function Traversal(
    // Van Laarhoven representation
    modifyF) {
        this.modifyF = modifyF;
        /**
         * @since 1.0.0
         */
        this._tag = 'Traversal';
    }
    /**
     * @since 1.0.0
     */
    Traversal.prototype.modify = function (f) {
        return modify$3(f)(this);
    };
    /**
     * @since 1.0.0
     */
    Traversal.prototype.set = function (a) {
        return set(a)(this);
    };
    Traversal.prototype.filter = function (predicate) {
        return fromTraversal(filter$4(predicate)(this));
    };
    /**
     * view a `Traversal` as a `Fold`
     *
     * @since 1.0.0
     */
    Traversal.prototype.asFold = function () {
        var _this = this;
        return new Fold(function (M) { return function (f) {
            return _this.modifyF(getApplicative(M))(function (a) { return make(f(a)); });
        }; });
    };
    /**
     * view a `Traversal` as a `Setter`
     *
     * @since 1.0.0
     */
    Traversal.prototype.asSetter = function () {
        var _this = this;
        return new Setter(function (f) { return _this.modify(f); });
    };
    /**
     * compose a `Traversal` with a `Traversal`
     *
     * @since 1.0.0
     */
    Traversal.prototype.compose = function (ab) {
        return fromTraversal(compose$4(ab)(this));
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composeTraversal = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose a `Traversal` with a `Fold`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composeFold = function (ab) {
        return this.asFold().compose(ab);
    };
    /**
     * compose a `Traversal` with a `Setter`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composeSetter = function (ab) {
        return this.asSetter().compose(ab);
    };
    /**
     * compose a `Traversal` with a `Optional`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composeOptional = function (ab) {
        return this.compose(ab.asTraversal());
    };
    /**
     * compose a `Traversal` with a `Lens`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composeLens = function (ab) {
        return fromTraversal(pipe(this, compose$4(pipe(ab, asTraversal$1))));
    };
    /**
     * compose a `Traversal` with a `Prism`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composePrism = function (ab) {
        return fromTraversal(pipe(this, compose$4(pipe(ab, asTraversal$3))));
    };
    /**
     * compose a `Traversal` with a `Iso`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composeIso = function (ab) {
        return fromTraversal(pipe(this, compose$4(pipe(ab, asTraversal))));
    };
    /**
     * compose a `Traversal` with a `Getter`
     *
     * @since 1.0.0
     */
    Traversal.prototype.composeGetter = function (ab) {
        return this.asFold().compose(ab.asFold());
    };
    return Traversal;
}());
/**
 * @category constructor
 * @since 1.0.0
 */
var Getter = /** @class */ (function () {
    function Getter(get) {
        this.get = get;
        /**
         * @since 1.0.0
         */
        this._tag = 'Getter';
    }
    /**
     * view a `Getter` as a `Fold`
     *
     * @since 1.0.0
     */
    Getter.prototype.asFold = function () {
        var _this = this;
        return new Fold(function () { return function (f) { return function (s) { return f(_this.get(s)); }; }; });
    };
    /**
     * compose a `Getter` with a `Getter`
     *
     * @since 1.0.0
     */
    Getter.prototype.compose = function (ab) {
        var _this = this;
        return new Getter(function (s) { return ab.get(_this.get(s)); });
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Getter.prototype.composeGetter = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose a `Getter` with a `Fold`
     *
     * @since 1.0.0
     */
    Getter.prototype.composeFold = function (ab) {
        return this.asFold().compose(ab);
    };
    /**
     * compose a `Getter` with a `Lens`
     *
     * @since 1.0.0
     */
    Getter.prototype.composeLens = function (ab) {
        return this.compose(ab.asGetter());
    };
    /**
     * compose a `Getter` with a `Iso`
     *
     * @since 1.0.0
     */
    Getter.prototype.composeIso = function (ab) {
        return this.compose(ab.asGetter());
    };
    /**
     * compose a `Getter` with a `Optional`
     *
     * @since 1.0.0
     */
    Getter.prototype.composeTraversal = function (ab) {
        return this.asFold().compose(ab.asFold());
    };
    /**
     * compose a `Getter` with a `Optional`
     *
     * @since 1.0.0
     */
    Getter.prototype.composeOptional = function (ab) {
        return this.asFold().compose(ab.asFold());
    };
    /**
     * compose a `Getter` with a `Prism`
     *
     * @since 1.0.0
     */
    Getter.prototype.composePrism = function (ab) {
        return this.asFold().compose(ab.asFold());
    };
    return Getter;
}());
/**
 * @category constructor
 * @since 1.0.0
 */
var Fold = /** @class */ (function () {
    function Fold(foldMap) {
        this.foldMap = foldMap;
        /**
         * @since 1.0.0
         */
        this._tag = 'Fold';
        this.getAll = foldMap(getMonoid$1())(of$1);
        this.exist = foldMap(monoidAny);
        this.all = foldMap(monoidAll);
        this.foldMapFirst = foldMap(getFirstMonoid());
    }
    /**
     * compose a `Fold` with a `Fold`
     *
     * @since 1.0.0
     */
    Fold.prototype.compose = function (ab) {
        var _this = this;
        return new Fold(function (M) { return function (f) { return _this.foldMap(M)(ab.foldMap(M)(f)); }; });
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Fold.prototype.composeFold = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose a `Fold` with a `Getter`
     *
     * @since 1.0.0
     */
    Fold.prototype.composeGetter = function (ab) {
        return this.compose(ab.asFold());
    };
    /**
     * compose a `Fold` with a `Traversal`
     *
     * @since 1.0.0
     */
    Fold.prototype.composeTraversal = function (ab) {
        return this.compose(ab.asFold());
    };
    /**
     * compose a `Fold` with a `Optional`
     *
     * @since 1.0.0
     */
    Fold.prototype.composeOptional = function (ab) {
        return this.compose(ab.asFold());
    };
    /**
     * compose a `Fold` with a `Lens`
     *
     * @since 1.0.0
     */
    Fold.prototype.composeLens = function (ab) {
        return this.compose(ab.asFold());
    };
    /**
     * compose a `Fold` with a `Prism`
     *
     * @since 1.0.0
     */
    Fold.prototype.composePrism = function (ab) {
        return this.compose(ab.asFold());
    };
    /**
     * compose a `Fold` with a `Iso`
     *
     * @since 1.0.0
     */
    Fold.prototype.composeIso = function (ab) {
        return this.compose(ab.asFold());
    };
    Fold.prototype.find = function (p) {
        return this.foldMapFirst(fromPredicate$2(p));
    };
    /**
     * get the first target of a `Fold`
     *
     * @since 1.0.0
     */
    Fold.prototype.headOption = function (s) {
        return this.find(function () { return true; })(s);
    };
    return Fold;
}());
/**
 * @category constructor
 * @since 1.0.0
 */
var Setter = /** @class */ (function () {
    function Setter(modify) {
        this.modify = modify;
        /**
         * @since 1.0.0
         */
        this._tag = 'Setter';
    }
    /**
     * @since 1.0.0
     */
    Setter.prototype.set = function (a) {
        return this.modify(constant$1(a));
    };
    /**
     * compose a `Setter` with a `Setter`
     *
     * @since 1.0.0
     */
    Setter.prototype.compose = function (ab) {
        var _this = this;
        return new Setter(function (f) { return _this.modify(ab.modify(f)); });
    };
    /**
     * Alias of `compose`
     *
     * @since 1.0.0
     */
    Setter.prototype.composeSetter = function (ab) {
        return this.compose(ab);
    };
    /**
     * compose a `Setter` with a `Traversal`
     *
     * @since 1.0.0
     */
    Setter.prototype.composeTraversal = function (ab) {
        return this.compose(ab.asSetter());
    };
    /**
     * compose a `Setter` with a `Optional`
     *
     * @since 1.0.0
     */
    Setter.prototype.composeOptional = function (ab) {
        return this.compose(ab.asSetter());
    };
    /**
     * compose a `Setter` with a `Lens`
     *
     * @since 1.0.0
     */
    Setter.prototype.composeLens = function (ab) {
        return this.compose(ab.asSetter());
    };
    /**
     * compose a `Setter` with a `Prism`
     *
     * @since 1.0.0
     */
    Setter.prototype.composePrism = function (ab) {
        return this.compose(ab.asSetter());
    };
    /**
     * compose a `Setter` with a `Iso`
     *
     * @since 1.0.0
     */
    Setter.prototype.composeIso = function (ab) {
        return this.compose(ab.asSetter());
    };
    return Setter;
}());

/**
 * @since 0.3.0
 */
var getEq$7 = function (S) { return S; };
/**
 * @since 0.2.0
 */
var getOrd$2 = function (O) { return O; };
/**
 * @since 0.2.0
 */
var getSemigroup$4 = function (S) { return S; };
/**
 * @since 0.2.0
 */
var getMonoid$3 = function (M) { return M; };
/**
 * @since 0.2.0
 */
var getSemiring = function (S) { return S; };
/**
 * @since 0.2.0
 */
var getRing = function (R) { return R; };
/**
 * @since 0.2.0
 */
var getField = function (F) { return F; };
//
// isos
//
var anyIso = new Iso(unsafeCoerce, unsafeCoerce);
/**
 * @since 0.2.0
 */
function iso$2() {
    return anyIso;
}
/**
 * @since 0.2.0
 */
function prism$1(predicate) {
    return new Prism(function (s) { return (predicate(s) ? some$5(s) : none); }, identity);
}

var es6 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getEq: getEq$7,
    getOrd: getOrd$2,
    getSemigroup: getSemigroup$4,
    getMonoid: getMonoid$3,
    getSemiring: getSemiring,
    getRing: getRing,
    getField: getField,
    iso: iso$2,
    prism: prism$1
});

/**
 * @since 2.10.0
 */
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Eq$1 = eqString;
/**
 * `string` semigroup under concatenation.
 *
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Semigroup.concat('a', 'b'), 'ab')
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Semigroup$1 = semigroupString;
/**
 * `string` monoid under concatenation.
 *
 * The `empty` value is `''`.
 *
 * @example
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(S.Monoid.concat('a', 'b'), 'ab')
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Monoid$1 = monoidString;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Ord$2 = ordString;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Show$1 = showString;
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * An empty `string`.
 *
 * @since 2.10.0
 */
var empty$2 = '';
/**
 * Test whether a `string` is empty.
 *
 * @since 2.10.0
 */
var isEmpty$4 = function (s) { return s.length === 0; };
/**
 * Calculate the number of characters in a `string`.
 *
 * @since 2.10.0
 */
var size$3 = function (s) { return s.length; };

var string = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Eq: Eq$1,
    Semigroup: Semigroup$1,
    Monoid: Monoid$1,
    Ord: Ord$2,
    Show: Show$1,
    empty: empty$2,
    isEmpty: isEmpty$4,
    size: size$3
});

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * Calculate the number of key/value pairs in a `Record`.
 *
 * @since 2.0.0
 */
var size$4 = size$2;
/**
 * Test whether a `Record` is empty.
 *
 * @since 2.0.0
 */
var isEmpty$5 = isEmpty$3;
/**
 * @since 2.0.0
 */
var keys$1 = keys;
/**
 * Map a `Record` into an `Array`.
 *
 * @example
 * import { collect } from 'fp-ts/Record'
 *
 * const x: { readonly a: string, readonly b: boolean } = { a: 'c', b: false }
 * assert.deepStrictEqual(
 *   collect((key, val) => ({ key: key, value: val }))(x),
 *   [{ key: 'a', value: 'c' }, { key: 'b', value: false }]
 * )
 *
 * @since 2.0.0
 */
var collect$1 = function (f) { return function (r) {
    var out = [];
    for (var _i = 0, _a = keys$1(r); _i < _a.length; _i++) {
        var key = _a[_i];
        out.push(f(key, r[key]));
    }
    return out;
}; };
/**
 * Get a sorted `Array` of the key/value pairs contained in a `Record`.
 *
 * @since 2.0.0
 */
var toArray = 
/*#__PURE__*/
collect$1(function (k, a) { return [k, a]; });
function toUnfoldable(U) {
    return function (r) {
        var sas = toArray(r);
        var len = sas.length;
        return U.unfold(0, function (b) { return (b < len ? some$5([sas[b], b + 1]) : none); });
    };
}
/**
 * Insert or replace a key/value pair in a `Record`.
 *
 * @category combinators
 * @since 2.10.0
 */
var upsertAt$1 = upsertAt;
/**
 * Test whether or not a key exists in a `Record`.
 *
 * Note. This function is not pipeable because is a custom type guard.
 *
 * @since 2.10.0
 */
var has$1 = has;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
function deleteAt$2(k) {
    return function (r) {
        if (!_hasOwnProperty.call(r, k)) {
            return r;
        }
        var out = Object.assign({}, r);
        delete out[k];
        return out;
    };
}
/**
 * @since 2.0.0
 */
var updateAt$2 = function (k, a) {
    return modifyAt$2(k, function () { return a; });
};
/**
 * @since 2.0.0
 */
var modifyAt$2 = function (k, f) { return function (r) {
    if (!has$1(k, r)) {
        return none;
    }
    var out = Object.assign({}, r);
    out[k] = f(r[k]);
    return some$5(out);
}; };
function pop(k) {
    var deleteAtk = deleteAt$2(k);
    return function (r) {
        var oa = lookup$4(k, r);
        return isNone(oa) ? none : some$5([oa.value, deleteAtk(r)]);
    };
}
// TODO: remove non-curried overloading in v3
/**
 * Test whether one `Record` contains all of the keys and values contained in another `Record`.
 *
 * @since 2.0.0
 */
var isSubrecord$1 = isSubrecord;
// TODO: remove non-curried overloading in v3
/**
 * Lookup the value for a key in a `Record`.
 *
 * @since 2.0.0
 */
var lookup$4 = lookup$3;
/**
 * Map a `Record` passing the keys to the iterating function.
 *
 * @since 2.0.0
 */
var mapWithIndex$3 = mapWithIndex$2;
/**
 * Map a `Record` passing the values to the iterating function.
 *
 * @since 2.0.0
 */
var map$5 = map$4;
/**
 * @since 2.0.0
 */
var reduceWithIndex$5 = reduceWithIndex$4;
/**
 * @since 2.0.0
 */
var foldMapWithIndex$5 = foldMapWithIndex$4;
/**
 * @since 2.0.0
 */
var reduceRightWithIndex$5 = reduceRightWithIndex$4;
/**
 * Create a `Record` with one key/value pair.
 *
 * @since 2.0.0
 */
var singleton$1 = singleton;
function traverseWithIndex$3(F) {
    return traverseWithIndex$2(F);
}
function traverse$5(F) {
    return traverse$3(F);
}
function sequence$4(F) {
    return sequence$3(F);
}
/**
 * @category Witherable
 * @since 2.6.5
 */
var wither$1 = function (F) {
    var traverseF = traverse$5(F);
    return function (f) { return function (fa) { return F.map(pipe$1(fa, traverseF(f)), compact$2); }; };
};
/**
 * @category Witherable
 * @since 2.6.5
 */
var wilt$1 = function (F) {
    var traverseF = traverse$5(F);
    return function (f) { return function (fa) { return F.map(pipe$1(fa, traverseF(f)), separate$2); }; };
};
/**
 * @since 2.0.0
 */
var partitionMapWithIndex$2 = partitionMapWithIndex$1;
function partitionWithIndex$2(predicateWithIndex) {
    return partitionWithIndex$1(predicateWithIndex);
}
/**
 * @since 2.0.0
 */
var filterMapWithIndex$2 = filterMapWithIndex$1;
function filterWithIndex$3(predicateWithIndex) {
    return filterWithIndex$2(predicateWithIndex);
}
function fromFoldable$1(M, F) {
    return fromFoldable(M, F);
}
function fromFoldableMap$1(M, F) {
    return fromFoldableMap(M, F);
}
/**
 * @since 2.0.0
 */
var every$3 = every$2;
/**
 * @since 2.0.0
 */
var some$4 = some$1;
// TODO: remove non-curried overloading in v3
/**
 * @since 2.0.0
 */
var elem$5 = elem$4;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map$4 = function (fa, f) { return pipe$1(fa, map$5(f)); };
/* istanbul ignore next */
var _mapWithIndex$2 = function (fa, f) { return pipe$1(fa, mapWithIndex$3(f)); };
/* istanbul ignore next */
var _reduce$3 = function (fa, b, f) { return pipe$1(fa, reduce$6(b, f)); };
/* istanbul ignore next */
var _foldMap$3 = function (M) {
    var foldMapM = foldMap$6(M);
    return function (fa, f) { return pipe$1(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight$3 = function (fa, b, f) { return pipe$1(fa, reduceRight$6(b, f)); };
/* istanbul ignore next */
var _traverse$3 = function (F) {
    var traverseF = traverse$5(F);
    return function (ta, f) { return pipe$1(ta, traverseF(f)); };
};
/* istanbul ignore next */
var _filter$1 = function (fa, predicate) { return pipe$1(fa, filter$5(predicate)); };
/* istanbul ignore next */
var _filterMap$1 = function (fa, f) { return pipe$1(fa, filterMap$2(f)); };
/* istanbul ignore next */
var _partition$1 = function (fa, predicate) { return pipe$1(fa, partition$2(predicate)); };
/* istanbul ignore next */
var _partitionMap$1 = function (fa, f) { return pipe$1(fa, partitionMap$2(f)); };
/* istanbul ignore next */
var _reduceWithIndex$2 = function (fa, b, f) {
    return pipe$1(fa, reduceWithIndex$5(b, f));
};
/* istanbul ignore next */
var _foldMapWithIndex$2 = function (M) {
    var foldMapWithIndexM = foldMapWithIndex$5(M);
    return function (fa, f) { return pipe$1(fa, foldMapWithIndexM(f)); };
};
/* istanbul ignore next */
var _reduceRightWithIndex$2 = function (fa, b, f) {
    return pipe$1(fa, reduceRightWithIndex$5(b, f));
};
/* istanbul ignore next */
var _partitionMapWithIndex$1 = function (fa, f) { return pipe$1(fa, partitionMapWithIndex$2(f)); };
/* istanbul ignore next */
var _partitionWithIndex$1 = function (fa, predicateWithIndex) {
    return pipe$1(fa, partitionWithIndex$2(predicateWithIndex));
};
/* istanbul ignore next */
var _filterMapWithIndex$1 = function (fa, f) {
    return pipe$1(fa, filterMapWithIndex$2(f));
};
/* istanbul ignore next */
var _filterWithIndex$1 = function (fa, predicateWithIndex) {
    return pipe$1(fa, filterWithIndex$3(predicateWithIndex));
};
/* istanbul ignore next */
var _traverseWithIndex$2 = function (F) {
    var traverseWithIndexF = traverseWithIndex$3(F);
    return function (ta, f) { return pipe$1(ta, traverseWithIndexF(f)); };
};
/* istanbul ignore next */
var _wither$1 = function (F) {
    var witherF = wither$1(F);
    return function (fa, f) { return pipe$1(fa, witherF(f)); };
};
/* istanbul ignore next */
var _wilt$1 = function (F) {
    var wiltF = wilt$1(F);
    return function (fa, f) { return pipe$1(fa, wiltF(f)); };
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Filterable
 * @since 2.0.0
 */
var filter$5 = filter$2;
/**
 * @category Filterable
 * @since 2.0.0
 */
var filterMap$2 = filterMap$1;
/**
 * @category Foldable
 * @since 2.0.0
 */
var foldMap$6 = foldMap$5;
/**
 * @category Filterable
 * @since 2.0.0
 */
var partition$2 = partition$1;
/**
 * @category Filterable
 * @since 2.0.0
 */
var partitionMap$2 = partitionMap$1;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduce$6 = reduce$5;
/**
 * @category Foldable
 * @since 2.0.0
 */
var reduceRight$6 = reduceRight$5;
/**
 * @category Compactable
 * @since 2.0.0
 */
var compact$2 = compact$1;
/**
 * @category Compactable
 * @since 2.0.0
 */
var separate$2 = separate$1;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$6 = 'Record';
/**
 * @category instances
 * @since 2.0.0
 */
var getShow$7 = getShow$6;
/**
 * @category instances
 * @since 2.0.0
 */
var getEq$8 = getEq$6;
/**
 * Returns a `Monoid` instance for `Record`s given a `Semigroup` instance for their values.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 * import { getMonoid } from 'fp-ts/Record'
 *
 * const M = getMonoid(SemigroupSum)
 * assert.deepStrictEqual(M.concat({ foo: 123 }, { foo: 456 }), { foo: 579 })
 *
 * @category instances
 * @since 2.0.0
 */
var getMonoid$4 = getMonoid$2;
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$3 = {
    URI: URI$6,
    map: _map$4
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$3 = 
/*#_PURE_*/
flap$5(Functor$3);
/**
 * @category instances
 * @since 2.7.0
 */
var FunctorWithIndex$2 = {
    URI: URI$6,
    map: _map$4,
    mapWithIndex: _mapWithIndex$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Foldable$3 = {
    URI: URI$6,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var FoldableWithIndex$2 = {
    URI: URI$6,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    reduceWithIndex: _reduceWithIndex$2,
    foldMapWithIndex: _foldMapWithIndex$2,
    reduceRightWithIndex: _reduceRightWithIndex$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Compactable$1 = {
    URI: URI$6,
    compact: compact$2,
    separate: separate$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Filterable$1 = {
    URI: URI$6,
    map: _map$4,
    compact: compact$2,
    separate: separate$2,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var FilterableWithIndex$1 = {
    URI: URI$6,
    map: _map$4,
    mapWithIndex: _mapWithIndex$2,
    compact: compact$2,
    separate: separate$2,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1,
    filterMapWithIndex: _filterMapWithIndex$1,
    filterWithIndex: _filterWithIndex$1,
    partitionMapWithIndex: _partitionMapWithIndex$1,
    partitionWithIndex: _partitionWithIndex$1
};
/**
 * @category instances
 * @since 2.7.0
 */
var Traversable$3 = {
    URI: URI$6,
    map: _map$4,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    traverse: _traverse$3,
    sequence: sequence$4
};
/**
 * @category instances
 * @since 2.7.0
 */
var TraversableWithIndex$2 = {
    URI: URI$6,
    map: _map$4,
    mapWithIndex: _mapWithIndex$2,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    reduceWithIndex: _reduceWithIndex$2,
    foldMapWithIndex: _foldMapWithIndex$2,
    reduceRightWithIndex: _reduceRightWithIndex$2,
    traverse: _traverse$3,
    sequence: sequence$4,
    traverseWithIndex: _traverseWithIndex$2
};
/**
 * @category instances
 * @since 2.7.0
 */
var Witherable$1 = {
    URI: URI$6,
    map: _map$4,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    traverse: _traverse$3,
    sequence: sequence$4,
    compact: compact$2,
    separate: separate$2,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1,
    wither: _wither$1,
    wilt: _wilt$1
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use a new `{}` instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var empty$3 = {};
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var insertAt$3 = upsertAt$1;
/**
 * Use [`has`](#has) instead.
 *
 * @since 2.0.0
 * @deprecated
 */
// tslint:disable-next-line: deprecation
var hasOwnProperty$1 = hasOwnProperty;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var record = {
    URI: URI$6,
    map: _map$4,
    reduce: _reduce$3,
    foldMap: _foldMap$3,
    reduceRight: _reduceRight$3,
    traverse: _traverse$3,
    sequence: sequence$4,
    compact: compact$2,
    separate: separate$2,
    filter: _filter$1,
    filterMap: _filterMap$1,
    partition: _partition$1,
    partitionMap: _partitionMap$1,
    mapWithIndex: _mapWithIndex$2,
    reduceWithIndex: _reduceWithIndex$2,
    foldMapWithIndex: _foldMapWithIndex$2,
    reduceRightWithIndex: _reduceRightWithIndex$2,
    filterMapWithIndex: _filterMapWithIndex$1,
    filterWithIndex: _filterWithIndex$1,
    partitionMapWithIndex: _partitionMapWithIndex$1,
    partitionWithIndex: _partitionWithIndex$1,
    traverseWithIndex: _traverseWithIndex$2,
    wither: _wither$1,
    wilt: _wilt$1
};

var Record = /*#__PURE__*/Object.freeze({
    __proto__: null,
    size: size$4,
    isEmpty: isEmpty$5,
    keys: keys$1,
    collect: collect$1,
    toArray: toArray,
    toUnfoldable: toUnfoldable,
    upsertAt: upsertAt$1,
    has: has$1,
    deleteAt: deleteAt$2,
    updateAt: updateAt$2,
    modifyAt: modifyAt$2,
    pop: pop,
    isSubrecord: isSubrecord$1,
    lookup: lookup$4,
    mapWithIndex: mapWithIndex$3,
    map: map$5,
    reduceWithIndex: reduceWithIndex$5,
    foldMapWithIndex: foldMapWithIndex$5,
    reduceRightWithIndex: reduceRightWithIndex$5,
    singleton: singleton$1,
    traverseWithIndex: traverseWithIndex$3,
    traverse: traverse$5,
    sequence: sequence$4,
    wither: wither$1,
    wilt: wilt$1,
    partitionMapWithIndex: partitionMapWithIndex$2,
    partitionWithIndex: partitionWithIndex$2,
    filterMapWithIndex: filterMapWithIndex$2,
    filterWithIndex: filterWithIndex$3,
    fromFoldable: fromFoldable$1,
    fromFoldableMap: fromFoldableMap$1,
    every: every$3,
    some: some$4,
    elem: elem$5,
    filter: filter$5,
    filterMap: filterMap$2,
    foldMap: foldMap$6,
    partition: partition$2,
    partitionMap: partitionMap$2,
    reduce: reduce$6,
    reduceRight: reduceRight$6,
    compact: compact$2,
    separate: separate$2,
    URI: URI$6,
    getShow: getShow$7,
    getEq: getEq$8,
    getMonoid: getMonoid$4,
    Functor: Functor$3,
    flap: flap$3,
    FunctorWithIndex: FunctorWithIndex$2,
    Foldable: Foldable$3,
    FoldableWithIndex: FoldableWithIndex$2,
    Compactable: Compactable$1,
    Filterable: Filterable$1,
    FilterableWithIndex: FilterableWithIndex$1,
    Traversable: Traversable$3,
    TraversableWithIndex: TraversableWithIndex$2,
    Witherable: Witherable$1,
    empty: empty$3,
    insertAt: insertAt$3,
    hasOwnProperty: hasOwnProperty$1,
    record: record
});

/**
 * Use [`BooleanAlgebra`](./boolean.ts.html#BooleanAlgebra) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var booleanAlgebraBoolean = {
    meet: function (x, y) { return x && y; },
    join: function (x, y) { return x || y; },
    zero: false,
    one: true,
    implies: function (x, y) { return !x || y; },
    not: function (x) { return !x; }
};

/**
 * @since 2.2.0
 */
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
var matchW$1 = function (onFalse, onTrue) { return function (value) {
    return value ? onTrue() : onFalse();
}; };
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category destructors
 * @since 2.10.0
 */
var foldW$1 = matchW$1;
/**
 * Defines the fold over a boolean value.
 * Takes two thunks `onTrue`, `onFalse` and a `boolean` value.
 * If `value` is false, `onFalse()` is returned, otherwise `onTrue()`.
 *
 * @example
 * import { some, map } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 * import { match } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(
 *  pipe(
 *    some(true),
 *    map(match(() => 'false', () => 'true'))
 *  ),
 *  some('true')
 * )
 *
 * @category destructors
 * @since 2.10.0
 */
var match$1 = foldW$1;
/**
 * Alias of [`match`](#match).
 *
 * @category destructors
 * @since 2.2.0
 */
var fold$4 = match$1;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Eq$2 = eqBoolean;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var BooleanAlgebra = booleanAlgebraBoolean;
/**
 * `boolean` semigroup under conjunction.
 *
 * @example
 * import { SemigroupAll } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(SemigroupAll.concat(true, true), true)
 * assert.deepStrictEqual(SemigroupAll.concat(true, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var SemigroupAll = semigroupAll;
/**
 * `boolean` semigroup under disjunction.
 *
 * @example
 * import { SemigroupAny } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(SemigroupAny.concat(true, true), true)
 * assert.deepStrictEqual(SemigroupAny.concat(true, false), true)
 * assert.deepStrictEqual(SemigroupAny.concat(false, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var SemigroupAny = semigroupAny;
/**
 * `boolean` monoid under conjunction.
 *
 * The `empty` value is `true`.
 *
 * @example
 * import { MonoidAll } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(MonoidAll.concat(true, true), true)
 * assert.deepStrictEqual(MonoidAll.concat(true, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var MonoidAll = monoidAll;
/**
 * `boolean` monoid under disjunction.
 *
 * The `empty` value is `false`.
 *
 * @example
 * import { MonoidAny } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(MonoidAny.concat(true, true), true)
 * assert.deepStrictEqual(MonoidAny.concat(true, false), true)
 * assert.deepStrictEqual(MonoidAny.concat(false, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var MonoidAny = monoidAny;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Ord$3 = ordBoolean;
/**
 * @category instances
 * @since 2.10.0
 */
// tslint:disable-next-line: deprecation
var Show$2 = showBoolean;

var boolean = /*#__PURE__*/Object.freeze({
    __proto__: null,
    matchW: matchW$1,
    foldW: foldW$1,
    match: match$1,
    fold: fold$4,
    Eq: Eq$2,
    BooleanAlgebra: BooleanAlgebra,
    SemigroupAll: SemigroupAll,
    SemigroupAny: SemigroupAny,
    MonoidAll: MonoidAll,
    MonoidAny: MonoidAny,
    Ord: Ord$3,
    Show: Show$2
});

function reduce$7(F, G) {
    return function (b, f) { return function (fga) { return F.reduce(fga, b, function (b, ga) { return G.reduce(ga, b, f); }); }; };
}
function foldMap$7(F, G) {
    return function (M) {
        var foldMapF = F.foldMap(M);
        var foldMapG = G.foldMap(M);
        return function (f) { return function (fga) { return foldMapF(fga, function (ga) { return foldMapG(ga, f); }); }; };
    };
}
function reduceRight$7(F, G) {
    return function (b, f) { return function (fga) { return F.reduceRight(fga, b, function (ga, b) { return G.reduceRight(ga, b, f); }); }; };
}
function reduceM(M, F) {
    return function (b, f) { return function (fa) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); }; };
}
function intercalate$1(M, F) {
    return function (sep, fm) {
        var go = function (_a, x) {
            var init = _a.init, acc = _a.acc;
            return init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, sep), x) };
        };
        return F.reduce(fm, { init: true, acc: M.empty }, go).acc;
    };
}
function toReadonlyArray(F) {
    return function (fa) {
        return F.reduce(fa, [], function (acc, a) {
            acc.push(a);
            return acc;
        });
    };
}
function traverse_(M, F) {
    var applyFirst = function (mu, mb) { return M.ap(M.map(mu, constant$1), mb); };
    var mu = M.of(undefined);
    return function (fa, f) { return F.reduce(fa, mu, function (mu, a) { return applyFirst(mu, f(a)); }); };
}
function foldM(M, F) {
    return function (fa, b, f) { return F.reduce(fa, M.of(b), function (mb, a) { return M.chain(mb, function (b) { return f(b, a); }); }); };
}
/**
 * Use [`toReadonlyArray`](#toreadonlyarray) instead
 *
 * @since 2.8.0
 * @deprecated
 */
var toArray$1 = toReadonlyArray;
/** @deprecated */
function getFoldableComposition(F, G) {
    var _reduce = reduce$7(F, G);
    var _foldMap = foldMap$7(F, G);
    var _reduceRight = reduceRight$7(F, G);
    return {
        reduce: function (fga, b, f) { return pipe$1(fga, _reduce(b, f)); },
        foldMap: function (M) {
            var foldMapM = _foldMap(M);
            return function (fga, f) { return pipe$1(fga, foldMapM(f)); };
        },
        reduceRight: function (fga, b, f) { return pipe$1(fga, _reduceRight(b, f)); }
    };
}

var Foldable$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    reduce: reduce$7,
    foldMap: foldMap$7,
    reduceRight: reduceRight$7,
    reduceM: reduceM,
    intercalate: intercalate$1,
    toReadonlyArray: toReadonlyArray,
    traverse_: traverse_,
    foldM: foldM,
    toArray: toArray$1,
    getFoldableComposition: getFoldableComposition
});

/**
 * @category instances
 * @since 2.0.0
 */
var getShow$8 = getShow$5;
/**
 * Calculate the number of key/value pairs in a map
 *
 * @since 2.0.0
 */
var size$5 = size$1;
/**
 * Test whether or not a map is empty
 *
 * @since 2.0.0
 */
var isEmpty$6 = isEmpty$2;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a key exists in a map
 *
 * @since 2.0.0
 */
var member$1 = member;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not a value is a member of a map
 *
 * @since 2.0.0
 */
var elem$6 = elem$3;
/**
 * Get a sorted `Array` of the keys contained in a `Map`.
 *
 * @since 2.0.0
 */
var keys$2 = function (O) { return function (m) { return Array.from(m.keys()).sort(O.compare); }; };
/**
 * Get a sorted `Array` of the values contained in a `Map`.
 *
 * @since 2.0.0
 */
var values = function (O) { return function (m) { return Array.from(m.values()).sort(O.compare); }; };
/**
 * @since 2.0.0
 */
function collect$2(O) {
    var keysO = keys$2(O);
    return function (f) { return function (m) {
        var out = [];
        var ks = keysO(m);
        for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
            var key = ks_1[_i];
            out.push(f(key, m.get(key)));
        }
        return out;
    }; };
}
/**
 * Get a sorted `Array` of the key/value pairs contained in a `Map`.
 *
 * @since 2.0.0
 */
function toArray$2(O) {
    return collect$2(O)(function (k, a) { return [k, a]; });
}
function toUnfoldable$1(ord, U) {
    var toArrayO = toArray$2(ord);
    return function (d) {
        var kas = toArrayO(d);
        var len = kas.length;
        return U.unfold(0, function (b) { return (b < len ? some$5([kas[b], b + 1]) : none); });
    };
}
/**
 * Insert or replace a key/value pair in a `Map`.
 *
 * @category combinators
 * @since 2.0.0
 */
var upsertAt$2 = function (E) {
    var lookupWithKeyE = lookupWithKey$1(E);
    return function (k, a) {
        var lookupWithKeyEk = lookupWithKeyE(k);
        return function (m) {
            var found = lookupWithKeyEk(m);
            if (isNone(found)) {
                var out = new Map(m);
                out.set(k, a);
                return out;
            }
            else if (found.value[1] !== a) {
                var out = new Map(m);
                out.set(found.value[0], a);
                return out;
            }
            return m;
        };
    };
};
/**
 * Delete a key and value from a map
 *
 * @category combinators
 * @since 2.0.0
 */
var deleteAt$3 = function (E) {
    var lookupWithKeyE = lookupWithKey$1(E);
    return function (k) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (isSome(found)) {
            var r = new Map(m);
            r.delete(found.value[0]);
            return r;
        }
        return m;
    }; };
};
/**
 * @since 2.0.0
 */
var updateAt$3 = function (E) {
    var modifyAtE = modifyAt$3(E);
    return function (k, a) { return modifyAtE(k, function () { return a; }); };
};
/**
 * @since 2.0.0
 */
var modifyAt$3 = function (E) {
    var lookupWithKeyE = lookupWithKey$1(E);
    return function (k, f) { return function (m) {
        var found = lookupWithKeyE(k, m);
        if (isNone(found)) {
            return none;
        }
        var r = new Map(m);
        r.set(found.value[0], f(found.value[1]));
        return some$5(r);
    }; };
};
/**
 * Delete a key and value from a map, returning the value as well as the subsequent map
 *
 * @since 2.0.0
 */
function pop$1(E) {
    var lookupE = lookup$5(E);
    var deleteAtE = deleteAt$3(E);
    return function (k) {
        var deleteAtEk = deleteAtE(k);
        return function (m) {
            return pipe$1(lookupE(k, m), map$7(function (a) { return [a, deleteAtEk(m)]; }));
        };
    };
}
function lookupWithKey$1(E) {
    return function (k, m) {
        if (m === undefined) {
            var lookupWithKeyE_1 = lookupWithKey$1(E);
            return function (m) { return lookupWithKeyE_1(k, m); };
        }
        var entries = m.entries();
        var e;
        // tslint:disable-next-line: strict-boolean-expressions
        while (!(e = entries.next()).done) {
            var _a = e.value, ka = _a[0], a = _a[1];
            if (E.equals(ka, k)) {
                return some$5([ka, a]);
            }
        }
        return none;
    };
}
// TODO: remove non-curried overloading in v3
/**
 * Lookup the value for a key in a `Map`.
 *
 * @since 2.0.0
 */
var lookup$5 = lookup$2;
// TODO: remove non-curried overloading in v3
/**
 * Test whether or not one `Map` contains all of the keys and values contained in another `Map`
 *
 * @since 2.0.0
 */
var isSubmap$1 = isSubmap;
/**
 * @category instances
 * @since 2.0.0
 */
var getEq$9 = getEq$5;
/**
 * Gets `Monoid` instance for Maps given `Semigroup` instance for their values
 *
 * @category instances
 * @since 2.0.0
 */
function getMonoid$5(SK, SA) {
    var lookupWithKeyS = lookupWithKey$1(SK);
    return {
        concat: function (mx, my) {
            if (isEmpty$6(mx)) {
                return my;
            }
            if (isEmpty$6(my)) {
                return mx;
            }
            var r = new Map(mx);
            var entries = my.entries();
            var e;
            // tslint:disable-next-line: strict-boolean-expressions
            while (!(e = entries.next()).done) {
                var _a = e.value, k = _a[0], a = _a[1];
                var mxOptA = lookupWithKeyS(k, mx);
                if (isSome(mxOptA)) {
                    r.set(mxOptA.value[0], SA.concat(mxOptA.value[1], a));
                }
                else {
                    r.set(k, a);
                }
            }
            return r;
        },
        empty: new Map()
    };
}
/**
 * Create a map with one key/value pair
 *
 * @since 2.0.0
 */
var singleton$2 = function (k, a) { return new Map([[k, a]]); };
function fromFoldable$2(E, M, F) {
    return function (fka) {
        var lookupWithKeyE = lookupWithKey$1(E);
        return F.reduce(fka, new Map(), function (b, _a) {
            var k = _a[0], a = _a[1];
            var bOpt = lookupWithKeyE(k, b);
            if (isSome(bOpt)) {
                b.set(bOpt.value[0], M.concat(bOpt.value[1], a));
            }
            else {
                b.set(k, a);
            }
            return b;
        });
    };
}
var _mapWithIndex$3 = function (fa, f) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, key = _a[0], a = _a[1];
        m.set(key, f(key, a));
    }
    return m;
};
/**
 * @category combinators
 * @since 2.10.0
 */
var partitionMapWithIndex$3 = function (f) { return function (fa) {
    var left = new Map();
    var right = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        var ei = f(k, a);
        if (isLeft(ei)) {
            left.set(k, ei.left);
        }
        else {
            right.set(k, ei.right);
        }
    }
    return separated(left, right);
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var partitionWithIndex$3 = function (p) { return function (fa) {
    var left = new Map();
    var right = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        if (p(k, a)) {
            right.set(k, a);
        }
        else {
            left.set(k, a);
        }
    }
    return separated(left, right);
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var filterMapWithIndex$3 = function (f) { return function (fa) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        var o = f(k, a);
        if (isSome(o)) {
            m.set(k, o.value);
        }
    }
    return m;
}; };
/**
 * @category combinators
 * @since 2.10.0
 */
var filterWithIndex$4 = function (p) { return function (m) {
    var out = new Map();
    var entries = m.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], a = _a[1];
        if (p(k, a)) {
            out.set(k, a);
        }
    }
    return out;
}; };
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map$5 = function (fa, f) { return _mapWithIndex$3(fa, function (_, a) { return f(a); }); };
var _filter$2 = function (fa, p) {
    return _filterWithIndex$2(fa, function (_, a) { return p(a); });
};
var _filterMap$2 = function (fa, f) { return _filterMapWithIndex$2(fa, function (_, a) { return f(a); }); };
var _partition$2 = function (fa, predicate) {
    return _partitionWithIndex$2(fa, function (_, a) { return predicate(a); });
};
var _partitionMap$2 = function (fa, f) { return _partitionMapWithIndex$2(fa, function (_, a) { return f(a); }); };
var _filterWithIndex$2 = function (fa, p) { return pipe$1(fa, filterWithIndex$4(p)); };
var _filterMapWithIndex$2 = function (fa, f) { return pipe$1(fa, filterMapWithIndex$3(f)); };
var _partitionWithIndex$2 = function (fa, p) { return pipe$1(fa, partitionWithIndex$3(p)); };
var _partitionMapWithIndex$2 = function (fa, f) {
    return pipe$1(fa, partitionMapWithIndex$3(f));
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * @category Compactable
 * @since 2.0.0
 */
var compact$3 = function (fa) {
    var m = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], oa = _a[1];
        if (isSome(oa)) {
            m.set(k, oa.value);
        }
    }
    return m;
};
/**
 * @category Filterable
 * @since 2.0.0
 */
var filter$6 = function (predicate) { return function (fa) { return _filter$2(fa, predicate); }; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var filterMap$3 = function (f) { return function (fa) {
    return _filterMap$2(fa, f);
}; };
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
var map$6 = function (f) { return function (fa) { return _map$5(fa, f); }; };
/**
 * @category FunctorWithIndex
 * @since 2.7.1
 */
var mapWithIndex$4 = function (f) { return function (fa) {
    return _mapWithIndex$3(fa, f);
}; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var partition$3 = function (predicate) { return function (fa) { return _partition$2(fa, predicate); }; };
/**
 * @category Filterable
 * @since 2.0.0
 */
var partitionMap$3 = function (f) { return function (fa) { return _partitionMap$2(fa, f); }; };
/**
 * @category Compactable
 * @since 2.0.0
 */
var separate$3 = function (fa) {
    var left = new Map();
    var right = new Map();
    var entries = fa.entries();
    var e;
    // tslint:disable-next-line: strict-boolean-expressions
    while (!(e = entries.next()).done) {
        var _a = e.value, k = _a[0], ei = _a[1];
        if (isLeft(ei)) {
            left.set(k, ei.left);
        }
        else {
            right.set(k, ei.right);
        }
    }
    return separated(left, right);
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
var URI$7 = 'Map';
/**
 * @category instances
 * @since 2.0.0
 */
function getFilterableWithIndex() {
    return {
        URI: URI$7,
        _E: undefined,
        map: _map$5,
        mapWithIndex: _mapWithIndex$3,
        compact: compact$3,
        separate: separate$3,
        filter: _filter$2,
        filterMap: _filterMap$2,
        partition: _partition$2,
        partitionMap: _partitionMap$2,
        partitionMapWithIndex: _partitionMapWithIndex$2,
        partitionWithIndex: _partitionWithIndex$2,
        filterMapWithIndex: _filterMapWithIndex$2,
        filterWithIndex: _filterWithIndex$2
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
function getWitherable$1(O) {
    var TWI = getTraversableWithIndex(O);
    return {
        URI: URI$7,
        _E: undefined,
        map: _map$5,
        compact: compact$3,
        separate: separate$3,
        filter: _filter$2,
        filterMap: _filterMap$2,
        partition: _partition$2,
        partitionMap: _partitionMap$2,
        reduce: TWI.reduce,
        foldMap: TWI.foldMap,
        reduceRight: TWI.reduceRight,
        traverse: TWI.traverse,
        sequence: TWI.sequence,
        mapWithIndex: _mapWithIndex$3,
        reduceWithIndex: TWI.reduceWithIndex,
        foldMapWithIndex: TWI.foldMapWithIndex,
        reduceRightWithIndex: TWI.reduceRightWithIndex,
        traverseWithIndex: TWI.traverseWithIndex,
        wilt: function (F) {
            var traverseF = TWI.traverse(F);
            return function (wa, f) { return F.map(traverseF(wa, f), separate$3); };
        },
        wither: function (F) {
            var traverseF = TWI.traverse(F);
            return function (wa, f) { return F.map(traverseF(wa, f), compact$3); };
        }
    };
}
/**
 * @category instances
 * @since 2.10.0
 */
var getFoldableWithIndex = function (O) {
    var keysO = keys$2(O);
    var reduceWithIndex = function (fa, b, f) {
        var out = b;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = f(k, out, fa.get(k));
        }
        return out;
    };
    var foldMapWithIndex = function (M) { return function (fa, f) {
        var out = M.empty;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = 0; i < len; i++) {
            var k = ks[i];
            out = M.concat(out, f(k, fa.get(k)));
        }
        return out;
    }; };
    var reduceRightWithIndex = function (fa, b, f) {
        var out = b;
        var ks = keysO(fa);
        var len = ks.length;
        for (var i = len - 1; i >= 0; i--) {
            var k = ks[i];
            out = f(k, fa.get(k), out);
        }
        return out;
    };
    return {
        URI: URI$7,
        _E: undefined,
        reduce: function (fa, b, f) { return reduceWithIndex(fa, b, function (_, b, a) { return f(b, a); }); },
        foldMap: function (M) {
            var foldMapWithIndexM = foldMapWithIndex(M);
            return function (fa, f) { return foldMapWithIndexM(fa, function (_, a) { return f(a); }); };
        },
        reduceRight: function (fa, b, f) { return reduceRightWithIndex(fa, b, function (_, a, b) { return f(a, b); }); },
        reduceWithIndex: reduceWithIndex,
        foldMapWithIndex: foldMapWithIndex,
        reduceRightWithIndex: reduceRightWithIndex
    };
};
/**
 * @category instances
 * @since 2.10.0
 */
var getTraversableWithIndex = function (O) {
    var FWI = getFoldableWithIndex(O);
    var keysO = keys$2(O);
    var traverseWithIndex = function (F) {
        return function (ta, f) {
            var fm = F.of(new Map());
            var ks = keysO(ta);
            var len = ks.length;
            var _loop_1 = function (i) {
                var key = ks[i];
                var a = ta.get(key);
                fm = F.ap(F.map(fm, function (m) { return function (b) { return m.set(key, b); }; }), f(key, a));
            };
            for (var i = 0; i < len; i++) {
                _loop_1(i);
            }
            return fm;
        };
    };
    var traverse = function (F) {
        var traverseWithIndexF = traverseWithIndex(F);
        return function (ta, f) { return traverseWithIndexF(ta, function (_, a) { return f(a); }); };
    };
    var sequence = function (F) {
        var traverseWithIndexF = traverseWithIndex(F);
        return function (ta) { return traverseWithIndexF(ta, function (_, a) { return a; }); };
    };
    return {
        URI: URI$7,
        _E: undefined,
        map: _map$5,
        mapWithIndex: _mapWithIndex$3,
        reduce: FWI.reduce,
        foldMap: FWI.foldMap,
        reduceRight: FWI.reduceRight,
        reduceWithIndex: FWI.reduceWithIndex,
        foldMapWithIndex: FWI.foldMapWithIndex,
        reduceRightWithIndex: FWI.reduceRightWithIndex,
        traverse: traverse,
        sequence: sequence,
        traverseWithIndex: traverseWithIndex
    };
};
/**
 * @category instances
 * @since 2.7.0
 */
var Functor$4 = {
    URI: URI$7,
    map: _map$5
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
var flap$4 = 
/*#_PURE_*/
flap$5(Functor$4);
/**
 * @category instances
 * @since 2.7.0
 */
var Compactable$2 = {
    URI: URI$7,
    compact: compact$3,
    separate: separate$3
};
/**
 * @category instances
 * @since 2.7.0
 */
var Filterable$2 = {
    URI: URI$7,
    map: _map$5,
    compact: compact$3,
    separate: separate$3,
    filter: _filter$2,
    filterMap: _filterMap$2,
    partition: _partition$2,
    partitionMap: _partitionMap$2
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use a `new Map()` instead.
 *
 * @since 2.0.0
 * @deprecated
 */
var empty$4 = new Map();
/**
 * Use [`upsertAt`](#upsertat) instead.
 *
 * @category combinators
 * @since 2.0.0
 * @deprecated
 */
var insertAt$4 = upsertAt$2;
/**
 * Use [`Filterable`](#filterable) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var map_ = Filterable$2;

var _Map = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getShow: getShow$8,
    size: size$5,
    isEmpty: isEmpty$6,
    member: member$1,
    elem: elem$6,
    keys: keys$2,
    values: values,
    collect: collect$2,
    toArray: toArray$2,
    toUnfoldable: toUnfoldable$1,
    upsertAt: upsertAt$2,
    deleteAt: deleteAt$3,
    updateAt: updateAt$3,
    modifyAt: modifyAt$3,
    pop: pop$1,
    lookupWithKey: lookupWithKey$1,
    lookup: lookup$5,
    isSubmap: isSubmap$1,
    getEq: getEq$9,
    getMonoid: getMonoid$5,
    singleton: singleton$2,
    fromFoldable: fromFoldable$2,
    partitionMapWithIndex: partitionMapWithIndex$3,
    partitionWithIndex: partitionWithIndex$3,
    filterMapWithIndex: filterMapWithIndex$3,
    filterWithIndex: filterWithIndex$4,
    compact: compact$3,
    filter: filter$6,
    filterMap: filterMap$3,
    map: map$6,
    mapWithIndex: mapWithIndex$4,
    partition: partition$3,
    partitionMap: partitionMap$3,
    separate: separate$3,
    URI: URI$7,
    getFilterableWithIndex: getFilterableWithIndex,
    getWitherable: getWitherable$1,
    getFoldableWithIndex: getFoldableWithIndex,
    getTraversableWithIndex: getTraversableWithIndex,
    Functor: Functor$4,
    flap: flap$4,
    Compactable: Compactable$2,
    Filterable: Filterable$2,
    empty: empty$4,
    insertAt: insertAt$4,
    map_: map_
});

var _Function = createCommonjsModule(function (module, exports) {
/**
 * Note that some limitations exist in the type system pertaining to
 * polymorphic (generic) functions which could impact the usage of any of the
 * functions here. All of these functions will work provided monomorphic
 * (non-generic) input functions.
 *
 * @since 0.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uncurry5 = exports.uncurry4 = exports.uncurry3 = exports.uncurry2 = exports.curry5 = exports.curry5T = exports.curry4 = exports.curry4T = exports.curry3 = exports.curry3T = exports.curry2 = exports.curry2T = exports.memoize = exports.construct = exports.until = exports.when = exports.unless = exports.ifElse = exports.guard = exports.applyTo = exports.unary = exports.withIndex = exports.flip = void 0;





/**
 * Flip the function/argument order of a curried function.
 *
 * @example
 * import { flip } from 'fp-ts-std/Function';
 *
 * const prepend = (x: string) => (y: string): string => x + y;
 * const append = flip(prepend);
 *
 * assert.strictEqual(prepend('x')('y'), 'xy');
 * assert.strictEqual(append('x')('y'), 'yx');
 *
 * @since 0.1.0
 */
const flip = (f) => (...b) => (...a) => f(...a)(...b);
exports.flip = flip;
/**
 * Given a curried function with an iterative callback, this returns a new
 * function that behaves identically except that it also supplies an index for
 * each iteration of the callback.
 *
 * @example
 * import * as A from 'fp-ts/Array';
 * import { withIndex } from 'fp-ts-std/Function';
 *
 * const mapWithIndex = withIndex<number, number, number>(A.map);
 * assert.deepStrictEqual(mapWithIndex(i => x => x + i)([1, 2, 3]), [1, 3, 5]);
 *
 * @since 0.5.0
 */
const withIndex = f => g => xs => {
    let i = 0; // eslint-disable-line functional/no-let
    return f(y => g(i++)(y))(xs);
};
exports.withIndex = withIndex;
/**
 * Converts a variadic function to a unary function.
 *
 * Whilst this isn't very useful for functions that ought to be curried,
 * it is helpful for functions which take an indefinite number of arguments
 * instead of more appropriately an array.
 *
 * @example
 * import { unary } from 'fp-ts-std/Function';
 *
 * const max = unary(Math.max);
 *
 * assert.strictEqual(max([1, 3, 2]), 3);
 *
 * @since 0.6.0
 */
const unary = (f) => (xs) => f(...xs);
exports.unary = unary;
/**
 * Apply a function, taking the data first. This can be thought of as ordinary
 * function application, but flipped.
 *
 * This is useful for applying functions point-free.
 *
 * @example
 * import { applyTo } from 'fp-ts-std/Function';
 * import { add, multiply } from 'fp-ts-std/Number';
 * import * as A from 'fp-ts/Array';
 * import { pipe, Endomorphism } from 'fp-ts/function';
 *
 * const calc: Array<Endomorphism<number>> = [add(1), multiply(2)];
 *
 * const output = pipe(calc, A.map(applyTo(5)));
 *
 * assert.deepStrictEqual(output, [6, 10]);
 *
 * @since 0.6.0
 */
const applyTo = (x) => (f) => f(x);
exports.applyTo = applyTo;
/**
 * Given an array of predicates and morphisms, returns the first morphism output
 * for which the paired predicate succeeded. If all predicates fail, the
 * fallback value is returned.
 *
 * This is analagous to Haskell's guards.
 *
 * @example
 * import { guard } from 'fp-ts-std/Function';
 * import { constant } from 'fp-ts/function';
 *
 * const numSize = guard<number, string>([
 *     [n => n > 100, n => `${n} is large!`],
 *     [n => n > 50, n => `${n} is medium.`],
 *     [n => n > 0, n => `${n} is small...`],
 * ])(n => `${n} is not a positive number.`);
 *
 * assert.strictEqual(numSize(101), '101 is large!');
 * assert.strictEqual(numSize(99), '99 is medium.');
 * assert.strictEqual(numSize(5), '5 is small...');
 * assert.strictEqual(numSize(-3), '-3 is not a positive number.');
 *
 * @since 0.6.0
 */
const guard = (branches) => (fallback) => (input) => _function.pipe(branches, _Array.map(([f, g]) => _function.flow(Option.fromPredicate(f), Option.map(g))), Monoid.concatAll(_function.getMonoid(Option.getFirstMonoid())()), exports.applyTo(input), Option.getOrElse(() => fallback(input)));
exports.guard = guard;
/**
 * Creates a function that processes the first morphism if the predicate
 * succeeds, else the second morphism.
 *
 * @example
 * import { ifElse } from 'fp-ts-std/Function';
 * import { increment, decrement } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isPositive: Predicate<number> = n => n > 0;
 * const normalise = ifElse(decrement)(increment)(isPositive);
 *
 * assert.strictEqual(normalise(-3), -2);
 * assert.strictEqual(normalise(3), 2);
 *
 * @since 0.6.0
 */
const ifElse = (onTrue) => (onFalse) => (f) => (x) => (f(x) ? onTrue(x) : onFalse(x));
exports.ifElse = ifElse;
/**
 * Runs the provided morphism on the input value if the predicate fails.
 *
 * @example
 * import { unless } from 'fp-ts-std/Function';
 * import { increment } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const ensureEven = unless(isEven)(increment);
 *
 * assert.strictEqual(ensureEven(1), 2);
 * assert.strictEqual(ensureEven(2), 2);
 *
 * @since 0.6.0
 */
const unless = (f) => (onFalse) => x => (f(x) ? x : onFalse(x));
exports.unless = unless;
/**
 * Runs the provided morphism on the input value if the predicate holds.
 *
 * @example
 * import { when } from 'fp-ts-std/Function';
 * import { increment } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const ensureOdd = when(isEven)(increment);
 *
 * assert.strictEqual(ensureOdd(1), 1);
 * assert.strictEqual(ensureOdd(2), 3);
 *
 * @since 0.6.0
 */
exports.when = _function.flow(_function.not, exports.unless);
/**
 * Yields the result of applying the morphism to the input until the predicate
 * holds.
 *
 * @example
 * import { until } from 'fp-ts-std/Function';
 * import { increment } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isOver100: Predicate<number> = n => n > 100;
 * const doubleUntilOver100 = until(isOver100)(n => n * 2);
 *
 * assert.strictEqual(doubleUntilOver100(1), 128);
 *
 * @since 0.6.0
 */
const until = (f) => (g) => {
    const h = x => (f(x) ? x : h(g(x)));
    return h;
};
exports.until = until;
/**
 * Wraps a constructor function for functional invocation.
 *
 * @example
 * import { construct } from 'fp-ts-std/Function';
 *
 * const mkURL = construct(URL);
 *
 * const xs: [string, string] = ['/x/y/z.html', 'https://samhh.com'];
 *
 * assert.deepStrictEqual(mkURL(xs), new URL(...xs));
 *
 * @since 0.7.0
 */
const construct = (x) => (xs) => new x(...xs);
exports.construct = construct;
/**
 * Given a function and an `Eq` instance for determining input equivalence,
 * returns a new function that caches the result of applying an input to said
 * function. If the cache hits, the cached value is returned and the function
 * is not called again. Useful for expensive computations.
 *
 * Provided the input function is pure, this function is too.
 *
 * The cache is implemented as a simple `Map`. There is no mechanism by which
 * cache entries can be cleared from memory.
 *
 * @example
 * import { memoize } from 'fp-ts-std/Function';
 * import { add } from 'fp-ts-std/Number';
 * import { eqNumber } from 'fp-ts/Eq';
 *
 * let runs = 0;
 * const f = memoize(eqNumber)<number>(n => {
 *     runs++;
 *     return add(5)(n);
 * });
 *
 * assert.strictEqual(runs, 0);
 * assert.strictEqual(f(2), 7);
 * assert.strictEqual(runs, 1);
 * assert.strictEqual(f(2), 7);
 * assert.strictEqual(runs, 1);
 *
 * @since 0.7.0
 */
const memoize = (eq) => (f) => {
    const cache = new Map();
    return k => {
        const cached = _Map.lookup(eq)(k)(cache);
        if (Option.isSome(cached))
            return cached.value; // eslint-disable-line functional/no-conditional-statement
        const val = f(k);
        cache.set(k, val); // eslint-disable-line functional/no-expression-statement
        return val;
    };
};
exports.memoize = memoize;
/**
 * Curry a function with binary tuple input.
 *
 * @example
 * import { curry2T } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat2 = ([a, b]: [string, string]): string =>
 *      a + b;
 * assert.strictEqual(curry2T(concat2)('a')('b'), concat2(['a', 'b']));
 *
 * @since 0.7.0
 */
const curry2T = (f) => (a) => (b) => f([a, b]);
exports.curry2T = curry2T;
/**
 * Curry a function with binary input.
 *
 * @example
 * import { curry2 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat2 = (a: string, b: string): string =>
 *      a + b;
 * assert.strictEqual(curry2(concat2)('a')('b'), concat2('a', 'b'));
 *
 * @since 0.7.0
 */
exports.curry2 = _function.flow(exports.unary, exports.curry2T);
/**
 * Curry a function with ternary tuple input.
 *
 * @example
 * import { curry3T } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat3 = ([a, b, c]: [string, string, string]): string =>
 *      a + b + c;
 * assert.strictEqual(curry3T(concat3)('a')('b')('c'), concat3(['a', 'b', 'c']));
 *
 * @since 0.7.0
 */
const curry3T = (f) => (a) => (b) => (c) => f([a, b, c]);
exports.curry3T = curry3T;
/**
 * Curry a function with ternary input.
 *
 * @example
 * import { curry3 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat3 = (a: string, b: string, c: string): string =>
 *      a + b + c;
 * assert.strictEqual(curry3(concat3)('a')('b')('c'), concat3('a', 'b', 'c'));
 *
 * @since 0.7.0
 */
exports.curry3 = _function.flow(exports.unary, exports.curry3T);
/**
 * Curry a function with quaternary tuple input.
 *
 * @example
 * import { curry4T } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat4 = ([a, b, c, d]: [string, string, string, string]): string =>
 *      a + b + c + d;
 * assert.strictEqual(curry4T(concat4)('a')('b')('c')('d'), concat4(['a', 'b', 'c', 'd']));
 *
 * @since 0.7.0
 */
const curry4T = (f) => (a) => (b) => (c) => (d) => f([a, b, c, d]);
exports.curry4T = curry4T;
/**
 * Curry a function with quaternary input.
 *
 * @example
 * import { curry4 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat4 = (a: string, b: string, c: string, d: string): string =>
 *      a + b + c + d;
 * assert.strictEqual(curry4(concat4)('a')('b')('c')('d'), concat4('a', 'b', 'c', 'd'));
 *
 * @since 0.7.0
 */
exports.curry4 = _function.flow(exports.unary, exports.curry4T);
/**
 * Curry a function with quinary tuple input.
 *
 * @example
 * import { curry5T } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat5 = ([a, b, c, d, e]: [string, string, string, string, string]): string =>
 *      a + b + c + d + e;
 * assert.strictEqual(curry5T(concat5)('a')('b')('c')('d')('e'), concat5(['a', 'b', 'c', 'd', 'e']));
 *
 * @since 0.7.0
 */
const curry5T = (f) => (a) => (b) => (c) => (d) => (e) => f([a, b, c, d, e]);
exports.curry5T = curry5T;
/**
 * Curry a function with quinary input.
 *
 * @example
 * import { curry5 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat5 = (a: string, b: string, c: string, d: string, e: string): string =>
 *      a + b + c + d + e;
 * assert.strictEqual(curry5(concat5)('a')('b')('c')('d')('e'), concat5('a', 'b', 'c', 'd', 'e'));
 *
 * @since 0.7.0
 */
exports.curry5 = _function.flow(exports.unary, exports.curry5T);
/**
 * Uncurry a binary function.
 *
 * @example
 * import { uncurry2 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat2 = (a: string): Endomorphism<string> => b =>
 *      a + b;
 * assert.strictEqual(uncurry2(concat2)(['a', 'b']), concat2('a')('b'));
 *
 * @since 0.7.0
 */
const uncurry2 = (f) => ([a, b]) => f(a)(b);
exports.uncurry2 = uncurry2;
/**
 * Uncurry a ternary function.
 *
 * @example
 * import { uncurry3 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat3 = (a: string) => (b: string): Endomorphism<string> => c =>
 *      a + b + c;
 * assert.strictEqual(uncurry3(concat3)(['a', 'b', 'c']), concat3('a')('b')('c'));
 *
 * @since 0.7.0
 */
const uncurry3 = (f) => ([a, b, c,]) => f(a)(b)(c);
exports.uncurry3 = uncurry3;
/**
 * Uncurry a quaternary function.
 *
 * @example
 * import { uncurry4 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat4 = (a: string) => (b: string) => (c: string): Endomorphism<string> => d =>
 *      a + b + c + d;
 * assert.strictEqual(uncurry4(concat4)(['a', 'b', 'c', 'd']), concat4('a')('b')('c')('d'));
 *
 * @since 0.7.0
 */
const uncurry4 = (f) => ([a, b, c, d]) => f(a)(b)(c)(d);
exports.uncurry4 = uncurry4;
/**
 * Uncurry a quinary function.
 *
 * @example
 * import { uncurry5 } from 'fp-ts-std/Function';
 * import { Endomorphism } from 'fp-ts/function';
 *
 * const concat5 = (a: string) => (b: string) => (c: string) => (d: string): Endomorphism<string> => e =>
 *      a + b + c + d + e;
 * assert.strictEqual(uncurry5(concat5)(['a', 'b', 'c', 'd', 'e']), concat5('a')('b')('c')('d')('e'));
 *
 * @since 0.7.0
 */
const uncurry5 = (f) => ([a, b, c, d, e]) => f(a)(b)(c)(d)(e);
exports.uncurry5 = uncurry5;
});

var _Array$1 = createCommonjsModule(function (module, exports) {
/**
 * Various functions to aid in working with arrays.
 *
 * @since 0.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.maximum = exports.minimum = exports.reduceRightWhile = exports.reduceWhile = exports.symmetricDifference = exports.takeRightWhile = exports.transpose = exports.dropAt = exports.dropRightWhile = exports.countBy = exports.moveTo = exports.moveFrom = exports.reject = exports.slice = exports.aperture = exports.median = exports.mean = exports.product = exports.sum = exports.cartesian = exports.without = exports.endsWith = exports.startsWith = exports.dropRepeats = exports.insertMany = exports.upsert = exports.pluckFirst = exports.getDisorderedEq = exports.join = exports.none = exports.elemFlipped = void 0;











/**
 * Like `fp-ts/Array::elem`, but flipped.
 *
 * @example
 * import { elemFlipped } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq';
 *
 * const isLowerVowel = elemFlipped(eqString)(['a', 'e', 'i', 'o', 'u']);
 *
 * assert.strictEqual(isLowerVowel('a'), true);
 * assert.strictEqual(isLowerVowel('b'), false);
 *
 * @since 0.1.0
 */
const elemFlipped = (eq) => (xs) => y => _Array.elem(eq)(y)(xs);
exports.elemFlipped = elemFlipped;
/**
 * Check if a predicate does not hold for any array member.
 *
 * @example
 * import { none } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isFive: Predicate<number> = n => n === 5;
 * const noneAreFive = none(isFive);
 *
 * assert.strictEqual(noneAreFive([4, 4, 4]), true);
 * assert.strictEqual(noneAreFive([4, 5, 4]), false);
 *
 * @since 0.7.0
 */
exports.none = _function.flow(_function.not, _Array.every);
/**
 * Join an array of strings together into a single string using the supplied
 * separator.
 *
 * @example
 * import { join } from 'fp-ts-std/Array';
 *
 * const commaSepd = join(',');
 *
 * assert.strictEqual(commaSepd([]), '');
 * assert.strictEqual(commaSepd(['a']), 'a');
 * assert.strictEqual(commaSepd(['a', 'b', 'c']), 'a,b,c');
 *
 * @since 0.1.0
 */
const join = (x) => (ys) => ys.join(x);
exports.join = join;
/**
 * Like `fp-ts/Array::getEq`, but items are not required to be in the same
 * order to determine equivalence. This function is therefore less efficient,
 * and `getEq` should be preferred on ordered data.
 *
 * @example
 * import { getEq } from 'fp-ts/Array';
 * import { getDisorderedEq } from 'fp-ts-std/Array';
 * import { ordNumber } from 'fp-ts/Ord';
 *
 * const f = getEq(ordNumber);
 * const g = getDisorderedEq(ordNumber);
 *
 * assert.strictEqual(f.equals([1, 2, 3], [1, 3, 2]), false);
 * assert.strictEqual(g.equals([1, 2, 3], [1, 3, 2]), true);
 *
 * @since 0.1.0
 */
const getDisorderedEq = (ordA) => ({
    equals: (xs, ys) => {
        const sort = _Array.sort(ordA);
        return _Array.getEq(ordA).equals(sort(xs), sort(ys));
    },
});
exports.getDisorderedEq = getDisorderedEq;
/**
 * Pluck the first item out of an array matching a predicate. Any further
 * matches will be left untouched.
 *
 * This can be thought of as analagous to `fp-ts/Array::findFirst` where
 * the remaining items, sans the match (if any), are returned as well.
 *
 * @example
 * import { pluckFirst } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isOverFive: Predicate<number> = n => n > 5;
 * const pluckFirstOverFive = pluckFirst(isOverFive);
 *
 * assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5]), [O.none, [1, 3, 5]]);
 * assert.deepStrictEqual(pluckFirstOverFive([1, 3, 5, 7, 9]), [O.some(7), [1, 3, 5, 9]]);
 *
 * @since 0.1.0
 */
const pluckFirst = (p) => (xs) => _function.pipe(_Array.findIndex(p)(xs), Option.fold(_function.constant([Option.none, xs]), i => [
    Option.some(xs[i]),
    _Array.unsafeDeleteAt(i, xs),
]));
exports.pluckFirst = pluckFirst;
/**
 * Update an item in an array or, if it's not present yet, insert it.
 *
 * If the item exists more than once (as determined by the supplied `Eq`
 * instance), only the first to be found will be updated. The order in which
 * the array is checked is unspecified.
 *
 * @example
 * import { upsert } from 'fp-ts-std/Array';
 * import { eqString, contramap } from 'fp-ts/Eq';
 *
 * type Account = {
 *     id: string;
 *     name: string;
 * };
 *
 * const eqAccount = contramap<string, Account>(acc => acc.id)(eqString);
 *
 * const accounts: Array<Account> = [{
 *     id: 'a',
 *     name: 'an account',
 * }, {
 *     id: 'b',
 *     name: 'another account',
 * }];
 *
 * const created: Account = {
 *     id: 'c',
 *     name: 'yet another account',
 * };
 *
 * const updated: Account = {
 *     id: 'b',
 *     name: 'renamed account name',
 * };
 *
 * const upsertAccount = upsert(eqAccount);
 *
 * assert.deepStrictEqual(upsertAccount(created)(accounts), [accounts[0], accounts[1], created]);
 * assert.deepStrictEqual(upsertAccount(updated)(accounts), [accounts[0], updated]);
 *
 * @since 0.1.0
 */
const upsert = (eqA) => (x) => (ys) => _function.pipe(_Array.findIndex(y => eqA.equals(x, y))(ys), Option.map(i => _Array.unsafeUpdateAt(i, x, ys)), Option.chain(NonEmptyArray.fromArray), Option.getOrElse(() => _Array.append(x)(ys)));
exports.upsert = upsert;
/**
 * Insert all the elements of an array into another array at the specified
 * index. Returns `None` if the index is out of bounds.
 *
 * The array of elements to insert must be non-empty.
 *
 * @example
 * import { insertMany } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 *
 * const f = insertMany(1)(['a', 'b']);
 * assert.deepStrictEqual(f([]), O.none);
 * assert.deepStrictEqual(f(['x']), O.some(['x', 'a', 'b']));
 * assert.deepStrictEqual(f(['x', 'y']), O.some(['x', 'a', 'b', 'y']));
 *
 * @since 0.5.0
 */
const insertMany = (i) => (xs) => (ys) => _function.pipe(xs, _Array.reverse, Foldable$4.reduceM(Option.Monad, _Array.Foldable)(ys, (zs, x) => _function.pipe(zs, _Array.insertAt(i, x))), Option.chain(NonEmptyArray.fromArray));
exports.insertMany = insertMany;
/**
 * Filter a list, removing any elements that repeat that directly preceding
 * them.
 *
 * @example
 * import { dropRepeats } from 'fp-ts-std/Array';
 * import { eqNumber } from 'fp-ts/Eq'
 *
 * assert.deepStrictEqual(dropRepeats(eqNumber)([1, 2, 2, 3, 2, 4, 4]), [1, 2, 3, 2, 4]);
 *
 * @since 0.6.0
 */
const dropRepeats = eq => xs => _function.pipe(xs, _Array.filterWithIndex((i, x) => i === 0 || !eq.equals(x, xs[i - 1])));
exports.dropRepeats = dropRepeats;
/**
 * Check if an array starts with the specified subarray.
 *
 * @example
 * import { startsWith } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq'
 *
 * const startsXyz = startsWith(eqString)(['x', 'y', 'z']);
 *
 * assert.strictEqual(startsXyz(['x', 'y', 'z', 'a']), true);
 * assert.strictEqual(startsXyz(['a', 'x', 'y', 'z']), false);
 *
 * @since 0.7.0
 */
const startsWith = (eq) => (start) => _function.flow(_Array.takeLeft(start.length), xs => _Array.getEq(eq).equals(xs, start));
exports.startsWith = startsWith;
/**
 * Check if an array ends with the specified subarray.
 *
 * @example
 * import { endsWith } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq'
 *
 * const endsXyz = endsWith(eqString)(['x', 'y', 'z']);
 *
 * assert.strictEqual(endsXyz(['a', 'x', 'y', 'z']), true);
 * assert.strictEqual(endsXyz(['a', 'x', 'b', 'z']), false);
 *
 * @since 0.6.0
 */
const endsWith = (eq) => (end) => _function.flow(_Array.takeRight(end.length), xs => _Array.getEq(eq).equals(xs, end));
exports.endsWith = endsWith;
/**
 * Returns a new array without the values present in the first input array.
 *
 * @example
 * import { without } from 'fp-ts-std/Array';
 * import { eqNumber } from 'fp-ts/Eq';
 *
 * const withoutFourOrFive = without(eqNumber)([4, 5]);
 *
 * assert.deepStrictEqual(withoutFourOrFive([3, 4]), [3]);
 * assert.deepStrictEqual(withoutFourOrFive([4, 5]), []);
 * assert.deepStrictEqual(withoutFourOrFive([4, 5, 6]), [6]);
 * assert.deepStrictEqual(withoutFourOrFive([3, 4, 5, 6]), [3, 6]);
 * assert.deepStrictEqual(withoutFourOrFive([4, 3, 4, 5, 6, 5]), [3, 6]);
 *
 * @since 0.6.0
 */
const without = (eq) => (xs) => _function.flow(_Array.filter(y => !_Array.elem(eq)(y)(xs)));
exports.without = without;
/**
 * Returns the {@link https://en.wikipedia.org/wiki/Cartesian_product Cartesian product}
 * of two arrays. In other words, returns an array containing tuples of every
 * possible ordered combination of the two input arrays.
 *
 * @example
 * import { cartesian } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(
 *     cartesian([1, 2])(['a', 'b', 'c']),
 *     [[1, 'a'], [1, 'b'], [1, 'c'], [2, 'a'], [2, 'b'], [2, 'c']],
 * );
 *
 * @since 0.6.0
 */
const cartesian = (xs) => (ys) => _function.pipe(xs, _Array.chain(x => _function.pipe(ys, _Array.map(y => [x, y]))));
exports.cartesian = cartesian;
/**
 * Adds together all the numbers in the input array.
 *
 * @example
 * import { sum } from 'fp-ts-std/Array';
 *
 * assert.strictEqual(sum([]), 0);
 * assert.strictEqual(sum([25, 3, 10]), 38);
 *
 * @since 0.6.0
 */
exports.sum = Monoid.concatAll(number.MonoidSum);
/**
 * Multiplies together all the numbers in the input array.
 *
 * @example
 * import { product } from 'fp-ts-std/Array';
 *
 * assert.strictEqual(product([]), 1);
 * assert.strictEqual(product([5]), 5);
 * assert.strictEqual(product([4, 2, 3]), 24);
 *
 * @since 0.6.0
 */
exports.product = Monoid.concatAll(number.MonoidProduct);
/**
 * Calculate the mean of an array of numbers.
 *
 * @example
 * import { mean } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(mean([2, 7, 9]), 6);
 *
 * @since 0.7.0
 */
const mean = (xs) => exports.sum(xs) / xs.length;
exports.mean = mean;
/**
 * Calculate the median of an array of numbers.
 *
 * @example
 * import { median } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(median([2, 9, 7]), 7);
 * assert.deepStrictEqual(median([7, 2, 10, 9]), 8);
 *
 * @since 0.7.0
 */
exports.median = _function.flow(NonEmptyArray.sort(number.Ord), xs => {
    const i = xs.length / 2;
    return i % 1 === 0 ? (xs[i - 1] + xs[i]) / 2 : xs[Math.floor(i)];
});
/**
 * Returns an array of tuples of the specified length occupied by consecutive
 * elements.
 *
 * If `n` is not a positive number, an empty array is returned.
 *
 * If `n` is greater than the length of the array, an empty array is returned.
 *
 * @example
 * import { aperture } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(aperture(1)([1, 2, 3, 4]), [[1], [2], [3], [4]]);
 * assert.deepStrictEqual(aperture(2)([1, 2, 3, 4]), [[1, 2], [2, 3], [3, 4]]);
 * assert.deepStrictEqual(aperture(3)([1, 2, 3, 4]), [[1, 2, 3], [2, 3, 4]]);
 * assert.deepStrictEqual(aperture(4)([1, 2, 3, 4]), [[1, 2, 3, 4]]);
 *
 * @since 0.7.0
 */
const aperture = (n) => (xs) => {
    const go = (i) => (ys) => i + n > xs.length ? ys : go(i + 1)(_Array.append(exports.slice(i)(n + i)(xs))(ys));
    return n < 1 ? [] : go(0)([]);
};
exports.aperture = aperture;
/**
 * Returns the elements of the array between the start index (inclusive) and the
 * end index (exclusive).
 *
 * This is merely a functional wrapper around `Array.prototype.slice`.
 *
 * @example
 * import { slice } from 'fp-ts-std/Array';
 *
 * const xs = ['a', 'b', 'c', 'd'];
 *
 * assert.deepStrictEqual(slice(1)(3)(xs), ['b', 'c']);
 * assert.deepStrictEqual(slice(1)(Infinity)(xs), ['b', 'c', 'd']);
 * assert.deepStrictEqual(slice(0)(-1)(xs), ['a', 'b', 'c']);
 * assert.deepStrictEqual(slice(-3)(-1)(xs), ['b', 'c']);
 *
 * @since 0.7.0
 */
const slice = (start) => (end) => (xs) => xs.slice(start, end);
exports.slice = slice;
/**
 * Filters out items in the array for which the predicate holds. This can be
 * thought of as the inverse of ordinary array filtering.
 *
 * @example
 * import { reject } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 *
 * assert.deepStrictEqual(reject(isEven)([1, 2, 3, 4]), [1, 3]);
 *
 * @since 0.7.0
 */
const reject = (f) => _Array.filter(_function.not(f));
exports.reject = reject;
/**
 * Move an item at index `from` to index `to`. See also `moveTo`.
 *
 * If either index is out of bounds, `None` is returned.
 *
 * If both indices are the same, the array is returned unchanged.
 *
 * @example
 * import { moveFrom } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(moveFrom(0)(1)(['a', 'b', 'c']), O.some(['b', 'a', 'c']));
 * assert.deepStrictEqual(moveFrom(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']));
 * assert.deepStrictEqual(moveFrom(0)(0)([]), O.none);
 * assert.deepStrictEqual(moveFrom(0)(1)(['a']), O.none);
 * assert.deepStrictEqual(moveFrom(1)(0)(['a']), O.none);
 *
 * @since 0.7.0
 */
const moveFrom = (from) => (to) => (xs) => from >= xs.length || to >= xs.length
    ? Option.none
    : from === to
        ? Option.some(xs)
        : _function.pipe(xs, _Array.lookup(from), Option.chain(x => _function.pipe(_Array.deleteAt(from)(xs), Option.chain(_Array.insertAt(to, x)))));
exports.moveFrom = moveFrom;
/**
 * Move an item at index `from` to index `to`. See also `moveFrom`.
 *
 * If either index is out of bounds, `None` is returned.
 *
 * If both indices are the same, the array is returned unchanged.
 *
 * @example
 * import { moveTo } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(moveTo(1)(0)(['a', 'b', 'c']), O.some(['b', 'a', 'c']));
 * assert.deepStrictEqual(moveTo(1)(1)(['a', 'b', 'c']), O.some(['a', 'b', 'c']));
 * assert.deepStrictEqual(moveTo(0)(0)([]), O.none);
 * assert.deepStrictEqual(moveTo(0)(1)(['a']), O.none);
 * assert.deepStrictEqual(moveTo(1)(0)(['a']), O.none);
 *
 * @since 0.7.0
 */
exports.moveTo = _Function.flip(exports.moveFrom);
/**
 * Map each item of an array to a key, and count how many map to each key.
 *
 * @example
 * import { countBy } from 'fp-ts-std/Array';
 * import { toLower } from 'fp-ts-std/String';
 *
 * const f = countBy(toLower);
 * const xs = ['A', 'b', 'C', 'a', 'e', 'A'];
 *
 * assert.deepStrictEqual(f(xs), { a: 3, b: 1, c: 1, e: 1 });
 *
 * @since 0.7.0
 */
const countBy = (f) => (xs) => Record.fromFoldableMap(number.MonoidSum, _Array.Foldable)(xs, x => [f(x), 1]);
exports.countBy = countBy;
/**
 * Remove the longest initial subarray from the end of the input array for
 * which all elements satisfy the specified predicate, creating a new array.
 *
 * @example
 * import { dropRightWhile } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const dropRightEvens = dropRightWhile(isEven);
 *
 * assert.deepStrictEqual(dropRightEvens([6, 7, 3, 4, 2]), [6, 7, 3]);
 *
 * @since 0.7.0
 */
const dropRightWhile = (f) => _function.flow(_Array.reverse, _Array.dropLeftWhile(f), _Array.reverse);
exports.dropRightWhile = dropRightWhile;
/**
 * Drop a number of elements from the specified index an array, returning a
 * new array.
 *
 * If `i` is out of bounds, `None` will be returned.
 *
 * If `i` is a float, it will be rounded down to the nearest integer.
 *
 * If `n` is larger than the available number of elements from the provided
 * index, only the elements prior to said index will be returned.
 *
 * If `n` is not a positive number, the array will be returned whole.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { dropAt } from 'fp-ts-std/Array';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(dropAt(2)(0)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b', 'c', 'd', 'e', 'f', 'g']));
 * assert.deepStrictEqual(dropAt(2)(3)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b', 'f', 'g']));
 * assert.deepStrictEqual(dropAt(2)(Infinity)(['a', 'b', 'c', 'd', 'e', 'f', 'g']), O.some(['a', 'b']));
 *
 * @since 0.3.0
 */
const dropAt = (i) => (n) => (xs) => _function.pipe(_Array.isOutOfBound(i, xs), boolean.fold(() => _function.pipe(_Array.copy(xs), ys => {
    // eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
    ys.splice(i, n);
    return ys;
}, Option.some), _function.constant(Option.none)));
exports.dropAt = dropAt;
/**
 * Tranposes the rows and columns of a 2D list. If some of the rows are shorter
 * than the following rows, their elements are skipped.
 *
 * @example
 * import { transpose } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
 * assert.deepStrictEqual(transpose([[1, 4], [2, 5], [3, 6]]), [[1, 2, 3], [4, 5, 6]]);
 * assert.deepStrictEqual(transpose([[10, 11], [20], [], [30, 31,32]]), [[10, 20, 30], [11, 31], [32]]);
 *
 * @since 0.7.0
 */
const transpose = (xs) => {
    /* eslint-disable functional/no-conditional-statement */
    if (_Array.isEmpty(xs))
        return [];
    if (_Array.isEmpty(xs[0]))
        return exports.transpose(_Array.dropLeft(1)(xs));
    /* eslint-enable functional/no-conditional-statement */
    const [[y, ...ys], ...yss] = xs;
    const zs = [y, ..._Array.filterMap(_Array.head)(yss)];
    const zss = [ys, ..._Array.map(_Array.dropLeft(1))(yss)];
    return [zs, ...exports.transpose(zss)];
};
exports.transpose = transpose;
/**
 * Calculate the longest initial subarray from the end of the input array for
 * which all elements satisfy the specified predicate, creating a new array.
 *
 * @example
 * import { takeRightWhile } from 'fp-ts-std/Array';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const takeRightEvens = takeRightWhile(isEven);
 *
 * assert.deepStrictEqual(takeRightEvens([6, 7, 3, 4, 2]), [4, 2]);
 *
 * @since 0.7.0
 */
const takeRightWhile = (f) => _function.flow(_Array.reverse, _Array.takeLeftWhile(f), _Array.reverse);
exports.takeRightWhile = takeRightWhile;
/**
 * Creates an array of all values which are present in one of the two input
 * arrays, but not both. The order is determined by the input arrays and
 * duplicate values present only in one input array are maintained.
 *
 * @example
 * import { symmetricDifference } from 'fp-ts-std/Array';
 * import { eqNumber } from 'fp-ts/Eq';
 *
 * assert.deepStrictEqual(symmetricDifference(eqNumber)([1, 2, 3, 4])([3, 4, 5, 6]), [1, 2, 5, 6]);
 * assert.deepStrictEqual(symmetricDifference(eqNumber)([1, 7, 7, 4, 3])([3, 4, 9, 6]), [1, 7, 7, 9, 6]);
 *
 * @since 0.7.0
 */
const symmetricDifference = (eq) => (xs) => ys => _Array.getMonoid().concat(_Array.difference(eq)(ys)(xs), _Array.difference(eq)(xs)(ys));
exports.symmetricDifference = symmetricDifference;
/**
 * Like ordinary array reduction, however this also takes a predicate that is
 * evaluated before each step. If the predicate doesn't hold, the reduction
 * short-circuits and returns the current accumulator value.
 *
 * @example
 * import { reduceWhile } from 'fp-ts-std/Array';
 * import { add } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const reduceUntilOdd = reduceWhile(isEven);
 *
 * assert.strictEqual(reduceUntilOdd(add)(0)([2, 4, 6, 9, 10]), 12);
 *
 * @since 0.8.0
 */
const reduceWhile = (p) => (f) => {
    const go = (acc) => (ys) => _function.pipe(NonEmptyArray.fromArray(ys), Option.filter(_function.flow(NonEmptyArray.head, p)), Option.fold(_function.constant(acc), _function.flow(NonEmptyArray.unprepend, ([z, zs]) => go(f(z)(acc))(zs))));
    return go;
};
exports.reduceWhile = reduceWhile;
/**
 * Like ordinary array reduction, however this also takes a predicate that is
 * evaluated before each step. If the predicate doesn't hold, the reduction
 * short-circuits and returns the current accumulator value.
 *
 * @example
 * import { reduceRightWhile } from 'fp-ts-std/Array';
 * import { add } from 'fp-ts-std/Number';
 * import { Predicate } from 'fp-ts/function';
 *
 * const isEven: Predicate<number> = n => n % 2 === 0;
 * const reduceRightUntilOdd = reduceRightWhile(isEven);
 *
 * assert.strictEqual(reduceRightUntilOdd(add)(0)([2, 4, 7, 8, 10]), 18);
 *
 * @since 0.8.0
 */
const reduceRightWhile = (p) => (f) => (x) => _function.flow(_Array.reverse, exports.reduceWhile(p)(f)(x));
exports.reduceRightWhile = reduceRightWhile;
/**
 * Obtain the minimum value from a non-empty array.
 *
 * @example
 * import { minimum } from 'fp-ts-std/Array';
 * import { ordNumber } from 'fp-ts/Ord';
 *
 * assert.strictEqual(minimum(ordNumber)([2, 3, 1, 5, 4]), 1);
 *
 * @since 0.9.0
 */
exports.minimum = _function.flow(Semigroup.min, NonEmptyArray.concatAll);
/**
 * Obtain the maximum value from a non-empty array.
 *
 * @example
 * import { maximum } from 'fp-ts-std/Array';
 * import { ordNumber } from 'fp-ts/Ord';
 *
 * assert.strictEqual(maximum(ordNumber)([2, 3, 1, 5, 4]), 5);
 *
 * @since 0.9.0
 */
exports.maximum = _function.flow(Semigroup.max, NonEmptyArray.concatAll);
/**
 * Append two arrays in terms of a semigroup. In effect, a functional wrapper
 * around `Array.prototype.concat`.
 *
 * @example
 * import { concat } from 'fp-ts-std/Array';
 *
 * assert.deepStrictEqual(concat([1, 2])([3, 4]), [1, 2, 3, 4]);
 *
 * @since 0.9.0
 */
const concat = (xs) => ys => _Array.getMonoid().concat(xs, ys);
exports.concat = concat;
});

var _String = createCommonjsModule(function (module, exports) {
/**
 * Various functions to aid in working with strings.
 *
 * @since 0.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeRightWhile = exports.takeLeftWhile = exports.toLower = exports.toUpper = exports.lookup = exports.init = exports.last = exports.tail = exports.head = exports.dropRightWhile = exports.dropLeftWhile = exports.dropRight = exports.dropLeft = exports.replaceAll = exports.replace = exports.test = exports.unlines = exports.lines = exports.reverse = exports.under = exports.split = exports.matchAll = exports.match = exports.takeRight = exports.takeLeft = exports.slice = exports.unsurround = exports.surround = exports.unappend = exports.append = exports.unprepend = exports.prepend = exports.endsWith = exports.startsWith = exports.trimRight = exports.trimLeft = exports.trim = exports.contains = exports.isString = exports.fromNumber = void 0;








/**
 * Convert a number to a string.
 *
 * @example
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.strictEqual(fromNumber(3), '3');
 *
 * @since 0.1.0
 */
const fromNumber = (x) => String(x);
exports.fromNumber = fromNumber;
/**
 * Refine a foreign value to a string.
 *
 * @example
 * import { isString } from 'fp-ts-std/String';
 *
 * assert.strictEqual(isString('3'), true);
 * assert.strictEqual(isString(3), false);
 *
 * @since 0.1.0
 */
const isString = (x) => typeof x === "string";
exports.isString = isString;
/**
 * Check if a string contains a given substring.
 *
 * @example
 * import { contains } from 'fp-ts-std/String';
 *
 * const f = contains('abc');
 *
 * assert.strictEqual(f('abc'), true);
 * assert.strictEqual(f('ABC'), false);
 * assert.strictEqual(f('xabcy'), true);
 * assert.strictEqual(f('xaycz'), false);
 *
 * @since 0.1.0
 */
const contains = (substring) => target => target.includes(substring);
exports.contains = contains;
/**
 * Trim both sides of a string.
 *
 * @example
 * import { trim } from 'fp-ts-std/String';
 *
 * assert.strictEqual(trim(' abc '), 'abc');
 *
 * @since 0.1.0
 */
const trim = x => x.trim();
exports.trim = trim;
/**
 * Trim the left side of a string.
 *
 * @example
 * import { trimLeft } from 'fp-ts-std/String';
 *
 * assert.strictEqual(trimLeft(' abc '), 'abc ');
 *
 * @since 0.1.0
 */
const trimLeft = x => x.trimLeft();
exports.trimLeft = trimLeft;
/**
 * Trim the right side of a string.
 *
 * @example
 * import { trimRight } from 'fp-ts-std/String';
 *
 * assert.strictEqual(trimRight(' abc '), ' abc');
 *
 * @since 0.1.0
 */
const trimRight = x => x.trimRight();
exports.trimRight = trimRight;
/**
 * Check if a string starts with the specified substring.
 *
 * @example
 * import { startsWith } from 'fp-ts-std/String';
 *
 * const isHttps = startsWith('https://');
 *
 * assert.strictEqual(isHttps('https://samhh.com'), true);
 * assert.strictEqual(isHttps('http://samhh.com'), false);
 *
 * @since 0.3.0
 */
const startsWith = (substring) => y => y.startsWith(substring);
exports.startsWith = startsWith;
/**
 * Check if a string ends with the specified substring.
 *
 * @example
 * import { endsWith } from 'fp-ts-std/String';
 *
 * const isHaskell = endsWith('.hs');
 *
 * assert.strictEqual(isHaskell('File.hs'), true);
 * assert.strictEqual(isHaskell('File.rs'), false);
 *
 * @since 0.3.0
 */
const endsWith = (substring) => y => y.endsWith(substring);
exports.endsWith = endsWith;
/**
 * Prepend one string to another.
 *
 * @example
 * import { prepend } from 'fp-ts-std/String';
 *
 * const prependShell = prepend('$ ');
 *
 * assert.strictEqual(prependShell('abc'), '$ abc');
 *
 * @since 0.1.0
 */
const prepend = (prepended) => rest => prepended + rest;
exports.prepend = prepend;
/**
 * Remove the beginning of a string, if it exists.
 *
 * @example
 * import { unprepend } from 'fp-ts-std/String';
 *
 * const unprependShell = unprepend('$ ');
 *
 * assert.strictEqual(unprependShell('$ abc'), 'abc');
 *
 * @since 0.1.0
 */
const unprepend = (start) => val => val.startsWith(start) ? val.substring(start.length) : val;
exports.unprepend = unprepend;
/**
 * Append one string to another.
 *
 * @example
 * import { append } from 'fp-ts-std/String';
 *
 * const withExt = append('.hs');
 *
 * assert.strictEqual(withExt('File'), 'File.hs');
 *
 * @since 0.1.0
 */
const append = (appended) => rest => rest + appended;
exports.append = append;
/**
 * Remove the end of a string, if it exists.
 *
 * @example
 * import { unappend } from 'fp-ts-std/String';
 *
 * const withoutExt = unappend('.hs');
 *
 * assert.strictEqual(withoutExt('File.hs'), 'File');
 *
 * @since 0.1.0
 */
const unappend = (end) => (val) => val.endsWith(end) ? val.substring(0, val.lastIndexOf(end)) : val;
exports.unappend = unappend;
/**
 * Surround a string. Equivalent to calling `prepend` and `append` with the
 * same outer value.
 *
 * @example
 * import { surround } from 'fp-ts-std/String';
 *
 * const quote = surround('"');
 *
 * assert.strictEqual(quote('abc'), '"abc"');
 *
 * @since 0.1.0
 */
const surround = (x) => _function.flow(exports.prepend(x), exports.append(x));
exports.surround = surround;
/**
 * Remove the start and end of a string, if they both exist.
 *
 * @example
 * import { unsurround } from 'fp-ts-std/String';
 *
 * const unquote = unsurround('"');
 *
 * assert.strictEqual(unquote('"abc"'), 'abc');
 *
 * @since 0.1.0
 */
const unsurround = (x) => val => val.startsWith(x) && val.endsWith(x)
    ? _function.pipe(val, exports.unprepend(x), exports.unappend(x))
    : val;
exports.unsurround = unsurround;
/**
 * Returns the substring between the start index (inclusive) and the end index
 * (exclusive).
 *
 * This is merely a functional wrapper around `String.prototype.slice`.
 *
 * @example
 * import { slice } from 'fp-ts-std/String';
 *
 * const x = 'abcd';
 *
 * assert.deepStrictEqual(slice(1)(3)(x), 'bc');
 * assert.deepStrictEqual(slice(1)(Infinity)(x), 'bcd');
 * assert.deepStrictEqual(slice(0)(-1)(x), 'abc');
 * assert.deepStrictEqual(slice(-3)(-1)(x), 'bc');
 *
 * @since 0.7.0
 */
const slice = (start) => (end) => x => x.slice(start, end);
exports.slice = slice;
/**
 * Keep the specified number of characters from the start of a string.
 *
 * If `n` is larger than the available number of characters, the string will
 * be returned whole.
 *
 * If `n` is not a positive number, an empty string will be returned.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { takeLeft } from 'fp-ts-std/String';
 *
 * assert.strictEqual(takeLeft(2)('abc'), 'ab');
 *
 * @since 0.3.0
 */
const takeLeft = (n) => exports.slice(0)(Ord.max(number.Ord)(0, n));
exports.takeLeft = takeLeft;
/**
 * Keep the specified number of characters from the end of a string.
 *
 * If `n` is larger than the available number of characters, the string will
 * be returned whole.
 *
 * If `n` is not a positive number, an empty string will be returned.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { takeRight } from 'fp-ts-std/String';
 *
 * assert.strictEqual(takeRight(2)('abc'), 'bc');
 *
 * @since 0.3.0
 */
const takeRight = (n) => x => exports.slice(Ord.max(number.Ord)(0, x.length - Math.floor(n)))(Infinity)(x);
exports.takeRight = takeRight;
/**
 * Functional wrapper around `String.prototype.match`.
 *
 * @example
 * import { match } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 * import { flow } from 'fp-ts/function';
 *
 * const f = flow(match(/^(\d)(\w)$/), O.map(xs => Array.from(xs)));
 *
 * assert.deepStrictEqual(f('2e'), O.some(['2e', '2', 'e']));
 * assert.deepStrictEqual(f('foo'), O.none);
 *
 * @since 0.1.0
 */
const match = (r) => (x) => Option.fromNullable(x.match(r));
exports.match = match;
/**
 * A functional wrapper around `String.prototype.matchAll`.
 *
 * If the provided `RegExp` is non-global, the function will return `None`.
 *
 * @example
 * import { matchAll } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 * import * as NEA from 'fp-ts/NonEmptyArray';
 * import { flow } from 'fp-ts/function';
 *
 * const f = flow(
 *     matchAll(/t(e)(st(\d?))/g),
 *     O.map(NEA.map(xs => Array.from(xs))),
 * );
 *
 * assert.deepStrictEqual(f('test1test2'), O.some([['test1', 'e', 'st1', '1'], ['test2', 'e', 'st2', '2']]));
 *
 * @since 0.5.0
 */
const matchAll = (r) => (x) => _function.pipe(Option.tryCatch(() => x.matchAll(r)), Option.chain(_function.flow(xs => Array.from(xs), NonEmptyArray.fromArray)));
exports.matchAll = matchAll;
/**
 * Split a string into substrings using the specified separator and return them
 * as an array.
 *
 * @example
 * import { split } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(split(',')('a,b,c'), ['a', 'b', 'c']);
 *
 * @since 0.1.0
 */
const split = (on) => (target) => target.split(on);
exports.split = split;
/**
 * Apply an endomorphism upon an array of strings (characters) against a string.
 * This is useful as it allows you to run many polymorphic functions targeting
 * arrays against strings without having to rewrite them.
 *
 * The name "under" is borrowed from newtypes, and expresses the notion that
 * a string can be thought of merely as an array of characters.
 *
 * @example
 * import { under } from 'fp-ts-std/String';
 * import * as A from 'fp-ts/Array';
 *
 * const filterOutX = under(A.filter(x => x !== "x"));
 *
 * assert.strictEqual(filterOutX("axbxc"), "abc");
 *
 * @since 0.7.0
 */
const under = (f) => _function.flow(exports.split(""), f, _Array$1.join(""));
exports.under = under;
/**
 * Reverse a string.
 *
 * @example
 * import { reverse } from 'fp-ts-std/String';
 *
 * assert.strictEqual(reverse('abc'), 'cba');
 *
 * @since 0.3.0
 */
exports.reverse = exports.under(_Array.reverse);
// The regex comes from here: https://stackoverflow.com/a/20056634
/**
 * Split a string into substrings using any recognised newline as the separator.
 *
 * @example
 * import { lines } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(lines('a\nb\nc'), ['a', 'b', 'c']);
 *
 * @since 0.1.0
 */
exports.lines = exports.split(/\r\n|\r|\n/);
/**
 * Join newline-separated strings together.
 *
 * @example
 * import { unlines } from 'fp-ts-std/String';
 *
 * assert.strictEqual(unlines(['a', 'b', 'c']), 'a\nb\nc');
 *
 * @since 0.1.0
 */
exports.unlines = _Array$1.join("\n");
/**
 * A functional wrapper around `RegExp.prototype.test`.
 *
 * @example
 * import { test } from 'fp-ts-std/String';
 *
 * const hasVowel = test(/(a|e|i|o|u)/);
 *
 * assert.strictEqual(hasVowel('meow'), true);
 * assert.strictEqual(hasVowel('grrr'), false);
 *
 * @since 0.1.0
 */
const test = (r) => x => r.test(x);
exports.test = test;
/**
 * Replace the first occurrence of a matched substring with a replacement.
 *
 * @example
 * import { replace } from 'fp-ts-std/String';
 *
 * assert.strictEqual(replace('foo')('bar')('foo foo foo'), 'bar foo foo');
 * assert.strictEqual(replace(/foo/)('bar')('foo foo foo'), 'bar foo foo');
 * assert.strictEqual(replace(/foo/g)('bar')('foo foo foo'), 'bar bar bar');
 *
 * @since 0.7.0
 */
const replace = (r) => (s) => x => x.replace(r, s);
exports.replace = replace;
/**
 * Replace every occurrence of a matched substring with a replacement.
 *
 * To use a `RegExp` (with a global flag) instead of a string to match, use
 * `replace` instead.
 *
 * @example
 * import { replaceAll } from 'fp-ts-std/String';
 *
 * assert.strictEqual(replaceAll('foo')('bar')('foo foo foo'), 'bar bar bar');
 *
 * @since 0.7.0
 */
const replaceAll = (r) => (s) => x => x.replaceAll(r, s);
exports.replaceAll = replaceAll;
/**
 * Drop a number of characters from the start of a string, returning a new
 * string.
 *
 * If `n` is larger than the available number of characters, an empty string
 * will be returned.
 *
 * If `n` is not a positive number, the string will be returned whole.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { dropLeft } from 'fp-ts-std/String';
 *
 * assert.strictEqual(dropLeft(2)('abc'), 'c');
 *
 * @since 0.6.0
 */
const dropLeft = (n) => x => x.substring(n);
exports.dropLeft = dropLeft;
/**
 * Drop a number of characters from the end of a string, returning a new
 * string.
 *
 * If `n` is larger than the available number of characters, an empty string
 * will be returned.
 *
 * If `n` is not a positive number, the string will be returned whole.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { dropRight } from 'fp-ts-std/String';
 *
 * assert.strictEqual(dropRight(2)('abc'), 'a');
 *
 * @since 0.3.0
 */
const dropRight = (n) => x => x.substring(0, x.length - Math.floor(n));
exports.dropRight = dropRight;
/**
 * Remove the longest initial substring for which all characters satisfy the
 * specified predicate, creating a new string.
 *
 * @example
 * import { dropLeftWhile } from 'fp-ts-std/String';
 *
 * const dropFilename = dropLeftWhile(x => x !== '.');
 *
 * assert.strictEqual(dropFilename('File.hs'), '.hs')
 *
 * @since 0.6.0
 */
exports.dropLeftWhile = _function.flow(_Array.dropLeftWhile, exports.under);
/**
 * Remove the longest initial substring from the end of the input string for
 * which all characters satisfy the specified predicate, creating a new string.
 *
 * @example
 * import { dropRightWhile } from 'fp-ts-std/String';
 * import { elemFlipped } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq';
 *
 * const isVowel = elemFlipped(eqString)(['a', 'e', 'i', 'o', 'u']);
 * const dropRightVowels = dropRightWhile(isVowel);
 *
 * assert.deepStrictEqual(dropRightVowels('hellooo'), 'hell');
 *
 * @since 0.7.0
 */
exports.dropRightWhile = _function.flow(_Array$1.dropRightWhile, exports.under);
/**
 * Get the first character in a string, or `None` if the string is empty.
 *
 * @example
 * import { head } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(head('abc'), O.some('a'));
 * assert.deepStrictEqual(head(''), O.none);
 *
 * @since 0.6.0
 */
exports.head = _function.flow(Option.fromPredicate(_function.not(string.isEmpty)), Option.map(exports.takeLeft(1)));
/**
 * Get all but the first character of a string, or `None` if the string is empty.
 *
 * @example
 * import { tail } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(tail(''), O.none);
 * assert.deepStrictEqual(tail('a'), O.some(''));
 * assert.deepStrictEqual(tail('ab'), O.some('b'));
 * assert.deepStrictEqual(tail('abc'), O.some('bc'));
 *
 * @since 0.6.0
 */
exports.tail = _function.flow(Option.fromPredicate(_function.not(string.isEmpty)), Option.map(exports.dropLeft(1)));
/**
 * Get the last character in a string, or `None` if the string is empty.
 *
 * @example
 * import { last } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(last('abc'), O.some('c'));
 * assert.deepStrictEqual(last(''), O.none);
 *
 * @since 0.7.0
 */
exports.last = _function.flow(Option.fromPredicate(_function.not(string.isEmpty)), Option.map(exports.takeRight(1)));
/**
 * Get all but the last character of a string, or `None` if the string is empty.
 *
 * @example
 * import { init } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(init(''), O.none);
 * assert.deepStrictEqual(init('a'), O.some(''));
 * assert.deepStrictEqual(init('ab'), O.some('a'));
 * assert.deepStrictEqual(init('abc'), O.some('ab'));
 *
 * @since 0.7.0
 */
exports.init = _function.flow(Option.fromPredicate(_function.not(string.isEmpty)), Option.map(exports.dropRight(1)));
/**
 * Attempt to access the character at the specified index of a string.
 *
 * @example
 * import { lookup } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(lookup(0)(''), O.none);
 * assert.deepStrictEqual(lookup(0)('abc'), O.some('a'));
 *
 * @since 0.7.0
 */
const lookup = (i) => (x) => Option.fromNullable(x[i]);
exports.lookup = lookup;
/**
 * Converts all the alphabetic characters in a string to uppercase.
 *
 * @example
 * import { toUpper } from 'fp-ts-std/String';
 *
 * assert.strictEqual(toUpper('Hello!'), 'HELLO!');
 *
 * @since 0.7.0
 */
const toUpper = x => x.toUpperCase();
exports.toUpper = toUpper;
/**
 * Converts all the alphabetic characters in a string to lowercase.
 *
 * @example
 * import { toLower } from 'fp-ts-std/String';
 *
 * assert.strictEqual(toLower('Hello!'), 'hello!');
 *
 * @since 0.7.0
 */
const toLower = x => x.toLowerCase();
exports.toLower = toLower;
/**
 * Calculate the longest initial substring for which all characters satisfy the
 * specified predicate, creating a new string.
 *
 * @example
 * import { takeLeftWhile } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(takeLeftWhile(x => x !== 'c')('abcd'), 'ab');
 *
 * @since 0.7.0
 */
// The pointful first function is needed to typecheck for some reason
exports.takeLeftWhile = _function.flow(f => _Array.takeLeftWhile(f), exports.under);
/**
 * Calculate the longest initial substring from the end of the input string
 * for which all characters satisfy the specified predicate, creating a new
 * string.
 *
 * @example
 * import { takeRightWhile } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(takeRightWhile(x => x !== 'b')('abcd'), 'cd');
 *
 * @since 0.7.0
 */
exports.takeRightWhile = _function.flow(_Array$1.takeRightWhile, exports.under);
});

var _JSON = createCommonjsModule(function (module, exports) {
/**
 * Various functions to aid in working with JSON.
 *
 * @since 0.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseO = exports.parse = exports.unstringify = exports.stringifyPrimitive = exports.stringifyO = exports.stringify = exports.unJSONString = void 0;





const isoJSONString = es6.iso();
const mkJSONString = isoJSONString.wrap;
/**
 * Unwrap a `JSONString` newtype back to its underlying string representation.
 *
 * @since 0.6.0
 */
exports.unJSONString = isoJSONString.unwrap;
/**
 * Stringify some arbitrary data.
 *
 * @example
 * import { stringify } from 'fp-ts-std/JSON';
 * import * as E from 'fp-ts/Either';
 * import { constant } from 'fp-ts/function';
 *
 * const f = stringify(constant('e'));
 *
 * const valid = 'abc';
 * const invalid = () => {};
 *
 * assert.deepStrictEqual(f(valid), E.right('"abc"'));
 * assert.deepStrictEqual(f(invalid), E.left('e'));
 *
 * @since 0.1.0
 */
const stringify = (f) => (x) => _function.pipe(
// It should only throw some sort of `TypeError`:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
Either.tryCatch(() => JSON.stringify(x), e => f(e)), Either.filterOrElse(_String.isString, () => f(new TypeError("Stringify output not a string"))), Either.map(mkJSONString));
exports.stringify = stringify;
/**
 * Stringify some arbitrary data, returning an `Option`.
 *
 * @example
 * import { stringifyO } from 'fp-ts-std/JSON';
 * import * as O from 'fp-ts/Option';
 *
 * const valid = 'abc';
 * const invalid = () => {};
 *
 * assert.deepStrictEqual(stringifyO(valid), O.some('"abc"'));
 * assert.deepStrictEqual(stringifyO(invalid), O.none);
 *
 * @since 0.1.0
 */
exports.stringifyO = _function.flow(exports.stringify(_function.identity), Option.fromEither);
/**
 * Stringify a primitive value with no possibility of failure.
 *
 * @example
 * import { stringifyPrimitive } from 'fp-ts-std/JSON';
 *
 * assert.strictEqual(stringifyPrimitive('abc'), '"abc"');
 *
 * @since 0.1.0
 */
const stringifyPrimitive = (x) => _function.pipe(x, JSON.stringify, mkJSONString);
exports.stringifyPrimitive = stringifyPrimitive;
/**
 * Parse a string as JSON. This is safe provided there have been no shenanigans
 * with the `JSONString` newtype.
 *
 * @example
 * import { unstringify, stringifyPrimitive } from 'fp-ts-std/JSON';
 * import { flow } from 'fp-ts/function';
 *
 * const f = flow(stringifyPrimitive, unstringify);
 *
 * assert.strictEqual(f('abc'), 'abc');
 *
 * @since 0.5.0
 */
exports.unstringify = _function.flow(exports.unJSONString, JSON.parse);
/**
 * Parse a string as JSON. The `Json` type on the right side comes from `fp-ts`
 * and is a union of all possible parsed types.
 *
 * @example
 * import { parse } from 'fp-ts-std/JSON';
 * import * as E from 'fp-ts/Either';
 * import { constant } from 'fp-ts/function';
 *
 * const f = parse(constant('e'));
 *
 * const valid = '"abc"';
 * const invalid = 'abc';
 *
 * assert.deepStrictEqual(f(valid), E.right('abc'));
 * assert.deepStrictEqual(f(invalid), E.left('e'));
 *
 * @since 0.1.0
 */
const parse = (f) => (x) => 
// It should only throw some sort of `SyntaxError`:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
Either.tryCatch(() => JSON.parse(x), e => f(e));
exports.parse = parse;
/**
 * Parse a string as JSON, returning an `Option`.
 *
 * @example
 * import { parseO } from 'fp-ts-std/JSON';
 * import * as O from 'fp-ts/Option';
 *
 * const valid = '"abc"';
 * const invalid = 'abc';
 *
 * assert.deepStrictEqual(parseO(valid), O.some('abc'));
 * assert.deepStrictEqual(parseO(invalid), O.none);
 *
 * @since 0.1.0
 */
exports.parseO = _function.flow(exports.parse(_function.identity), Option.fromEither);
});

var __pika_web_default_export_for_treeshaking__ = /*@__PURE__*/getDefaultExportFromCjs(_JSON);

export default __pika_web_default_export_for_treeshaking__;
var parse = _JSON.parse;
var parseO = _JSON.parseO;
var stringify = _JSON.stringify;
var stringifyO = _JSON.stringifyO;
var stringifyPrimitive = _JSON.stringifyPrimitive;
var unJSONString = _JSON.unJSONString;
var unstringify = _JSON.unstringify;
export { _JSON as __moduleExports, parse, parseO, stringify, stringifyO, stringifyPrimitive, unJSONString, unstringify };

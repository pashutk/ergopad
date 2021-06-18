import { c as createCommonjsModule, g as getDefaultExportFromCjs, a as commonjsGlobal } from '../../common/_commonjsHelpers-8c19dec8.js';
import { F as Functor, C as Chain, A as Applicative } from '../../common/Separated-8613e55b.js';
import { A as Apply } from '../../common/Apply-b14b9217.js';
import { E as EitherT, F as FromIO, a as FromEither, C as Compactable, b as Filterable } from '../../common/FromIO-af888b32.js';
import { E as Either } from '../../common/Either-803e7e02.js';
import { _ as _function } from '../../common/function-eb01d8e0.js';
import '../../common/Option-23247b41.js';

var IO = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonoid = exports.getSemigroup = exports.io = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.FromIO = exports.ChainRec = exports.MonadIO = exports.chainFirst = exports.Monad = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.Pointed = exports.flap = exports.Functor = exports.URI = exports.fromIO = exports.flatten = exports.chain = exports.of = exports.ap = exports.map = void 0;
/**
 * ```ts
 * interface IO<A> {
 *   (): A
 * }
 * ```
 *
 * `IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
 * type `A` and **never fails**. If you want to represent a synchronous computation that may fail, please see
 * `IOEither`.
 *
 * @since 2.0.0
 */





// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
var _map = function (ma, f) { return function () { return f(ma()); }; };
var _ap = function (mab, ma) { return function () { return mab()(ma()); }; };
var _chain = function (ma, f) { return function () { return f(ma())(); }; };
var _chainRec = function (a, f) { return function () {
    var e = f(a)();
    while (e._tag === 'Left') {
        e = f(e.left)();
    }
    return e.right;
}; };
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
var map = function (f) { return function (fa) { return _map(fa, f); }; };
exports.map = map;
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
var ap = function (fa) { return function (fab) { return _ap(fab, fa); }; };
exports.ap = ap;
/**
 * @category Pointed
 * @since 2.0.0
 */
exports.of = _function.constant;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
var chain = function (f) { return function (ma) { return _chain(ma, f); }; };
exports.chain = chain;
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(_function.identity);
/**
 * @category constructors
 * @since 2.7.0
 * @deprecated
 */
exports.fromIO = _function.identity;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'IO';
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flap = 
/*#_PURE_*/
Functor.flap(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Apply = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply.apFirst(exports.Apply);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply.apSecond(exports.Apply);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Applicative = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain
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
exports.chainFirst = 
/*#__PURE__*/
Chain.chainFirst(exports.Chain);
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.ChainRec = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: _chain,
    chainRec: _chainRec
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: _function.identity
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
exports.Do = 
/*#__PURE__*/
exports.of({});
/**
 * @since 2.8.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor.bindTo(exports.Functor);
/**
 * @since 2.8.0
 */
exports.bind = 
/*#__PURE__*/
Chain.bind(exports.Chain);
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = 
/*#__PURE__*/
Apply.apS(exports.Apply);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.9.0
 */
var traverseArrayWithIndex = function (f) { return function (as) { return function () { return as.map(function (a, i) { return f(i, a)(); }); }; }; };
exports.traverseArrayWithIndex = traverseArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @since 2.9.0
 */
var traverseArray = function (f) {
    return exports.traverseArrayWithIndex(function (_, a) { return f(a); });
};
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(_function.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.io = {
    URI: exports.URI,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    fromIO: exports.fromIO,
    chainRec: _chainRec
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getApplySemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getSemigroup = 
/*#__PURE__*/
Apply.getApplySemigroup(exports.Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getApplicativeMonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getMonoid = 
/*#__PURE__*/
Applicative.getApplicativeMonoid(exports.Applicative);
});

var IOEither = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainFirstW = exports.chainFirst = exports.Monad = exports.Chain = exports.ApplicativeSeq = exports.ApplicativePar = exports.apSecond = exports.apFirst = exports.ApplyPar = exports.Bifunctor = exports.Pointed = exports.flap = exports.Functor = exports.getFilterable = exports.getCompactable = exports.getAltIOValidation = exports.getApplicativeIOValidation = exports.URI = exports.throwError = exports.altW = exports.alt = exports.flatten = exports.chainW = exports.chain = exports.of = exports.apW = exports.ap = exports.mapLeft = exports.bimap = exports.map = exports.swap = exports.orElseW = exports.orElse = exports.toUnion = exports.tryCatchK = exports.tryCatch = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromIO = exports.fromEither = exports.leftIO = exports.rightIO = exports.right = exports.left = void 0;
exports.getIOValidation = exports.getSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.ioEither = exports.Applicative = exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.bracket = exports.fromEitherK = exports.filterOrElseW = exports.filterOrElse = exports.fromPredicate = exports.chainEitherKW = exports.chainEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromOption = exports.FromEither = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.MonadThrow = exports.MonadIO = exports.Alt = void 0;




var E = __importStar(Either);
var ET = __importStar(EitherT);





var I = __importStar(IO);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
exports.left = 
/*#__PURE__*/
ET.left(I.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.right = 
/*#__PURE__*/
ET.right(I.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.rightIO = 
/*#__PURE__*/
ET.rightF(I.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.leftIO = 
/*#__PURE__*/
ET.leftF(I.Functor);
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromEither = I.of;
/**
 * @category constructors
 * @since 2.7.0
 */
exports.fromIO = exports.rightIO;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/
ET.match(I.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchW = exports.match;
/**
 * @category destructors
 * @since 2.10.0
 */
exports.matchE = 
/*#__PURE__*/
ET.matchE(I.Monad);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.0.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchEW = exports.matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.foldW = exports.matchEW;
/**
 * @category destructors
 * @since 2.0.0
 */
exports.getOrElse = 
/*#__PURE__*/
ET.getOrElse(I.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.6.0
 */
exports.getOrElseW = exports.getOrElse;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * Constructs a new `IOEither` from a function that performs a side effect and might throw
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @category interop
 * @since 2.0.0
 */
var tryCatch = function (f, onThrow) { return function () {
    return E.tryCatch(f, onThrow);
}; };
exports.tryCatch = tryCatch;
/**
 * Converts a function that may throw to one returning a `IOEither`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f, onThrow) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.tryCatch(function () { return f.apply(void 0, a); }, onThrow);
}; };
exports.tryCatchK = tryCatchK;
/**
 * @category interop
 * @since 2.10.0
 */
exports.toUnion = 
/*#__PURE__*/
ET.toUnion(I.Functor);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.0.0
 */
exports.orElse = 
/*#__PURE__*/
ET.orElse(I.Monad);
/**
 * Less strict version of [`orElse`](#orelse).
 *
 * @category combinators
 * @since 2.10.0
 */
exports.orElseW = exports.orElse;
/**
 * @category combinators
 * @since 2.0.0
 */
exports.swap = 
/*#__PURE__*/
ET.swap(I.Functor);
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return _function.pipe(fa, exports.map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return _function.pipe(fab, exports.ap(fa)); };
var _apSeq = function (fab, fa) {
    return _function.pipe(fab, exports.chain(function (f) { return _function.pipe(fa, exports.map(f)); }));
};
/* istanbul ignore next */
var _chain = function (ma, f) { return _function.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return _function.pipe(fa, exports.bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return _function.pipe(fa, exports.mapLeft(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return _function.pipe(fa, exports.alt(that)); };
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
exports.map = 
/*#__PURE__*/
ET.map(I.Functor);
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.bimap = 
/*#__PURE__*/
ET.bimap(I.Functor);
/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.0.0
 */
exports.mapLeft = 
/*#__PURE__*/
ET.mapLeft(I.Functor);
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
exports.ap = 
/*#__PURE__*/
ET.ap(I.Apply);
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
exports.apW = exports.ap;
/**
 * @category Pointed
 * @since 2.8.5
 */
exports.of = exports.right;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
exports.chain = 
/*#__PURE__*/
ET.chain(I.Monad);
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
exports.chainW = exports.chain;
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(_function.identity);
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.0.0
 */
exports.alt = 
/*#__PURE__*/
ET.alt(I.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
exports.altW = exports.alt;
/**
 * @category MonadThrow
 * @since 2.7.0
 */
exports.throwError = exports.left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
exports.URI = 'IOEither';
/**
 * @category instances
 * @since 2.7.0
 */
function getApplicativeIOValidation(S) {
    var ap = Apply.ap(I.Apply, E.getApplicativeValidation(S));
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return _function.pipe(fab, ap(fa)); },
        of: exports.of
    };
}
exports.getApplicativeIOValidation = getApplicativeIOValidation;
/**
 * @category instances
 * @since 2.7.0
 */
function getAltIOValidation(S) {
    var alt = ET.altValidation(I.Monad, S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        alt: function (fa, that) { return _function.pipe(fa, alt(that)); }
    };
}
exports.getAltIOValidation = getAltIOValidation;
/**
 * @category instances
 * @since 2.10.0
 */
var getCompactable = function (M) {
    var C = E.getCompactable(M);
    return {
        URI: exports.URI,
        _E: undefined,
        compact: Compactable.compact(I.Functor, C),
        separate: Compactable.separate(I.Functor, C, E.Functor)
    };
};
exports.getCompactable = getCompactable;
/**
 * @category instances
 * @since 2.1.0
 */
function getFilterable(M) {
    var F = E.getFilterable(M);
    var C = exports.getCompactable(M);
    var filter = Filterable.filter(I.Functor, F);
    var filterMap = Filterable.filterMap(I.Functor, F);
    var partition = Filterable.partition(I.Functor, F);
    var partitionMap = Filterable.partitionMap(I.Functor, F);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        compact: C.compact,
        separate: C.separate,
        filter: function (fa, predicate) { return _function.pipe(fa, filter(predicate)); },
        filterMap: function (fa, f) { return _function.pipe(fa, filterMap(f)); },
        partition: function (fa, predicate) { return _function.pipe(fa, partition(predicate)); },
        partitionMap: function (fa, f) { return _function.pipe(fa, partitionMap(f)); }
    };
}
exports.getFilterable = getFilterable;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flap = 
/*#_PURE_*/
Functor.flap(exports.Functor);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Pointed = {
    URI: exports.URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
    URI: exports.URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply.apFirst(exports.ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply.apSecond(exports.ApplyPar);
/**
 * @category instances
 * @since 2.8.4
 */
exports.ApplicativePar = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
/**
 * @category instances
 * @since 2.8.4
 */
exports.ApplicativeSeq = {
    URI: exports.URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Monad = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain
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
exports.chainFirst = 
/*#__PURE__*/
Chain.chainFirst(exports.Chain);
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.8.0
 */
exports.chainFirstW = exports.chainFirst;
/**
 * @category instances
 * @since 2.7.0
 */
exports.Alt = {
    URI: exports.URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadIO = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.MonadThrow = {
    URI: exports.URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    throwError: exports.throwError
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: exports.URI,
    fromIO: exports.fromIO
};
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromIOK = 
/*#__PURE__*/
FromIO.fromIOK(exports.FromIO);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainIOK = 
/*#__PURE__*/
FromIO.chainIOK(exports.FromIO, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstIOK = 
/*#__PURE__*/
FromIO.chainFirstIOK(exports.FromIO, exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromEither = {
    URI: exports.URI,
    fromEither: exports.fromEither
};
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromOption = 
/*#__PURE__*/
FromEither.fromOption(exports.FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/
FromEither.fromOptionK(exports.FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainOptionK = 
/*#__PURE__*/
FromEither.chainOptionK(exports.FromEither, exports.Chain);
/**
 * @category combinators
 * @since 2.4.0
 */
exports.chainEitherK = 
/*#__PURE__*/
FromEither.chainEitherK(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
exports.chainEitherKW = exports.chainEitherK;
/**
 * @category constructors
 * @since 2.0.0
 */
exports.fromPredicate = 
/*#__PURE__*/
FromEither.fromPredicate(exports.FromEither);
/**
 * @category combinators
 * @since 2.0.0
 */
exports.filterOrElse = 
/*#__PURE__*/
FromEither.filterOrElse(exports.FromEither, exports.Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
exports.filterOrElseW = exports.filterOrElse;
/**
 * @category combinators
 * @since 2.4.0
 */
exports.fromEitherK = 
/*#__PURE__*/
FromEither.fromEitherK(exports.FromEither);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Make sure that a resource is cleaned up in the event of an exception (\*). The release action is called regardless of
 * whether the body action throws (\*) or returns.
 *
 * (\*) i.e. returns a `Left`
 *
 * @since 2.0.0
 */
var bracket = function (acquire, use, release) {
    return _function.pipe(acquire, exports.chain(function (a) {
        return _function.pipe(use(a), I.chain(function (e) {
            return _function.pipe(release(a, e), exports.chain(function () { return I.of(e); }));
        }));
    }));
};
exports.bracket = bracket;
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
exports.Do = 
/*#__PURE__*/
exports.of({});
/**
 * @since 2.8.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor.bindTo(exports.Functor);
/**
 * @since 2.8.0
 */
exports.bind = 
/*#__PURE__*/
Chain.bind(exports.Chain);
/**
 * @since 2.8.0
 */
exports.bindW = exports.bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
exports.apS = 
/*#__PURE__*/
Apply.apS(exports.ApplyPar);
/**
 * @since 2.8.0
 */
exports.apSW = exports.apS;
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.9.0
 */
var traverseArrayWithIndex = function (f) {
    return _function.flow(I.traverseArrayWithIndex(f), I.map(E.sequenceArray));
};
exports.traverseArrayWithIndex = traverseArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @since 2.9.0
 */
var traverseArray = function (f) { return exports.traverseArrayWithIndex(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @since 2.9.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(_function.identity);
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.9.0
 */
var traverseSeqArrayWithIndex = function (f) { return function (as) { return function () {
    var out = [];
    for (var i = 0; i < as.length; i++) {
        var b = f(i, as[i])();
        if (E.isLeft(b)) {
            return b;
        }
        out.push(b.right);
    }
    return E.right(out);
}; }; };
exports.traverseSeqArrayWithIndex = traverseSeqArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverse(ApplicativeSeq)`.
 *
 * @since 2.9.0
 */
var traverseSeqArray = function (f) { return exports.traverseSeqArrayWithIndex(function (_, a) { return f(a); }); };
exports.traverseSeqArray = traverseSeqArray;
/**
 * Equivalent to `ReadonlyArray#sequence(ApplicativeSeq)`.
 *
 * @since 2.9.0
 */
exports.sequenceSeqArray = 
/*#__PURE__*/
exports.traverseSeqArray(_function.identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`ApplicativePar`](#applicativepar) instead
 *
 * @since 2.7.0
 * @category instances
 * @deprecated
 */
exports.Applicative = exports.ApplicativePar;
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.ioEither = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft,
    map: _map,
    of: exports.of,
    ap: _ap,
    chain: _chain,
    alt: _alt,
    fromIO: exports.fromIO,
    throwError: exports.throwError
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getApplySemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplySemigroup = 
/*#__PURE__*/
Apply.getApplySemigroup(exports.ApplyPar);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getApplicativeMonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
exports.getApplyMonoid = 
/*#__PURE__*/
Applicative.getApplicativeMonoid(exports.ApplicativePar);
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getApplySemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
var getSemigroup = function (S) {
    return Apply.getApplySemigroup(I.Apply)(E.getSemigroup(S));
};
exports.getSemigroup = getSemigroup;
/**
 * Use [`getApplicativeIOValidation`](#getapplicativeiovalidation) and [`getAltIOValidation`](#getaltiovalidation).
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
function getIOValidation(SE) {
    var applicativeIOValidation = getApplicativeIOValidation(SE);
    var altIOValidation = getAltIOValidation(SE);
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: applicativeIOValidation.ap,
        of: exports.of,
        chain: _chain,
        bimap: _bimap,
        mapLeft: _mapLeft,
        alt: altIOValidation.alt,
        fromIO: exports.fromIO,
        throwError: exports.throwError
    };
}
exports.getIOValidation = getIOValidation;
});

var __pika_web_default_export_for_treeshaking__ = /*@__PURE__*/getDefaultExportFromCjs(IOEither);

export default __pika_web_default_export_for_treeshaking__;

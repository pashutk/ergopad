import { c as createCommonjsModule, a as commonjsGlobal } from './_commonjsHelpers-8c19dec8.js';
import { A as Apply } from './Apply-b14b9217.js';
import { E as Either } from './Either-803e7e02.js';
import { _ as _function } from './function-eb01d8e0.js';
import { S as Separated, F as Functor, C as Chain } from './Separated-8613e55b.js';
import { O as Option } from './Option-23247b41.js';

var Compactable = createCommonjsModule(function (module, exports) {
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
exports.getCompactableComposition = exports.separate = exports.compact = void 0;



var S = __importStar(Separated);
function compact(F, G) {
    return function (fga) { return F.map(fga, G.compact); };
}
exports.compact = compact;
function separate(F, C, G) {
    var _compact = compact(F, C);
    var _map = Functor.map(F, G);
    return function (fge) { return S.separated(_compact(_function.pipe(fge, _map(Option.getLeft))), _compact(_function.pipe(fge, _map(Option.getRight)))); };
}
exports.separate = separate;
/** @deprecated */
function getCompactableComposition(F, G) {
    var map = Functor.getFunctorComposition(F, G).map;
    return {
        map: map,
        compact: compact(F, G),
        separate: separate(F, G, G)
    };
}
exports.getCompactableComposition = getCompactableComposition;
});

var EitherT = createCommonjsModule(function (module, exports) {
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
exports.getEitherM = exports.toUnion = exports.swap = exports.orElse = exports.getOrElse = exports.matchE = exports.match = exports.altValidation = exports.mapLeft = exports.bimap = exports.alt = exports.chain = exports.ap = exports.map = exports.leftF = exports.rightF = exports.left = exports.right = void 0;

var E = __importStar(Either);


function right(F) {
    return _function.flow(E.right, F.of);
}
exports.right = right;
function left(F) {
    return _function.flow(E.left, F.of);
}
exports.left = left;
function rightF(F) {
    return function (fa) { return F.map(fa, E.right); };
}
exports.rightF = rightF;
function leftF(F) {
    return function (fe) { return F.map(fe, E.left); };
}
exports.leftF = leftF;
function map(F) {
    return Functor.map(F, E.Functor);
}
exports.map = map;
function ap(F) {
    return Apply.ap(F, E.Apply);
}
exports.ap = ap;
function chain(M) {
    return function (f) { return function (ma) { return M.chain(ma, function (e) { return (E.isLeft(e) ? M.of(e) : f(e.right)); }); }; };
}
exports.chain = chain;
function alt(M) {
    return function (second) { return function (first) { return M.chain(first, function (e) { return (E.isLeft(e) ? second() : M.of(e)); }); }; };
}
exports.alt = alt;
function bimap(F) {
    return function (f, g) { return function (fea) { return F.map(fea, E.bimap(f, g)); }; };
}
exports.bimap = bimap;
function mapLeft(F) {
    return function (f) { return function (fea) { return F.map(fea, E.mapLeft(f)); }; };
}
exports.mapLeft = mapLeft;
function altValidation(M, S) {
    return function (second) { return function (first) {
        return M.chain(first, E.match(function (e1) {
            return M.map(second(), E.mapLeft(function (e2) { return S.concat(e1, e2); }));
        }, right(M)));
    }; };
}
exports.altValidation = altValidation;
function match(F) {
    return function (onLeft, onRight) { return function (ma) { return F.map(ma, E.match(onLeft, onRight)); }; };
}
exports.match = match;
function matchE(M) {
    return function (onLeft, onRight) { return function (ma) { return M.chain(ma, E.match(onLeft, onRight)); }; };
}
exports.matchE = matchE;
function getOrElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, E.match(onLeft, M.of)); }; };
}
exports.getOrElse = getOrElse;
function orElse(M) {
    return function (onLeft) { return function (ma) { return M.chain(ma, function (e) { return (E.isLeft(e) ? onLeft(e.left) : M.of(e)); }); }; };
}
exports.orElse = orElse;
function swap(F) {
    return function (ma) { return F.map(ma, E.swap); };
}
exports.swap = swap;
function toUnion(F) {
    return function (fa) { return F.map(fa, E.toUnion); };
}
exports.toUnion = toUnion;
/** @deprecated  */
/* istanbul ignore next */
function getEitherM(M) {
    var _ap = ap(M);
    var _map = map(M);
    var _chain = chain(M);
    var _alt = alt(M);
    var _bimap = bimap(M);
    var _mapLeft = mapLeft(M);
    var _fold = matchE(M);
    var _getOrElse = getOrElse(M);
    var _orElse = orElse(M);
    return {
        map: function (fa, f) { return _function.pipe(fa, _map(f)); },
        ap: function (fab, fa) { return _function.pipe(fab, _ap(fa)); },
        of: right(M),
        chain: function (ma, f) { return _function.pipe(ma, _chain(f)); },
        alt: function (fa, that) { return _function.pipe(fa, _alt(that)); },
        bimap: function (fea, f, g) { return _function.pipe(fea, _bimap(f, g)); },
        mapLeft: function (fea, f) { return _function.pipe(fea, _mapLeft(f)); },
        fold: function (fa, onLeft, onRight) { return _function.pipe(fa, _fold(onLeft, onRight)); },
        getOrElse: function (fa, onLeft) { return _function.pipe(fa, _getOrElse(onLeft)); },
        orElse: function (fa, f) { return _function.pipe(fa, _orElse(f)); },
        swap: swap(M),
        rightM: rightF(M),
        leftM: leftF(M),
        left: left(M)
    };
}
exports.getEitherM = getEitherM;
});

var Filterable = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterableComposition = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = void 0;
/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */





function filter(F, G) {
    return function (predicate) { return function (fga) { return F.map(fga, function (ga) { return G.filter(ga, predicate); }); }; };
}
exports.filter = filter;
function filterMap(F, G) {
    return function (f) { return function (fga) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }; };
}
exports.filterMap = filterMap;
function partition(F, G) {
    var _filter = filter(F, G);
    return function (predicate) { return function (fga) {
        return Separated.separated(_function.pipe(fga, _filter(function (a) { return !predicate(a); })), _function.pipe(fga, _filter(predicate)));
    }; };
}
exports.partition = partition;
function partitionMap(F, G) {
    var _filterMap = filterMap(F, G);
    return function (f) { return function (fga) {
        return Separated.separated(_function.pipe(fga, _filterMap(function (a) { return Option.getLeft(f(a)); })), _function.pipe(fga, _filterMap(function (a) { return Option.getRight(f(a)); })));
    }; };
}
exports.partitionMap = partitionMap;
/** @deprecated */
function getFilterableComposition(F, G) {
    var map = Functor.getFunctorComposition(F, G).map;
    var _compact = Compactable.compact(F, G);
    var _separate = Compactable.separate(F, G, G);
    var _filter = filter(F, G);
    var _filterMap = filterMap(F, G);
    var _partition = partition(F, G);
    var _partitionMap = partitionMap(F, G);
    return {
        map: map,
        compact: _compact,
        separate: _separate,
        filter: function (fga, f) { return _function.pipe(fga, _filter(f)); },
        filterMap: function (fga, f) { return _function.pipe(fga, _filterMap(f)); },
        partition: function (fga, p) { return _function.pipe(fga, _partition(p)); },
        partitionMap: function (fga, f) { return _function.pipe(fga, _partitionMap(f)); }
    };
}
exports.getFilterableComposition = getFilterableComposition;
});

var FromEither = createCommonjsModule(function (module, exports) {
/**
 * The `FromEither` type class represents those data types which support errors.
 *
 * @since 2.10.0
 */
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
exports.filterOrElse = exports.chainEitherK = exports.fromEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromPredicate = exports.fromOption = void 0;
var E = __importStar(Either);

function fromOption(F) {
    return function (onNone) { return _function.flow(E.fromOption(onNone), F.fromEither); };
}
exports.fromOption = fromOption;
function fromPredicate(F) {
    return function (predicate, onFalse) {
        return _function.flow(E.fromPredicate(predicate, onFalse), F.fromEither);
    };
}
exports.fromPredicate = fromPredicate;
function fromOptionK(F) {
    var fromOptionF = fromOption(F);
    return function (onNone) {
        var from = fromOptionF(onNone);
        return function (f) { return _function.flow(f, from); };
    };
}
exports.fromOptionK = fromOptionK;
function chainOptionK(F, M) {
    var fromOptionKF = fromOptionK(F);
    return function (onNone) {
        var from = fromOptionKF(onNone);
        return function (f) { return function (ma) { return M.chain(ma, from(f)); }; };
    };
}
exports.chainOptionK = chainOptionK;
function fromEitherK(F) {
    return function (f) { return _function.flow(f, F.fromEither); };
}
exports.fromEitherK = fromEitherK;
function chainEitherK(F, M) {
    var fromEitherKF = fromEitherK(F);
    return function (f) { return function (ma) { return M.chain(ma, fromEitherKF(f)); }; };
}
exports.chainEitherK = chainEitherK;
function filterOrElse(F, M) {
    return function (predicate, onFalse) { return function (ma) {
        return M.chain(ma, _function.flow(E.fromPredicate(predicate, onFalse), F.fromEither));
    }; };
}
exports.filterOrElse = filterOrElse;
});

var FromIO = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = void 0;
/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */


function fromIOK(F) {
    return function (f) { return _function.flow(f, F.fromIO); };
}
exports.fromIOK = fromIOK;
function chainIOK(F, M) {
    return function (f) {
        var g = _function.flow(f, F.fromIO);
        return function (first) { return M.chain(first, g); };
    };
}
exports.chainIOK = chainIOK;
function chainFirstIOK(F, M) {
    var chainFirstM = Chain.chainFirst(M);
    return function (f) { return chainFirstM(_function.flow(f, F.fromIO)); };
}
exports.chainFirstIOK = chainFirstIOK;
});

export { Compactable as C, EitherT as E, FromIO as F, FromEither as a, Filterable as b };

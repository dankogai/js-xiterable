/**
 * xiterable.ts
 *
 * @version: 0.1.3
 * @author: dankogai
 *
*/
export const version = '0.1.3';
// MARK: Utility
/**
 * `true` if `obj` is iterable.  `false` otherwise.
 */
export function isIterable(obj) {
    if (typeof obj === 'string')
        return true; // string is iterable
    if (obj !== Object(obj))
        return false; // other primitives
    return typeof obj[Symbol.iterator] === 'function';
}
/**
 * `true` if `o` is an integer (Number with integral value or BigInt).
 */
export function isAnyInt(o) {
    return typeof o === 'number' ? Number.isInteger(o) : typeof o === 'bigint';
}
function min(...args) {
    let result = Number.POSITIVE_INFINITY;
    for (const v of args) {
        if (v < result)
            result = v;
    }
    return result;
}
const nthError = (n) => {
    throw TypeError('I do not know how to random access!');
};
/**
 * main class
 */
export class Xiterable {
    /**
     * @constructor
     */
    constructor(seed, length = Number.POSITIVE_INFINITY, nth) {
        if (seed instanceof Xiterable) {
            return seed;
        }
        if (!isIterable(seed)) {
            if (typeof seed !== 'function') {
                throw TypeError(`${seed} is neither iterable or a generator`);
            }
            // treat obj as a generator
            seed = { [Symbol.iterator]: seed };
        }
        else if (!nth) {
            if (typeof seed['nth'] === 'function') {
                nth = seed['nth'].bind(seed);
            }
            else if (isAnyInt(seed['length'])) {
                const len = seed['length'];
                const ctor = len.constructor;
                nth = (n) => seed[ctor(n < 0 ? len : 0) + ctor(n)];
            }
        }
        if (isAnyInt(seed['length']))
            length = seed['length'];
        if (!nth)
            nth = nthError;
        Object.assign(this, { seed: seed, length: length, nth: nth });
        Object.freeze(this);
    }
    static get version() { return version; }
    static isIterable(obj) { return isIterable(obj); }
    /*
     *
     */
    make(...args) {
        return new (Function.prototype.bind.apply(this, [null, ...args]));
    }
    /**
     * `true` if this iterable is endless
     */
    get isEndless() {
        return this.length === Number.POSITIVE_INFINITY;
    }
    /**
     * does `new`
     * @param {*} args
     * @returns {Xiterable}
     */
    static of(...args) {
        return new (Function.prototype.bind.apply(this, [null].concat(args)));
    }
    /**
     * Same as `of` but takes a single array `arg`
     *
     * cf. https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
     * @param {Array} arg
     * @returns {Xiterable}
     */
    static from(arg) {
        return new (Function.prototype.bind.apply(this, [null].concat(arg)));
    }
    [Symbol.iterator]() {
        return this.seed[Symbol.iterator]();
    }
    toArray() {
        return [...this];
    }
    /// MARK: methods found in Array.prototype ////
    /**
     * `map` as `Array.prototype.map`
    */
    map(fn, thisArg) {
        const len = this.length;
        const ctor = len.constructor;
        const iter = this.seed;
        const nth = (n) => fn.call(thisArg, this.nth(n), n, this.seed);
        const gen = function* () {
            let i = ctor(0);
            for (const v of iter) {
                yield fn.call(thisArg, v, i++, iter);
            }
        };
        return new Xiterable(gen, len, nth);
    }
    /**
     * `forEach` as `Array.prototype.map`
    */
    forEach(fn, thisArg) {
        let i = 0;
        for (const v of this.seed) {
            fn.call(thisArg, v, i++, this.seed);
        }
    }
    /**
    * `entries` as `Array.prototype.entries`
    */
    entries() {
        return this.map((v, i) => [i, v]);
    }
    /**
    * `keys` as `Array.prototype.keys`
    */
    keys() {
        return this.map((v, i) => i);
    }
    /**
    * `values` as `Array.prototype.values`
    */
    values() {
        return this.map((v, i) => v);
    }
    /**
     * `filter` as `Array.prototype.filter`
     */
    filter(fn, thisArg) {
        const iter = this.seed;
        const ctor = this.length.constructor;
        const gen = function* () {
            let i = ctor(0);
            for (const v of iter) {
                if (fn.call(thisArg, v, i++, iter))
                    yield v;
            }
        };
        return new Xiterable(gen);
    }
    /**
     * `find` as `Array.prototype.find`
     */
    find(fn, thisArg) {
        let i = this.length.constructor(0);
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed))
                return v;
        }
    }
    /**
     * `findIndex` as `Array.prototype.find`
     */
    findIndex(fn, thisArg) {
        let i = this.length.constructor(0);
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed))
                return --i;
        }
        return -1;
    }
    /**
    * `indexOf` as `Array.prototype.indexOf`
    */
    indexOf(valueToFind, fromIndex = 0) {
        const len = this.length;
        const ctor = len.constructor;
        fromIndex = ctor(fromIndex);
        if (fromIndex < 0) {
            if (this.isEndless) {
                throw new RangeError('an infinite iterable cannot go backwards');
            }
            fromIndex = ctor(len) + ctor(fromIndex);
            if (fromIndex < 0)
                fromIndex = 0;
        }
        return this.entries().findIndex(v => fromIndex <= v[0] && Object.is(v[1], valueToFind));
    }
    /**
    * `lastIndexOf` as `Array.prototype.lastIndexOf`
    */
    lastIndexOf(valueToFind, fromIndex) {
        if (this.isEndless) {
            throw new RangeError('an infinite iterable cannot go backwards');
        }
        const len = this.length;
        const ctor = len.constructor;
        fromIndex = arguments.length == 1
            ? ctor(len) - ctor(1) : ctor(fromIndex);
        if (fromIndex < 0) {
            fromIndex = ctor(len) + ctor(fromIndex);
            if (fromIndex < 0)
                fromIndex = 0;
        }
        const offset = ctor(len) - ctor(1);
        fromIndex = offset - ctor(fromIndex);
        const idx = this.reversed().indexOf(valueToFind, ctor(fromIndex));
        if (idx === -1)
            return -1;
        return ctor(len) - ctor(idx) - ctor(1);
    }
    /**
     * `includes` as `Array.prototype.includes`
     */
    includes(valueToFind, fromIndex = 0) {
        return this.indexOf(valueToFind, fromIndex) > -1;
    }
    /**
     * `reduce` as `Array.prototype.reduce`
     */
    reduce(fn, initialValue) {
        if (this.isEndless) {
            throw new RangeError('an infinite iterable cannot be reduced');
        }
        if (arguments.length == 1 && Number(this.length) === 0) {
            throw new TypeError('Reduce of empty iterable with no initial value');
        }
        let a = initialValue, i = 0, it = this.seed;
        for (const v of it) {
            a = arguments.length == 1 && i == 0 ? v : fn(a, v, i, it);
            i++;
        }
        return a;
    }
    /**
     *  `reduceRight` as `Array.prototype.reduceRight`
     */
    reduceRight(fn, initialValue) {
        let it = this.reversed();
        return it.reduce.apply(it, arguments);
    }
    /**
     * `flat` as `Array.prototype.flat`
     */
    flat(depth = 1) {
        function* _flatten(iter, depth) {
            for (const it of iter) {
                if (isIterable(it) && depth > 0) {
                    yield* _flatten(it, depth - 1);
                }
                else {
                    yield it;
                }
            }
        }
        return new Xiterable(() => _flatten(this, depth));
    }
    /**
     * `flatMap` as `Array.prototype.flatMap`
    */
    flatMap(fn, thisArg) {
        return this.map(fn, thisArg).flat();
    }
    /**
    * `join` as `Array.prototype.join`
    * @param {String} separator
    * @returns {String}
    */
    join(separator = ',') {
        return this.reduce((a, v) => String(a) + separator + String(v));
    }
    /**
     * `every` as `Array.prototype.every`
     */
    every(fn, thisArg = null) {
        let i = this.length.constructor(0);
        for (const v of this.seed) {
            if (!fn.call(thisArg, v, i++, this.seed))
                return false;
        }
        return true;
    }
    /**
     * `some` as `Array.prototype.some`
     */
    some(fn, thisArg = null) {
        let i = this.length.constructor(0);
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed))
                return true;
        }
        return false;
    }
    /**
     * `concat` as `Array.prototype.concat`
     */
    concat(...args) {
        const head = this.seed;
        const rest = args.map(v => (Object(v) === v ? v : [v]));
        const gen = function* () {
            for (const v of head)
                yield v;
            for (const it of rest) {
                for (const v of it)
                    yield v;
            }
        };
        return new Xiterable(gen);
    }
    /**
     * `slice` as `Array.prototype.slice`
     */
    slice(start = 0, end = Number.POSITIVE_INFINITY) {
        // return this.drop(start).take(end - start);
        const ctor = this.length.constructor;
        if (start < 0 || end < 0) {
            if (this.isEndless) {
                throw new RangeError('negative indexes cannot be used');
            }
            if (start < 0)
                start = ctor(this.length) + ctor(start);
            if (end < 0)
                end = ctor(this.length) + ctor(end);
        }
        if (end <= start)
            return new Xiterable([]);
        let len = end === Number.POSITIVE_INFINITY
            ? ctor(this.length) - ctor(start)
            : ctor(end) - ctor(start);
        if (len < 0)
            len = ctor(0);
        const nth = (i) => {
            if (i < 0)
                i += len;
            return 0 <= i && i < len ? this.nth(start + i) : undefined;
        };
        const iter = this.seed;
        const gen = function* () {
            let i = ctor(-1);
            for (const v of iter) {
                ++i;
                if (i < start)
                    continue;
                if (end <= i)
                    break;
                yield v;
            }
        };
        return new Xiterable(gen, len, nth);
    }
    //// MARK: functional methods not defined above
    /**
     */
    take(n) {
        const ctor = this.length.constructor;
        let len = ctor(n);
        if (ctor(this.length) < len)
            len = ctor(this.length);
        const nth = (i) => {
            if (i < 0)
                i += len;
            return 0 <= i && i < len ? this.nth(i) : undefined;
        };
        const iter = this.seed;
        const gen = function* () {
            let i = ctor(0), nn = ctor(n);
            for (const v of iter) {
                if (nn <= i++)
                    break;
                yield v;
            }
        };
        return new Xiterable(gen, len, nth);
    }
    /**
     */
    drop(n) {
        const ctor = this.length.constructor;
        let len = ctor(this.length) - ctor(n);
        if (len < 0)
            len = ctor(0);
        const nth = (i) => {
            if (i < 0)
                i += len;
            return 0 <= i && i < len ? this.nth(n + i) : undefined;
        };
        const iter = this.seed;
        const gen = function* () {
            let i = ctor(0), nn = ctor(n);
            for (const v of iter) {
                if (i++ < nn)
                    continue;
                yield v;
            }
        };
        return new Xiterable(gen, len, nth);
    }
    /**
     * returns an iterable with all elements replaced with `value`
     */
    filled(value) {
        return this.map(() => value);
    }
    /**
     * reverse the iterable.  `this` must be finite and random accessible.
     */
    reversed() {
        if (this.isEndless || this.nth === nthError) {
            throw new RangeError('cannot reverse an infinite iterable');
        }
        let len = this.length;
        const ctor = len.constructor;
        const nth = (n) => {
            const i = ctor(n) + ctor(n < 0 ? len : 0);
            return 0 <= i && i < len
                ? this.nth(ctor(len) - i - ctor(1)) : undefined;
        };
        const iter = this;
        const gen = function* () {
            let i = len;
            while (0 < i)
                yield iter.nth(--i);
        };
        return new Xiterable(gen, len, nth);
    }
    /**
     * @returns {Xiterable}
     */
    zip(...args) {
        return Xiterable.zip(this, ...args);
    }
    //// MARK: static methods
    /**
     * @returns {Xiterable}
     */
    static zip(...args) {
        const xargs = args.map(v => new Xiterable(v));
        const len = min(...xargs.map(v => v.length));
        const ctor = this.length.constructor;
        const nth = (n) => {
            if (n < 0)
                n = ctor(n) + ctor(len);
            if (n < 0 || len <= n)
                return undefined;
            let result = [];
            for (const x of xargs) {
                result.push(x.nth(n));
            }
            return result;
        };
        const gen = function* () {
            const them = xargs.map(v => v[Symbol.iterator]());
            while (true) {
                let elem = [];
                for (const it of them) {
                    const nx = it.next();
                    if (nx.done)
                        return;
                    elem.push(nx.value);
                }
                yield elem;
            }
        };
        return new Xiterable(gen, len, nth);
    }
    /**
     * @returns {Xiterable}
     */
    static zipWith(fn, ...args) {
        if (typeof fn !== 'function')
            throw TypeError(`${fn} is not a function.`);
        return Xiterable.zip(...args).map(a => fn.apply(null, a));
    }
    /**
     *  `xrange` like `xrange()` of Python 2 (or `range()` of Python 3)
     */
    static xrange(b, e, d) {
        if (typeof b === 'undefined')
            [b, e, d] = [0, Number.POSITIVE_INFINITY, 1];
        if (typeof e === 'undefined')
            [b, e, d] = [0, b, 1];
        if (typeof d === 'undefined')
            [b, e, d] = [b, e, 1];
        const len = typeof b === 'bigint'
            ? (BigInt(e) - BigInt(b)) / BigInt(d)
            : Math.floor((Number(e) - Number(b)) / Number(d));
        const ctor = b.constructor;
        const nth = (n) => {
            if (n < 0)
                n = ctor(len) + ctor(n);
            if (len <= n)
                return undefined;
            return ctor(b) + ctor(d) * ctor(n);
        };
        const gen = function* () {
            let i = b;
            while (i < e) {
                yield i;
                i += ctor(d);
            }
        };
        return new Xiterable(gen, len, nth);
    }
    /**
     */
    static repeat(value, times = Number.POSITIVE_INFINITY) {
        const nth = (n) => n < 0 ? undefined : value;
        const gen = function* () {
            let i = 0;
            while (i++ < times)
                yield value;
        };
        return new Xiterable(gen, times, nth);
    }
}
;
export const xiterable = (...args) => Xiterable.of(...args);
export const zip = Xiterable.zip.bind(Xiterable);
export const zipWith = Xiterable.zipWith.bind(Xiterable);
export const xrange = Xiterable.xrange.bind(Xiterable);
export const repeat = Xiterable.repeat.bind(Xiterable);

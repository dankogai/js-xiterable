/**
 * xiterable.ts
 *
 * @version: 0.1.1
 * @author: dankogai
 *
*/
export const version = '0.1.1';
//  MARK: types
type anyint = number | bigint;
declare const BigInt: typeof Number;
type anyfunction = (...any) => any;
type transform<T, U> = (T, anyint?, any?) => U;
type predicate<T> = (T, anyint?, any?) => boolean;
type accumulate<T, U> = (U, T, anyint?, any?) => U;
type subscript = (anyint) => any;
// MARK: Utility
/**
 * `true` if `obj` is iterable.  `false` otherwise.
 */
export function isIterable(obj) {
    if (typeof obj === 'string') return true;  // string is iterable
    if (obj !== Object(obj)) return false; // other primitives
    return typeof obj[Symbol.iterator] === 'function';
}
/**
 * `true` if `o` is an integer (Number with integral value or BigInt).
 */
export function isAnyInt(o) {
    return typeof o === 'number' ? Number.isInteger(o) : typeof o === 'bigint';
}
function min(...args: anyint[]) {
    let result: anyint = Number.POSITIVE_INFINITY;
    for (const v of args) {
        if (v < result) result = v;
    }
    return result;
}
const nthError = (n: anyint) => {
    throw TypeError('I do not know how to random access!');
}
/**
 * main class
 */
export class Xiterable<T> {
    seed: Iterable<T>;
    length: anyint;
    nth: (anyint) => T;
    static get version() { return version }
    static isIterable(obj) { return isIterable(obj) }
    /**
     * @constructor
     */
    constructor(
        seed: Iterable<T> | anyfunction,
        length: anyint = Number.POSITIVE_INFINITY,
        nth?: subscript
    ) {
        if (seed instanceof Xiterable) {
            return seed;
        }
        if (!isIterable(seed)) {
            if (typeof seed !== 'function') {
                throw TypeError(`${seed} is neither iterable or a generator`);
            }
            // treat obj as a generator
            seed = { [Symbol.iterator]: seed };
        } else if (!nth) {
            if (typeof seed['nth'] === 'function') {
                nth = seed['nth'].bind(seed);
            } else if (isAnyInt(seed['length'])) {
                const len = seed['length'];
                const ctor = len.constructor;
                nth = (n: anyint) => seed[ctor(n < 0 ? len : 0) + ctor(n)];
            }
        }
        if (isAnyInt(seed['length'])) length = seed['length'];
        if (!nth) nth = nthError;
        Object.assign(this, { seed: seed, length: length, nth: nth });
        Object.freeze(this);
    }
    /*
     *
     */
    make(...args) {
        return new (Function.prototype.bind.apply(this, [null,...args]));
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
    static make(...args) {
        return new (Function.prototype.bind.apply(this, [null].concat(args)));
    }
    /**
     * Same as `make` but takes a single array `arg`
     * 
     * cf. https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
     * @param {Array} arg
     * @returns {Xiterable}
     */
    static vmake(arg) {
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
    map<U>(fn: transform<T, U>, thisArg?): Xiterable<U> {
        const nth = (n: anyint) => fn.call(thisArg, this.nth(n), n, this.seed);
        return new Xiterable(() => function* (it, ctor) {
            let i = ctor(0);
            for (const v of it) {
                yield fn.call(thisArg, v, i++, it);
            }
        }(this.seed, this.length.constructor), this.length, nth);
    }
    /**
     * `forEach` as `Array.prototype.map`
    */
    forEach<U>(fn: transform<T, U>, thisArg?) {
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
    filter(fn: predicate<T>, thisArg?): Xiterable<T> {
        let seed = this.seed;
        return new Xiterable(() => function* (it, ctor) {
            let i = ctor(0);
            for (const v of seed) {
                if (!fn.call(thisArg, v, i++, seed)) continue;
                yield v;
            }
        }(this.seed, this.length.constructor));
    }
    /**
     * `find` as `Array.prototype.find`
     */
    find(fn: predicate<T>, thisArg?) {
        let i = this.length.constructor(0);
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed)) return v;
        }
    }
    /**
     * `findIndex` as `Array.prototype.find`
     */
    findIndex(fn: predicate<T>, thisArg?): anyint {
        let i = this.length.constructor(0);
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed)) return --i;
        }
        return -1;
    }
    /**
    * `indexOf` as `Array.prototype.indexOf`
    */
    indexOf(valueToFind, fromIndex: anyint = 0): anyint {
        const ctor = this.length.constructor;
        fromIndex = ctor(fromIndex);
        if (fromIndex < 0) {
            if (this.isEndless) {
                throw new RangeError('an infinite iterable cannot go backwards');
            }
            fromIndex = ctor(this.length) + ctor(fromIndex);
            if (fromIndex < 0) fromIndex = 0;
        }
        return this.entries().findIndex(
            v => fromIndex <= v[0] && Object.is(v[1], valueToFind)
        );
    }
    /**
    * `lastIndexOf` as `Array.prototype.lastIndexOf`
    */
    lastIndexOf(valueToFind, fromIndex?: anyint): anyint {
        const ctor = this.length.constructor;
        fromIndex = arguments.length == 1
            ? ctor(this.length) - ctor(1) : ctor(fromIndex);
        if (this.isEndless) {
            throw new RangeError('an infinite iterable cannot go backwards');
        }
        if (fromIndex < 0) {
            fromIndex = ctor(this.length) + ctor(fromIndex);
            if (fromIndex < 0) fromIndex = 0;
        }
        const offset = ctor(this.length) - ctor(1)
        fromIndex = offset - ctor(fromIndex);
        let it = this.reversed()
        let idx = it.indexOf(valueToFind, ctor(fromIndex));
        if (idx === -1) return -1;
        return ctor(this.length) - ctor(idx) - ctor(1);
    }
    /**
     * `includes` as `Array.prototype.includes`
     */
    includes(valueToFind: T, fromIndex: anyint = 0) {
        return this.indexOf(valueToFind, fromIndex) > -1;
    }
    /**
     * `reduce` as `Array.prototype.reduce`
     */
    reduce<U>(fn: accumulate<T, any>, initialValue?: U) {
        if (this.isEndless) {
            throw new RangeError('an infinite iterable cannot be reduced');
        }
        if (arguments.length == 1 && Number(this.length) === 0) {
            throw new TypeError('Reduce of empty iterable with no initial value')
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
    reduceRight<U>(fn: accumulate<T, any>, initialValue?: U): U {
        let it = this.reversed()
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
                } else {
                    yield it;
                }
            }
        }
        return new Xiterable(() => _flatten(this, depth));
    }
    /**
     * `flatMap` as `Array.prototype.flatMap`
    */
    flatMap<U>(fn: transform<T, U>, thisArg?) {
        return this.map(fn, thisArg).flat();
    }
    /**
    * `join` as `Array.prototype.join`
    * @param {String} separator
    * @returns {String}
    */
    join(separator = ','): string {
        return this.reduce((a, v) => String(a) + separator + String(v));
    }
    /**
     * `every` as `Array.prototype.every`
     */
    every(fn: predicate<T>, thisArg = null) {
        return ((it, num) => {
            let i = num(0);
            for (const v of it) {
                if (!fn.call(thisArg, v, i++, it)) return false;
            }
            return true;
        })(this.seed, this.length.constructor);
    }
    /**
     * `some` as `Array.prototype.some`
     */
    some(fn: predicate<T>, thisArg = null) {
        return ((it, ctor) => {
            let i = ctor(0);
            for (const v of it) {
                if (fn.call(thisArg, v, i++, it)) return true;
            }
            return false;
        })(this.seed, this.length.constructor);
    }
    /**
     * `concat` as `Array.prototype.concat`
     */
    concat(...args) {
        function* _gen(head, rest) {
            for (const v of head) yield v;
            for (const it of rest) {
                for (const v of it) yield v;
            }
        };
        return new Xiterable(() => _gen(
            this.seed,    /* check if v is primitive and wrap if so */
            args.map(v => (Object(v) === v ? v : [v]))
        ));
    }
    /**
     * `slice` as `Array.prototype.slice`
     */
    slice(start: anyint = 0, end: anyint = Number.POSITIVE_INFINITY): Xiterable<T> {
        // return this.drop(start).take(end - start);
        let ctor = this.length.constructor;
        if (start < 0 || end < 0) {
            if (this.isEndless) {
                throw new RangeError('negative indexes cannot be used')
            }
            if (start < 0) start = ctor(this.length) + ctor(start);
            if (end < 0) end = ctor(this.length) + ctor(end);
        }
        if (end <= start) return new Xiterable([]);
        let newlen = end === Number.POSITIVE_INFINITY
            ? ctor(this.length) - ctor(start)
            : ctor(end) - ctor(start);
        if (newlen < 0) newlen = ctor(0);
        let nth = (i) => {
            if (i < 0) i += newlen;
            return 0 <= i && i < newlen ? this.nth(start + i) : undefined;
        }
        return new Xiterable(() => function* (it, ctor) {
            let i = ctor(-1);
            for (const v of it) {
                ++i;
                if (i < start) continue;
                if (end <= i) break;
                yield v;
            }
        }(this.seed, ctor), newlen, nth);
    }
    //// MARK: functional methods not defined above
    /**
     */
    take(n: anyint): Xiterable<T> {
        let ctor = this.length.constructor;
        let newlen = ctor(n);
        if (ctor(this.length) < newlen) newlen = ctor(this.length);
        let nth = (i) => {
            if (i < 0) i += newlen;
            return 0 <= i && i < newlen ? this.nth(i) : undefined;
        }
        return new Xiterable(() => function* (it, num) {
            let i = num(0), nn = num(n);
            for (const v of it) {
                if (nn <= i++) break;
                yield v;
            }
        }(this.seed, ctor), newlen, nth);
    }
    /**
     */
    drop(n: anyint): Xiterable<T> {
        let ctor = this.length.constructor;
        let newlen = ctor(this.length) - ctor(n);
        if (newlen < 0) newlen = ctor(0);
        let nth = (i) => {
            if (i < 0) i += newlen;
            return 0 <= i && i < newlen ? this.nth(n + i) : undefined;
        }
        return new Xiterable(() => function* (it, num) {
            let i = num(0), nn = num(n);
            for (const v of it) {
                if (i++ < nn) continue;
                yield v;
            }
        }(this.seed, ctor), newlen, nth);
    }
    /**
     * returns an iterable with all elements replaced with `value`
     */
    filled<U>(value: U) {
        return this.map(() => value)
    }
    /**
     * reverse the iterable.  `this` must be finite and random accessible.
     */
    reversed(): Xiterable<T> {
        if (this.isEndless || this.nth === nthError) {
            throw new RangeError('cannot reverse an infinite iterable');
        }
        let length = this.length;
        const ctor = length.constructor;
        const nth = (n) => {
            const i = ctor(n) + ctor(n < 0 ? length : 0);
            return 0 <= i && i < length
                ? this.nth(ctor(length) - i - ctor(1)) : undefined;
        };
        return new Xiterable(() => function* (it, len) {
            let i = len;
            while (0 < i) yield it.nth(--i);
        }(this, length), length, nth);
    }
    /**
     * @returns {Xiterable}
     */
    zip(...args: Iterable<any>[]) {
        return Xiterable.zip(this, ...args);
    }
    //// MARK: static methods
    /**
     * @returns {Xiterable}
     */
    static zip(...args: Iterable<any>[]) {
        const xargs = args.map(v => new Xiterable(v));
        const length = min(...xargs.map(v => v.length))
        const ctor = this.length.constructor;
        const nth = (n: anyint) => {
            if (n < 0) n = ctor(n) + ctor(length);
            if (n < 0 || length <= n) return undefined;
            let result = [];
            for (const x of xargs) {
                result.push(x.nth(n))
            }
            return result;
        };
        return new Xiterable(() => function* (them) {
            while (true) {
                let elem = []
                for (const it of them) {
                    const nx = it.next();
                    if (nx.done) return;
                    elem.push(nx.value);
                }
                yield elem;
            }
        }(xargs.map(v => v[Symbol.iterator]())), length, nth);
    }
    /**
     * @returns {Xiterable}
     */
    static zipWith(fn: anyfunction, ...args) {
        if (typeof fn !== 'function') throw TypeError(
            `${fn} is not a function.`
        );
        return Xiterable.zip(...args).map(a => fn.apply(null, a));
    }
    /**
     *  `xrange` like `xrange()` of Python 2 (or `range()` of Python 3)
     */
    static xrange(b: anyint, e: anyint, d: anyint) {
        if (typeof b === 'undefined') [b, e, d] = [0, Number.POSITIVE_INFINITY, 1]
        if (typeof e === 'undefined') [b, e, d] = [0, b, 1]
        if (typeof d === 'undefined') [b, e, d] = [b, e, 1]
        let len = typeof b === 'bigint'
            ? (BigInt(e) - BigInt(b)) / BigInt(d)
            : Math.floor((Number(e) - Number(b)) / Number(d));
        let ctor = b.constructor;
        let nth = (n: anyint) => {
            if (n < 0) n = ctor(len) + ctor(n);
            if (len <= n) return undefined;
            return ctor(b) + ctor(d) * ctor(n);
        }
        return new Xiterable(() => function* (b, e, d) {
            let i = b;
            while (i < e) {
                yield i;
                i += ctor(d);
            }
        }(b, e, d), len, nth);
    }
    /** 
     */
    static repeat(value, times = Number.POSITIVE_INFINITY) {
        return new Xiterable(function* () {
            let i = 0;
            while (i++ < times) yield value;
        }, times, (n) => value);
    }
};
export const xiterable = (...args) => Xiterable.make(...args);
export const zip = Xiterable.zip.bind(Xiterable);
export const zipWith = Xiterable.zipWith.bind(Xiterable);
export const xrange = Xiterable.xrange.bind(Xiterable);
export const repeat = Xiterable.repeat.bind(Xiterable);

/**
 * xiterable.ts
 *
 * @version: 0.0.3
 * @author: dankogai
 *
*/
export const version = '0.0.3';
/**
 * `true` if `obj` is iterable.  `false` otherwise.
 */
export function isIterable(obj) {
    if (typeof obj === 'string') return true;  // string is iterable
    if (obj !== Object(obj)) return false; // other primitives
    return typeof obj[Symbol.iterator] === 'function';
}
/** 
 * BigInt workaround
 */
type anyint = number | bigint;
declare const BigInt: typeof Number;
function isInt(o) {
    return typeof o === 'number' ? (o | 0) === o : typeof o === 'bigint';
}
type anyfunction = (...any) => any;
type transform<T, U> = (T, anyint?, any?) => U;
type predicate<T> = (T, anyint?, any?) => boolean;
type accumulate<T, U> = (U, T, anyint?, any?) => U;
/**
 * 
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
        seed: T,
        length: anyint = Number.POSITIVE_INFINITY,
        nth: anyfunction = null
    ) {
        if (!isIterable(seed)) {
            if (typeof seed !== 'function') {
                throw TypeError(`${seed} is neither iterable or a generator`);
            }
            // treat obj as a generator
            seed = Object.create(null, { [Symbol.iterator]: { value: seed } });
        } else if (!nth) {
            if (typeof seed['nth'] === 'function') {
                nth = seed['nth'].bind(seed);
            } else if (isInt(seed['length'])) {
                nth = (n) => seed[Number(n < 0 ? length + n : n)];
            }
        }
        if (isInt(seed['length'])) {
            length = seed['length'];
        }
        if (!nth) nth = (n) => {
            throw TypeError('I do not know how to random access!');
        };
        Object.defineProperty(this, 'seed', { value: seed });
        Object.defineProperty(this, 'length', { value: length });
        Object.defineProperty(this, 'nth', { value: nth });
    }
    /**
     * 
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
    map<U>(fn: transform<T, U>, thisArg?) {
        const seed = this.seed;
        const nth = (n) => fn.call(thisArg, this.nth(n), n, seed);
        return new Xiterable(() => function* (it, num) {
            let i = num(0);
            for (const v of it) {
                yield fn.call(thisArg, v, i++, it);
            }
        }(seed, this.length.constructor), this.length, nth);
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
    filter(fn: predicate<T>, thisArg?) {
        let seed = this.seed;
        return new Xiterable(() => function* (it, num) {
            let i = num(0);
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
    findIndex(fn: predicate<T>, thisArg?) {
        let i = this.length.constructor(0);
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed)) return Number(i) - 1;
        }
        return -1;
    }
    /**
    * `indexOf` as `Array.prototype.indexOf`
    */
    indexOf(valueToFind, fromIndex: anyint = 0) {
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
    lastIndexOf(valueToFind, fromIndex?:anyint) {
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
    reduceRight<U>(fn: accumulate<T, any>, initialValue?: U) {
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
    join(separator = ',') {
        return this.reduce((a, v) => String(a) + separator + String(v));
    }
    /**
     * `every` as `Array.prototype.every`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
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
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
     */
    some(fn: predicate<T>, thisArg = null) {
        return ((it, num) => {
            let i = num(0);
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
    slice(start = 0, end = Number.POSITIVE_INFINITY) {
        if (start < 0 || end < 0) {
            throw new RangeError("negative index unsupported");
        }
        if (end <= start) return new Xiterable([]);
        // return this.drop(start).take(end - start);
        let ctor = this.length.constructor;
        let newlen = end === Number.POSITIVE_INFINITY
            ? ctor(this.length) - ctor(start)
            : ctor(end) - ctor(start);
        if (newlen < 0) newlen = ctor(0);
        let nth = (i) => {
            if (i < 0) i = newlen + i;
            if (newlen <= i) throw RangeError(`${i} is out of range`);
            return this.nth(start + i);
        }
        return new Xiterable(() => function* (it, num) {
            let i = num(-1);
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
     * 
     */
    take(n: anyint) {
        let ctor = this.length.constructor;
        let newlen = ctor(n);
        if (ctor(this.length) < newlen) newlen = ctor(this.length);
        let nth = (i) => {
            if (i < 0) i = newlen + i;
            if (newlen <= i) throw RangeError(`${i} is out of range`);
            return this.nth(i);
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
     * @param {Number} n
     * @returns {Xiterable}
     */
    drop(n: anyint) {
        let ctor = this.length.constructor;
        let newlen = ctor(this.length) - ctor(n);
        if (newlen < 0) newlen = ctor(0);
        let nth = (i) => {
            if (i < 0) i = newlen + i;
            if (newlen <= i) throw RangeError(`${i} is out of range`);
            return this.nth(n + i);
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
     * @param {*} value the value to replace each element
     */
    filled(value) {
        return this.map(() => value)
    }
    /**
     * reverse the iterable.  `this` must be finite and random accessible.
     */
    reversed() {
        if (this.isEndless) {
            throw new RangeError('cannot reverse an infinite iterable');
        }
        let length = this.length;
        const ctor = length.constructor;
        const nth = (n) => {
            const i = ctor(n) + ctor(n < 0 ? length : 0);
            return this.nth(ctor(length) - i - ctor(1))
        };
        return new Xiterable(() => function* (it, len) {
            let i = len;
            while (0 < i) yield it.nth(--i);
        }(this, this.length), this.length, nth);
    }
    /**
     * @returns {Xiterable}
     */
    zip(...args) {
        return new Xiterable(() => function* (head, rest) {
            while (true) {
                let next = head.next();
                if (next.done) return;
                let elem = next.value;
                for (const it of rest) {
                    const vd = it.next();
                    if (vd.done) return;
                    elem.push(vd.value);
                }
                yield elem;
            }
        }(
            this.map(v => [v])[Symbol.iterator](),
            args.map(v => v[Symbol.iterator]())
        ));
    }
    //// MARK: static methods
    /**
     * @returns {Xiterable}
     */
    static zip(arg0, ...args) {
        let it = new Xiterable(arg0);
        return it.zip.apply(it, args);
    }
    /**
     * @returns {Xiterable}
     */
    static zipWith(fn: anyfunction, ...args) {
        if (typeof fn !== 'function') throw TypeError(
            `${fn} is not a function.`
        );
        return Xiterable.zip.apply(null, args).map(a => fn.apply(null, a));
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
        let nth = (n:anyint) => {
            if (n < 0) n = ctor(len) + ctor(n);
            if (len <= n) throw RangeError(`${n} is out of range`);
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
export const xiterable = (obj) => new Xiterable(obj);
export const zip = Xiterable.zip;
export const zipWith = Xiterable.zipWith;
export const xrange = Xiterable.xrange;
export const repeat = Xiterable.repeat;

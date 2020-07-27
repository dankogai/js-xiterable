/**
 * xiterable.js
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
 * 
 */
type anyint = number | bigint;
declare const BigInt: typeof Number;
/**
 *
 */
export class Xiterable {
    seed: Iterable<any>;
    length: number | bigint | undefined;
    static get version() { return version }
    static isIterable(obj) { return isIterable(obj) }
    /**
     * @constructor
     */
    constructor(obj, length = Number.POSITIVE_INFINITY) {
        if (!isIterable(obj)) {
            if (typeof obj !== 'function') {
                throw TypeError(`${obj} is neither iterable or a generator`);
            }
            // treat obj as a generator
            obj = Object.create(null, { [Symbol.iterator]: { value: obj } })
            this.length = length;
        } else {
            this.length = obj.length;
        }
        Object.defineProperty(this, 'seed', { value: obj });
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
     * @param {Function} fn the mapping function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
    */
    map(fn, thisArg = null) {
        let seed = this.seed;
        return new Xiterable(function* () {
            let i = 0;
            for (const v of seed) {
                yield fn.call(thisArg, v, i++, seed);
            }
        });
    }
    /**
     * `forEach` as `Array.prototype.map`
     * @param {Function} fn the callback function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
    */
    forEach(fn, thisArg = null) {
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
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    filter(fn, thisArg = null) {
        let seed = this.seed;
        return new Xiterable(function* () {
            let i = 0;
            for (const v of seed) {
                if (!fn.call(thisArg, v, i++, seed)) continue;
                yield v;
            }
        });
    }
    /**
     * `find` as `Array.prototype.find`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    find(fn, thisArg = null) {
        let i = 0;
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed)) return v;
        }
    }
    /**
     * `findIndex` as `Array.prototype.find`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    findIndex(fn, thisArg = null) {
        let i = 0;
        for (const v of this.seed) {
            if (fn.call(thisArg, v, i++, this.seed)) return i - 1;
        }
        return -1;
    }
    /**
    * `indexOf` as `Array.prototype.indexOf`
    * 
    */
    indexOf(valueToFind, fromIndex = 0) {
        if (fromIndex < 0) {
            throw new RangeError("negative index unsupported");
        }
        return this.entries().findIndex(
            v => fromIndex <= v[0] && Object.is(v[1], valueToFind)
        );
    }
    /**
     * `includes` as `Array.prototype.includes`
     * 
     */
    includes(valueToFind, fromIndex = 0) {
        return this.indexOf(valueToFind, fromIndex) > -1;
    }
    /**
     * `reduce` as `Array.prototype.reduce`
     * @param {Function} fn the reducer function
     * @param {Object} [initialValue] the initial value
     */
    reduce(fn) {
        let it = this.seed[Symbol.iterator]();
        let [a, i] = 1 < arguments.length ?
            [arguments[1], 0] : [it.next().value, 1];
        // for (const v of it) {
        let next;
        while ((next = it.next()).done) {
            a = fn(a, next.value, i++, this.seed);
        }
        return a;
    }
    /**
     * `flat` as `Array.prototype.flat`
     * 
     * @param {Number} depth specifies how deeply to flatten. defaults to `1`
     * @returns {Xiterable} a new `Xiterable` with flattended elements
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
     * 
     * @param {Function} fn the mapping function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    flatMap(fn, thisArg = null) {
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
    every(fn, thisArg = null) {
        return ((it) => {
            let i = 0;
            for (const v of it) {
                if (!fn.call(thisArg, v, i++, it)) return false;
            }
            return true;
        })(this.seed);
    }
    /**
     * `some` as `Array.prototype.some`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
     */
    some(fn, thisArg = null) {
        return ((it) => {
            let i = 0;
            for (const v of it) {
                if (fn.call(thisArg, v, i++, it)) return true;
            }
            return false;
        })(this.seed);
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
     * 
     * **CAVEAT**: `[...this]` is internally created if `start` or `end` is negative
     * @param {Number} start
     * @param {Number} end
     * @returns {Xiterable} a new `Xiterable` with sliced elements
     */
    slice(start = 0, end = Number.POSITIVE_INFINITY) {
        if (start < 0 || end < 0) {
            throw new RangeError("negative index unsupported");
        }
        if (end <= start) return new Xiterable([]);
        // return this.drop(start).take(end - start);
        let seed = this.seed;
        return new Xiterable(function* () {
            let i = -1;
            for (const v of seed) {
                ++i;
                if (i < start) continue;
                if (end <= i) break;
                yield v;
            }
        });
    }
    //// MARK: functional methods not defined above
    /**
     * @returns {Xiterable}
     */
    // reversed() {
    //     return new Xiterable([...this].reverse());
    // }
    /**
     * @param {Number} n
     * @returns {Xiterable}
     */
    take(n) {
        return new Xiterable(() => function* (it) {
            let i = 0;
            for (const v of it) {
                if (n <= i++) break;
                yield v;
            }
        }(this.seed));
    }
    /**
     * @param {Number} n
     * @returns {Xiterable}
     */
    drop(n) {
        return new Xiterable(() => function* (it) {
            let i = 0;
            for (const v of it) {
                if (i++ < n) continue;
                yield v;
            }
        }(this.seed));
    }
    /**
     * returns an iterator with all elements replaced with `value`
     * @param {*} value the value to replace each element
     */
    filled(value) {
        return this.map(() => value)
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
     * @param {Function} fn
     * @returns {Xiterable}
     */
    static zipWith(fn, ...args) {
        if (typeof fn !== 'function') throw TypeError(
            `${fn} is not a function.`
        );
        return Xiterable.zip.apply(null, args).map(a => fn.apply(null, a));
    }
    /**
     *  `xrange` like `xrange()` of Python 2 (or `range()` of Python 3)
     *
     * @param {number} [b] if omitted, returns an infinite stream of `0,1,2...`
     * @param {number} [e] if omitted, `0..<b`.  otherwise `b..<e`.
     * @param {number} [d] step between numbers. defaults to `1`
     */
    static xrange(b, e, d) {
        if (typeof b === 'undefined') [b, e, d] = [0, Number.POSITIVE_INFINITY, 1]
        if (typeof e === 'undefined') [b, e, d] = [0, b, 1]
        if (typeof d === 'undefined') [b, e, d] = [b, e, 1]
        return new Xiterable(() => function* (b, e, d) {
            let i = b;
            while (i < e) {
                yield i;
                i += d;
            }
        }(b, e, d));
    }
    /**
     */
    static repeat(value, times = Number.POSITIVE_INFINITY) {
        return new Xiterable(function* () {
            let i = 0;
            while (i++ < times) yield value;
        });
    }
};
export const xiterable = (obj) => new Xiterable(obj);
export const zip = Xiterable.zip;
export const zipWith = Xiterable.zipWith;
export const xrange = Xiterable.xrange;
export const repeat = Xiterable.repeat;

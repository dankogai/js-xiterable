/**
 * xiterator.js
 *
 * @version: 0.0.0
 * @author: dankogai
 *
*/
export class Xiterator {
    static get version() {
        return '0.0.0';
    }
    /**
     * `true` if `obj` is iterable.  `false` otherwise.
     */
    static isIterable(obj) {
        if (typeof obj === 'string') return true;  // string is iterable
        if (obj !== Object(obj))     return false; // other primitives
        return typeof obj[Symbol.iterator] === 'function';
    }
    /**
     * @constructor
     * @param {Iterable} obj the source iterable
     */
    constructor(obj) {
        if (!isIterable(obj)) {
            throw TypeError(`${obj} is not an iterator`);
        }
        Object.defineProperty(this, 'iter', { value:obj[Symbol.iterator]() });
    }
    [Symbol.iterator]() {
        return this.iter;
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
    map(fn, thisArg=null) {
        return new Xiterator(function*(it){
            let i = 0;
            for (const v of it) {
                yield fn.call(thisArg, v, i++, it);
            }
        }(this.iter));
    }
    /**
     * `forEach` as `Array.prototype.map`
     * @param {Function} fn the callback function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
    */
    forEach(fn, thisArg=null) {
        ((it) => {
            let i = 0;
            for (const v of it) {
                fn.call(thisArg, v, i++, it);
            }
        })(this.iter);
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
    filter(fn, thisArg=null) {
        return new Xiterator(function*(it){
            let i = 0;
            for (const v of it) {
                if (!fn.call(thisArg, v, i++, it)) continue;
                yield v;
            }
        }(this.iter));
    }
    /**
     * `find` as `Array.prototype.find`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    find(fn, thisArg=null) {
        return ((it) => {
            let i = 0;
            for (const v of it) {
                if (fn.call(thisArg, v, i++, it)) return v;
            }
        })(this.iter);
    }
    /**
     * `findIndex` as `Array.prototype.find`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    findIndex(fn, thisArg=null) {
        return ((it) => {
            let i = 0;
            for (const v of it) {
                if (fn.call(thisArg, v, i++, it)) return i-1;
            }
            return -1;
        })(this.iter);
    }
    /**
     * `includes` as `Array.prototype.includes`
     * 
     * **CAVEAT**: `[...this]` is internally created if `fromIndex` is negative
     */
    includes(valueToFind, fromIndex=0) {
        if (fromIndex < 0) {
            throw new RangeError("negative index unsupported");
        }
        return this.entries().findIndex(
            v => fromIndex <= v[0] && Object.is(v[1], valueToFind)
        ) > -1;
    }
    /**
     * `reduce` as `Array.prototype.reduce`
     * @param {Function} fn the reducer function
     * @param {Object} [initialValue] the initial value
     */
    reduce(fn, initialValue) {
        return ((it) => {
            let [a, i] = 1 < arguments.length ? [initialValue, 0] : [it.next().value, 1]
            for (const v of it) {
                a = fn(a, v, i++, it);
            }
            return a;
        })(this.iter);
    }
    /**
     * `reduceRight` as `Array.prototype.reduceRight`
     * 
     * **CAVEAT**: `[...this]` is internally created
     */
    reduceRight(...args) {
        return Array.prototype.reduceRight.apply([...this], args);
    }
    /**
     * `flat` as `Array.prototype.flat`
     * 
     * @param {Number} depth specifies how deeply to flatten. defaults to `1`
     * @returns {Xiterator} a new `Xiterator` with flattended elements
     */
    flat(depth=1) {
        if (depth === undefined) depth = 1;
        function* _flatten(iter, depth) {
            for (const it of iter) {
                if (isIterable(it) && depth > 0) {
                    yield* _flatten(it, depth - 1);
                } else {
                    yield it;
                }
            }
        }
        return new Xiterator(_flatten(this, depth));
    }
    /**
     * `flatMap` as `Array.prototype.flatMap`
     * 
     * @param {Function} fn the mapping function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    flatMap(fn, thisArg=null) {
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
    every(fn, thisArg=null) {
        return ((it) => {
            let x = {done:false};
            let i = 0;
            let a;
            while (!(x = it.next()).done) {
                let v = x.value;
                if (!fn.call(thisArg, v, i++, it)) return false;
            }
            return true;
        })(this.iter);
    }
    /**
     * `some` as `Array.prototype.some`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
     */
    some(fn, thisArg=null) {
        return ((it) => {
            let x = {done:false};
            let i = 0;
            let a;
            while (!(x = it.next()).done) {
                let v = x.value;
                if (fn.call(thisArg, v, i++, it)) return true;
            }
            return false;
        })(this.iter);
    }
    /**
     * `concat` as `Array.prototype.concat`
     */
    concat(...args) {
        return new Xiterator(function*(head, rest){
            for (const v of head) yield v;
            for (const it of rest) {
                for (const v of it) yield v;
            }
        }(
            this.iter,    /* check if v is primitive and wrap if so */
            args.map(v => (Object(v) === v ? v : [v])[Symbol.iterator]())
        ));
    }
    /**
     * `slice` as `Array.prototype.slice`
     * 
     * **CAVEAT**: `[...this]` is internally created if `start` or `end` is negative
     * @param {Number} start
     * @param {Number} end
     * @returns {Xiterator} a new `Xiterator` with sliced elements
     */
    slice(start = 0, end = Number.POSITIVE_INFINITY) {
        if (start < 0 || end < 0) {
            throw new RangeError("negative index unsupported");
        }
        if (end <= start) return new Xiterator([]);
        // return this.drop(start).take(end - start);
        return new Xiterator(function*(it){
            let i = -1;
            for (const v of it) {
                ++i;
                if (i <  start) continue;
                if (end <=   i) break;
                yield v;
            }
        }(this.iter));
    }
    //// MARK: functional methods not defined above
    /**
     * @returns {Xiterator}
     */
    reversed() {
        return new Xiterator([...this].reverse());
    }
    /**
     * @param {Number} n
     * @returns {Xiterator}
     */
    take(n) {
        return new Xiterator(function*(it){
            let i = 0;
            for (const v of it) {
                if (n <= i++) break;
                yield v;
            }
        }(this.iter));
    }
    /**
     * @param {Number} n
     * @returns {Xiterator}
     */
    drop(n) {
        return new Xiterator(function*(it){
            let i = 0;
            for (const v of it) {
                if (i++ < n) continue;
                yield v;
            }
        }(this.iter));
    }
    /**
     * returns an iterator with all elements replaced with `value`
     * @param {*} value the value to replace each element
     */
    filled(value) {
        return this.map(() => value)
    }
    /**
     * @returns {Xiterator}
     */
    zip(...args) {
        return new Xiterator(function*(head, rest) {
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
     * @returns {Xiterator}
     */
    static zip(arg0, ...args) {
        if (typeof arg0[Symbol.iterator] !== 'function') {
            throw TypeError(`${arg0} is not an iterator`);
        }
        let it = new Xiterator(arg0);
        return it.zip.apply(it, args);
    }
    /**
     * @param {Function} fn
     * @returns {Xiterator}
     */
    static zipWith(fn, ...args) {
        if (typeof fn !== 'function') throw TypeError(
            `${fn} is not a function.`
        );
        return Xiterator.zip.apply(null, args).map(a => fn.apply(null, a));
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
        return new Xiterator(function*(b, e, d){
            let i = b;
            while (i < e) {
                yield i;
                i += d;
            }
        }(b, e, d));
    }
    /**
     */
    static repeat(value, times=Number.POSITIVE_INFINITY) {
        return new Xiterator(function *(){
            let i = 0;
            while (i++ < times) yield value;
        }());
    }
};
//Xiterator.version = version;
/**
 * @returns {Xiterator} simply returns `new Xiterator(obj)`
 */
export const xiterator = (obj) => new Xiterator(obj);
export const isIterable = Xiterator.isIterable;
export const zip = Xiterator.zip;
export const zipWith = Xiterator.zipWith;
export const xrange = Xiterator.xrange;
export const repeat = Xiterator.repeat;

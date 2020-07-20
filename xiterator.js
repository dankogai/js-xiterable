/**
 * xiterator.js
 *
 * @version: 0.0.0
 * @author: dankogai
 *
 * @typedef {Function} callback 
*/
export class Xiterator {
    static get version() {
        return '0.0.0';
    }
    /**
     * Creates an instance of Xiterator.
     *
     * @constructor
     * @param {Iterable} obj the source iterator
     */
    constructor(obj) {
        if (typeof obj[Symbol.iterator] !== 'function') {
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
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
     * @param {callback} transform the mapping function
     * @param {Object} [thisArg] Value to use as `this` when executing `transform`
    */
    map(transform, thisArg) {
        return new Xiterator(function*(it){
            let i = 0;
            for (const v of it) {
                yield transform.call(thisArg, v, i++, it);
            }
        }(this.iter));
    }
    /**
     * `forEach` as `Array.prototype.map`
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     * @param {callback} callback the callback function
     * @param {Object} [thisArg] Value to use as `this` when executing `callback`
    */
    forEach(callback, thisArg) {
        ((it) => {
            let i = 0;
            for (const v of it) {
                callback.call(thisArg, x.value, i++, it);
            }
        })(this.iter);
    }
    /**
    * `entries` as `Array.prototype.entries`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries
    */
    entries() {
       return this.map((v, i) => [i, v]);
    }
    /**
    * `keys` as `Array.prototype.entries`
    * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys
    */
    keys() {
        return this.map((v, i) => i);
    }
    /**
    * `values` as `Array.prototype.entries`
    * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys
    */
    values() {
        return this.map((v, i) => v);
    }
    /**
     * `filter` as `Array.prototype.filter`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     * @param {callback} predicate the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `predicate`
     */
    filter(predicate, thisArg) {
        return new Xiterator(function*(it){
            let i = 0;
            for (const v of it) {
                if (!predicate.call(thisArg, v, i++, it)) continue;
                yield v;
            }
        }(this.iter));
    }
    /**
     * `find` as `Array.prototype.find`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
     * @param {callback} predicate the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `predicate`
     */
    find(predicate, thisArg) {
        return ((it) => {
            let i = 0;
            for (const v of it) {
                if (predicate.call(thisArg, v, i++, it)) return v;
            }
        })(this.iter);
    }
    /**
     * `findIndex` as `Array.prototype.find`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
     * @param {callback} predicate the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `predicate`
     * @returns {Number}
     */
    findIndex(predicate, thisArg) {
        return ((it) => {
            let i = 0;
            for (const v of it) {
                if (predicate.call(thisArg, v, i++, it)) return i-1;
            }
            return -1;
        })(this.iter);
    }
    /**
     * `includes` as `Array.prototype.includes`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
     * 
     * **CAVEAT**: `[...this]` is internally created if `fromIndex` is negative
     * @param {*} valueToFind the value to find
     * @param {Object} [fromIndex] Value to use as `this` when executing `predicate`
     * @returns {Boolean}
     */
    includes(valueToFind, fromIndex=0) {
        return 0 <= fromIndex 
        ? this.entries().findIndex(v => fromIndex <= v[0] && Object.is(v[1], valueToFind)) > -1
        : Array.prototype.includes.apply([...this], arguments);
    }
    /**
     * `lastIndexOf` as `Array.prototype.find`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
     * @param {*} valueToFind the value to find
     * @param {Object} [fromIndex] Value to use as `this` when executing `predicate`
     */
    lastIndexOf(valueToFind, fromIndex=0) {
        return Array.prototype.lastIndexOf.apply([...this], arguments);
    }
    /**
     * `reduce` as `Array.prototype.reduce`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
     * @param {callback} reducer the reducer function
     * @param {Object} [initialValue] the initial value
     */
    reduce(reducer, initialValue) {
        return ((it) => {
            let [a, i] = 1 < arguments.length ? [initialValue, 0] : [it.next().value, 1]
            for (const v of it) {
                a = reducer(a, v, i++, it);
            }
            return a;
        })(this.iter);
    }
    /**
     * `reduceRight` as `Array.prototype.reduceRight`
     * 
     * **CAVEAT**: `[...this]` is internally created
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
     */
    reduceRight(reducer, initialValue) {
        return Array.prototype.reduceRight.apply([...this], arguments);
    }
    /**
     * `flat` as `Array.prototype.flat`
     * 
     * **CAVEAT**: `[...this]` is internally created
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
     * @returns {Xiterator} a new `Xiterator` with flattended elements
     */
    flat() {
        return new Xiterator(Array.prototype.flat.apply([...this], arguments));
    }
    /**
     * `flatMap` as `Array.prototype.flatMap`
     * 
     * **CAVEAT**: `[...this]` is internally created
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
     * @returns {Xiterator} a new `Xiterator` with flatMapped elements
     */
    flatMap() {
        return new Xiterator(Array.prototype.flatMap.apply([...this], arguments));
    }
    /**
    * `join` as `Array.prototype.join`
    * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
    * @param {String} separator
    * @returns {String}
    */
    join(separator = ',') {
        return this.reduce((a, v) => String(a) + separator + String(v));
    }
    /**
     * `every` as `Array.prototype.every`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
     * @param {Function} predicate the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `transform`
     * @returns {Boolean}
     */
    every(predicate, thisArg) {
        return ((it) => {
            let x = {done:false};
            let i = 0;
            let a;
            while (!(x = it.next()).done) {
                let v = x.value;
                if (!predicate.call(thisArg, v, i++, it)) return false;
            }
            return true;
        })(this.iter);
    }
    /**
     * `some` as `Array.prototype.some`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     * @param {Function} predicate the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `transform`
     * @returns {Boolean}
     */
    some(predicate, thisArg) {
        return ((it) => {
            let x = {done:false};
            let i = 0;
            let a;
            while (!(x = it.next()).done) {
                let v = x.value;
                if (predicate.call(thisArg, v, i++, it)) return true;
            }
            return false;
        })(this.iter);
    }
    /**
     * `concat` as `Array.prototype.some`
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
     */
    concat() {
        let that = this.iter;
        for (const arg of arguments) {
            // if primitive, wrap w/ an array
            let it = (Object(arg) === arg ? arg : [arg])[Symbol.iterator]();
            that = (function*(head, tail){
                for (const v of head) yield v;
                for (const v of tail) yield v;
            })(that, it);
        }
        return new Xiterator(that);
    }
    /**
     * `slice` as `Array.prototype.slice`
     * 
     * **CAVEAT**: `[...this]` is internally created
     * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
     * @returns {Xiterator} a new `Xiterator` with flatMapped elements
     */
    slice() {
        return new Xiterator(Array.prototype.slice.apply([...this], arguments));
    }
    
};
//Xiterator.version = version;
/**
 * @returns {Xiterator} simply returns `new Xiterator(obj)`
 */
export const xiterator = (obj) => new Xiterator(obj);

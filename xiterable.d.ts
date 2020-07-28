/**
 * xiterable.ts
 *
 * @version: 0.0.3
 * @author: dankogai
 *
*/
export declare const version = "0.0.3";
/**
 * `true` if `obj` is iterable.  `false` otherwise.
 */
export declare function isIterable(obj: any): boolean;
/**
 * BigInt workaround
 */
declare type anyint = number | bigint;
declare type callback = (...any: any[]) => any;
/**
 *
 */
export declare class Xiterable {
    seed: Iterable<any>;
    length: anyint;
    static get version(): string;
    static isIterable(obj: any): boolean;
    /**
     * @constructor
     */
    constructor(obj: any, length?: anyint);
    /**
     *
     */
    get isEndless(): boolean;
    /**
     * does `new`
     * @param {*} args
     * @returns {Xiterable}
     */
    static make(...args: any[]): any;
    /**
     * Same as `make` but takes a single array `arg`
     *
     * cf. https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
     * @param {Array} arg
     * @returns {Xiterable}
     */
    static vmake(arg: any): any;
    [Symbol.iterator](): Iterator<any, any, undefined>;
    toArray(): any[];
    /**
     * `map` as `Array.prototype.map`
     * @param {Function} fn the mapping function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
    */
    map(fn: callback, thisArg?: any): Xiterable;
    /**
     * `forEach` as `Array.prototype.map`
     * @param {Function} fn the callback function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
    */
    forEach(fn: callback, thisArg?: any): void;
    /**
    * `entries` as `Array.prototype.entries`
    */
    entries(): Xiterable;
    /**
    * `keys` as `Array.prototype.keys`
    */
    keys(): Xiterable;
    /**
    * `values` as `Array.prototype.values`
    */
    values(): Xiterable;
    /**
     * `filter` as `Array.prototype.filter`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    filter(fn: callback, thisArg?: any): Xiterable;
    /**
     * `find` as `Array.prototype.find`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    find(fn: callback, thisArg?: any): any;
    /**
     * `findIndex` as `Array.prototype.find`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    findIndex(fn: callback, thisArg?: any): number;
    /**
    * `indexOf` as `Array.prototype.indexOf`
    *
    */
    indexOf(valueToFind: any, fromIndex?: number): number;
    /**
     * `includes` as `Array.prototype.includes`
     *
     */
    includes(valueToFind: any, fromIndex?: number): boolean;
    /**
     * `reduce` as `Array.prototype.reduce`
     * @param {Function} fn the reducer function
     * @param {Object} [initialValue] the initial value
     */
    reduce(fn: callback): any;
    /**
     * `flat` as `Array.prototype.flat`
     *
     * @param {Number} depth specifies how deeply to flatten. defaults to `1`
     * @returns {Xiterable} a new `Xiterable` with flattended elements
     */
    flat(depth?: number): Xiterable;
    /**
     * `flatMap` as `Array.prototype.flatMap`
     *
     * @param {Function} fn the mapping function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     */
    flatMap(fn: callback, thisArg?: any): Xiterable;
    /**
    * `join` as `Array.prototype.join`
    * @param {String} separator
    * @returns {String}
    */
    join(separator?: string): any;
    /**
     * `every` as `Array.prototype.every`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
     */
    every(fn: callback, thisArg?: any): boolean;
    /**
     * `some` as `Array.prototype.some`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
     */
    some(fn: callback, thisArg?: any): boolean;
    /**
     * `concat` as `Array.prototype.concat`
     */
    concat(...args: any[]): Xiterable;
    /**
     * `slice` as `Array.prototype.slice`
     *
     * **CAVEAT**: `[...this]` is internally created if `start` or `end` is negative
     * @param {Number} start
     * @param {Number} end
     * @returns {Xiterable} a new `Xiterable` with sliced elements
     */
    slice(start?: number, end?: number): Xiterable;
    /**
     * @returns {Xiterable}
     */
    /**
     * @param {Number} n
     * @returns {Xiterable}
     */
    take(n: any): Xiterable;
    /**
     * @param {Number} n
     * @returns {Xiterable}
     */
    drop(n: any): Xiterable;
    /**
     * returns an iterator with all elements replaced with `value`
     * @param {*} value the value to replace each element
     */
    filled(value: any): Xiterable;
    /**
     *
     */
    get hasNth(): boolean;
    /**
     * nth
     */
    nth(n: anyint): any;
    /**
     * returns an iterator which reverses entries.
     */
    reversed(): Xiterable;
    /**
     * @returns {Xiterable}
     */
    zip(...args: any[]): Xiterable;
    /**
     * @returns {Xiterable}
     */
    static zip(arg0: any, ...args: any[]): any;
    /**
     * @param {Function} fn
     * @returns {Xiterable}
     */
    static zipWith(fn: any, ...args: any[]): any;
    /**
     *  `xrange` like `xrange()` of Python 2 (or `range()` of Python 3)
     *
     * @param {number} [b] if omitted, returns an infinite stream of `0,1,2...`
     * @param {number} [e] if omitted, `0..<b`.  otherwise `b..<e`.
     * @param {number} [d] step between numbers. defaults to `1`
     */
    static xrange(b: any, e: any, d: any): Xiterable;
    /**
     */
    static repeat(value: any, times?: number): Xiterable;
}
export declare const xiterable: (obj: any) => Xiterable;
export declare const zip: typeof Xiterable.zip;
export declare const zipWith: typeof Xiterable.zipWith;
export declare const xrange: typeof Xiterable.xrange;
export declare const repeat: typeof Xiterable.repeat;
export {};

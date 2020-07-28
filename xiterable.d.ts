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
declare type anyfunction = (...any: any[]) => any;
declare type transform<T, U> = (T: any, anyint?: any, any?: any) => U;
declare type predicate<T> = (T: any, anyint?: any, any?: any) => boolean;
declare type accumulate<T, U> = (U: any, T: any, anyint?: any, any?: any) => U;
/**
 *
 */
export declare class Xiterable<T> {
    seed: Iterable<T>;
    length: anyint;
    nth: (anyint: any) => T;
    static get version(): string;
    static isIterable(obj: any): boolean;
    /**
     * @constructor
     */
    constructor(seed: T, length?: anyint, nth?: anyfunction);
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
    [Symbol.iterator](): Iterator<T, any, undefined>;
    toArray(): T[];
    /**
     * `map` as `Array.prototype.map`
    */
    map<U>(fn: transform<T, U>, thisArg?: any): Xiterable<() => Generator<any, void, unknown>>;
    /**
     * `forEach` as `Array.prototype.map`
    */
    forEach<U>(fn: transform<T, U>, thisArg?: any): void;
    /**
    * `entries` as `Array.prototype.entries`
    */
    entries(): Xiterable<() => Generator<any, void, unknown>>;
    /**
    * `keys` as `Array.prototype.keys`
    */
    keys(): Xiterable<() => Generator<any, void, unknown>>;
    /**
    * `values` as `Array.prototype.values`
    */
    values(): Xiterable<() => Generator<any, void, unknown>>;
    /**
     * `filter` as `Array.prototype.filter`
     */
    filter(fn: predicate<T>, thisArg?: any): Xiterable<() => Generator<T, void, unknown>>;
    /**
     * `find` as `Array.prototype.find`
     */
    find(fn: predicate<T>, thisArg?: any): T;
    /**
     * `findIndex` as `Array.prototype.find`
     */
    findIndex(fn: predicate<T>, thisArg?: any): number;
    /**
    * `indexOf` as `Array.prototype.indexOf`
    */
    indexOf(valueToFind: any, fromIndex?: anyint): number;
    /**
    * `lastIndexOf` as `Array.prototype.lastIndexOf`
    */
    lastIndexOf(valueToFind: any, fromIndex?: anyint): number;
    /**
     * `includes` as `Array.prototype.includes`
     */
    includes(valueToFind: T, fromIndex?: anyint): boolean;
    /**
     * `reduce` as `Array.prototype.reduce`
     */
    reduce<U>(fn: accumulate<T, any>, initialValue?: U): U;
    /**
     *  `reduceRight` as `Array.prototype.reduceRight`
     */
    reduceRight<U>(fn: accumulate<T, any>, initialValue?: U): any;
    /**
     * `flat` as `Array.prototype.flat`
     */
    flat(depth?: number): Xiterable<() => any>;
    /**
     * `flatMap` as `Array.prototype.flatMap`
    */
    flatMap<U>(fn: transform<T, U>, thisArg?: any): Xiterable<() => any>;
    /**
    * `join` as `Array.prototype.join`
    * @param {String} separator
    * @returns {String}
    */
    join(separator?: string): unknown;
    /**
     * `every` as `Array.prototype.every`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
     */
    every(fn: predicate<T>, thisArg?: any): boolean;
    /**
     * `some` as `Array.prototype.some`
     * @param {Function} fn the predicate function
     * @param {Object} [thisArg] Value to use as `this` when executing `fn`
     * @returns {Boolean}
     */
    some(fn: predicate<T>, thisArg?: any): boolean;
    /**
     * `concat` as `Array.prototype.concat`
     */
    concat(...args: any[]): Xiterable<() => Generator<any, void, unknown>>;
    /**
     * `slice` as `Array.prototype.slice`
     */
    slice(start?: number, end?: number): any;
    /**
     *
     */
    take(n: anyint): Xiterable<() => Generator<T, void, unknown>>;
    /**
     * @param {Number} n
     * @returns {Xiterable}
     */
    drop(n: anyint): Xiterable<() => Generator<T, void, unknown>>;
    /**
     * returns an iterable with all elements replaced with `value`
     * @param {*} value the value to replace each element
     */
    filled(value: any): Xiterable<() => Generator<any, void, unknown>>;
    /**
     * reverse the iterable.  `this` must be finite and random accessible.
     */
    reversed(): Xiterable<() => Generator<T, void, unknown>>;
    /**
     * @returns {Xiterable}
     */
    zip(...args: any[]): Xiterable<() => Generator<any, void, unknown>>;
    /**
     * @returns {Xiterable}
     */
    static zip(arg0: any, ...args: any[]): any;
    /**
     * @returns {Xiterable}
     */
    static zipWith(fn: anyfunction, ...args: any[]): any;
    /**
     *  `xrange` like `xrange()` of Python 2 (or `range()` of Python 3)
     */
    static xrange(b: anyint, e: anyint, d: anyint): Xiterable<() => Generator<number | bigint, void, unknown>>;
    /**
     */
    static repeat(value: any, times?: number): Xiterable<() => Generator<any, void, unknown>>;
}
export declare const xiterable: (obj: any) => Xiterable<any>;
export declare const zip: typeof Xiterable.zip;
export declare const zipWith: typeof Xiterable.zipWith;
export declare const xrange: typeof Xiterable.xrange;
export declare const repeat: typeof Xiterable.repeat;
export {};

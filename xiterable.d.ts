/**
 * xiterable.ts
 *
 * @version: 0.1.5
 * @author: dankogai
 *
*/
export declare const version = "0.1.5";
declare type anyint = number | bigint;
declare type anyfunction = (...any: any[]) => any;
declare type transform<T, U> = (T: any, anyint?: any, any?: any) => U;
declare type predicate<T> = (T: any, anyint?: any, any?: any) => boolean;
declare type accumulate<T, U> = (U: any, T: any, anyint?: any, any?: any) => U;
declare type subscript = (anyint: any) => any;
/**
 * `true` if `obj` is iterable.  `false` otherwise.
 */
export declare function isIterable(obj: any): boolean;
/**
 * `true` if `o` is an integer (Number with integral value or BigInt).
 */
export declare function isAnyInt(o: any): boolean;
/**
 * main class
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
    constructor(seed: Iterable<T> | anyfunction, length?: anyint, nth?: subscript);
    make(...args: any[]): any;
    /**
     * `true` if this iterable is endless
     */
    get isEndless(): boolean;
    /**
     * does `new`
     * @param {*} args
     * @returns {Xiterable}
     */
    static of(...args: any[]): any;
    /**
     * Same as `of` but takes a single array `arg`
     *
     * cf. https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
     * @param {Array} arg
     * @returns {Xiterable}
     */
    static from(arg: any): any;
    [Symbol.iterator](): Iterator<T, any, undefined>;
    toArray(): T[];
    /**
     * `map` as `Array.prototype.map`
    */
    map<U>(fn: transform<T, U>, thisArg?: any): Xiterable<U>;
    /**
     * `forEach` as `Array.prototype.map`
    */
    forEach<U>(fn: transform<T, U>, thisArg?: any): void;
    /**
    * `entries` as `Array.prototype.entries`
    */
    entries(): Xiterable<any[]>;
    /**
    * `keys` as `Array.prototype.keys`
    */
    keys(): Xiterable<any>;
    /**
    * `values` as `Array.prototype.values`
    */
    values(): Xiterable<any>;
    /**
    * like `filter` but instead of removing elements
    * that do not meet the predicate, it replaces them with `undefined`.
    */
    mapFilter(fn: predicate<T>, thisArg?: any): Xiterable<T>;
    /**
     * `filter` as `Array.prototype.filter`
     */
    filter(fn: predicate<T>, thisArg?: any): Xiterable<T>;
    /**
     * `find` as `Array.prototype.find`
     */
    find(fn: predicate<T>, thisArg?: any): T;
    /**
     * `findIndex` as `Array.prototype.find`
     */
    findIndex(fn: predicate<T>, thisArg?: any): anyint;
    /**
    * `indexOf` as `Array.prototype.indexOf`
    */
    indexOf(valueToFind: any, fromIndex?: anyint): anyint;
    /**
    * `lastIndexOf` as `Array.prototype.lastIndexOf`
    */
    lastIndexOf(valueToFind: any, fromIndex?: anyint): anyint;
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
    reduceRight<U>(fn: accumulate<T, any>, initialValue?: U): U;
    /**
     * `flat` as `Array.prototype.flat`
     */
    flat(depth?: number): Xiterable<unknown>;
    /**
     * `flatMap` as `Array.prototype.flatMap`
    */
    flatMap<U>(fn: transform<T, U>, thisArg?: any): Xiterable<unknown>;
    /**
    * `join` as `Array.prototype.join`
    * @param {String} separator
    * @returns {String}
    */
    join(separator?: string): string;
    /**
     * `every` as `Array.prototype.every`
     */
    every(fn: predicate<T>, thisArg?: any): boolean;
    /**
     * `some` as `Array.prototype.some`
     */
    some(fn: predicate<T>, thisArg?: any): boolean;
    /**
     * `concat` as `Array.prototype.concat`
     */
    concat(...args: any[]): Xiterable<unknown>;
    /**
     * `slice` as `Array.prototype.slice`
     */
    slice(start?: anyint, end?: anyint): Xiterable<T>;
    /**
     * returns an iterable with the first `n` elements from `this`.
     */
    take(n: anyint): Xiterable<T>;
    /**
     * returns an iterable without the first `n` elements from `this`
     */
    drop(n: anyint): Xiterable<T>;
    /**
     * returns an iterable with which iterates `this` till `fn` is no longer `true`.
     */
    takeWhile(fn: predicate<T>, thisArg?: any): Xiterable<T>;
    /**
     * returns an iterable with all elements replaced with `value`
     */
    filled<U>(value: U): Xiterable<U>;
    /**
     * reverse the iterable.  `this` must be finite and random accessible.
     */
    reversed(): Xiterable<T>;
    /**
     * @returns {Xiterable}
     */
    zip(...args: Iterable<any>[]): Xiterable<unknown>;
    /**
     * @returns {Xiterable}
     */
    static zip(...args: Iterable<any>[]): Xiterable<unknown>;
    /**
     * @returns {Xiterable}
     */
    static zipWith(fn: anyfunction, ...args: any[]): Xiterable<any>;
    /**
     *  `xrange` like `xrange()` of Python 2 (or `range()` of Python 3)
     */
    static xrange(b: anyint, e: anyint, d: anyint): Xiterable<unknown>;
    /**
     */
    static repeat(value: any, times?: number): Xiterable<unknown>;
}
export declare const xiterable: any;
export declare const zip: any;
export declare const zipWith: any;
export declare const xrange: any;
export declare const repeat: any;
export {};

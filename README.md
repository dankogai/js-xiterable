[![build status](https://secure.travis-ci.org/dankogai/js-xiterator.png)](http://travis-ci.org/dankogai/js-xiterator)

# js-xiterator

Make ES6 Iterators Functional Again

## Synopsis

```javascript
const count = function*(n){
    let i = 0;
    while (i < n) {
        yield i++;
    }
};
```

```javascript
import {Xiterator, xiterator} from './xiterator.js';
const $ = xiterator;
const n = [...  count(10)];    // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const o = [...$(count(10)).filter(v=>v%2).map(v=>v*v)]; // [1, 9, 25, 49, 81]
[...Xiterator.zip(n, o)]       // [[0, 1], [1, 9], [2, 25], [3, 49], [4, 81]]
```

## vs. `Array.prototype`

The following methods in `Array.prototype` are supported as follows.   For any method `meth` in the table below, the following identity holds.

```javascript
[...iter.meth(arg)] // is equivalent [...iter].meth(arg)
```

| method        | available? | efficent?| Comment |
|:--------------|:----:|:----:|---------|
|[concat]       | ✔︎    | ✔︎    |   |
|[copyWithin]   | ❌| | Not Immutable |
|[entries]      | ✔︎    | ✔︎    |   |
|[every]        | ✔︎    | ✔︎    |   |
|[fill]         | ❌| | Not Immutable, see [filled](#filled) |
|[filter]       | ✔︎    | ✔︎    |   |
|[find]         | ✔︎    | ✔︎    |   |
|[findIndex]    | ✔︎    | ✔︎    |   |
|[flat]         | ✔︎    | ✔︎    |   |
|[flatMap]      | ✔︎    | ✔︎    |   |
|[forEach]      | ✔︎    | ✔︎    |   |
|[includes]     | ✔︎    | ✔︎*   | * throws `RangeError` if the 2nd arg is negative |
|[indexOf]      | ✔︎    | ✔︎    |   |
|[join]         | ✔︎    | ✔︎    |   |
|[keys]         | ✔︎    | ✔︎    |   |
|[lastIndexOf]  | ❌    | ❌ | need all elements to evaluate |
|[map]          | ✔︎    | ✔︎    |   |
|[pop]          | ❌| | Not Immutable |
|[push]         | ❌| | Not Immutable |
|[reduce]       | ✔︎    | ✔︎    |   |
|[reduceRight]  | ✔︎    | ❌ |   |
|[reverse]      | ❌| | Not Immutable.  see [reversed](#reversed) |
|[shift]        | ❌| | Not Immutable |
|[slice]        | ✔︎    | ✔︎*   | * throws `RangeError` if any of the arg is negative |
|[some]         | ✔︎    | ✔︎    |   |
|[sort]         | ❌| | Not Immutable |
|[splice]       | ❌| | Not Immutable |
|[unshift]      | ❌| | Not Immutable |
|[filter]       | ✔︎    | ✔︎    |   |

[concat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
[copyWithin]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
[entries]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries
[every]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
[fill]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
[filter]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
[find]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
[findIndex]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
[flat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
[flatMap]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
[forEach]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
[includes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
[indexOf]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
[join]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
[keys]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys
[lastIndexOf]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
[pop]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
[push]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
[reduce]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
[reduceRight]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
[reverse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
[shift]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
[slice]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
[some]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
[sort]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[splice]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
[unshift]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
[values]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values

## other instance methods

#### `.toArray()`

Returns `[...this]`.

#### `.take`

`.take(n)` returns the iterator that takes first `n` elements of the original iterator.

#### `.drop`

.drop(n)` returns the iterator that drops first `n` elements of the original iterator.

#### `.zip`

`.zip(...args)` zips iterators in the `args`. Static version also [available](#Xiteratorzip).

```javascript
[...Xiterator.xrange().zip('abcd')]   // [[0,"a"],[1,"b"],[2,"c"],[3,"d"]]
```

#### `.filled`

`.filled(value)` returns an iterator with all elements replaced with `value`.

#### `.reversed`

Reversed iterator `.reversed()`.  Simply  `new Xiterator([...iter].reverse())`.

## static methods

They are also exported so you can `import {zip,zipWith} from 'xiterator.js'`

#### `Xiterator.zip`

Zips iterators in the argument.

```javascript
[...zip([0,1,2,3], 'abcd')]   // [[0,"a"],[1,"b"],[2,"c"],[3,"d"]]
```

#### `Xiterator.zipWith`

Zips iterators and then feed it to the function.

```javascript
[...Xiterator.zipWith((a,b)=>a+b, 'bcdfg', 'aeiou')]    // ["ba","ce","di","fo","gu"]
```

#### `Xiterator.xrange`

`xrange()` as Python 2 (or `range()` of Python 3).

```javascript
for (const i of Xiterator.xrange()) // infinite stream of 0, 1, ...
    console.log(i)
}
[...Xiterator.xrange(4)]        // [0, 1, 2, 3]
[...Xiterator.xrange(1,5)]      // [1, 2, 3, 4]
[...Xiterator.xrange(1,5,2)]    // [1, 3] 
```

### `Xiterator.repeat`

Returns an iterator with all elements are the same.

* `Xiterator.repeat(value)` returns an infinite stream of `value`
* `Xiterator.repeat(value, n)` returns repeats `value` for `n` times.

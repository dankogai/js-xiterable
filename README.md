[![build status](https://secure.travis-ci.org/dankogai/js-xiterable.png)](http://travis-ci.org/dankogai/js-xiterable)

# js-xiterable

Make ES6 Iterators Functional Again

## Synopsis

Suppose we have a generator like this.

```javascript
function* count(n) {
    let i = 0;
    while (i < n) yield i++;
};
```

We make it more functional like this.

```javascript
import {Xiterable} from './xiterable.js';
const xcount = new Xiterable(n => count(n));
const tens = xcount(10);
const odds = tens.filter(v=>v%2).map(v=>v*v);
const zips = tens.zip(odds);
[...tens];  // [ 0,      1,      2,       3,       4, 5, 6, 7, 8, 9]
[...odds];  // [ 1,      9,     25,      49,      81]
[...zips];  // [[0, 1], [1, 9], [2, 25], [3, 49], [4, 81]]
```

### Install

```shell
npm install js-xiterable
```

### Usage

locally

```javascript
import {
  Xiterable,
  xiterable,
  zip,
  zipWith,
  xrange,
  repeat
} from './xiterable.js`;
```

remotely

```javascript
import {Xiterable} from 'https://cdn.jsdelivr.net/npm/js-xiterable@0.0.3/xiterable.min.js';
```

### commonjs (node.js)

use [babel] or [esm].

[babel]: https://babeljs.io
[esm]: https://github.com/standard-things/esm

```shell
% node -r esm
Welcome to Node.js v14.5.0.
Type ".help" for more information.
> import * as _X from './xiterable.js'
undefined
> _X
[Module] {
  Xiterable: [Function: Xiterable],
  isIterable: [Function: isIterable],
  repeat: [Function: repeat],
  xiterable: [Function: xiterable],
  xrange: [Function: xrange],
  zip: [Function: zip],
  zipWith: [Function: zipWith]
}
> [..._X.xrange(10).filter(v=>v%2).map(v=>v*v)]
[ 1, 9, 25, 49, 81 ]
> 
```

## Description

### instance methods found in `Array.prototype`

The following methods in `Array.prototype` are supported as follows.   For any method `meth`, `[...iter.meth(arg)]` deeply equals to `[...iter].meth(arg)`.

| method        | available? | Comment |
|:--------------|:----:|:---------|
|[concat]       | ✔︎ |    |
|[copyWithin]   | ❌ | mutating |
|[entries]      | ✔︎ |   |
|[every]        | ✔︎ |   |
|[fill]         | ❌ | mutating ; see [repeat](#xiterablerepeat) |
|[filter]       | ✔︎ |   |
|[find]         | ✔︎ |   |
|[findIndex]    | ✔︎ |   |
|[flat]         | ✔︎ |   |
|[flatMap]      | ✔︎ |   |
|[forEach]      | ✔︎ |   |
|[includes]     | ✔︎*| * throws `RangeError` if the 2nd arg is negative |
|[indexOf]      | ✔︎ |   |
|[join]         | ✔︎ |   |
|[keys]         | ✔︎ |   |
|[lastIndexOf]  | ❌ | need to iterate backwards |
|[map]          | ✔︎ |   |
|[pop]          | ❌ | mutating |
|[push]         | ❌ | mutating |
|[reduce]       | ✔︎ |   |
|[reduceRight]  | ❌ | need to iterate backwards |
|[reverse]      | ❌ | mutating; see [reversed](#reversed) |
|[shift]        | ❌ | mutating |
|[slice]        | ✔︎*| * throws `RangeError` if any of the arg is negative |
|[some]         | ✔︎ |   |
|[sort]         | ❌ | mutating |
|[splice]       | ❌ | mutating |
|[unshift]      | ❌ | mutating |
|[filter]       | ✔︎ |   |

Unavalable methods either:

* mutates the calling object. e.g. `pop`, `push`…
* need to iterate backwards.  e.g. `lastIndexOf()`, `reduceRight()`…

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

`.zip(...args)` zips iterators in the `args`. Static version also [available](#Xiterablezip).

```javascript
[...Xiterable.xrange().zip('abcd')]   // [[0,"a"],[1,"b"],[2,"c"],[3,"d"]]
```

#### `.filled`

`.filled(value)` returns an iterator with all elements replaced with `value`.

#### `.reversed`

Reversed iterator `.reversed()`.  Simply  `new Xiterable([...iter].reverse())`.

## static methods

They are also exported so you can:

```javascript
import {repeat,xrange,zip,zipWith} from 'xiterable.js'
```
Examples below assumes

```javascript
import {Xiterable} from 'xiterable.js'.
```

Examples below assumes

#### `Xiterable.zip`

Zips iterators in the argument.

```javascript
[...Xiterable.zip([0,1,2,3], 'abcd')]   // [[0,"a"],[1,"b"],[2,"c"],[3,"d"]]
```

#### `Xiterable.zipWith`

Zips iterators and then feed it to the function.

```javascript
[...Xiterable.zipWith((a,b)=>a+b, 'bcdfg', 'aeiou')]    // ["ba","ce","di","fo","gu"]
```

#### `Xiterable.xrange`

`xrange()` as Python 2 (or `range()` of Python 3).

```javascript
for (const i of Xiterable.xrange()){ // infinite stream of 0, 1, ...
    console.log(i)
}
```

```javascript
[...Xiterable.xrange(4)]        // [0, 1, 2, 3]
[...Xiterable.xrange(1,5)]      // [1, 2, 3, 4]
[...Xiterable.xrange(1,5,2)]    // [1, 3] 
```

### `Xiterable.repeat`

Returns an iterator with all elements are the same.

```javascript
for (const i of Xiterable.repeat('spam')) { // infinite stream of 'spam'
    console.log(i)
}
```

```javascript
[...Xiterable.repeat('spam', 4)] // ['spam', 'spam', 'spam', 'spam']
```

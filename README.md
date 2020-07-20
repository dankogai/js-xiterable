[![build status](https://secure.travis-ci.org/dankogai/js-xiterator.png)](http://travis-ci.org/dankogai/js-xiterator)

# js-xiterator

Make ES6 Iterators Functional Again

## Synopsis

```javascript
const counter = function *(n){
    let i = 0;
    while (i < n) {
        yield i++;
    }
};
```

```javascript
import {xiterator} from 'xiterator.js';
let it = xiterator(counter(10)).filter(v => v%2==1).map(v => v*v);
[...it]; // [ 1, 9, 25, 49, 81 ]
```

## vs. `Array.prototype`

The following methods in `Array.prototype` are supported as follows.

| method        | available? | lazy?| Comment |
|---------------|------|------|---------|
|[concat]       | ✔︎    | ✔︎    |   |
|[copyWithin]   | ❌| | Not Immutable |
|[entries]      | ✔︎    | ✔︎    |   |
|[every]        | ✔︎    | ✔︎    |   |
|[fill]         | ❌| | Not Immutable |
|[filter]       | ✔︎    | ✔︎    |   |
|[find]         | ✔︎    | ✔︎    |   |
|[findIndex]    | ✔︎    | ✔︎    |   |
|[flat]         | ✔︎    | ❌ | `[...this]` internally |
|[flatMap]      | ✔︎    | ❌ | `[...this]` internally |
|[forEach]      | ✔︎    | ✔︎    |   |
|[includes]     | ✔︎    | △    | not lazy if the 2nd arg is negative |
|[indexOf]      | ✔︎    | ✔︎    |   |
|[join]         | ✔︎    | ✔︎    |   |
|[keys]         | ✔︎    | ✔︎    |   |
|[lastIndexOf]  | ✔︎    | ✔︎    |   |
|[map]          | ✔︎    | ✔︎    |   |
|[pop]          | ❌| | Not Immutable |
|[push]         | ❌| | Not Immutable |
|[reduce]       | ✔︎    | ✔︎    |   |
|[reduceRight]  | ✔︎    | ❌ | `[...this]` internally |
|[reverse]      | ❌| | Not Immutable |
|[shift]        | ❌| | Not Immutable |
|[slice]        | ✔︎    | ❌ | `[...this]` internally |
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

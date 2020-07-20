import {Xiterator, xiterator, xrange} from '../xiterator.js';
const $      = chai.expect;
const should = chai.should;
describe('[...]', () => {
    it('[...xiterator(range(4))] === [0,1,2,3]', () =>
       $([...xiterator(xrange(4))]).to.deep.equal([0,1,2,3])
      );
});
const gen = (n) =>  xiterator(xrange(n))
const ary = [...gen(42)];
describe('.prototype.map', () => {
    it('[...iter.map(v=>v*v)] === [...iter].map(v=>v*v)', () =>
       $([...gen(42).map(v=>v*v)]).to.deep.equal(ary.map(v=>v*v))
    );
});
describe('.prototype.filter', () => {
    it('[...iter.filter(v=>v%2)] === [...iter].filter(v=>v%2)', () =>
    $([...gen(42).filter(v=>v%2)]).to.deep.equal(ary.filter(v=>v%2))
    );
});
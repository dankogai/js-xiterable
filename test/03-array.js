import {Xiterator, xiterator, xrange} from '../xiterator.js';
const $      = chai.expect;
const should = chai.should;
const gen = xrange
const ary = [...gen(4)];
describe('[...iter]', () => {
    it('[...xrange(4)] === [0,1,2,3]', () =>
       $([...xrange(4)]).to.deep.equal([0,1,2,3])
      );
});
describe('.prototype.map', () => {
    for (const f of [v=>v*v, (v,i)=>i*v]) {
        it(`[...iter.map(${f})] === [...iter].map(${f})`, () =>
            $([...gen(4).map(f)]).to.deep.equal([...gen(4)].map(f))
        );
    }
});
describe('.prototype.filter', () => {
    for (const f of [v=>v%2, (v,i)=>v===i]) {
        it(`[...iter.filter(${f})] === [...filter].fiter(${f})`, () =>
            $([...gen(4).filter(f)]).to.deep.equal([...gen(4)].filter(f))
        );
    }
});
describe('.prototype.slice', () => {
    const ary = [...gen(-4,4)];
    for (const s of ary) {
        it(`[...iter.slice(${s})] === [...iter].slice(${s})`, () =>
            $([...gen(-4,4).slice(s)]).to.deep.equal(ary.slice(s))
        );
        for (const e of ary) {
            it(`[...iter.slice(${s},${e})] === [...iter].slice(${s},${e})`, () =>
                $([...gen(-4,4).slice(s,e)]).to.deep.equal(ary.slice(s,e))
            );
        }
    }
});
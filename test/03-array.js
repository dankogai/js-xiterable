import { Xiterable, xiterable, xrange } from '../xiterable.js';
const $ = chai.expect;
const should = chai.should;
const gen = xrange(4)
const ary = [...gen];
describe('[...iter]', () => {
    it('[...xrange(4)] === [0,1,2,3]', () =>
        $([...xrange(4)]).to.deep.equal([0, 1, 2, 3])
    );
});
describe('.prototype.map', () => {
    for (const f of [v => v * v, (v, i) => i * v]) {
        it(`[...iter.map(${f})] === [...iter].map(${f})`, () =>
            $([...gen.map(f)]).to.deep.equal([...gen].map(f))
        );
    }
});
describe('.prototype.filter', () => {
    for (const f of [v => v % 2, (v, i) => v === i]) {
        it(`[...iter.filter(${f})] === [...filter].fiter(${f})`, () =>
            $([...gen.filter(f)]).to.deep.equal([...gen].filter(f))
        );
    }
});
describe('.prototype.reduce', () => {
    const f = (a, v) => a + v;
    it(`[...iter.reduce(${f})] === [...filter].reduce(${f})`, () =>
        $([...gen.filter(f)]).to.deep.equal([...gen].filter(f))
    );
    it(`[...iter.reduce(${f}, '')] === [...filter].reduce(${f}, '')`, () =>
        $([...gen.filter(f, '')]).to.deep.equal([...gen].filter(f, ''))
    );
});
describe('.prototype.slice', () => {
    // const ary = [...gen(-4,4)];
    for (const s of ary) {
        it(`[...iter.slice(${s})] === [...iter].slice(${s})`, () =>
            $([...gen.slice(s)]).to.deep.equal(ary.slice(s))
        );
        for (const e of ary) {
            it(`[...iter.slice(${s},${e})] === [...iter].slice(${s},${e})`, () =>
                $([...gen.slice(s, e)]).to.deep.equal(ary.slice(s, e))
            );
        }
    }
});
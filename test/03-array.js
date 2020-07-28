import { Xiterable, xiterable as xi, xrange } from '../xiterable.js';
const $ = chai.expect;
const should = chai.should;
const xr4 = xrange(4);
const ar4 = [...xr4];
describe('[...iter]', () => {
    it('[...xrange(4)] === [0,1,2,3]', () =>
        $([...xrange(4)]).to.deep.equal([0, 1, 2, 3])
    );
});
describe('.prototype.map', () => {
    for (const f of [v => v * v, (v, i) => i * v]) {
        it(`[...iter.map(${f})] === [...iter].map(${f})`, () =>
            $([...xr4.map(f)]).to.deep.equal([...xr4].map(f))
        );
    }
});
describe('.prototype.{entries,values,keys}', () => {
    it(`[...iter.entries()] === [...[...iter].entries()])`, () =>
        $([...xr4.entries()]).to.deep.equal([...[...xr4].entries()])
    );
    it(`[...iter.values()] === [...[...iter].values()])`, () =>
        $([...xr4.values()]).to.deep.equal([...[...xr4].values()])
    );
    it(`[...iter.keys()] === [...[...iter].keys()])`, () =>
        $([...xr4.keys()]).to.deep.equal([...[...xr4].keys()])
    );
});
describe('.prototype.filter', () => {
    for (const f of [v => v % 2, (v, i) => v === i]) {
        it(`[...iter.filter(${f})] === [...filter].fiter(${f})`, () =>
            $([...xr4.filter(f)]).to.deep.equal([...xr4].filter(f))
        );
    }
});
describe('.prototype.{indexOf,lastIndexOf}', () => {
    let iter = xi('dankogai');
    it(`iter.indexOf('a') === [...iter].indexOf('a')`, () =>
        $(iter.indexOf('a')).to.equal([...iter].indexOf('a'))
    );
    it(`iter.indexOf('A') === [...iter].indexOf('A')`, () =>
        $(iter.indexOf('A')).to.equal([...iter].indexOf('A'))
    );
    it(`iter.lastIndexOf('a') === [...iter].lastIndexOf('a')`, () =>
        $(iter.lastIndexOf('a')).to.equal([...iter].lastIndexOf('a'))
    );
    it(`iter.lastIndexOf('A') === [...iter].lastIndexOf('A')`, () =>
        $(iter.lastIndexOf('A')).to.equal([...iter].lastIndexOf('A'))
    );
    for (const i of xrange(-8, 8)) {
        it(`iter.indexOf('a', ${i}) === [...iter].indexOf('a', ${i})`, () =>
            $(iter.indexOf('a', i)).to.equal([...iter].indexOf('a', i))
        );
        it(`iter.lastIndexOf('a', ${i}) === [...iter].lastIndexOf('a', ${i})`, () =>
            $(iter.lastIndexOf('a', i)).to.equal([...iter].lastIndexOf('a', i))
        );
    }
});
describe('.prototype.reduce', () => {
    const f = (a, v) => a + v;
    it(`iter.reduce(${f}) === [...filter].reduce(${f})`, () =>
        $(xr4.reduce(f)).to.equal([...xr4].reduce(f))
    );
    it(`iter.reduce(${f}, '') === [...filter].reduce(${f}, '')`, () =>
        $(xr4.reduce(f, '')).to.equal([...xr4].reduce(f, ''))
    );
});
describe('.prototype.reduceRight', () => {
    const f = (a, v) => a + v;
    it(`iter.reduceRight(${f}) === [...filter].reduceRight(${f})`, () =>
        $(xr4.reduceRight(f)).to.equal([...xr4].reduceRight(f))
    );
    it(`iter.reduceRight(${f}, '') === [...filter].reduceRight(${f}, '')`, () =>
        $(xr4.reduceRight(f, '')).to.equal([...xr4].reduceRight(f, ''))
    );
});
describe('.prototype.slice', () => {
    // const ary = [...xrange(-4,4)];
    for (const s of ar4) {
        it(`[...iter.slice(${s})] === [...iter].slice(${s})`, () =>
            $([...xr4.slice(s)]).to.deep.equal(ar4.slice(s))
        );
        for (const e of ar4) {
            it(`[...iter.slice(${s},${e})] === [...iter].slice(${s},${e})`, () =>
                $([...xr4.slice(s, e)]).to.deep.equal(ar4.slice(s, e))
            );
        }
    }
});
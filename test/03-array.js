import { Xiterable, xiterable, xrange } from '../xiterable.js';
const $ = chai.expect;
const should = chai.should;
const xr4 = xrange(4);
const ar4 = [...xr4];
describe('[...]', () => {
    it('[...xrange(4)] === [0,1,2,3]', () =>
        $([...xrange(4)]).to.deep.equal([0, 1, 2, 3])
    );
});
describe('.map()', () => {
    for (const f of [v => v * v, (v, i) => i * v]) {
        it(`[...xi.map(${f})] === [...xi].map(${f})`, () =>
            $([...xr4.map(f)]).to.deep.equal([...xr4].map(f))
        );
    }
});
describe('.entries(), .values(), .keys()', () => {
    it(`[...xi.entries()] === [...[...xi].entries()])`, () =>
        $([...xr4.entries()]).to.deep.equal([...[...xr4].entries()])
    );
    it(`[...xi.values()] === [...[...xi].values()])`, () =>
        $([...xr4.values()]).to.deep.equal([...[...xr4].values()])
    );
    it(`[...xi.keys()] === [...[...xi].keys()])`, () =>
        $([...xr4.keys()]).to.deep.equal([...[...xr4].keys()])
    );
});
describe('.filter()', () => {
    for (const f of [v => v % 2, (v, i) => v === i]) {
        it(`[...xi.filter(${f})] === [...filter].fiter(${f})`, () =>
            $([...xr4.filter(f)]).to.deep.equal([...xr4].filter(f))
        );
    }
});
describe('.indexOf(), lastIndexOf()', () => {
    let str = 'dankogai'
    let xi = xiterable(str);
    it(`xi.indexOf('a') === [...xi].indexOf('a')`, () =>
        $(xi.indexOf('a')).to.equal([...xi].indexOf('a'))
    );
    it(`xi.indexOf('A') === [...xi].indexOf('A')`, () =>
        $(xi.indexOf('A')).to.equal([...xi].indexOf('A'))
    );
    it(`xi.lastIndexOf('a') === [...xi].lastIndexOf('a')`, () =>
        $(xi.lastIndexOf('a')).to.equal([...xi].lastIndexOf('a'))
    );
    it(`xi.lastIndexOf('A') === [...xi].lastIndexOf('A')`, () =>
        $(xi.lastIndexOf('A')).to.equal([...xi].lastIndexOf('A'))
    );
    for (const i of xrange(-str.length, str.length)) {
        it(`xi.indexOf('a', ${i}) === [...xi].indexOf('a', ${i})`, () =>
            $(xi.indexOf('a', i)).to.equal([...xi].indexOf('a', i))
        );
        it(`xi.lastIndexOf('a', ${i}) === [...xi].lastIndexOf('a', ${i})`, () =>
            $(xi.lastIndexOf('a', i)).to.equal([...xi].lastIndexOf('a', i))
        );
    }
});
describe('.reduce(), .reduceRight()', () => {
    const f = (a, v) => a + v;
    it(`xi.reduce(${f}) === [...xi].reduce(${f})`, () =>
        $(xr4.reduce(f)).to.equal([...xr4].reduce(f))
    );
    it(`xi.reduce(${f}, '') === [...xi].reduce(${f}, '')`, () =>
        $(xr4.reduce(f, '')).to.equal([...xr4].reduce(f, ''))
    );
    it(`xi.reduceRight(${f}) === [...xi].reduceRight(${f})`, () =>
        $(xr4.reduceRight(f)).to.equal([...xr4].reduceRight(f))
    );
    it(`xi.reduceRight(${f}, '') === [...xi].reduceRight(${f}, '')`, () =>
        $(xr4.reduceRight(f, '')).to.equal([...xr4].reduceRight(f, ''))
    );
});
describe('.slice()', () => {
    const ary = [...xrange(-4, 4)];
    for (const s of ary) {
        it(`[...xi.slice(${s})] === [...xi].slice(${s})`, () =>
            $([...xr4.slice(s)]).to.deep.equal(ar4.slice(s))
        );
        for (const e of ary) {
            it(`[...xi.slice(${s},${e})] === [...xi].slice(${s},${e})`, () =>
                $([...xr4.slice(s, e)]).to.deep.equal(ar4.slice(s, e))
            );
        }
    }
});
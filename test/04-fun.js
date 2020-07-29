import { Xiterable, xiterable, xrange, repeat, zip, zipWith } from '../xiterable.js';
const $ = chai.expect;
const should = chai.should;
describe('.reversed', () => {
    let xi = xrange().take(4).reversed();
    let ar = [3, 2, 1, 0]
    it(`xrange().take(4).reversed() === ${JSON.stringify(ar)}`, () =>
        $([...xi]).to.deep.equal(ar))
});
describe('zip, zipWith', () => {
    let xi = zip(xrange(), repeat('x'));
    let ar = Array(4).fill('x').map((v, i) => [i, v]);
    it(`[...zip(xrange(), repeat('x')).take(4)]
        === ${JSON.stringify(ar)}`, () =>
        $([...xi.take(4)]).to.deep.equal(ar))

    xi = zipWith((a, b) => a + b, xrange(), repeat('x'));
    ar = Array(4).fill('x').map((v, i) => i + v);
    it(`[...zipWith((a, b) => a + b, xrange(), repeat('x')).take(4)]
        === ${JSON.stringify(ar)}`, () =>
        $([...xi.take(4)]).to.deep.equal(ar))
});

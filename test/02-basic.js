import {Xiterator as _} from '../xiterator.js';
const $ = chai.expect;    

describe('isIterable', () => {
    it('String',  ()=>$(_.isIterable('')).to.equal(true));
    it('Boolean', ()=>$(_.isIterable(false)).to.equal(false));
    it('Number',  ()=>$(_.isIterable(0)).to.equal(false));
    it('Symbol',  ()=>$(_.isIterable(Symbol())).to.equal(false));
    if (typeof BigInt !== 'undefined') {
        let bzero; try{ eval('bzero = 0n') }catch(err){};
        it('BigInt',  ()=>$(_.isIterable(bzero)).to.equal(false));
    } else {
        it.skip('BigInt missing', x=>x);
    }
    it('null',     ()=>$(_.isIterable(null)).to.equal(false));
    it('null',     ()=>$(_.isIterable(null)).to.equal(false));
    it('undefined',()=>$(_.isIterable(undefined)).to.equal(false));
    it('Object', ()=>$(_.isIterable({})).to.equal(false));
    it('Array', ()=>$(_.isIterable([])).to.equal(true));
    it('Map',()=>$(_.isIterable(new Map())).to.equal(true));
    it('Set',()=>$(_.isIterable(new Set())).to.equal(true));
    it('Int8Array', ()=>$(_.isIterable(new Int8Array())).to.equal(true));
    it('Uint8Array', ()=>$(_.isIterable(new Uint8Array())).to.equal(true));
    it('Uint8ClampedArray',
       ()=>$(_.isIterable(new Uint8ClampedArray())).to.equal(true));
    it('Int16Array', ()=>$(_.isIterable(new Int16Array())).to.equal(true));
    it('Uint16Array', ()=>$(_.isIterable(new Uint16Array())).to.equal(true));
    it('Int32Array', ()=>$(_.isIterable(new Int32Array())).to.equal(true));
    it('Uint32Array', ()=>$(_.isIterable(new Uint32Array())).to.equal(true));
    it('Float32Array', ()=>$(_.isIterable(new Float32Array())).to.equal(true));
    it('Float64Array', ()=>$(_.isIterable(new Float64Array())).to.equal(true));
    if (typeof BigInt64Array !== 'undefined') {
        it('BigInt64Array',
           ()=>$(_.isIterable(new BigInt64Array())).to.equal(true));
        it('BigUint64Array',
           ()=>$(_.isIterable(new BigUint64Array())).to.equal(true));
    } else {
        it.skip('BigInt64Array missing', x=>x);
        it.skip('BigUint64Array missing', x=>x);
    }
    ;
});

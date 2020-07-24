import * as _Module from '../xiterator.js';
describe('import', () => {
  for (const k in _Module) {
    const tn = k === 'version' ? 'string' : 'function';
    it(`${k} is a ${tn}`, () => chai.expect(typeof _Module[k]).to.equal(tn));
  }
});

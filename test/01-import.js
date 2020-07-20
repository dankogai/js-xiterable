import {Xiterator, xiterator, range} from '../xiterator.js';
describe('import', () => {
  it('Xiterator is a function', () => 
    chai.expect(typeof Xiterator).to.equal('function')
  );
  it('xiterator is a function', () =>
    chai.expect(typeof xiterator).to.equal('function')
  );
  it('range is a function', () =>
    chai.expect(typeof range).to.equal('function')
  );
});

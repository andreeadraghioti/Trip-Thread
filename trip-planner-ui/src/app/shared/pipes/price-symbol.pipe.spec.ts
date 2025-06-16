import { PriceSymbolPipe } from './price-symbol.pipe';

describe('PriceSymbolPipe', () => {
  it('create an instance', () => {
    const pipe = new PriceSymbolPipe();
    expect(pipe).toBeTruthy();
  });
});

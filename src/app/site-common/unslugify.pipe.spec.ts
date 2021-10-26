import { UnslugifyPipe } from './unslugify.pipe';

describe('UnslugifyPipe', () => {
  it('create an instance', () => {
    const pipe = new UnslugifyPipe();
    expect(pipe).toBeTruthy();
  });
});

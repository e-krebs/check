// const { add } = require('./example');
import { add, Sum } from './example';

describe('sum', () => {
  let added = 1;

  describe('adding 1', () => {
    const { a, b, sum }: Sum = add(added, 1);

    it('a: 1', () => {
      expect(a).toEqual(1);
    });

    test('b: 1', () => {
      expect(b).toEqual(1);
    });

    it('sum: 2', () => {
      console.log('logging something');
      expect(sum).toEqual(2);
    });
  });

  it('adding 1 (global)', () => {
    expect(add(added, 1)).toEqual({ a: 1, b: 1, sum: 2 });
  });

  describe('adding 0', () => {
    added = 0;

    it('global', () => {
      expect(add(added, 1)).toEqual({ a: 0, b: 1, sum: 1 });
    });

    const { a, b, sum } = add(added, 1);

    it('a: 0', () => {
      expect(a).toEqual(0);
    });

    it('b: 1', () => {
      expect(b).toEqual(1);
    });

    it('sum: 1', () => {
      expect(sum).toEqual(1);
    });
  });
});

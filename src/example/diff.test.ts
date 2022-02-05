import { remove, type Diff } from './example';

describe('remove', () => {
  let removed = 1;

  describe('removing 1', () => {
    const { a, b, diff }: Diff = remove(1, removed);

    it('a: 1', () => {
      expect(a).toEqual(1);
    });

    test('b: 1', () => {
      expect(b).toEqual(1);
    });

    it('diff: 0', () => {
      expect(diff).toEqual(0);
    });
  });

  it('removing 1 (global)', () => {
    expect(remove(1, removed)).toEqual({ a: 1, b: 1, diff: 0 });
  });

  describe('removing 0', () => {
    removed = 0;

    it('global', () => {
      expect(remove(1, removed)).toEqual({ a: 1, b: 0, diff: 1 });
    });

    const { a, b, diff } = remove(1, removed);

    it('a: 1', () => {
      expect(a).toEqual(1);
    });

    it('b: 0', () => {
      expect(b).toEqual(0);
    });

    it('diff: 1', () => {
      expect(diff).toEqual(1);
    });
  });
});

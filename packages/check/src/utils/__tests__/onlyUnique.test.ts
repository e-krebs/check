import { onlyUnique } from '../onlyUnique';

describe('onlyUnique', () => {
  it('should not change input when no duplicates', () => {
    expect(['a', 'b'].filter(onlyUnique)).toEqual(['a', 'b']);
  });

  it('should remove duplicates', () => {
    expect(['a', 'b', 'a'].filter(onlyUnique)).toEqual(['a', 'b']);
    expect(['a', 'b', 'a', 'b'].filter(onlyUnique)).toEqual(['a', 'b']);
    expect(['a', 'b', 'a', 'a'].filter(onlyUnique)).toEqual(['a', 'b']);
  });
});

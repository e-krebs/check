import { getFile, getFolders } from '../pathHelper';

const path = 'this/is/my/path/to/my/file.ts';

describe('getFolders', () => {
  it('should extract folders name with trailing slash', () => {
    expect(getFolders(path)).toEqual('this/is/my/path/to/my/');
  });
});

describe('getFile', () => {
  it('should extract file name', () => {
    expect(getFile(path)).toEqual('file.ts');
  });
});

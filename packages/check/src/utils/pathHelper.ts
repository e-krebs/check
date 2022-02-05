export const getFolders = (path: string): string =>
  path.slice(0, path.lastIndexOf('/') + 1);

export const getFile = (path: string): string =>
  path.slice(path.lastIndexOf('/') + 1);

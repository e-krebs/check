import { Glob } from 'glob';

import { getConfiguration } from '../utils/getConfiguration';

export const globs = async (): Promise<string[]> => {
  return await new Promise<string[]>((resolve) => {
    const { pattern } = getConfiguration();
    new Glob(pattern, (err, files) => {
      if (err) {
        console.error('Error with pattern', err);
        process.exit(1);
      } else {
        resolve(files);
      }
    });
  });
};

import chalk from 'chalk';
import Glob from 'fast-glob';

import { getConfiguration } from '../utils/getConfiguration';

export const globs = async (): Promise<string[]> => {
  const { testFilesPattern } = getConfiguration();
  try {
    return await Glob(testFilesPattern);
  } catch (err) {
    console.error(`Error with pattern "${chalk.yellowBright(testFilesPattern)}"`, err);
    process.exit(1);
  }
};

import chalk from 'chalk';
import Glob from 'fast-glob';

import { getConfiguration } from '../utils/getConfiguration';

export const globs = async (log = false): Promise<string[]> => {
  const { testFilesPattern } = getConfiguration(log);
  try {
    return await Glob(testFilesPattern);
  } catch (err) {
    console.error(`Error with pattern "${chalk.yellowBright(testFilesPattern)}"`, err);
    process.exit(1);
  }
};

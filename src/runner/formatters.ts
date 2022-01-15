import chalk from 'chalk';

import { getFile, getFolders } from 'utils/pathHelper';

export const formatBranch = (depth: number, description: string, success?: boolean): string => {
  const output: string[] = [' '.repeat(depth * 2)];
  if (success !== undefined) {
    output.push(success ? chalk.green('√') : chalk.red('×'));
    output.push(' ');
    output.push(chalk.grey(description))
  } else {
    output.push(description);
  }
  return output.reduce((a, b) => `${a}${b}`);
}

export const formatFileResult = (path: string, success: boolean): string => {
  const output: string[] = [];
  output.push(success
    ? chalk.greenBright.inverse(' PASS ')
    : chalk.redBright.inverse(' FAIL ')
  );
  output.push(' ');
  output.push(chalk.grey(getFolders(path)));
  output.push(getFile(path));
  return output.reduce((a, b) => `${a}${b}`);
}

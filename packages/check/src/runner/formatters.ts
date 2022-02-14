import chalk from 'chalk';
import { diffJson } from 'diff';
import readline from 'node:readline';
import { createReadStream } from 'fs';

import { getFile, getFolders } from '../utils/pathHelper';
import type { RunError } from './runTypings';

export const formatBranch = (depth: number, description: string, success?: boolean): string => {
  const output: string[] = [' '.repeat(depth * 2)];
  if (success !== undefined) {
    output.push(success ? chalk.green('√') : chalk.red('×'));
    output.push(' ');
    output.push(chalk.grey(description));
  } else {
    output.push(description);
  }
  return output.reduce((a, b) => `${a}${b}`);
};

export const formatFileResult = (path: string, success: boolean, noTest = false): string => {
  const output: string[] = [];
  output.push(success
    ? chalk.greenBright.inverse(' PASS ')
    : chalk.redBright.inverse(' FAIL ')
  );
  output.push(' ');
  output.push(chalk.grey(getFolders(path)));
  output.push(getFile(path));
  if (noTest) {
    output.push(chalk.redBright(' (no test found)'));
  }
  return output.reduce((a, b) => `${a}${b}`);
};

const formatCodeLines = async (path: string, testLine: number): Promise<string[]> => {
  const output: string[] = [];
  const lines: number[] = [];

  if (testLine !== null) {
    for (let current = testLine - 2; current <= testLine + 3; current++) {
      if (current >= 0) lines.push(current);
    }
  }

  const lineReader = readline.createInterface({ input: createReadStream(path) });
  let lineNumber = 0;
  for await (const line of lineReader) {
    lineNumber++;
    if (lines.includes(lineNumber)) {
      const head = lineNumber === testLine
        ? `${chalk.red('  > ')}${chalk.grey(`${lineNumber} | `)}`
        : chalk.grey(`    ${lineNumber} | `);
      const body = (lineNumber === testLine ? chalk.white : chalk.grey)(line);
      output.push(`${head}${body}`);
    }
    if (lineNumber > Math.max(...lines)) lineReader.close();
  }

  output.push('');
  output.push(`    ${chalk.grey('at')} ${chalk.cyan(path)}${chalk.grey(`:${testLine}`)}`);
  output.push('');

  return output;
};

const formatDiff = (expected: object, received: object): string => {
  const diffs = diffJson(expected, received);

  const output: string[] = [];
  for (const diff of diffs) {
    const items = diff.value.split('\n');
    for (const item of items) {
      if (!item) continue;
      if (diff.added) output.push(chalk.red(`\n  + ${item}`));
      else if (diff.removed) output.push(chalk.green(`\n  - ${item}`));
      else output.push(chalk.grey(`\n    ${item}`));
    }
  }

  return output.reduce((a, b) => `${a}${b}`);
};

const formatError = async (runError: RunError): Promise<string[]> => {
  const output: string[] = [];
  const logicalPath = runError.logicalPath.reduce((a, b) => `${a} > ${b}`);
  output.push('');
  output.push(chalk.redBright(`  ● ${logicalPath}`));
  let i = 0;
  for (const detail of runError.details) {
    output.push('');
    output.push(`    ${detail.message}`);
    output.push(formatDiff(detail.expected, detail.received));
    if (detail.line) {
      output.push('');
      output.push(...await formatCodeLines(runError.path, detail.line));
    }
    i = i + 1;
  }
  return output;
};

export const formatErrors = async (runErrors: RunError[]): Promise<string[]> => (
  await Promise.all(runErrors.map(
    async error => await formatError(error)
  ))
).flat();

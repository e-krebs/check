
import { executeRunItems } from './executeRunItems';
import { isBranch, isTestBranch, type Run } from './typings';

const formatBranch = (depth: number, description: string, success?: boolean): string => {
  const output: string[] = [' '.repeat(depth * 2)];
  if (success !== undefined) {
    output.push(success ? '✔' : '❌');
    output.push(' ');
  }
  output.push(description);
  return output.reduce((a, b) => `${a}${b}`);
}

export const executeRuns = (runs: Run[], path: string, depth: number = 1): string[] => {
  let output: string[] = [];
  let globalSuccess = true;

  for (const run of runs) {
    if (isBranch(run)) {
      output.push(formatBranch(depth, run.description));
      output.push(...executeRuns(run.branches, path, depth + 1));
    }
    if (isTestBranch(run)) {
      const success = executeRunItems(run, path);
      output.push(formatBranch(depth, run.description, success));
      globalSuccess = globalSuccess && success;
    }
  }
  if (depth === 1) {
    output = [` ${globalSuccess ? 'PASS' : 'FAIL'}  ${path}`, ...output];
  }
  return output;
}

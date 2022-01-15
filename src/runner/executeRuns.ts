import { executeRunItems } from './executeRunItems';
import { formatBranch, formatFileResult } from './formatters';
import { isBranch, isTestBranch, type Run } from './typings';

interface RunResult {
  output: string[];
  success: boolean;
}

export const executeRuns = (runs: Run[], path: string, depth: number = 1): RunResult => {
  let output: string[] = [];
  let globalSuccess: boolean = true;

  for (const run of runs) {
    if (isBranch(run)) {
      output.push(formatBranch(depth, run.description));
      const runResult = executeRuns(run.branches, path, depth + 1); 
      output.push(...runResult.output);
      globalSuccess = globalSuccess && runResult.success;
    }
    if (isTestBranch(run)) {
      const success = executeRunItems(run, path);
      output.push(formatBranch(depth, run.description, success));
      globalSuccess = globalSuccess && success;
    }
  }

  if (depth === 1) {
    output = [formatFileResult(path, globalSuccess), ...output];
  }
  return { output, success: globalSuccess };
}

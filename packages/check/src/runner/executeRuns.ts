import { executeRunItems } from './executeRunItems';
import { formatBranch, formatFileResult } from './formatters';
import { OutputLevel } from './outputLevel';
import type { RunError, RunResult } from './runTypings';
import { isBranch, isTestBranch, type Run } from './typings';

export const executeRuns = (
  runs: Run[],
  path: string,
  outputLevel: OutputLevel,
  logicalPath: string[] = []
): RunResult => {
  let output: string[] = [];
  const errors: RunError[] = [];
  let globalSuccess = true;

  for (const run of runs) {
    if (isBranch(run)) {
      if (outputLevel === 'detailed') {
        output.push(formatBranch(logicalPath.length + 1, run.description));
      }
      const runResult = executeRuns(
        run.branches,
        path,
        outputLevel,
        [...logicalPath, run.description]
      );
      output.push(...runResult.output);
      globalSuccess = globalSuccess && runResult.details.success;
      errors.push(...runResult.details.errors);
    }
    if (isTestBranch(run)) {
      const runResult = executeRunItems(run, path);
      if (outputLevel === 'detailed') {
        output.push(formatBranch(logicalPath.length + 1, run.description, runResult.pass));
      }
      globalSuccess = globalSuccess && runResult.pass;
      if (!runResult.pass) {
        const { details } = runResult;
        errors.push({ path, logicalPath: [...logicalPath, run.description], details });
      }
    }
  }

  if (logicalPath.length <= 0) {
    output = [formatFileResult(path, globalSuccess), ...output];
  }
  return { output, details: { errors, success: globalSuccess } };
};

import { executeRunItems } from './executeRunItems';
import { formatBranch, formatFileResult } from './formatters';
import { isBranch, isTestBranch, type Run } from './typings';

interface RunError {
  path: string;
  logicalPath: string[];
  messages: string[];
  lines: (number | null)[];
}

interface RunDetails {
  success: boolean;
  errors: RunError[]
}

interface RunResult {
  output: string[];
  details: RunDetails;
}

export const executeRuns = (runs: Run[], path: string, logicalPath: string[] = []): RunResult => {
  let output: string[] = [];
  const errors: RunError[] = [];
  let globalSuccess: boolean = true;

  for (const run of runs) {
    if (isBranch(run)) {
      output.push(formatBranch(logicalPath.length + 1, run.description));
      const runResult = executeRuns(run.branches, path, [...logicalPath, run.description]); 
      output.push(...runResult.output);
      globalSuccess = globalSuccess && runResult.details.success;
    }
    if (isTestBranch(run)) {
      const runResult = executeRunItems(run, path);
      output.push(formatBranch(logicalPath.length + 1, run.description, runResult.pass));
      globalSuccess = globalSuccess && runResult.pass;
      if (!runResult.pass) {
        const { messages, lines } = runResult;
        errors.push({ path, logicalPath, messages, lines });
      }
    }
  }

  if (logicalPath.length <= 0) {
    output = [formatFileResult(path, globalSuccess), ...output];
  }
  return { output, details: { errors, success: globalSuccess } };
}

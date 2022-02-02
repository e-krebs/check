import type { RunResult } from './RunTypings';
import { formatErrors } from './formatters';

const printLines = (lines: string[]) => {
  lines.forEach(line => {
    console.log(line);
  });
}

export const printRunResult = async (runResult: RunResult): Promise<void> => {
  printLines(runResult.output);

  if (runResult.details.errors) {
    const errors = await formatErrors(runResult.details.errors);
    printLines(errors);
  }
}


import type { Line } from 'utils/Line';
import { printFile } from 'utils/printFile';
import { executeRuns } from './executeRuns';
import { linesToRuns } from './linesToRun';
import { printRunResult } from './printer';

export const run = async (lines: Line[], path: string): Promise<boolean> => {
  const runs = linesToRuns(lines);
  printFile('out/runs.json', runs);
  const runResult = executeRuns(runs, path);
  await printRunResult(runResult);

  return runResult.details.success;
}


import type { Line } from '../utils/Line';
import { printFile } from '../utils/printFile';
import { executeRuns } from './executeRuns';
import { linesToRuns } from './linesToRun';
import type { OutputLevel } from '../utils/outputLevel';
import { printRunResult } from './printer';

export const run = async (
  lines: Line[],
  path: string,
  outputLevel: OutputLevel
): Promise<boolean> => {
  const runs = linesToRuns(lines);
  printFile(`out/${path}-runs.json`, runs);
  const runResult = executeRuns(runs, path, outputLevel);
  await printRunResult(runResult);

  return runResult.details.success;
};

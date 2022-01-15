
import type { Line } from 'utils/Line';
import { printFile } from 'utils/printFile';
import { executeRuns } from './executeRuns';
import { linesToRuns } from './linesToRun';

export const run = (lines: Line[], path: string) => {
  const runs = linesToRuns(lines);
  printFile('out/runs.json', runs);
  const runResult = executeRuns(runs, path);
  runResult.output.forEach(line => {
    console.log(line)
  });
}

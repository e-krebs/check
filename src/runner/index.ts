
import type { Line } from 'utils/Line';
import { executeRuns } from './executeRuns';
import { linesToRuns } from './linesToRun';

export const run = (lines: Line[], path: string) => {
  const runs = linesToRuns(lines);
  const output = executeRuns(runs, path);
  output.forEach(line => {
    console.log(line)
  });
}

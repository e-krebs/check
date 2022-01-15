
import type { Line } from 'utils/Line';
import { type LineRunParam } from './lineRun';
import { linesToLineRuns } from './linesToLineRuns';
import { runLine } from './runLine';

export const run = (lines: Line[], path: string): {
  runs: LineRunParam[][],
  success: boolean,
} => {
  let success = true;
  // TODO: keep some hierarchy so that we can log info like jest
  const runParams: LineRunParam[][] = linesToLineRuns(lines);
  for (const runParam of runParams) {
    success = success && runLine(runParam, path);
  }
  return {
    runs: runParams,
    success,
  };
}

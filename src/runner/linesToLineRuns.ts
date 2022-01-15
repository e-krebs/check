import { type Line } from 'utils/Line';
import { type LineRunParam } from './lineRun';

export const linesToLineRuns = (lines: Line[], parents: LineRunParam[] = []): LineRunParam[][] => {
  const result: LineRunParam[][] = [];
  let stack: LineRunParam[] = [];
  for (const line of lines) {
    switch (line.type) {
      case 'Code':
        stack.push({ code: line.code });
        break;
      case 'Test':
        result.push([
          ...parents,
          ...stack,
          { tests: line.code }
        ]);
        break;
      case 'TestDescription':
        result.push(...linesToLineRuns(line.items, [
          ...parents,
          ...stack,
          { description: line.description }
        ]));
        break;
      case 'TestDefinition':
        if (!line.items) {
          result.push([
            ...parents,
            ...stack,
            { description: line.description, tests: line.tests }
          ]);
        } else {
          result.push(...linesToLineRuns(line.items, [
            ...parents,
            ...stack,
            { description: line.description }
          ]));
        }
        break;
      case 'Default':
        break;
    }
  }
  return result;
}


import { Line } from 'utils/Line';
import { type Run, type RunItem } from './typings';

export const linesToRuns = (lines: Line[], parents: RunItem[] = []): Run[] => {
  const stack: RunItem[] = [...parents];
  const result: Run[] = []
  for (const line of lines) {
    switch (line.type) {
      case 'Code':
        stack.push(...line.code.map(code => ({ code })));
        break;
      case 'Test':
        stack.push({ tests: line.code, lines: line.lines });
        break;
      case 'TestDescription':
        result.push({
          description: line.description,
          branches: linesToRuns(line.items, stack),
        });
        break;
      case 'TestDefinition':
        if (!line.items) {
          result.push({
            description: line.description,
            items: [...stack, { tests: line.tests, lines: line.lines }],
          });
        } else {
          result.push({
            description: line.description,
            branches: linesToRuns(line.items, stack),
          });
        }
        break;
      case 'Default':
        break;
    }
  }
  return result;
}

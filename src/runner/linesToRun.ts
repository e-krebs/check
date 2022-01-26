
import { Line } from 'utils/Line';
import { type Run, type RunItem } from './typings';

export const linesToRuns = (lines: Line[], parents: RunItem[] = []): Run[] => {
  let stack: RunItem[] = [...parents];
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
          const branches = linesToRuns(line.items, stack);
          if (branches.length === 1 && branches[0].description === '') {
            result.push({
              ...branches[0],
              description: line.description,
            });
          } else {
            result.push({
              description: line.description,
              branches: linesToRuns(line.items, stack),
            });
          }
        }
        break;
      case 'Default':
        break;
    }
  }
  if (result.length <= 0 && stack.length > 0) {
    result.push({ description: '', items: stack });
  }
  return result;
}

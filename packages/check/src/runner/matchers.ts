import chalk from 'chalk';
import { Change, diffJson } from 'diff';
import isEqual from 'lodash/isEqual';

import { MatcherFunction, MatcherResultWithoutLines } from './matchersTyping';
import { isSpy } from './spy';

type MatcherName = 'toEqual';
type Matchers<T> = Record<MatcherName, MatcherFunction<T>>;
type MatchersOrNever<T> = T extends SpyProperties ? Record<string, never> : Matchers<T>;

const matcherDescription: Record<MatcherName, string> = {
  toEqual: 'deep equality',
};

const sortChanges = (changes: Change[]): Change[] => {
  const sorted: Change[] = [];

  for (let i = 0; i < changes.length; i++) {
    if (changes[i].removed && changes[i + 1].added) {
      sorted.push(changes[i + 1]);
      sorted.push(changes[i]);
      i++;
    } else {
      sorted.push(changes[i]);
    }
  }

  return sorted;
};

const undefinedReplacement = 'undefinedReplacementString';

const formatDiff = <T>(expected: T, received: Partial<T>): string[] => {
  const output: string[] = [];

  const diffs = diffJson(
    expected as unknown as object,
    received as unknown as object,
    { undefinedReplacement }
  );
  const sortedDiffs = sortChanges(diffs);

  for (const diff of sortedDiffs) {
    const items = diff.value.split('\n');
    for (const item of items) {
      if (!item) continue;
      const itemAsString = item.replace(`"${undefinedReplacement}"`, 'undefined');
      if (diff.added) output.push(chalk.red(` + ${itemAsString} `));
      else if (diff.removed) output.push(chalk.green(` - ${itemAsString} `));
      else output.push(chalk.grey(`   ${itemAsString} `));
    }
  }
  return output;
};

const matcherMessage = (name: MatcherName, not = false): string => {
  const received = chalk.red('received');
  const fullName = chalk.white(`${not ? '.not' : ''}.${name}`);
  const expected = chalk.green('expected');
  const description = ` // ${matcherDescription[name]}`;
  return chalk.grey(`expect(${received})${fullName}(${expected})${description}`);
};

export const matchers = <T>(received: T): MatchersOrNever<T> => isSpy(received)
  ? {} as MatchersOrNever<T>
  : ({
    toEqual: (expected: T): MatcherResultWithoutLines => {
      const pass = isEqual(received, expected);
      if (pass) return { pass: true };
      return {
        pass: false,
        details: [{
          message: matcherMessage('toEqual'),
          diff: formatDiff(expected, received),
        }]
      };
    }
  }) as MatchersOrNever<T>;

export const not = <T>(matchers: MatchersOrNever<T>): MatchersOrNever<T> => {
  const notMatchers: Partial<MatchersOrNever<T>> = {};
  for (const matcherName in matchers) {
    notMatchers[(matcherName as MatcherName)] = (expected: T) => {
      const pass = !(matchers as Matchers<T>)[matcherName as MatcherName](expected);
      if (pass) return { pass: true };
      return {
        pass: false,
        details: [{
          message: matcherMessage('toEqual', true),
          diff: formatDiff(expected, {}),
        }]
      };
    };
  }
  return notMatchers as MatchersOrNever<T>;
};

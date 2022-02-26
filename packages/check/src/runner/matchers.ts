import chalk from 'chalk';
import isEqual from 'lodash/isEqual';

type MatcherResultSuccess = { pass: true };
export type FailDetailLight<T> = {
  message: string;
  expected: T;
  received: T;
};
export type FailDetail<T> = FailDetailLight<T> & { line: number | null };
export type FailError = {
  error: unknown;
  line: number | null;
};
export const isDetail = <T>(fail: FailDetailLight<T> | FailError): fail is FailDetailLight<T> =>
  Boolean((fail as FailDetailLight<T>).message);

type MatcherResultFail<T, Fail extends FailDetailLight<T> = FailDetail<T>> = {
  pass: false,
  details: (Fail | FailError)[]
};

export type MatcherResultWithoutLines<T> =
  MatcherResultSuccess |
  MatcherResultFail<T, FailDetailLight<T>>;
export type MatcherResult<T> = MatcherResultSuccess | MatcherResultFail<T>;

type MatcherFunction<T> = (expected: T) => MatcherResultWithoutLines<T>;
type MatcherName = 'toEqual';
type Matchers<T> = Record<MatcherName, MatcherFunction<T>>;

const matcherDescription: Record<MatcherName, string> = {
  toEqual: 'deep equality',
};

const matcherMessage = (name: MatcherName, not = false): string => {
  const received = chalk.red('received');
  const fullName = chalk.white(`${not ? '.not' : ''}.${name}`);
  const expected = chalk.green('expected');
  const description = ` // ${matcherDescription[name]}`;
  return chalk.grey(`expect(${expected})${fullName}(${received})${description}`);
};

export const matchers = <T>(received: T): Matchers<T> => ({
  toEqual: (expected: T): MatcherResultWithoutLines<T> => {
    const pass = isEqual(received, expected);
    if (pass) return { pass: true };
    return {
      pass: false,
      details: [{
        message: matcherMessage('toEqual'),
        expected,
        received,
      }]
    };
  }
});

export const not = <T>(matchers: Matchers<T>): Matchers<T> => {
  const notMatchers: Partial<Matchers<T>> = {};
  for (const matcherName in matchers) {
    notMatchers[(matcherName as MatcherName)] = (expected: T) => {
      const pass = !matchers[matcherName as MatcherName](expected);
      if (pass) return { pass: true };
      return {
        pass: false,
        details: [{
          message: matcherMessage('toEqual', true),
          expected,
          received: expected,
        }]
      };
    };
  }
  return notMatchers as Matchers<T>;
};

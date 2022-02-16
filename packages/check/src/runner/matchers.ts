import chalk from 'chalk';
import isEqual from 'lodash/isEqual';

type MatcherResultSuccess = { pass: true };
export type FailDetailLight = {
  message: string;
  expected: object;
  received: object;
};
export type FailDetail =  FailDetailLight & { line: number | null };
export type FailError = {
  error: unknown;
  line: number | null;
};
export const isDetail = (fail: FailDetailLight | FailError): fail is FailDetailLight =>
  Boolean((fail as FailDetailLight).message);

type MatcherResultFail<Fail extends FailDetailLight = FailDetail> = {
  pass: false,
  details: (Fail | FailError)[]
};

export type MatcherResultWithoutLines =
  MatcherResultSuccess |
  MatcherResultFail<FailDetailLight>;
export type MatcherResult = MatcherResultSuccess | MatcherResultFail;

type MatcherFunction = (expected: object) => MatcherResultWithoutLines;
type MatcherName = 'toEqual';
type Matchers = Record<MatcherName, MatcherFunction>;

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

export const matchers = (received: object): Matchers => ({
  toEqual: (expected: object): MatcherResultWithoutLines => {
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

export const not = (matchers: Matchers): Matchers => {
  const notMatchers: Partial<Matchers> = {};
  for (const matcherName in matchers) {
    notMatchers[(matcherName as MatcherName)] = (expected: object) => {
      const pass = !matchers[matcherName as MatcherName](expected);
      if (pass) return { pass: true };
      return {
        pass: false, details: [{
          message: matcherMessage('toEqual', true),
          expected,
          received: expected,
        }]
      };
    };
  }
  return notMatchers as Matchers;
};

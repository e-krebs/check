import isEqual from 'lodash/isEqual';

type MatcherResultSuccess = { pass: true };
type MatcherResultFail = { pass: false, messages: string[], lines: (number | null)[] };

export type MatcherResultWithoutLines = MatcherResultSuccess | Omit<MatcherResultFail, 'lines'>;
export type MatcherResult = MatcherResultSuccess | MatcherResultFail;

type MatcherFunction = (expected: any) => MatcherResultWithoutLines;
type MatcherName = 'toEqual';
type Matchers = Record<MatcherName, MatcherFunction>;

const matcherMessage = (name: MatcherName, not = false): string =>
  `expect(received)${not ? '.not' : ''}.${name}(expected)`;

export const matchers = (received: string): Matchers => ({
  toEqual: (expected: any): MatcherResultWithoutLines => {
    const pass = isEqual(received, expected);
    if (pass) return { pass: true };
    return { pass: false, messages: [matcherMessage('toEqual')] };
  }
});

export const not = (matchers: Matchers): Matchers => {
  const notMatchers: Partial<Matchers> = {};
  for (const matcher in matchers) {
    notMatchers[(matcher as MatcherName)] = (expected: any) => {
      const pass = !matchers[matcher as MatcherName](expected);
      if (pass) return { pass: true };
      return { pass: false, messages: [matcherMessage('toEqual', true)] };
    };
  }
  return notMatchers as Matchers;
}

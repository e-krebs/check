import isEqual  from 'lodash/isEqual';

type MatcherFunction = (expected: any) => boolean;
type Matchers = Record<string, MatcherFunction>;

export const matchers = (received: string): Matchers => ({
  toEqual: (expected: any): boolean => {
    // TODO: do something when returning false
    return isEqual(received, expected);
  }
});

export const not = (matchers: Matchers): Matchers => {
  const notMatchers: Matchers = {};
  for (const matcher in matchers) {
    notMatchers[matcher] = (expected: any) => !matchers[matcher](expected);
  }
  return notMatchers;
}

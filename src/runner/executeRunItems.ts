import { runInContext, type Context } from 'vm';

import { getContext } from './getContext';
import type { MatcherResult, MatcherResultWithoutLines } from './matchers';
import { isCode, isTests, type TestBranch } from './typings';

const runTests = (tests: string[], context: Context): MatcherResultWithoutLines => {
  let pass = true;
  const messages: string[] = [];
  for (const test of tests) {
    const matcherResult: MatcherResult = runInContext(test, context);
    pass = pass && matcherResult.pass;
    if (!matcherResult.pass && matcherResult.messages.length > 0) {
      messages.push(...matcherResult.messages);
    }
  }
  return pass ? { pass: true } : { pass: false, messages };
}

export const executeRunItems = (
  testBranch: TestBranch,
  path: string
): MatcherResult => {
  let pass = true;
  const messages: string[] = [];
  const lines: (number | null)[] = [];
  const context = getContext(path);

  for (const runItem of testBranch.items) {
    if (isCode(runItem)) {
      runInContext(runItem.code, context);
    }
    if (isTests(runItem)) {
      const testResult = runTests(runItem.tests, context);
      pass = pass && testResult.pass;
      if (!testResult.pass && testResult.messages.length > 0) {
        messages.push(...testResult.messages);
        lines.push(...runItem.lines);
      }
    }
  }
  return pass ? { pass: true } : { pass: false, messages, lines };
}

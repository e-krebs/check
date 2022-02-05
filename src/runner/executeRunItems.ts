import { runInContext, type Context } from 'vm';

import { getContext } from './getContext';
import type { FailDetail, MatcherResult, MatcherResultWithoutLines } from './matchers';
import { isCode, isTests, type TestBranch } from './typings';

const runTests = (tests: string[], context: Context): MatcherResultWithoutLines => {
  let pass = true;
  const details: Omit<FailDetail, 'line'>[] = [];
  for (const test of tests) {
    const matcherResult: MatcherResult = runInContext(test, context);
    pass = pass && matcherResult.pass;
    if (!matcherResult.pass && matcherResult.details.length > 0) {
      details.push(...matcherResult.details);
    }
  }
  return pass ? { pass: true } : { pass: false, details };
};

export const executeRunItems = (
  testBranch: TestBranch,
  path: string
): MatcherResult => {
  let pass = true;
  const details: FailDetail[] = [];
  const context = getContext(path);

  for (const runItem of testBranch.items) {
    if (isCode(runItem)) {
      runInContext(runItem.code, context);
    }
    if (isTests(runItem)) {
      const testResult = runTests(runItem.tests, context);
      pass = pass && testResult.pass;
      if (!testResult.pass && testResult.details.length > 0) {
        for (let i = 0; i < testResult.details.length; i++) {
          details.push({ ...testResult.details[i], line: runItem.lines[i] });
        }
      }
    }
  }
  return pass ? { pass: true } : { pass: false, details };
};

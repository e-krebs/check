import { runInContext, type Context } from 'vm';

import { getContext } from './getContext';
import {
  FailError, FailDetail, isDetail, MatcherResult, MatcherResultWithoutLines
} from './matchersTyping';
import { isCode, isTests, type TestBranch } from './typings';

const runTest = (test: string, context: Context): MatcherResultWithoutLines => {
  const matcherResult: MatcherResult = runInContext(test, context);
  return !matcherResult.pass && matcherResult.details.length > 0
    ? { pass: false, details: matcherResult.details }
    : { pass: true };
};

export const executeRunItems = (testBranch: TestBranch, path: string): MatcherResult => {
  let pass = true;
  const details: (FailDetail | FailError)[] = [];
  const context = getContext(path);

  for (const runItem of testBranch.items) {
    if (isCode(runItem)) {
      try {
        runInContext(runItem.code, context);
      } catch (error) {
        return { pass: false, details: [{ error, line: runItem.line }] };
      }
    }
    if (isTests(runItem)) {
      for (let i = 0; i < runItem.tests.length; i++) {
        const testResult = runTest(runItem.tests[i], context);
        pass = pass && testResult.pass;
        if (!testResult.pass && testResult.details.length > 0) {
          for (let j = 0; j < testResult.details.length; j++) {
            const detail = testResult.details[j];
            if (isDetail(detail)) {
              details.push({ ...detail, line: runItem.lines[i] });
            } else {
              details.push(detail);
            }
          }
        }
      }
    }
  }
  return pass ? { pass: true } : { pass: false, details };
};

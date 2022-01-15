import { runInContext, type Context } from 'vm';

import { getContext } from './getContext';
import { isCode, isTests, type TestBranch } from './typings';

const runTests = (tests: string[], context: Context): boolean => {
  let testsResult = true;
  for (const test of tests) {
    testsResult = testsResult && runInContext(test, context);
  }
  return testsResult;
}

export const executeRunItems = (
  testBranch: TestBranch,
  path: string
): boolean => {
  let success = true;
  const context = getContext(path);

  for (const runItem of testBranch.items) {
    if (isCode(runItem)) {
      runInContext(runItem.code, context);
    }
    if (isTests(runItem)) {
      success = success && runTests(runItem.tests, context);
    }
  }
  return success;
}

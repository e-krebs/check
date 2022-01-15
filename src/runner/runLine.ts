import { runInContext, type Context } from 'vm';

import { getContext } from './getContext';
import { isCode, isDescription, isTests, type LineRunParam } from './lineRun';

export const runLine = (runParams: LineRunParam[], path: string): boolean => {
  let success = true;
  const context = getContext(path);
  const output: string[] = [];
  for (const runParam of runParams) {
    if (isCode(runParam)) {
      for (const codeLine of runParam.code) {
        runInContext(codeLine, context);
      }
    }
    if (isDescription(runParam)) {
      output.push(runParam.description);
    }
    if (isTests(runParam)) {
      if (runParam.description) {
        output.push(runParam.description);
      }
      const testResult = runTests(runParam.tests, context);
      output.push(testResult ? '✔' : '❌');
      success = success && testResult;
    }
  }
  console.log(`  ${output.reduce((a, b) => `${a}  ${b}`)}`);
  return success;
}

const runTests = (tests: string[], context: Context): boolean => {
  let testsResult = true;
  for (const test of tests) {
    testsResult = testsResult && runInContext(test, context);
  }
  return testsResult;
}

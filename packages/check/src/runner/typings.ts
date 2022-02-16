type Branch = {
  description: string;
  branches: Run[];
}
export const isBranch = (runParam: Run): runParam is Branch =>
  (runParam as Branch).branches !== undefined;

export type TestBranch = {
  description: string;
  items: RunItem[];
}
export const isTestBranch = (runParam: Run): runParam is TestBranch =>
  (runParam as TestBranch).items !== undefined;

export type Run = Branch | TestBranch;

type Code = {
  code: string;
  line: number | null;
}
export const isCode = (runParam: RunItem): runParam is Code =>
  (runParam as Code).code !== undefined;

type Test = {
  tests: string[];
  lines: (number | null)[]
}
export const isTests = (runParam: RunItem): runParam is Test =>
  (runParam as Test).tests !== undefined;

export type RunItem = Code | Test;
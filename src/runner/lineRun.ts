
type LineRunCode = {
  code: string[];
};

type LineRunDescription = {
  description: string;
};

type LineRunTests = {
  description?: string;
  tests: string[];
};

export type LineRunParam = LineRunCode | LineRunDescription | LineRunTests;

export const isCode = (runParam: LineRunParam): runParam is LineRunCode =>
  (runParam as LineRunCode).code !== undefined;

  export const isDescription = (runParam: LineRunParam): runParam is LineRunDescription =>
  (runParam as LineRunDescription).description !== undefined && (runParam as LineRunTests).tests === undefined;

  export const isTests = (runParam: LineRunParam): runParam is LineRunTests =>
  (runParam as LineRunTests).tests !== undefined;

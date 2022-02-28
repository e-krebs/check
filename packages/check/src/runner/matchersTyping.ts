type MatcherResultSuccess = { pass: true };
export type FailDetailLight = {
  message: string;
  diff: string[];
};
export type FailDetail = FailDetailLight & { line: number | null };
export type FailError = {
  error: unknown;
  line: number | null;
};
export const isDetail = (
  fail: FailDetailLight | FailError
): fail is FailDetailLight =>
  Boolean((fail as FailDetailLight).message);

type MatcherResultFail<Fail extends FailDetailLight = FailDetail> = {
  pass: false,
  details: (Fail | FailError)[]
};

export type MatcherResultWithoutLines =
  MatcherResultSuccess |
  MatcherResultFail<FailDetailLight>;
export type MatcherResult = MatcherResultSuccess | MatcherResultFail;

export type MatcherFunction<T> = (expected: T) => MatcherResultWithoutLines;
export type MatcherWithArgsFunction<T, U extends unknown[]> =
  (expected: T, args: U) => MatcherResultWithoutLines;

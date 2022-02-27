type UnknownFunction = (...args: unknown[]) => unknown
type EmptyFunction = () => void;

interface Matchers<T> {
  toEqual(expected: T): void;
}

interface NotMatchers<T> {
  not: Matchers<T>;
}

interface SpyMatchers {
  toBeCalledTimes: (expected: number) => void;
}

interface SpyProperties {
  isSpy: true;
}

interface Describe {
  (name: string, fn: EmptyFunction): void;
}

interface It {
  (name: string, fn: EmptyFunction): void;
}

interface Expect {
  <T = unknown>(actual: T): T extends SpyProperties ? SpyMatchers : Matchers<T> & NotMatchers<T>;
}

interface Spy {
  <T = UnknownFunction>(modulePath: string, declarationPath: string): T & SpyProperties;
}

declare const describe: Describe;
declare const it: It;
declare const test: It;
declare const expect: Expect;
declare const spy: Spy;

type UnknownFunction = (...args: unknown[]) => unknown
type EmptyFunction = () => void;

interface Matchers<T> {
  toEqual(expected: T): void;
}

interface SpyProperties {
  calls: number;
}

interface Describe {
  (name: string, fn: EmptyFunction): void;
}

interface It {
  (name: string, fn: EmptyFunction): void;
}

interface Expect {
  <T = unknown>(actual: T): Matchers<T>;
}

interface Spy {
  <T = UnknownFunction>(modulePath: string, declarationPath: string): T & SpyProperties;
}

declare const describe: Describe;
declare const it: It;
declare const test: It;
declare const expect: Expect;
declare const spy: Spy;

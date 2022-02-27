import { ModulesRegistry } from './modules';

type FunctionType<U extends Array<unknown>, V> = (...args: U) => V;

interface SpyProperties {
  isSpy: true;
  calls: number;
}

export const isSpy = <T>(
  object: T
): object is T & SpyProperties => (object as T & SpyProperties).isSpy === true;

declare class Spy<U extends Array<unknown>, V> {
  constructor(module: FunctionType<U, V>);
}

function Spy<U extends Array<unknown>, V>(
  this: SpyProperties, module: FunctionType<U, V>
): FunctionType<U, V> {
  this.calls = 0;
  this.isSpy = true;

  const spy: FunctionType<U, V> = (...props: U): V => {
    this.calls++;
    return module(...props);
  };

  Object.defineProperties(spy, {
    calls:  { get: () => this.calls },
    isSpy:  { get: () => this.isSpy },
  });
  return spy as FunctionType<U, V> & SpyProperties;
}

type UnknownFunction = (...args: unknown[]) => unknown

export { Spy };
export const spy = <T = UnknownFunction>(
  modulePath: string,
  declarationPath: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const module = require(modulePath);
  const declaration = module[declarationPath];
  const spyFunction = new Spy(declaration);
  if (!(modulePath in ModulesRegistry.spies)) {
    ModulesRegistry.spies[modulePath] = {};
  }
  ModulesRegistry.spies[modulePath][declarationPath] = spyFunction;
  return spyFunction as T & SpyProperties;
};

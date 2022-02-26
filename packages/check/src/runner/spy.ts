import { ModulesRegistry } from './modules';

type FunctionType<U extends Array<unknown>, V> = (...args: U) => V;

interface SpyProperties {
  calls: number;
}

declare class Spy<U extends Array<unknown>, V> {
  constructor(module: FunctionType<U, V>);
}

function Spy<U extends Array<unknown>, V>(
  this: SpyProperties, module: FunctionType<U, V>
): FunctionType<U, V> {
  this.calls = 0;
  
  const spy: FunctionType<U, V> = (...props: U): V => {
    this.calls++;
    return module(...props);
  };
  Object.defineProperty(spy, 'calls', {
    get: () => this.calls,
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
  ModulesRegistry.spies[modulePath][declarationPath] = spyFunction ;
  return spyFunction as T & SpyProperties;
};

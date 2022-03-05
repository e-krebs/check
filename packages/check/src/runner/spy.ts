import set from 'lodash/set';

import { ModulesRegistry } from './modules';

type FunctionType<U extends Array<unknown>, V> = (...args: U) => V;

export interface SpyCall {
  args: unknown[];
  returns: unknown;
}

export interface SpyProperties {
  isSpy: true;
  calls: SpyCall[];
}

export const isSpy = <T>(
  object: T
): object is T & SpyProperties => (object as T & SpyProperties).isSpy === true;

declare class Spy<U extends Array<unknown>, V> {
  constructor(module: FunctionType<U, V>, context?: unknown);
}

function Spy<U extends Array<unknown>, V>(
  this: SpyProperties, module: FunctionType<U, V>, thisPath?: unknown
): FunctionType<U, V> {
  this.calls = [];
  this.isSpy = true;

  const spy: FunctionType<U, V> = (...args: U): V => {
    const returns = module.call(thisPath, ...args);
    this.calls.push({ args, returns });
    return returns;
  };

  Object.defineProperties(spy, {
    calls: { get: () => this.calls },
    isSpy: { get: () => this.isSpy },
  });
  return spy as FunctionType<U, V> & SpyProperties;
}

export type UnknownFunction = (...args: unknown[]) => unknown;

type PathDeclaration = string | string[];

const resolvePathDeclaration = (module: unknown, path: PathDeclaration): UnknownFunction => {
  const pathArray: string[] = Array.isArray(path) ? path : [path];
  let resolved = module;
  for (let i = 0; i < pathArray.length; i++) {
    resolved = (resolved as never)[pathArray[i]];
  }
  return resolved as UnknownFunction;
};

export const reducePaths = (path: PathDeclaration): string => Array.isArray(path)
? path.reduce((a, b) => `${a}.${b}`)
: path;

export { Spy };
export const spy = <T extends UnknownFunction = UnknownFunction>(
  modulePath: string | 'global',
  declarationPath: PathDeclaration,
  thisPath?: PathDeclaration,
) => {
  const resolvedPath = modulePath === 'global'
    ? 'global'
    : require.resolve(modulePath, { paths: [ModulesRegistry.testFileDirname] });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const module = modulePath === 'global' ? globalThis : require(resolvedPath);

  const declaration = resolvePathDeclaration(module, declarationPath);
  const context = thisPath ? resolvePathDeclaration(module, thisPath) : undefined;

  const spyFunction: Spy<unknown[], unknown> = new Spy(declaration, context);
  if (!(resolvedPath in ModulesRegistry.spies)) {
    ModulesRegistry.spies[resolvedPath] = [];
  }

  ModulesRegistry.spies[resolvedPath].push({ path: declarationPath, spyFunction });
  if (modulePath === 'global') {
    // apply global spy immediately since they're not loaded as modules
    set(globalThis, reducePaths(declarationPath), spyFunction);
  }
  return spyFunction as T & SpyProperties;
};

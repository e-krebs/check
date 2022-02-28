import { createContext, type Context } from 'vm';

import { matchers, not } from './matchers';
import { ModulesRegistry, resolvedRequire } from './modules';
import { spy } from './spy';
import { spyMatchers } from './spyMatchers';

export const getContext = (path: string): Context => {
  const context = createContext({
    require: resolvedRequire(path),
    exports,
    console,
    process,
    expect: <T>(received: T) => ({
      not: not(matchers(received)),
      ...matchers(received),
      ...spyMatchers(received),
    }),
    spy,
  });
  // clear caches
  new ModulesRegistry();
  return context;
};

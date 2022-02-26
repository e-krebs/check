import { createContext, type Context } from 'vm';

import { matchers, not } from './matchers';
import { resolvedRequire } from './modules';
import { spy } from './spy';

export const getContext = (path: string): Context => {
  const context = createContext({
    require: resolvedRequire(path),
    exports,
    console,
    process,
    expect: (received: object) => ({
      not: not(matchers(received)),
      ...matchers(received)
    }),
    spy,
  });
  return context;
};

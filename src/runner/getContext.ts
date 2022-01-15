import { createContext, type Context } from 'vm';
import { realpathSync } from 'fs';

import { matchers, not } from './matchers';

const resolvedRequire = (path: string): NodeRequire => {
  const dir = realpathSync(path.slice(0, path.lastIndexOf('/')));
  const res = (id: string) => {
    const resolvedPath = require.resolve(id, { paths: [dir] });
    return require(resolvedPath);
  };
  res.resolve = require.resolve;
  res.cache = require.cache;
  res.extensions = require.extensions;
  res.main = require.main;
  return res;
}

export const getContext = (path: string): Context => {
  const context = createContext({
    require: resolvedRequire(path),
    exports,
    console,
    expect: (received: string) => ({
      not: not(matchers(received)),
      ...matchers(received)
    }),
  });
  return context;
};

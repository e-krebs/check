import { realpathSync } from 'fs';
import { Module } from 'module';

const moduleLoad = Module._load;

type ModuleDeclarations = Record<string, unknown>;
type Modules = Record<string, ModuleDeclarations>;
export class ModulesRegistry {
  constructor() {
    // clear spies cache
    ModulesRegistry.spies = {};
    // clear node inner module cache
    Module._cache = {};
  }

  static spies: Modules = {};
}

// this is the require function used inside the test file
export const resolvedRequire = (path: string): NodeRequire => {
  const dir = realpathSync(path.slice(0, path.lastIndexOf('/')));
  const res = (id: string) => {
    const resolvedPath = require.resolve(id, { paths: [dir] });
    // this is the inner function called by node to resolve dependencies
    Module._load = (request, parent, isMain) => {
      const loadedModule = moduleLoad(request, parent, isMain);
      if (request in ModulesRegistry.spies) {
        return { ...loadedModule, ...ModulesRegistry.spies[request] };
      }
      return loadedModule;
    };
    return require(resolvedPath);
  };
  res.resolve = require.resolve;
  res.cache = require.cache;
  res.extensions = require.extensions;
  res.main = require.main;
  return res;
};

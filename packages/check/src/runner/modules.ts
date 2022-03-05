import { realpathSync } from 'fs';
import { Module } from 'module';
import set from 'lodash/set';

import { Spy, reducePaths } from './spy';

const moduleLoad = Module._load;

interface ModuleDeclaration {
  path: string | string[],
  spyFunction: Spy<unknown[], unknown>,
}
type Modules = Record<string, ModuleDeclaration[]>;
export class ModulesRegistry {
  constructor(testFileDirname: string) {
    // clear spies cache
    ModulesRegistry.spies = {};
    // clear node inner module cache
    Module._cache = {};
    ModulesRegistry.testFileDirname = testFileDirname;
  }

  static spies: Modules = {};
  static testFileDirname: string;
}

// this is the require function used inside the test file
export const resolvedRequire = (path: string): NodeRequire => {
  const dir = realpathSync(path.slice(0, path.lastIndexOf('/')));
  const res = (id: string) => {
    const resolvedPath = require.resolve(id, { paths: [dir] });
    // this is the inner function called by node to resolve dependencies
    Module._load = (request, parent, isMain) => {
      const loadedModule = moduleLoad(request, parent, isMain);
      const resolvedPath = Module._resolveFilename(request, parent, isMain);
      if (resolvedPath in ModulesRegistry.spies) {
        const moduleDeclarations = ModulesRegistry.spies[resolvedPath];
        for (const moduleDeclaration of moduleDeclarations) {
          set(loadedModule, reducePaths(moduleDeclaration.path), moduleDeclaration.spyFunction);
        }
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

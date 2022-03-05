import { Module as OriginalModule } from 'module';

declare module 'module' {
  class Module extends OriginalModule {
      static _load: (request: string, parent: Module, isMain: boolean) => NodeModule;
      static _resolveFilename: (request: string, parent: Module, isMain: boolean) => string;
      static _cache: Record<string, NodeModule>;
  }
  export = Module;
}

import { Module as OriginalModule } from 'module';

declare module 'module' {
  class Module extends OriginalModule {
      static _load: (request: string, parent: Module, isMain: boolean) => NodeModule;
  }
  export = Module;
}

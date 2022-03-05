# spy

`spy<T = UnknownFunction>(modulePath: string | 'global', declarationPath: string | string[], thisPath?: string | string[]) => T & SpyProperties;`

# basic usage
you can defined a spy by specifying the module & declaration you want to spy:
```ts
const spyExistsSync = spy('fs', 'existsSync')
```
optionally, you can add typing to your spy function:
```ts
import { type existsSync } from 'fs';

const spyExistsSync = spy<typeof existsSync>('fs', 'existsSync');
```

Regular matchers don't work on spy function, instead, they have their dedicated set of spy matchers. So far:
- `toBeCalled` matcher (will compare the number in parameter with the spy function inner counter)
  - first argument is the number of calls to match
  - second argument (optional) is an array of parameters to match (match, not equal)
  - if both are provided, it will succeed if the function has been called X times with arguments matching those provided

> A note about typings:
>
> `check`'s types are smart enough so that depending on the parameter passed to the `it`/`test` function:
>  - if this parameter is a spy functions, only spy matchers are available (not standard matchers)
>  - if this parameter is not a spy function, only standard matchers are available (not spy matchers)

# advanced usages
All these advanced usage can be combined together.

## deep declaration
It is possible to spy on a deeper function. To do so, the second argument you pass must be a string array:
```ts
// this will spy on declarationA.myFunction inside myCustomModule
const spyMyFunction = spy('myCustomModule', ['declarationA', 'myFunction']);
```

## dealing with context
If your spy function need a specific `this` when running, you can specify its path through the third optional argument:
```ts
// myFunction will be executed with this being declarationA
const spyMyFunction = spy('myCustomModule', ['declarationA', 'myFunction'], 'declarationA');
```
This third argument can either be a string or string array.

## spying a global function
To spy on a global function, pass 'global' as the first argument:
```ts
const spyConsoleWarn = spy('global', ['console', 'warn']);
```

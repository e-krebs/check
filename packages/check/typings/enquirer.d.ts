declare module 'enquirer' {
  export interface PromptOptions {
    type: string;
    name: 'value';
    message: string;
    initial?: string;
  }

  export declare class Prompt {
    constructor(options?: PromptOptions);
    value: string;
    clear: () => void;
    write: (...args: string[]) => void;
    state: { message: string };
    keypress(key: string, event: Key, a?: { line: string }): void;
    cursorHide: () => void;
    cursorShow: () => void;
  }

  declare class Enquirer<T = object> {
    constructor(options?: object, answers?: T);
    register<T extends typeof Enquirer.Prompt>(type: string, fn: T | (() => T)): this;

    prompt(
      questions:
        | PromptOptions
        | ((this: Enquirer) => PromptOptions)
        | (PromptOptions | ((this: Enquirer) => PromptOptions))[]
    ): Promise<T>;
  }

  export = Enquirer;
}

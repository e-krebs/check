import chalk from 'chalk';
import Enquirer, { PromptOptions } from 'enquirer';
import Glob from 'fast-glob';
import { Key, cursorTo } from 'readline';

import { getConfiguration } from '../utils/getConfiguration';
import { filterFiles } from './filterFiles';

const highlight = (text: string, tag: string): string => {
  return chalk.gray(text.replaceAll(tag, chalk.white(tag)));
};

const maxFilesShown = 5;

export class GlobPrompt extends Enquirer.Prompt {
  constructor(options: PromptOptions) {
    super(options);
    this.value = options.initial || '';
  }

  private print(search = ''): void {
    this.cursorHide();
    console.clear();
    this.write(chalk.gray(`\n  ${this.state.message}${chalk.white(search)}`));
    const { testFilesPattern } = getConfiguration();
    Glob(testFilesPattern).then(patternResults => {
      const results = filterFiles(patternResults, search);
      switch (results.length) {
        case 0:
          this.write(chalk.gray('\n\n    no file found\n'));
          break;
        case 1:
          this.write(chalk.gray('\n\n    1 file found\n'));
          break;
        default: {
          const additional = results.length > maxFilesShown
            ? ` (showing first ${maxFilesShown} files)`
            : '';
          this.write(chalk.gray(`\n\n    ${results.length} files found${additional}\n`));
          break;
        }
      }
      results.slice(0, maxFilesShown).map((result => {
        this.write(`\n  ${highlight(result, search)}`);
      }));
      // cursor position (2 for spaces)
      cursorTo(process.stdout, this.state.message.length + search.length + 2, 1);
      this.cursorShow();
    });

  }

  keypress(key: string, event: Key, { line }: { line: string }): void {
    if (event.name === 'return') {
      // on enter → validate
      super.keypress(key, event);
    } else {
      this.value = line;
      this.print(line);
    }
  }

  render(): void {
    this.print();
  }
}

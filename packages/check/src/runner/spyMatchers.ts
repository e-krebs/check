import chalk, { ForegroundColor } from 'chalk';

import { MatcherFunction, MatcherResultWithoutLines } from './matchersTyping';
import { isSpy } from './spy';

type SpyMatcherName = 'toBeCalledTimes';
type SpyMatchers = Record<SpyMatcherName, MatcherFunction<number>>
type SpyMatchersOrNever<T> = T extends SpyProperties ? SpyMatchers : Record<string, never>;

const spyMatcherMessage = (name: SpyMatcherName): string => {
  const received = chalk.red('received');
  const fullName = chalk.white(`.${name}`);
  const expected = chalk.green('expected');
  return chalk.grey(`expect(${received})${fullName}(${expected})`);
};

const calledTimes = (symbol: string, nb: number, color: typeof ForegroundColor): string => {
  const times = nb > 1 ? 'times' : 'time';
  const colorer = chalk[color];
  return chalk.grey(`  ${colorer(symbol)} called ${colorer(nb)} ${times}`);
};

export const spyMatchers = <T>(
  received: T
): SpyMatchersOrNever<T> => isSpy(received)
    ? {
      toBeCalledTimes: (times: number): MatcherResultWithoutLines => {
        isSpy(received);
        const pass = received.calls === times;
        if (pass) return { pass: true };
        return {
          pass: false,
          details: [{
            message: spyMatcherMessage('toBeCalledTimes'),
            diff: [
              calledTimes('+', received.calls, 'red'),
              calledTimes('-', times, 'green')
            ],
          }]
        };
      },
    } as SpyMatchersOrNever<T>
    : {} as SpyMatchersOrNever<T>;

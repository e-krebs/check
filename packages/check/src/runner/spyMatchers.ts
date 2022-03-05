import chalk, { ForegroundColor } from 'chalk';
import isMatch from 'lodash/isMatch';

import { MatcherWithArgsFunction, MatcherResultWithoutLines } from './matchersTyping';
import { isSpy, SpyCall } from './spy';

type SpyMatcherName = 'toBeCalled';
type SpyMatchers<T extends unknown[]> = Record<SpyMatcherName, MatcherWithArgsFunction<number, T>>
type SpyMatchersOrNever<T, U extends unknown[]> = T extends SpyProperties
  ? SpyMatchers<U>
  : Record<string, never>;

const spyMatcherMessage = (name: SpyMatcherName, args?: string): string => {
  const received = chalk.red('received');
  const fullName = chalk.white(`.${name}`);
  const expected = chalk.green('expected');
  const options = args ? `, ${args}` : '';
  return chalk.grey(`expect(${received})${fullName}(${expected}${options})`);
};

const calledTimes = (
  symbol: string,
  nb: number,
  color: typeof ForegroundColor,
  args?: string
): string => {
  const times = nb > 1 ? 'times' : 'time';
  const colorer = chalk[color];
  const options = args ? ` with ${args}` : '';
  return chalk.grey(`  ${colorer(symbol)} called ${colorer(nb)} ${times}${options}`);
};

const argsToString = <U extends unknown[]>(args: U): string => {
  switch (args.length) {
    case 0:
      return '';
    case 1:
      return JSON.stringify(args[0]);
    default:
      return args.map(arg => JSON.stringify(arg)).reduce((a, b) => `${a}, ${b}`);
  }
};

const stringifyCall = (call: SpyCall): string => {
  return chalk.gray(`    called once with ${argsToString(call.args)}`);
};

const validateCall = <U extends unknown[]>(call: SpyCall, args: U): boolean => {
  let result: boolean | null = null;
  for (let i = 0; i < args.length; i++) {
    const expected = args[i];
    const received = call.args[i];
    if (expected) {
      if (!received) return false;
      switch (typeof expected) {
        case 'object':
          if (typeof received === 'object') {
            result = (result ?? true) && isMatch(received, expected as object);
          } else {
            return false;
          }
          break;
        case 'string':
        case 'number':
          result = (result ?? true) && received === expected;
          break;
        default:
          return false;
      }
    }
  }
  return result ?? false;
};

interface CallsValidation {
  pass: boolean;
  timesPassed: number;
}

const validateCalls = <U extends unknown[]>(
  times: number, calls: SpyCall[], args: U
): CallsValidation => {
  const validations: boolean[] = calls
    .map(call => validateCall<U>(call, args))
    .filter(success => success);
  switch (validations.length) {
    case 0:
      return { pass: times === 0, timesPassed: 0 };
    case 1: {
      const valid = validations[0];
      return {
        pass: times === 1 && valid,
        timesPassed: valid ? 1 : 0
      };
    }
    default:
      {
        const timesPassed = validations.filter(a => a === true).length;
        return { pass: timesPassed === times, timesPassed };
      }
  }
};

export const spyMatchers = <T, U extends unknown[]>(
  received: T
): SpyMatchersOrNever<T, U> => isSpy(received)
    ? {
      toBeCalled: (times: number, args: U): MatcherResultWithoutLines => {
        isSpy<T>(received);
        if (!args || args.length <= 0) {
          if (received.calls.length === times) return { pass: true };
          return {
            pass: false,
            details: [{
              message: spyMatcherMessage('toBeCalled'),
              diff: [
                calledTimes('+', received.calls.length, 'red'),
                calledTimes('-', times, 'green')
              ],
            }]
          };
        } else {
          const { pass, timesPassed } = validateCalls(times, received.calls, args);
          if (pass) return { pass: true };
          const options = argsToString(args);
          return {
            pass: false,
            details: [{
              message: spyMatcherMessage('toBeCalled', options),
              diff: [
                calledTimes('+', timesPassed, 'red', options),
                ...received.calls.map(stringifyCall),
                calledTimes('-', times, 'green', options)
              ]
            }],
          };
        }
      },
    } as SpyMatchersOrNever<T, U>
    : {} as SpyMatchersOrNever<T, U>;

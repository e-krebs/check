import type { existsSync, readFileSync } from 'fs';

const spyExistsSync = spy<typeof existsSync>('fs', 'existsSync');
const spyReadFileSync = spy<typeof readFileSync>('fs', 'readFileSync');
const spySafeParse = spy(
  '../../models/configuration',
  ['ConfigurationModel', 'safeParse'],
  'ConfigurationModel'
);
const spyConsoleWarn = spy<typeof console.warn>('global', ['console', 'warn']);
const spyConsoleError = spy<typeof console.warn>('global', ['console', 'error']);

import { ConfigurationModel } from '../../models/configuration';
import { getConfiguration } from '../getConfiguration';

process.argv = ['node', 'checkWorker'];

describe('getConfiguration', () => {
  describe('when no argument is passed', () => {
    describe('default', () => {
      const configuration = getConfiguration();

      it('should return default configuration', () => {
        expect(spyExistsSync).toBeCalled(1, ['check.config.json']);
        expect(spyReadFileSync).toBeCalled(0, ['check.config.json']);
        expect(spySafeParse).toBeCalled(1, [{}]);
        expect(spyConsoleWarn).toBeCalled(0);
        expect(spyConsoleError).toBeCalled(0);
        expect(configuration).toEqual(ConfigurationModel.parse({}));
      });
    });

    describe('when log: true', () => {
      getConfiguration(true);

      it('should return default configuration', () => {
        expect(spyConsoleWarn).toBeCalled(1);
      });
    });
  });

  describe('when a configPath argument is passed', () => {
    process.argv.push('some/path/to/config.json');

    const configuration = getConfiguration();

    it('should return default configuration', () => {
      expect(spyExistsSync).toBeCalled(1, ['some/path/to/config.json']);
      expect(spyReadFileSync).toBeCalled(0, ['some/path/to/config.json']);
      expect(spyReadFileSync).toBeCalled(0, ['check.config.json']);
      expect(spySafeParse).toBeCalled(1, [{}]);
      expect(spyConsoleWarn).toBeCalled(0);
      expect(spyConsoleError).toBeCalled(0);
      expect(configuration).toEqual(ConfigurationModel.parse({}));
    });
  });
});

// TODO: update tests when mocking will be available
// - when file exists
// - when file parsing fails
// - etc.
import { getArguments } from '../getArguments';

process.argv = ['node', 'checkWorker'];

describe('getArguments', () => {
  describe('when no argument is passed', () => {
    it('should return default', () => {
      expect(getArguments()).toEqual({ watch: false, configPath: undefined });
    });
  });

  describe('when configPath is passed', () => {
    process.argv.push('some/path/to/config.json');

    it('should return configPath', () => {
      expect(getArguments()).toEqual({ watch: false, configPath: 'some/path/to/config.json' });
    });
  });

  describe('when --watch is passed', () => {
    process.argv.push('--watch');
    it('should return configPath', () => {
      expect(getArguments()).toEqual({ watch: true, configPath: undefined });
    });
  });
});

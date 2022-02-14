import { trimChar } from '../trimChar';

describe('trimChar', () => {
  it('should trim single quotes (default)', () => {
    expect(trimChar('\'test\'')).toEqual('test');
    expect(trimChar('\'test')).toEqual('test');
    expect(trimChar('test\'')).toEqual('test');
    expect(trimChar('\'\'test\'\'')).toEqual('test');
  });

  it('should trim given char (but not single quotes)', () => {
    expect(trimChar(' test ', ' ')).toEqual('test');
    expect(trimChar(' test', ' ')).toEqual('test');
    expect(trimChar('test ', ' ')).toEqual('test');
    expect(trimChar('  test  ', ' ')).toEqual('test');
    expect(trimChar('\'test\'', ' ')).toEqual('\'test\'');
  });
});

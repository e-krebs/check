
export type Arguments = {
  configPath?: string;
} & { [Key in OptionNames]: boolean; }

const optionPrefix = '--';
const isOption = (argument: string): boolean => argument.startsWith(optionPrefix);

const optionsNames = ['watch'] as const;
type OptionNames = typeof optionsNames[number];
const optionArg = (name: OptionNames): `--${OptionNames}` => `${optionPrefix}${name}`;


export const getArguments = (): Arguments => {
  const [...args] = process.argv.slice(2);

  const { configPath, options } = args.length > 0 && !isOption(args[0])
    ? { configPath: args[0], options: args.slice(1).filter(isOption) }
    : { configPath: undefined, options: args.filter(isOption) };

  const optionList: Partial<Record<OptionNames, boolean>> = {};
  optionsNames.forEach(option => {
    optionList[option] = options.includes(optionArg(option));
  });

  return { configPath, ...optionList as Record<OptionNames, boolean> };
};

import { readFileSync, existsSync } from 'fs';
import chalk from 'chalk';

import { type Configuration, ConfigurationModel } from '../models/configuration';
import { getArguments } from './getArguments';

export const getConfiguration = (log = false): Configuration => {
  let config: unknown = {};

  const { configPath } = getArguments();
  const path = configPath ?? 'check.config.json';
  try {
    if (existsSync(path)) {
      const configFile = readFileSync(path, 'utf-8');
      config = JSON.parse(configFile);
    } else if (log) {
      console.warn(chalk.yellowBright(
        `File ${chalk.bgYellowBright.black(path)} doesn't exist, using default configuration`
      ));
    }
  } catch (e) {
    console.error(`${chalk.red('Error while reading config file')} ${chalk.bgRed(path)}`);
  }

  const result = ConfigurationModel.safeParse(config);
  if (!result.success) {
    console.error(
      `${chalk.red('Error while parsing config file')} ${chalk.bgRed(path)}`,
      result.error.errors
    );
    process.exit(1);
  }
  return result.data;
};
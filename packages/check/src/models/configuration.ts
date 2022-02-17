import { object, string, array, type infer as Infer } from 'zod';

const defaultTestFilesPattern = '**/*.test.ts';
const defaultWatchFilesPattern = '**/*';
const defaultWatchFilesIgnored = ['node_modules', '.git', '.swc', 'dist', 'out'];

export const ConfigurationModel = object({
  testFilesPattern: string().default(defaultTestFilesPattern),
  watchFilesPattern: string().default(defaultWatchFilesPattern),
  watchFilesIgnored: array(string()).default(defaultWatchFilesIgnored),
}).default({
  testFilesPattern: defaultTestFilesPattern,
  watchFilesPattern: defaultWatchFilesPattern,
  watchFilesIgnored: defaultWatchFilesIgnored,
});

export type Configuration = Infer<typeof ConfigurationModel>;

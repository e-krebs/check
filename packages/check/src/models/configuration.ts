import { object, string, type infer as Infer } from 'zod';

const defaultPattern = '**/*.test.ts';

export const ConfigurationModel = object({
  testFilesPattern: string().default(defaultPattern)
}).default({
  testFilesPattern: defaultPattern
});

export type Configuration = Infer<typeof ConfigurationModel>;

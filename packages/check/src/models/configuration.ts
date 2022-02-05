import { object, string, type infer as Infer } from 'zod';

const defaultPattern = '**/*.test.ts';

export const ConfigurationModel = object({
  pattern: string().default(defaultPattern)
}).default({
  pattern: defaultPattern
});

export type Configuration = Infer<typeof ConfigurationModel>;

import { parse } from './parser';
import { run } from './runner';
import type { OutputLevel } from './utils/outputLevel';
import { printFile } from './utils/printFile';

export const check = async (path: string, outputLevel: OutputLevel): Promise<boolean> => {
  const parsedFile = await parse(path);
  printFile(`out/${path}-result.json`, parsedFile);
  
  return await run(parsedFile, path, outputLevel);
};

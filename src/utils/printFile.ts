import { writeFileSync, mkdirSync } from 'fs';
import { getFolders } from './pathHelper';

export const printFile = (path: string, content: any) => {
  const folders = getFolders(path);

  try {
    mkdirSync(folders, { recursive: true });
  } catch (e) {
    console.warn(e)
  }

  writeFileSync(path, JSON.stringify(content, undefined, 2));
};

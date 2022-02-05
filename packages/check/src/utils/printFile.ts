import { writeFileSync, mkdirSync } from 'fs';

import { getFolders } from './pathHelper';

export const printFile = (path: string, content: object) => {
  if (process.env.WRITE_DEBUG_FILES !== 'true') {
    return;
  }

  const folders = getFolders(path);

  try {
    mkdirSync(folders, { recursive: true });
  } catch (e) {
    console.warn(e);
  }

  writeFileSync(path, JSON.stringify(content, undefined, 2));
};

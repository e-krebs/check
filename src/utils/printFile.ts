import { writeFileSync, mkdirSync, opendirSync } from 'fs';

export const printFile = (path: string, content: any) => {
  const folders = path.slice(0, path.lastIndexOf('/'));

  try {
    mkdirSync(folders, { recursive: true });
  } catch (e) {
    console.warn(e)
  }

  writeFileSync(path, JSON.stringify(content, undefined, 2));
};

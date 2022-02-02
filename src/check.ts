import { parse } from 'parser';
import { run } from 'runner';
import { printFile } from 'utils/printFile';

const main = async (): Promise<void> => {
  const path = process.argv.slice(2)[0];
  const parsedFile = await parse(path);
  printFile('out/result.json', parsedFile);
  
  const success = await run(parsedFile, path);
  process.exit(success ? 0 : 1)
}

main();

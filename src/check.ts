import { parse } from 'parser';
import { run } from 'runner';
import { printFile } from 'utils/printFile';

const path = process.argv.slice(2)[0];
const parsedFile = parse(path);
printFile('out/result.json', parsedFile);

run(parsedFile, path);

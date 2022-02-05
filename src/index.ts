import { Glob } from 'glob';
import { config } from 'dotenv';

import { type OutputLevel } from 'runner/outputLevel';
import { getConfiguration } from 'utils/getConfiguration';
import { checkInWorker } from './checkInWorker';

config();

const { pattern } = getConfiguration();
new Glob(pattern, async (err, files) => {
  if (err) {
    console.error('Error with pattern', err);
    process.exit(1);
  } else {
    const outputLevel: OutputLevel = files.length > 1 ? 'short' : 'detailed';
    const checks = await Promise.all(files.map(
      async file => await checkInWorker(file, outputLevel)
    ));
    const success: boolean = checks.reduce((a, b) => a && b);
    process.exit(success ? 0 : 1);
  }
});

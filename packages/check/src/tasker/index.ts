import { watch as watchFn } from 'chokidar';
import Queue from 'better-queue';
import chalk from 'chalk';

import { type OutputLevel } from '../utils/outputLevel';
import { checkInWorker } from '../checkInWorker';
import { globs } from './globs';

interface QueueItem {
  path: string;
  outputLevel: OutputLevel;
}

export const tasker = () => {
  const queue = new Queue<QueueItem>(
    ({ path, outputLevel }, cb) => {
      const { cancel, result } = checkInWorker(path, outputLevel);
      // task will be considered as finished when we call cb
      // i.e. when result is resolved
      result.then(cb);
      return { cancel };
    },
    { cancelIfRunning: true, id: 'path' }
  );

  queue.on('empty', () => {
    console.log('');
    console.log(chalk.gray('Ran all tests.'));
  });

  // watcher source file
  const watcher = watchFn('./**/*', {
    persistent: true,
    ignored: ['node_modules', '.git']
  });

  watcher
    .on('add', async () => { await runTests(queue); })
    .on('change', async () => { await runTests(queue); })
    .on('unlink', async () => { await runTests(queue); });
};

export const runTests = async (queue?: Queue) => {
  const files = await globs();
  const outputLevel: OutputLevel = files.length > 1 ? 'short' : 'detailed';

  if (queue) {
    // running asynchronously (through the queue)
    console.clear();
    files.map(path => {
      queue.push({ path, outputLevel });
    });
  } else {
    // running synchronously
    const workers = files.map(file => checkInWorker(file, outputLevel));
    const checks = await Promise.all(workers.map(
      async worker => await worker.result
    ));
    const success: boolean = checks.reduce((a, b) => a && b);
    process.exit(success ? 0 : 1);
  }
};

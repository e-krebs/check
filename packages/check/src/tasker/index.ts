import { watch as watchFn, type FSWatcher } from 'chokidar';
import Queue from 'better-queue';
import chalk from 'chalk';

import { type OutputLevel } from '../utils/outputLevel';
import { checkInWorker } from '../checkInWorker';
import { globs } from './globs';
import { getConfiguration } from '../utils/getConfiguration';
import { filterFiles } from './filterFiles';

interface QueueItem {
  path: string;
  outputLevel: OutputLevel;
}

// singleton
export class Tasker {
  static runningTasks: string[] = [];
  static watcherIsOn = true;
  static queue?: Queue;
  static watcher?: FSWatcher;
  static filter = '';
}

export const tasker = () => {
  Tasker.queue = new Queue<QueueItem>(
    ({ path, outputLevel }, cb) => {
      const { cancel, result } = checkInWorker(path, outputLevel);
      // task will be considered as finished when we call cb
      // i.e. when result is resolved
      result.then(cb);
      return { cancel };
    },
    { cancelIfRunning: true, id: 'path' }
  );

  Tasker.queue.on('empty', () => {
    console.log('');
    console.log(chalk.gray('Ran all tests.'));
    console.log('');
    console.log(chalk.gray(`press ${chalk.white('<f>')} to filter`));
    console.log(chalk.gray(`press ${chalk.white('<ctrl> + <c>')} to exit`));
  });

  // watcher source file
  const { watchFilesPattern, watchFilesIgnored } = getConfiguration(true);
  Tasker.watcher = watchFn(watchFilesPattern, {
    persistent: true,
    ignored: watchFilesIgnored
  });

  Tasker.watcher
    .on('add', async () => { await runTests(); })
    .on('change', async () => { await runTests(); })
    .on('unlink', async () => { await runTests(); });
};

export const runTests = async () => {
  let outputLevel: OutputLevel = 'short';
  let files = await globs(!Tasker.queue);
  if (Tasker.filter) {
    files = filterFiles(files, Tasker.filter);
  }

  switch (files.length) {
    case 0: {
      const { testFilesPattern } = getConfiguration();
      console.error(chalk.yellowBright(
        `No test file matches "${chalk.bgYellowBright.black(testFilesPattern)}", stopping...`
      ));
      process.exit(1);
      break;
    }
    case 1:
      outputLevel = 'detailed';
      break;
  }

  if (Tasker.queue) {
    // running asynchronously (through the queue)
    console.clear();
    if (Tasker.filter) {
      console.log(chalk.gray(`  files filtered on: ${chalk.white(Tasker.filter)}\n`));
    }
    for (const path of files) {
      Tasker.queue.push({ path, outputLevel });
      if (!Tasker.runningTasks.includes(path)) {
        Tasker.runningTasks.push(path);
      }
    }
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

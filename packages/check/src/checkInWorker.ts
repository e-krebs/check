import { Worker } from 'worker_threads';
import { resolve } from 'path';

import { type OutputLevel } from './runner/outputLevel';

export const checkInWorker = (file: string, outputLevel: OutputLevel): Promise<boolean> => {
  const checkWorker = resolve(__dirname, 'checkWorker.js');
  return new Promise<boolean>((resolve) => {
    let success = false;

    const worker = new Worker(
      // mandatory js worker, will run checkTask.ts
      checkWorker,
      // workerData is used inside checkTask.ts
      { workerData: { file, outputLevel } }
    );

    worker.once(
      'message',
      (result: boolean) => { success = result; }
    );

    worker.on(
      'error',
      (error: Error) => {
        console.error(`worker error (${file})`, error);
        return resolve(false);
      }
    );

    worker.on('exit', () => resolve(success));
  });
};

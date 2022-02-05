import { Worker } from 'worker_threads';

import { type OutputLevel } from 'runner/outputLevel';

export const checkInWorker = (file: string, outputLevel: OutputLevel): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    let success = false;

    const worker = new Worker(
      // mandatory js worker, will run checkTask.ts
      './src/checkWorker.js',
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

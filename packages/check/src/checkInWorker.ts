import { Worker as WorkerThread } from 'worker_threads';
import { resolve } from 'path';

import { type OutputLevel } from './utils/outputLevel';

interface Worker {
  result: Promise<boolean>;
  cancel: () => Promise<number>;
}

export const checkInWorker = (file: string, outputLevel: OutputLevel): Worker => {
  const checkWorker = resolve(__dirname, 'checkWorker.js');

  const worker = new WorkerThread(
    // mandatory js worker, will run checkTask.ts
    checkWorker,
    // workerData is used inside checkTask.ts
    { workerData: { file, outputLevel } }
  );

  const result = new Promise<boolean>((resolve) => {
    let success = false;

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

  const cancel = async () => {
    return await worker.terminate();
  };

  return { result, cancel, };
};

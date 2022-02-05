import { parentPort, workerData } from 'worker_threads';

import { check } from './check';

// data sent when creating the worker
const { file, outputLevel } = workerData;
check(file, outputLevel).then((success) => {
  if (parentPort) {
    parentPort.postMessage(success);
  } else {
    throw ('parentPort is null');
  }
});

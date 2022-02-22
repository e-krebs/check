import { config } from 'dotenv';

import { getArguments } from './utils/getArguments';
import { runTests, tasker } from './tasker';
import { listenKeypress } from './tasker/listenKeypress';

config();

const main = async () => {
  const { watch } = getArguments();
  if (watch) {
    tasker();
    listenKeypress();
  } else {
    await runTests();
  }
};

main();

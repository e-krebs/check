import { config } from 'dotenv';

import { getArguments } from './utils/getArguments';
import { runTests, tasker } from './tasker';

config();

const main = async () => {
  const { watch } = getArguments();
  if (watch) {
    tasker();
  } else {
    await runTests();
  }
};

main();

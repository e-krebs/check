const path = require('path');
require('ts-node').register({
  transpileOnly: true,
  'ts-node': { swc: true }
});
require(path.resolve(__dirname, 'checkTask.ts'));

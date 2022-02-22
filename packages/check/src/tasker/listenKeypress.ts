import Enquirer from 'enquirer';
import { emitKeypressEvents, Key } from 'readline';

import { GlobPrompt } from './GlobPrompt';
import { tasker, Tasker } from './index';

const enquirer = new Enquirer<{ value: string }>();
enquirer.register('glob', GlobPrompt);

export const listenKeypress = () => {
  process.stdin.setRawMode(true);
  process.stdin.resume();

  emitKeypressEvents(process.stdin);
  process.stdin.on('keypress', async (_, key) => await onKeyPress(key));
};

const onKeyPress = async (key: Key): Promise<void> => {
  if (key.ctrl && key.name === 'c') {
    console.clear();
    process.exit();
  }

  if (!Tasker.watcherIsOn) return;

  if (!key.ctrl && !key.meta && !key.shift && key.name === 'f') {
    Tasker.watcherIsOn = false;

    Tasker.runningTasks.map(taskId => { Tasker.queue?.cancel(taskId); });
    Tasker.runningTasks.splice(0, Tasker.runningTasks.length);
    Tasker.queue?.destroy(() => { });

    await Tasker.watcher?.close();

    const { value } = await enquirer.prompt({
      type: 'glob',
      name: 'value',
      message: 'filter on: '
    }).catch(() => ({ value: '' }));

    console.clear();
    Tasker.filter = value;
    Tasker.watcherIsOn = true;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    tasker();
  }
};

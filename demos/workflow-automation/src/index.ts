import { resolve } from 'path';
import { startWatcher } from './watcher.js';

const watchDir = process.argv[2] ?? resolve(process.cwd(), 'watch');

startWatcher(watchDir);

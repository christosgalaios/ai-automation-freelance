import chokidar from 'chokidar';
import { resolve, extname, dirname } from 'path';
import { mkdirSync } from 'fs';
import { parseCsvFile } from './parser.js';
import { enrichBatch, getClient } from './enricher.js';
import { buildReport, saveReport, sendSlackNotification } from './reporter.js';

const queue = new Set<string>();
let processing = false;

async function processFile(filePath: string): Promise<void> {
  console.log(`\n[QUEUE] Processing: ${filePath}`);

  const { rows, errors: parseErrors } = parseCsvFile(filePath);
  console.log(`  Parsed ${rows.length} valid rows, ${parseErrors.length} errors`);

  if (rows.length === 0) {
    console.log('  No valid rows to enrich — skipping.');
    return;
  }

  const client = getClient();
  console.log(`  Enriching ${rows.length} rows via Claude...`);
  const { enriched, errors: enrichErrors } = await enrichBatch(rows, client);

  const allErrors = [...parseErrors, ...enrichErrors];
  const report = buildReport(filePath, enriched, rows.length + parseErrors.length, allErrors);

  const outputDir = resolve(dirname(filePath), '..', 'output');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = saveReport(report, outputDir);

  console.log(`  Report saved: ${outputPath}`);
  sendSlackNotification(report);
}

async function drainQueue(): Promise<void> {
  if (processing || queue.size === 0) return;
  processing = true;

  while (queue.size > 0) {
    const [next] = queue;
    queue.delete(next);
    try {
      await processFile(next);
    } catch (err) {
      console.error(`  Error processing ${next}:`, err instanceof Error ? err.message : err);
    }
  }

  processing = false;
}

export function startWatcher(watchDir: string): void {
  const resolvedDir = resolve(watchDir);
  console.log(`\nWatching for CSV files in: ${resolvedDir}`);
  console.log('Drop a .csv file into the directory to trigger processing.\n');

  const watcher = chokidar.watch(resolvedDir, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
  });

  watcher.on('add', (filePath: string) => {
    if (extname(filePath).toLowerCase() === '.csv') {
      console.log(`[WATCHER] Detected: ${filePath}`);
      queue.add(filePath);
      void drainQueue();
    }
  });

  watcher.on('error', (err: unknown) => {
    console.error('[WATCHER] Error:', err);
  });
}

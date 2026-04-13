/**
 * Thin adapter around node:sqlite DatabaseSync.
 * Abstracted here so tests can mock this module instead of node:sqlite directly.
 */
import { DatabaseSync } from 'node:sqlite';

export type { DatabaseSync };

export function openDatabase(path: string): DatabaseSync {
  return new DatabaseSync(path);
}

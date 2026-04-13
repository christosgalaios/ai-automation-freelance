import { join, dirname } from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { openDatabase, type DatabaseSync } from './sqlite-adapter.js';

export type { DatabaseSync };

const DEFAULT_DB_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..', '..', '..', 'data', 'tracker.db'
);

let _db: DatabaseSync | null = null;

export function getDb(dbPath?: string): DatabaseSync {
  if (_db) return _db;
  const path = dbPath ?? process.env.TRACKER_DB_PATH ?? DEFAULT_DB_PATH;
  mkdirSync(dirname(path), { recursive: true });
  _db = openDatabase(path);
  migrate(_db);
  return _db;
}

export function closeDb(): void {
  _db?.close();
  _db = null;
}

export function createDb(dbPath: string): DatabaseSync {
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = openDatabase(dbPath);
  migrate(db);
  return db;
}

function migrate(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY,
      job_title TEXT NOT NULL,
      platform TEXT DEFAULT 'upwork',
      client_name TEXT,
      rate_quoted REAL,
      rate_type TEXT DEFAULT 'fixed',
      date_sent TEXT NOT NULL,
      status TEXT DEFAULT 'sent',
      proposal_file TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export type ProposalStatus = 'sent' | 'viewed' | 'replied' | 'won' | 'lost';

export interface Proposal {
  id: number;
  job_title: string;
  platform: string;
  client_name: string | null;
  rate_quoted: number | null;
  rate_type: string;
  date_sent: string;
  status: ProposalStatus;
  proposal_file: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewProposal {
  job_title: string;
  platform?: string;
  client_name?: string;
  rate_quoted?: number;
  rate_type?: string;
  date_sent: string;
  status?: ProposalStatus;
  proposal_file?: string;
  notes?: string;
}

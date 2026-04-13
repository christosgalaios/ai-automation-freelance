import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import type { SqlJsStatic, Database, QueryExecResult } from 'sql.js';
import type { DatabaseSync } from '../src/sqlite-adapter.js';

// ---------------------------------------------------------------------------
// sql.js is async — load it once, then build a synchronous adapter
// ---------------------------------------------------------------------------
let SQL: SqlJsStatic;

beforeAll(async () => {
  SQL = await initSqlJs();
});

// Build a DatabaseSync-compatible object backed by sql.js
function makeDb(): DatabaseSync {
  const sqlDb: Database = new SQL.Database();

  const exec = (sql: string): void => {
    sqlDb.run(sql);
  };

  const prepare = (sql: string) => ({
    run: (...params: unknown[]) => {
      sqlDb.run(sql, params as (string | number | null | Uint8Array)[]);
      const rowid =
        (sqlDb.exec('SELECT last_insert_rowid()')[0]?.values[0]?.[0] as number) ?? 0;
      return { lastInsertRowid: BigInt(rowid), changes: sqlDb.getRowsModified() };
    },
    get: (...params: unknown[]) => {
      const result: QueryExecResult[] = sqlDb.exec(
        sql,
        params as (string | number | null | Uint8Array)[]
      );
      if (!result[0] || result[0].values.length === 0) return undefined;
      const obj: Record<string, unknown> = {};
      result[0].columns.forEach((c, i) => {
        obj[c] = result[0].values[0][i];
      });
      return obj;
    },
    all: (...params: unknown[]) => {
      const result: QueryExecResult[] = sqlDb.exec(
        sql,
        params as (string | number | null | Uint8Array)[]
      );
      if (!result[0]) return [];
      return result[0].values.map((vals) => {
        const obj: Record<string, unknown> = {};
        result[0].columns.forEach((c, i) => {
          obj[c] = vals[i];
        });
        return obj;
      });
    },
  });

  return { exec, prepare, close: () => sqlDb.close() } as unknown as DatabaseSync;
}

// ---------------------------------------------------------------------------
// Mock sqlite-adapter so node:sqlite is never imported
// ---------------------------------------------------------------------------
vi.mock('../src/sqlite-adapter.js', () => ({
  openDatabase: (_path: string) => makeDb(),
}));

import { createDb } from '../src/db.js';
import {
  addProposal,
  getProposal,
  listProposals,
  updateStatus,
  deleteProposal,
  getStats,
  exportToCsv,
} from '../src/commands.js';

let db: DatabaseSync;

beforeEach(() => {
  db = createDb(':memory:');
});

describe('addProposal', () => {
  it('creates a proposal with required fields', () => {
    const p = addProposal(db, { job_title: 'Build MCP Server', date_sent: '2026-04-01' });
    expect(p.id).toBeGreaterThan(0);
    expect(p.job_title).toBe('Build MCP Server');
    expect(p.status).toBe('sent');
    expect(p.platform).toBe('upwork');
  });

  it('stores optional fields', () => {
    const p = addProposal(db, {
      job_title: 'AI Workflow',
      date_sent: '2026-04-02',
      client_name: 'Acme Corp',
      rate_quoted: 750,
      notes: 'Promising lead',
    });
    expect(p.client_name).toBe('Acme Corp');
    expect(p.rate_quoted).toBe(750);
    expect(p.notes).toBe('Promising lead');
  });

  it('defaults platform to upwork', () => {
    const p = addProposal(db, { job_title: 'Test', date_sent: '2026-04-01' });
    expect(p.platform).toBe('upwork');
  });
});

describe('getProposal', () => {
  it('retrieves an existing proposal', () => {
    const created = addProposal(db, { job_title: 'Test', date_sent: '2026-04-01' });
    const fetched = getProposal(db, created.id);
    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(created.id);
  });

  it('returns undefined for missing id', () => {
    expect(getProposal(db, 9999)).toBeUndefined();
  });
});

describe('listProposals', () => {
  it('returns all proposals', () => {
    addProposal(db, { job_title: 'A', date_sent: '2026-04-01' });
    addProposal(db, { job_title: 'B', date_sent: '2026-04-02' });
    expect(listProposals(db)).toHaveLength(2);
  });

  it('filters by status', () => {
    addProposal(db, { job_title: 'A', date_sent: '2026-04-01', status: 'sent' });
    addProposal(db, { job_title: 'B', date_sent: '2026-04-02', status: 'won' });
    expect(listProposals(db, 'won')).toHaveLength(1);
    expect(listProposals(db, 'sent')).toHaveLength(1);
  });

  it('returns empty array when no proposals', () => {
    expect(listProposals(db)).toHaveLength(0);
  });
});

describe('updateStatus', () => {
  it('updates proposal status', () => {
    const p = addProposal(db, { job_title: 'Test', date_sent: '2026-04-01' });
    const updated = updateStatus(db, p.id, 'replied');
    expect(updated?.status).toBe('replied');
  });

  it('returns null for missing id', () => {
    expect(updateStatus(db, 9999, 'won')).toBeNull();
  });

  it('allows all valid statuses', () => {
    const p = addProposal(db, { job_title: 'Test', date_sent: '2026-04-01' });
    for (const status of ['sent', 'viewed', 'replied', 'won', 'lost'] as const) {
      expect(updateStatus(db, p.id, status)?.status).toBe(status);
    }
  });
});

describe('deleteProposal', () => {
  it('deletes an existing proposal', () => {
    const p = addProposal(db, { job_title: 'Test', date_sent: '2026-04-01' });
    expect(deleteProposal(db, p.id)).toBe(true);
    expect(getProposal(db, p.id)).toBeUndefined();
  });

  it('returns false for missing id', () => {
    expect(deleteProposal(db, 9999)).toBe(false);
  });
});

describe('getStats', () => {
  beforeEach(() => {
    addProposal(db, { job_title: 'A', date_sent: '2026-04-01', status: 'won', rate_quoted: 500 });
    addProposal(db, { job_title: 'B', date_sent: '2026-04-02', status: 'won', rate_quoted: 1000 });
    addProposal(db, { job_title: 'C', date_sent: '2026-04-03', status: 'lost' });
    addProposal(db, { job_title: 'D', date_sent: '2026-04-04', status: 'replied' });
    addProposal(db, { job_title: 'E', date_sent: '2026-04-05', status: 'sent' });
  });

  it('counts total proposals', () => expect(getStats(db).total).toBe(5));
  it('calculates win rate', () => expect(getStats(db).winRate).toBe('40%'));
  it('calculates reply rate', () => expect(getStats(db).replyRate).toBe('80%'));
  it('calculates average rate', () => expect(getStats(db).averageRate).toBe(750));
  it('calculates total won value', () => expect(getStats(db).totalValue).toBe(1500));
  it('returns status breakdown', () => {
    const s = getStats(db);
    expect(s.byStatus['won']).toBe(2);
    expect(s.byStatus['lost']).toBe(1);
  });
});

describe('exportToCsv', () => {
  it('exports correct CSV headers', () => {
    const csv = exportToCsv(db);
    expect(csv.split('\n')[0]).toContain('job_title');
  });

  it('exports all proposals', () => {
    addProposal(db, { job_title: 'A', date_sent: '2026-04-01' });
    addProposal(db, { job_title: 'B', date_sent: '2026-04-02' });
    expect(exportToCsv(db).split('\n').filter(Boolean)).toHaveLength(3);
  });

  it('escapes commas in fields', () => {
    addProposal(db, { job_title: 'Build MCP, and more', date_sent: '2026-04-01' });
    expect(exportToCsv(db)).toContain('"Build MCP, and more"');
  });

  it('handles empty table', () => {
    expect(exportToCsv(db).split('\n').filter(Boolean)).toHaveLength(1);
  });
});

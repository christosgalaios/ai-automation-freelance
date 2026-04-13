import { DatabaseSync } from 'node:sqlite';
import type { Proposal, NewProposal, ProposalStatus } from './db.js';

export function addProposal(db: DatabaseSync, data: NewProposal): Proposal {
  const stmt = db.prepare(`
    INSERT INTO proposals (job_title, platform, client_name, rate_quoted, rate_type, date_sent, status, proposal_file, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.job_title,
    data.platform ?? 'upwork',
    data.client_name ?? null,
    data.rate_quoted ?? null,
    data.rate_type ?? 'fixed',
    data.date_sent,
    data.status ?? 'sent',
    data.proposal_file ?? null,
    data.notes ?? null,
  );

  return getProposal(db, Number(result.lastInsertRowid))!;
}

export function getProposal(db: DatabaseSync, id: number): Proposal | undefined {
  const stmt = db.prepare('SELECT * FROM proposals WHERE id = ?');
  return stmt.get(id) as Proposal | undefined;
}

export function listProposals(db: DatabaseSync, status?: ProposalStatus): Proposal[] {
  if (status) {
    const stmt = db.prepare('SELECT * FROM proposals WHERE status = ? ORDER BY date_sent DESC');
    return stmt.all(status) as Proposal[];
  }
  return db.prepare('SELECT * FROM proposals ORDER BY date_sent DESC').all() as Proposal[];
}

export function updateStatus(
  db: DatabaseSync,
  id: number,
  status: ProposalStatus
): Proposal | null {
  const existing = getProposal(db, id);
  if (!existing) return null;

  db.prepare(
    "UPDATE proposals SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, id);

  return getProposal(db, id)!;
}

export function deleteProposal(db: DatabaseSync, id: number): boolean {
  const result = db.prepare('DELETE FROM proposals WHERE id = ?').run(id);
  return result.changes > 0;
}

export interface Stats {
  total: number;
  byStatus: Record<string, number>;
  winRate: string;
  replyRate: string;
  averageRate: number | null;
  totalValue: number;
  platformBreakdown: Record<string, number>;
  recentActivity: Array<{ date: string; count: number }>;
}

export function getStats(db: DatabaseSync): Stats {
  const all = listProposals(db);

  const byStatus: Record<string, number> = {};
  const platformBreakdown: Record<string, number> = {};
  let rateSum = 0;
  let rateCount = 0;
  let totalValue = 0;

  for (const p of all) {
    byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
    platformBreakdown[p.platform] = (platformBreakdown[p.platform] ?? 0) + 1;
    if (p.rate_quoted) {
      rateSum += p.rate_quoted;
      rateCount++;
    }
    if (p.status === 'won' && p.rate_quoted) {
      totalValue += p.rate_quoted;
    }
  }

  const won = byStatus['won'] ?? 0;
  const replied = (byStatus['replied'] ?? 0) + won + (byStatus['lost'] ?? 0);
  const total = all.length;

  const winRate = total > 0 ? `${Math.round((won / total) * 100)}%` : '0%';
  const replyRate = total > 0 ? `${Math.round((replied / total) * 100)}%` : '0%';

  const activityMap: Record<string, number> = {};
  for (const p of all) {
    const date = p.date_sent.slice(0, 10);
    activityMap[date] = (activityMap[date] ?? 0) + 1;
  }
  const recentActivity = Object.entries(activityMap)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 30)
    .map(([date, count]) => ({ date, count }));

  return {
    total,
    byStatus,
    winRate,
    replyRate,
    averageRate: rateCount > 0 ? Math.round(rateSum / rateCount) : null,
    totalValue,
    platformBreakdown,
    recentActivity,
  };
}

export function exportToCsv(db: DatabaseSync): string {
  const proposals = listProposals(db);
  const headers = [
    'id', 'job_title', 'platform', 'client_name', 'rate_quoted',
    'rate_type', 'date_sent', 'status', 'proposal_file', 'notes',
    'created_at', 'updated_at',
  ];

  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [
    headers.join(','),
    ...proposals.map((p) =>
      headers.map((h) => escapeCell(p[h as keyof Proposal])).join(',')
    ),
  ];

  return rows.join('\n');
}

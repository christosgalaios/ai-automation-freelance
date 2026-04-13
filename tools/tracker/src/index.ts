#!/usr/bin/env node
import { createInterface } from 'readline';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { getDb } from './db.js';
import {
  addProposal,
  listProposals,
  updateStatus,
  getStats,
  exportToCsv,
  type Stats,
} from './commands.js';
import type { ProposalStatus } from './db.js';

const VALID_STATUSES: ProposalStatus[] = ['sent', 'viewed', 'replied', 'won', 'lost'];

function ask(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function cmdAdd(): Promise<void> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const jobTitle = await ask(rl, 'Job title: ');
    const platform = await ask(rl, 'Platform [upwork]: ');
    const clientName = await ask(rl, 'Client name (optional): ');
    const rateStr = await ask(rl, 'Rate quoted (optional, e.g. 500): ');
    const rateType = await ask(rl, 'Rate type [fixed/hourly]: ');
    const dateSent = await ask(rl, `Date sent [${new Date().toISOString().slice(0, 10)}]: `);
    const proposalFile = await ask(rl, 'Proposal file path (optional): ');
    const notes = await ask(rl, 'Notes (optional): ');

    const db = getDb();
    const proposal = addProposal(db, {
      job_title: jobTitle || 'Untitled',
      platform: platform || 'upwork',
      client_name: clientName || undefined,
      rate_quoted: rateStr ? parseFloat(rateStr) : undefined,
      rate_type: rateType || 'fixed',
      date_sent: dateSent || new Date().toISOString().slice(0, 10),
      proposal_file: proposalFile || undefined,
      notes: notes || undefined,
    });

    console.log(`\nAdded proposal #${proposal.id}: "${proposal.job_title}"`);
  } finally {
    rl.close();
  }
}

function cmdList(status?: string): void {
  const db = getDb();
  const proposals = listProposals(db, status as ProposalStatus | undefined);

  if (proposals.length === 0) {
    console.log('No proposals found.');
    return;
  }

  console.log('\nID  | Date       | Status   | Platform | Rate     | Title');
  console.log('-'.repeat(80));
  for (const p of proposals) {
    const rate = p.rate_quoted ? `£${p.rate_quoted}` : 'N/A';
    const id = String(p.id).padEnd(3);
    const date = p.date_sent.slice(0, 10).padEnd(11);
    const statusPad = p.status.padEnd(9);
    const platform = p.platform.padEnd(9);
    const ratePad = rate.padEnd(9);
    console.log(`${id} | ${date}| ${statusPad}| ${platform}| ${ratePad}| ${p.job_title}`);
  }
  console.log(`\nTotal: ${proposals.length}`);
}

function cmdUpdate(id: string, status: string): void {
  if (!VALID_STATUSES.includes(status as ProposalStatus)) {
    console.error(`Invalid status. Choose from: ${VALID_STATUSES.join(', ')}`);
    process.exit(1);
  }
  const db = getDb();
  const updated = updateStatus(db, parseInt(id, 10), status as ProposalStatus);
  if (!updated) {
    console.error(`Proposal #${id} not found.`);
    process.exit(1);
  }
  console.log(`Updated #${id} to "${status}"`);
}

function cmdStats(): void {
  const db = getDb();
  const stats: Stats = getStats(db);

  console.log('\n=== Proposal Tracker Stats ===\n');
  console.log(`Total proposals: ${stats.total}`);
  console.log(`Win rate:        ${stats.winRate}`);
  console.log(`Reply rate:      ${stats.replyRate}`);
  console.log(`Average rate:    ${stats.averageRate ? `£${stats.averageRate}` : 'N/A'}`);
  console.log(`Total won value: £${stats.totalValue}`);
  console.log('\nBy status:');
  for (const [status, count] of Object.entries(stats.byStatus)) {
    console.log(`  ${status.padEnd(10)} ${count}`);
  }
  console.log('\nBy platform:');
  for (const [platform, count] of Object.entries(stats.platformBreakdown)) {
    console.log(`  ${platform.padEnd(10)} ${count}`);
  }
}

function cmdExport(outputPath?: string): void {
  const db = getDb();
  const csv = exportToCsv(db);
  const path = outputPath ?? join(process.cwd(), `proposals-export-${Date.now()}.csv`);
  writeFileSync(path, csv, 'utf-8');
  console.log(`Exported to: ${path}`);
}

function printHelp(): void {
  console.log(`
Proposal Tracker CLI

Commands:
  tracker add                    Log a new proposal (interactive)
  tracker list [status]          Show all proposals (filter by status)
  tracker update <id> <status>   Update proposal status
  tracker stats                  Show conversion rates and analytics
  tracker export [output.csv]    Export all proposals to CSV

Statuses: sent | viewed | replied | won | lost
`);
}

async function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case 'add':
      await cmdAdd();
      break;
    case 'list':
      cmdList(args[0]);
      break;
    case 'update':
      if (!args[0] || !args[1]) {
        console.error('Usage: tracker update <id> <status>');
        process.exit(1);
      }
      cmdUpdate(args[0], args[1]);
      break;
    case 'stats':
      cmdStats();
      break;
    case 'export':
      cmdExport(args[0]);
      break;
    default:
      printHelp();
  }
}

main().catch((err) => {
  console.error('Error:', err instanceof Error ? err.message : err);
  process.exit(1);
});

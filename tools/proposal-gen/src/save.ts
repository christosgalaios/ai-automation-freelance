import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { type ProposalResult, type JobDetails } from './generator.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export interface ProposalMetadata {
  jobTitle: string;
  jobUrl?: string;
  budget?: string;
  clientLocation?: string;
  keyRequirements: string[];
  date: string;
  wordCount: number;
  status: 'draft';
  proposalFile: string;
  jsonFile: string;
}

export function saveProposal(
  result: ProposalResult,
  job: JobDetails,
  jobUrl: string | undefined,
  outputDir: string
): ProposalMetadata {
  mkdirSync(outputDir, { recursive: true });

  const date = new Date().toISOString().slice(0, 10);
  const slug = slugify(result.jobTitle);
  const baseName = `${date}-${slug}`;
  const mdPath = join(outputDir, `${baseName}.md`);
  const jsonPath = join(outputDir, `${baseName}.json`);

  const mdContent = [
    `# Proposal: ${result.jobTitle}`,
    `**Date:** ${date}`,
    jobUrl ? `**Job URL:** ${jobUrl}` : '',
    job.budget ? `**Budget:** ${job.budget}` : '',
    `**Word Count:** ${result.wordCount}`,
    '',
    '---',
    '',
    result.text,
  ]
    .filter((l) => l !== undefined)
    .join('\n');

  const metadata: ProposalMetadata = {
    jobTitle: result.jobTitle,
    jobUrl,
    budget: job.budget,
    clientLocation: job.clientLocation,
    keyRequirements: job.keyRequirements,
    date,
    wordCount: result.wordCount,
    status: 'draft',
    proposalFile: mdPath,
    jsonFile: jsonPath,
  };

  writeFileSync(mdPath, mdContent, 'utf-8');
  writeFileSync(jsonPath, JSON.stringify(metadata, null, 2), 'utf-8');

  return metadata;
}

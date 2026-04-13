#!/usr/bin/env node
import { input, editor } from '@inquirer/prompts';
import { resolve } from 'path';
import { generateProposal, getAnthropicClient } from './generator.js';
import { saveProposal } from './save.js';

async function main() {
  console.log('\nProposal Generator — AI Automation Engineer\n');
  console.log('Answer the prompts below to generate a tailored Upwork proposal.\n');

  const jobTitle = await input({ message: 'Job title:' });
  const jobUrl = await input({ message: 'Job URL (optional, press Enter to skip):' });
  const jobDescription = await editor({
    message: 'Paste the full job description (opens editor):',
  });
  const budget = await input({ message: 'Budget mentioned (optional):' });
  const clientLocation = await input({ message: 'Client location (optional):' });
  const requirementsInput = await input({
    message: 'Key requirements (comma-separated):',
  });
  const keyRequirements = requirementsInput
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);

  console.log('\nGenerating proposal...\n');

  try {
    const client = getAnthropicClient();
    const result = await generateProposal(
      { jobTitle, jobDescription, budget: budget || undefined, clientLocation: clientLocation || undefined, keyRequirements },
      client
    );

    console.log('='.repeat(60));
    console.log(result.text);
    console.log('='.repeat(60));
    console.log(`\nWord count: ${result.wordCount}/200`);

    const outputDir = resolve(process.cwd(), '../../proposals');
    const metadata = saveProposal(
      result,
      { jobTitle, jobDescription, budget: budget || undefined, clientLocation: clientLocation || undefined, keyRequirements },
      jobUrl || undefined,
      outputDir
    );

    console.log(`\nSaved to:`);
    console.log(`  Proposal: ${metadata.proposalFile}`);
    console.log(`  Metadata: ${metadata.jsonFile}`);
  } catch (err) {
    console.error('\nError:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();

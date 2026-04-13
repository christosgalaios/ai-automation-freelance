import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BANNED_PHRASES, type JobDetails } from '../src/generator.js';

const MOCK_PROPOSAL = `Your requirement for MCP server integration with Salesforce is exactly the kind of system I've built at scale.

I've built 110+ MCP tools across 14 production modules, connecting Claude to CRMs, databases, and third-party APIs. Your use case — syncing lead data between Salesforce and Claude — maps directly to what I've shipped.

I'd approach this by building a typed MCP server in TypeScript with tools for lead retrieval, status updates, and activity logging. I'd use the official @modelcontextprotocol/sdk, add Zod validation on all inputs, and include a test suite covering the Salesforce API integration. Deployment would be via a simple Node.js process you can run locally or on any server.

My IEEE-published research on multi-agent systems underpins this architecture.

What's your current Salesforce API access setup — are you on the REST or Bulk API?

Christos
AI Automation Engineer
https://christosgalaios.vercel.app`;

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ type: 'text', text: MOCK_PROPOSAL }],
      }),
    },
  })),
}));

import { generateProposal } from '../src/generator.js';
import Anthropic from '@anthropic-ai/sdk';

const SAMPLE_JOB: JobDetails = {
  jobTitle: 'Build MCP Server for Salesforce Integration',
  jobDescription:
    'We need a developer to build a Model Context Protocol server that connects Claude to our Salesforce CRM. The server should support reading leads, updating statuses, and logging activities.',
  budget: '$500-1000',
  clientLocation: 'United States',
  keyRequirements: ['MCP server', 'Salesforce API', 'TypeScript', 'Claude integration'],
};

describe('generateProposal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a proposal under 200 words', async () => {
    const client = new Anthropic({ apiKey: 'test' });
    const result = await generateProposal(SAMPLE_JOB, client);
    expect(result.wordCount).toBeLessThanOrEqual(200);
  });

  it('contains at least one number or metric', async () => {
    const client = new Anthropic({ apiKey: 'test' });
    const result = await generateProposal(SAMPLE_JOB, client);
    expect(/\d+/.test(result.text)).toBe(true);
  });

  it('does not contain banned phrases', async () => {
    const client = new Anthropic({ apiKey: 'test' });
    const result = await generateProposal(SAMPLE_JOB, client);
    const lowerText = result.text.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      expect(lowerText).not.toContain(phrase.toLowerCase());
    }
  });

  it('includes the sign-off URL', async () => {
    const client = new Anthropic({ apiKey: 'test' });
    const result = await generateProposal(SAMPLE_JOB, client);
    expect(result.text).toContain('https://christosgalaios.vercel.app');
  });

  it('includes the sign-off name', async () => {
    const client = new Anthropic({ apiKey: 'test' });
    const result = await generateProposal(SAMPLE_JOB, client);
    expect(result.text).toContain('Christos');
  });

  it('returns correct metadata', async () => {
    const client = new Anthropic({ apiKey: 'test' });
    const result = await generateProposal(SAMPLE_JOB, client);
    expect(result.jobTitle).toBe(SAMPLE_JOB.jobTitle);
    expect(result.generatedAt).toBeTruthy();
  });

  it('calls Claude with the correct model', async () => {
    const client = new Anthropic({ apiKey: 'test' });
    await generateProposal(SAMPLE_JOB, client);
    expect(client.messages.create).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'claude-sonnet-4-6' })
    );
  });
});

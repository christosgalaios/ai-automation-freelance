import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentOutputSchema } from '../src/schema.js';

// Mock the Anthropic SDK before importing pipeline
vi.mock('@anthropic-ai/sdk', () => {
  const mockOutput = {
    topic: 'AI automation for small businesses',
    generatedAt: new Date().toISOString(),
    socialPosts: [
      { platform: 'twitter', content: 'Small businesses can save 20+ hours/week with AI automation. Here\'s how to start. #AIAutomation', characterCount: 92 },
      { platform: 'linkedin', content: 'AI automation is no longer just for enterprise. Small businesses are now leveraging Claude and custom workflows to eliminate repetitive tasks and focus on growth.', characterCount: 162 },
      { platform: 'instagram', content: 'Transform your business with AI automation. Save time, reduce errors, scale faster. 🤖', characterCount: 87 },
      { platform: 'facebook', content: 'Did you know small businesses that adopt AI automation report saving an average of 20+ hours per week? Learn how to automate your workflows today.', characterCount: 148 },
      { platform: 'threads', content: 'The AI automation playbook for small businesses: Start with one repetitive task. Automate it. Measure the time saved. Repeat.', characterCount: 124 },
    ],
    blogOutline: {
      title: 'How Small Businesses Can Save 20+ Hours/Week with AI Automation',
      metaDescription: 'Practical guide to AI automation for small businesses — tools, workflows, and real results.',
      sections: [
        { heading: 'Introduction', subpoints: ['The time problem', 'AI as the solution'], estimatedWordCount: 300 },
        { heading: 'Top Tasks to Automate', subpoints: ['Email handling', 'Data entry', 'Reporting'], estimatedWordCount: 600 },
        { heading: 'Getting Started', subpoints: ['Choose a workflow', 'Pick your tools', 'Measure results'], estimatedWordCount: 500 },
        { heading: 'Conclusion', subpoints: ['Next steps'], estimatedWordCount: 200 },
      ],
      estimatedReadTime: '8 min read',
      targetKeywords: ['AI automation', 'small business automation', 'workflow automation'],
    },
    hashtags: {
      primary: ['#AIAutomation', '#SmallBusiness', '#Productivity'],
      secondary: ['#WorkflowAutomation', '#BusinessGrowth', '#TechForBusiness', '#DigitalTransformation', '#AITools'],
      niche: ['#ClaudeAI', '#MCPServer', '#AIWorkflow'],
    },
    postingSchedule: [
      { platform: 'linkedin', bestDays: ['Tuesday', 'Wednesday', 'Thursday'], bestTimes: ['9:00 AM', '12:00 PM'], frequency: '3x per week', rationale: 'B2B audience most active mid-week mornings' },
      { platform: 'twitter', bestDays: ['Monday', 'Wednesday', 'Friday'], bestTimes: ['8:00 AM', '5:00 PM'], frequency: 'Daily', rationale: 'Tech audience active at commute times' },
    ],
  };

  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ type: 'text', text: JSON.stringify(mockOutput) }],
        }),
      },
    })),
  };
});

import { runContentPipeline } from '../src/pipeline.js';
import Anthropic from '@anthropic-ai/sdk';

describe('runContentPipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns valid ContentOutput structure', async () => {
    const client = new Anthropic({ apiKey: 'test-key' });
    const result = await runContentPipeline('AI automation for small businesses', client);
    expect(() => ContentOutputSchema.parse(result)).not.toThrow();
  });

  it('returns exactly 5 social posts', async () => {
    const client = new Anthropic({ apiKey: 'test-key' });
    const result = await runContentPipeline('test topic', client);
    expect(result.socialPosts).toHaveLength(5);
  });

  it('covers all required platforms', async () => {
    const client = new Anthropic({ apiKey: 'test-key' });
    const result = await runContentPipeline('test topic', client);
    const platforms = result.socialPosts.map((p) => p.platform);
    expect(platforms).toContain('twitter');
    expect(platforms).toContain('linkedin');
    expect(platforms).toContain('instagram');
  });

  it('blog outline has required fields', async () => {
    const client = new Anthropic({ apiKey: 'test-key' });
    const result = await runContentPipeline('test topic', client);
    expect(result.blogOutline.title).toBeTruthy();
    expect(result.blogOutline.sections.length).toBeGreaterThan(0);
    expect(result.blogOutline.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it('hashtags include primary, secondary and niche', async () => {
    const client = new Anthropic({ apiKey: 'test-key' });
    const result = await runContentPipeline('test topic', client);
    expect(result.hashtags.primary.length).toBeGreaterThan(0);
    expect(result.hashtags.secondary.length).toBeGreaterThan(0);
    expect(result.hashtags.niche.length).toBeGreaterThan(0);
  });

  it('calls the Anthropic API with correct model', async () => {
    const client = new Anthropic({ apiKey: 'test-key' });
    await runContentPipeline('test topic', client);
    expect(client.messages.create).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'claude-sonnet-4-6' })
    );
  });
});

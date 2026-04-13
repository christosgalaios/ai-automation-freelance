import Anthropic from '@anthropic-ai/sdk';
import { ContentOutputSchema, type ContentOutput } from './schema.js';

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set.\n' +
        'Copy env.example to .env and add your key:\n' +
        '  ANTHROPIC_API_KEY=sk-ant-...'
    );
  }
  return new Anthropic({ apiKey: key });
}

const SYSTEM_PROMPT = `You are an expert content strategist and copywriter specialising in B2B SaaS and AI technology.
Given a topic, produce structured content output as valid JSON matching this exact schema:

{
  "topic": string,
  "generatedAt": ISO8601 string,
  "socialPosts": [
    { "platform": "twitter"|"linkedin"|"instagram"|"facebook"|"threads", "content": string, "characterCount": number }
  ],  // exactly 5 posts, one per platform
  "blogOutline": {
    "title": string,
    "metaDescription": string (max 160 chars),
    "sections": [{ "heading": string, "subpoints": string[], "estimatedWordCount": number }],
    "estimatedReadTime": string,
    "targetKeywords": string[]
  },
  "hashtags": {
    "primary": string[],    // 3-5 high-volume hashtags
    "secondary": string[],  // 5-8 medium hashtags
    "niche": string[]       // 3-5 niche hashtags
  },
  "postingSchedule": [
    { "platform": string, "bestDays": string[], "bestTimes": string[], "frequency": string, "rationale": string }
  ]
}

Return ONLY valid JSON. No markdown, no explanation.`;

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function runContentPipeline(
  topic: string,
  client?: Anthropic
): Promise<ContentOutput> {
  const anthropic = client ?? getClient();

  const response = await withRetry(() =>
    anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate comprehensive content for this topic: "${topic}"\n\nSet generatedAt to: ${new Date().toISOString()}`,
        },
      ],
    })
  );

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in response');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    throw new Error(`Failed to parse JSON response: ${textBlock.text.slice(0, 200)}`);
  }

  const validated = ContentOutputSchema.parse(parsed);
  return validated;
}

import Anthropic from '@anthropic-ai/sdk';
import { type CsvRow, type EnrichedRow } from './types.js';

export function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set.\nCopy env.example to .env and add your key.'
    );
  }
  return new Anthropic({ apiKey: key });
}

const ENRICH_PROMPT = `Analyse this customer feedback row and return a JSON object with exactly these fields:
{
  "category": string,       // e.g. "Bug Report", "Feature Request", "Praise", "Complaint", "Question"
  "sentiment": "positive"|"neutral"|"negative",
  "summary": string,        // one sentence summary, max 100 chars
  "actionRequired": boolean, // true if needs follow-up
  "priority": "low"|"medium"|"high"
}
Return ONLY valid JSON, no markdown.`;

export async function enrichRow(row: CsvRow, client: Anthropic): Promise<EnrichedRow> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `${ENRICH_PROMPT}\n\nFeedback: "${row.feedback}"\nProduct: ${row.product}\nRating: ${row.rating}/5`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text in enrichment response');
  }

  const enrichment = JSON.parse(textBlock.text) as {
    category: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    summary: string;
    actionRequired: boolean;
    priority: 'low' | 'medium' | 'high';
  };

  return { ...row, ...enrichment };
}

export async function enrichBatch(
  rows: CsvRow[],
  client: Anthropic,
  concurrency = 3
): Promise<{ enriched: EnrichedRow[]; errors: string[] }> {
  const enriched: EnrichedRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i += concurrency) {
    const batch = rows.slice(i, i + concurrency);
    const results = await Promise.allSettled(batch.map((r) => enrichRow(r, client)));

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === 'fulfilled') {
        enriched.push(result.value);
      } else {
        const row = batch[j];
        errors.push(`Row ${row?.id ?? i + j}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`);
        // Push a fallback enriched row
        if (row) {
          enriched.push({
            ...row,
            category: 'Unknown',
            sentiment: 'neutral',
            summary: row.feedback.slice(0, 100),
            actionRequired: false,
            priority: 'low',
          });
        }
      }
    }

    // Rate limit: small delay between batches
    if (i + concurrency < rows.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { enriched, errors };
}

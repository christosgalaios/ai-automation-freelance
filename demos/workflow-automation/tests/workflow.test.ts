import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseCsvContent } from '../src/parser.js';
import { buildReport, sendSlackNotification } from '../src/reporter.js';
import type { EnrichedRow } from '../src/types.js';

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              category: 'Praise',
              sentiment: 'positive',
              summary: 'Customer is happy with the product.',
              actionRequired: false,
              priority: 'low',
            }),
          },
        ],
      }),
    },
  })),
}));

const SAMPLE_CSV = `id,customer,feedback,product,date,rating
1,Acme Corp,Great product saves time,AI Workflow Pro,2026-04-01,5
2,Beta Ltd,Confusing setup documentation is lacking,MCP Server Kit,2026-04-02,2
3,Gamma Inc,Works as expected nothing special,Content Pipeline,2026-04-03,3`;

const SAMPLE_ENRICHED: EnrichedRow[] = [
  {
    id: '1',
    customer: 'Acme Corp',
    feedback: 'Great product saves time',
    product: 'AI Workflow Pro',
    date: '2026-04-01',
    rating: 5,
    category: 'Praise',
    sentiment: 'positive',
    summary: 'Customer is happy.',
    actionRequired: false,
    priority: 'low',
  },
  {
    id: '2',
    customer: 'Beta Ltd',
    feedback: 'Confusing setup',
    product: 'MCP Server Kit',
    date: '2026-04-02',
    rating: 2,
    category: 'Complaint',
    sentiment: 'negative',
    summary: 'Setup is difficult.',
    actionRequired: true,
    priority: 'high',
  },
  {
    id: '3',
    customer: 'Gamma Inc',
    feedback: 'Works as expected',
    product: 'Content Pipeline',
    date: '2026-04-03',
    rating: 3,
    category: 'Neutral',
    sentiment: 'neutral',
    summary: 'Product meets expectations.',
    actionRequired: false,
    priority: 'medium',
  },
];

describe('parseCsvContent', () => {
  it('parses valid CSV into rows', () => {
    const { rows, errors } = parseCsvContent(SAMPLE_CSV);
    expect(rows).toHaveLength(3);
    expect(errors).toHaveLength(0);
  });

  it('extracts correct fields', () => {
    const { rows } = parseCsvContent(SAMPLE_CSV);
    expect(rows[0]).toMatchObject({
      id: '1',
      customer: 'Acme Corp',
      rating: 5,
    });
  });

  it('rejects rows with invalid rating', () => {
    const badCsv = `id,customer,feedback,product,date,rating\n1,Test,feedback,product,2026-01-01,99`;
    const { rows, errors } = parseCsvContent(badCsv);
    expect(rows).toHaveLength(0);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('handles empty CSV', () => {
    const { rows } = parseCsvContent('');
    expect(rows).toHaveLength(0);
  });

  it('handles CSV with only headers', () => {
    const { rows } = parseCsvContent('id,customer,feedback,product,date,rating');
    expect(rows).toHaveLength(0);
  });
});

describe('buildReport', () => {
  it('builds a valid report from enriched rows', () => {
    const report = buildReport('feedback.csv', SAMPLE_ENRICHED, 3, []);
    expect(report.reportId).toBeTruthy();
    expect(report.totalRows).toBe(3);
    expect(report.validRows).toBe(3);
    expect(report.rows).toHaveLength(3);
  });

  it('calculates sentiment breakdown correctly', () => {
    const report = buildReport('feedback.csv', SAMPLE_ENRICHED, 3, []);
    expect(report.sentimentBreakdown.positive).toBe(1);
    expect(report.sentimentBreakdown.negative).toBe(1);
    expect(report.sentimentBreakdown.neutral).toBe(1);
  });

  it('calculates average rating', () => {
    const report = buildReport('feedback.csv', SAMPLE_ENRICHED, 3, []);
    // (5 + 2 + 3) / 3 = 3.33
    expect(report.averageRating).toBeCloseTo(3.33, 1);
  });

  it('counts high priority items', () => {
    const report = buildReport('feedback.csv', SAMPLE_ENRICHED, 3, []);
    expect(report.highPriorityCount).toBe(1);
  });

  it('counts action required items', () => {
    const report = buildReport('feedback.csv', SAMPLE_ENRICHED, 3, []);
    expect(report.actionRequiredCount).toBe(1);
  });

  it('tracks invalid rows', () => {
    const report = buildReport('feedback.csv', SAMPLE_ENRICHED, 5, ['Row 4: invalid', 'Row 5: invalid']);
    expect(report.invalidRows).toBe(2);
    expect(report.errors).toHaveLength(2);
  });

  it('builds category summary', () => {
    const report = buildReport('feedback.csv', SAMPLE_ENRICHED, 3, []);
    expect(report.categorySummary['Praise']).toBe(1);
    expect(report.categorySummary['Complaint']).toBe(1);
  });
});

describe('sendSlackNotification', () => {
  it('logs to console without throwing', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const report = buildReport('test.csv', SAMPLE_ENRICHED, 3, []);
    expect(() => sendSlackNotification(report)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

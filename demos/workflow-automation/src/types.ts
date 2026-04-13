import { z } from 'zod';

export const CsvRowSchema = z.object({
  id: z.string(),
  customer: z.string(),
  feedback: z.string(),
  product: z.string(),
  date: z.string(),
  rating: z.coerce.number().min(1).max(5),
});

export const EnrichedRowSchema = CsvRowSchema.extend({
  category: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  summary: z.string(),
  actionRequired: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
});

export const ReportSchema = z.object({
  reportId: z.string(),
  sourceFile: z.string(),
  processedAt: z.string(),
  totalRows: z.number().int().nonnegative(),
  validRows: z.number().int().nonnegative(),
  invalidRows: z.number().int().nonnegative(),
  sentimentBreakdown: z.object({
    positive: z.number(),
    neutral: z.number(),
    negative: z.number(),
  }),
  averageRating: z.number(),
  categorySummary: z.record(z.number()),
  highPriorityCount: z.number(),
  actionRequiredCount: z.number(),
  rows: z.array(EnrichedRowSchema),
  errors: z.array(z.string()),
});

export type CsvRow = z.infer<typeof CsvRowSchema>;
export type EnrichedRow = z.infer<typeof EnrichedRowSchema>;
export type Report = z.infer<typeof ReportSchema>;

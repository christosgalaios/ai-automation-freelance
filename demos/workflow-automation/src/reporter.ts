import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
import { join, basename } from 'path';
import { type EnrichedRow, type Report, ReportSchema } from './types.js';

export function buildReport(
  sourceFile: string,
  enriched: EnrichedRow[],
  totalRows: number,
  errors: string[]
): Report {
  const sentimentBreakdown = { positive: 0, neutral: 0, negative: 0 };
  const categorySummary: Record<string, number> = {};
  let ratingSum = 0;
  let highPriorityCount = 0;
  let actionRequiredCount = 0;

  for (const row of enriched) {
    sentimentBreakdown[row.sentiment]++;
    categorySummary[row.category] = (categorySummary[row.category] ?? 0) + 1;
    ratingSum += row.rating;
    if (row.priority === 'high') highPriorityCount++;
    if (row.actionRequired) actionRequiredCount++;
  }

  const report: Report = {
    reportId: randomUUID(),
    sourceFile: basename(sourceFile),
    processedAt: new Date().toISOString(),
    totalRows,
    validRows: enriched.length,
    invalidRows: totalRows - enriched.length,
    sentimentBreakdown,
    averageRating: enriched.length > 0 ? Math.round((ratingSum / enriched.length) * 100) / 100 : 0,
    categorySummary,
    highPriorityCount,
    actionRequiredCount,
    rows: enriched,
    errors,
  };

  return ReportSchema.parse(report);
}

export function saveReport(report: Report, outputDir: string): string {
  const filename = `report-${report.reportId.slice(0, 8)}-${Date.now()}.json`;
  const outputPath = join(outputDir, filename);
  writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  return outputPath;
}

export function sendSlackNotification(report: Report): void {
  const timestamp = new Date().toISOString();
  const message = [
    `[SLACK ${timestamp}] Workflow Automation Report Ready`,
    `  File: ${report.sourceFile}`,
    `  Rows processed: ${report.validRows}/${report.totalRows}`,
    `  Sentiment: ${report.sentimentBreakdown.positive} positive / ${report.sentimentBreakdown.neutral} neutral / ${report.sentimentBreakdown.negative} negative`,
    `  Avg rating: ${report.averageRating}/5`,
    `  High priority items: ${report.highPriorityCount}`,
    `  Actions required: ${report.actionRequiredCount}`,
    report.errors.length > 0 ? `  Errors: ${report.errors.length}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  console.log(message);
}

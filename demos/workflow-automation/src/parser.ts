import { parse } from 'csv-parse';
import { readFileSync } from 'fs';
import { CsvRowSchema, type CsvRow } from './types.js';

export interface ParseResult {
  rows: CsvRow[];
  errors: string[];
}

export function parseCsvFile(filePath: string): ParseResult {
  const content = readFileSync(filePath, 'utf-8');
  return parseCsvContent(content);
}

export function parseCsvContent(content: string): ParseResult {
  const rows: CsvRow[] = [];
  const errors: string[] = [];

  // Use synchronous parsing via records array
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    return { rows, errors: ['CSV file is empty or has no data rows'] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing — handles quoted fields
    const values = parseCSVLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ?? '';
    });

    const result = CsvRowSchema.safeParse(obj);
    if (result.success) {
      rows.push(result.data);
    } else {
      errors.push(`Row ${i}: ${result.error.issues.map((e) => e.message).join(', ')}`);
    }
  }

  return { rows, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

// Keep csv-parse available for async usage if needed
export { parse };

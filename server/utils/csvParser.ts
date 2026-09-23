import { Readable } from 'stream';
import csv from 'csv-parser';

export interface ParsedCSVRow {
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  isValid: boolean;
  error?: string;
}

export const parseCSVBuffer = (buffer: Buffer): Promise<ParsedCSVRow[]> => {
  return new Promise((resolve, reject) => {
    const results: ParsedCSVRow[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on('data', (row: any) => {
        // normalize keys
        const normalized: Record<string, string> = {};
        for (const key of Object.keys(row)) {
          normalized[key.trim().toLowerCase()] = (row[key] || '').trim();
        }

        const dateStr = normalized.date || normalized['transaction date'] || new Date().toISOString().slice(0, 10);
        const rawType = (normalized.type || 'expense').toLowerCase();
        const type = rawType.includes('inc') ? 'income' : 'expense';
        const category = normalized.category || normalized['category name'] || 'Miscellaneous';
        const amount = parseFloat(normalized.amount || normalized.cost || normalized.value || '0');
        const description = normalized.description || normalized.details || normalized.note || 'Imported Transaction';

        let isValid = true;
        let error = '';

        if (isNaN(amount) || amount <= 0) {
          isValid = false;
          error = 'Invalid amount';
        } else if (isNaN(new Date(dateStr).getTime())) {
          isValid = false;
          error = 'Invalid date format';
        }

        results.push({
          date: dateStr,
          type,
          category,
          amount: Math.abs(amount),
          description,
          isValid,
          error,
        });
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

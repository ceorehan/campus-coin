import { GoogleGenAI } from '@google/genai';
import { ENV } from '../config/env.js';

let aiClient: GoogleGenAI | null = null;

if (ENV.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: ENV.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err: any) {
    console.warn('Failed to initialize GoogleGenAI client:', err.message);
  }
}

// Fallback heuristic categorizer when AI is disabled or fails
const heuristicCategorize = (description: string, type: 'income' | 'expense' = 'expense') => {
  const d = description.toLowerCase();

  if (type === 'income') {
    if (d.includes('allowance') || d.includes('pocket money') || d.includes('parents')) {
      return { category: 'Allowance', confidence: 0.95 };
    }
    if (d.includes('job') || d.includes('salary') || d.includes('tutor') || d.includes('freelance') || d.includes('work')) {
      return { category: 'Part-time Job', confidence: 0.92 };
    }
    if (d.includes('scholarship') || d.includes('grant') || d.includes('bursary')) {
      return { category: 'Scholarship', confidence: 0.98 };
    }
    if (d.includes('gift') || d.includes('birthday') || d.includes('bonus')) {
      return { category: 'Gift', confidence: 0.9 };
    }
    return { category: 'Other Income', confidence: 0.75 };
  }

  // Expense heuristics
  if (d.includes('cafe') || d.includes('lunch') || d.includes('dinner') || d.includes('breakfast') ||
      d.includes('food') || d.includes('burger') || d.includes('coffee') || d.includes('canteen') ||
      d.includes('pizza') || d.includes('groceries') || d.includes('starbucks') || d.includes('dining')) {
    return { category: 'Food', confidence: 0.94 };
  }
  if (d.includes('uber') || d.includes('bus') || d.includes('train') || d.includes('metro') ||
      d.includes('transit') || d.includes('taxi') || d.includes('gas') || d.includes('fuel') ||
      d.includes('commute') || d.includes('bike')) {
    return { category: 'Transport', confidence: 0.93 };
  }
  if (d.includes('hostel') || d.includes('rent') || d.includes('dorm') || d.includes('room') ||
      d.includes('utilities') || d.includes('electricity') || d.includes('water bill')) {
    return { category: 'Hostel/Rent', confidence: 0.96 };
  }
  if (d.includes('book') || d.includes('tuition') || d.includes('course') || d.includes('exam') ||
      d.includes('stationary') || d.includes('stationery') || d.includes('print') || d.includes('pen') ||
      d.includes('lab') || d.includes('library')) {
    return { category: 'Academics', confidence: 0.91 };
  }
  if (d.includes('netflix') || d.includes('spotify') || d.includes('youtube') || d.includes('prime') ||
      d.includes('hulu') || d.includes('apple') || d.includes('subscription') || d.includes('cloud') ||
      d.includes('patreon') || d.includes('gym')) {
    return { category: 'Subscriptions', confidence: 0.95 };
  }
  if (d.includes('movie') || d.includes('cinema') || d.includes('game') || d.includes('concert') ||
      d.includes('party') || d.includes('club') || d.includes('steam') || d.includes('bowling')) {
    return { category: 'Entertainment', confidence: 0.89 };
  }

  return { category: 'Miscellaneous', confidence: 0.65 };
};

export const suggestCategory = async (
  description: string,
  categories: string[],
  type: 'income' | 'expense' = 'expense'
): Promise<{ category: string; confidence: number; source: 'gemini' | 'heuristic' }> => {
  if (!description || description.trim() === '') {
    return { category: categories[0] || 'Miscellaneous', confidence: 0.5, source: 'heuristic' };
  }

  if (aiClient) {
    try {
      const prompt = `Given the student transaction description "${description}" and type "${type}", classify it into exactly one of these available categories: ${categories.join(
        ', '
      )}.
Respond ONLY in valid JSON format with keys "category" (string matching one of the options) and "confidence" (number between 0.1 and 1.0).`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);

      if (parsed.category && categories.includes(parsed.category)) {
        return {
          category: parsed.category,
          confidence: parsed.confidence || 0.9,
          source: 'gemini',
        };
      }
    } catch (err: any) {
      console.warn('Gemini categorization failed or timed out, falling back to heuristic:', err.message);
    }
  }

  const fallback = heuristicCategorize(description, type);
  // Match with available categories
  const matched = categories.find((c) => c.toLowerCase() === fallback.category.toLowerCase()) || categories[0] || 'Miscellaneous';

  return {
    category: matched,
    confidence: fallback.confidence,
    source: 'heuristic',
  };
};

export const generateMonthlyInsight = async (data: {
  month: string;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
  previousMonthExpense?: number;
  topCategory?: string;
}): Promise<{ summaryText: string; tipText: string; source: 'gemini' | 'heuristic' }> => {
  const { month, totalIncome, totalExpense, savings, categoryBreakdown, previousMonthExpense, topCategory } = data;

  const pctChange = previousMonthExpense && previousMonthExpense > 0
    ? Math.round(((totalExpense - previousMonthExpense) / previousMonthExpense) * 100)
    : 0;

  if (aiClient) {
    try {
      const prompt = `You are a friendly, encouraging college student financial advisor for the app 'Campus Coin'.
Analyze this student's spending for month ${month}:
- Total Income: $${totalIncome}
- Total Expense: $${totalExpense}
- Net Savings: $${savings}
- Top Spending Category: ${topCategory || 'Food'}
- Spending Change vs Previous Month: ${pctChange}%
- Category Breakdown: ${JSON.stringify(categoryBreakdown)}

Write:
1) A 2-sentence narrative spending summary explaining where their money went and how they did.
2) A practical, actionable student saving tip for next month.
Respond in valid JSON with keys: "summaryText" and "tipText".`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);
      if (parsed.summaryText && parsed.tipText) {
        return {
          summaryText: parsed.summaryText,
          tipText: parsed.tipText,
          source: 'gemini',
        };
      }
    } catch (err: any) {
      console.warn('Gemini monthly insight generation failed, using heuristic:', err.message);
    }
  }

  // Smart heuristic insight
  let summary = `In ${month}, your total spending was $${totalExpense.toLocaleString()} against an income of $${totalIncome.toLocaleString()}, leaving you with $${savings.toLocaleString()} in savings.`;
  if (pctChange > 0) {
    summary += ` Your spending increased by ${pctChange}% compared to last month, driven primarily by ${topCategory || 'daily costs'}.`;
  } else if (pctChange < 0) {
    summary += ` Great job! You reduced your spending by ${Math.abs(pctChange)}% compared to last month.`;
  } else {
    summary += ` Your spending remained stable, with ${topCategory || 'essentials'} making up the largest share.`;
  }

  let tip = `Try meal-prepping 2 days a week to cut down on ${topCategory || 'Food'} expenses, and review unused subscriptions to boost next month's savings.`;
  if (savings < 0) {
    tip = `You spent more than your income this month. Set hard weekly limits on non-essential categories like Entertainment and Snacks until your balance recovers.`;
  } else if (savings > (totalIncome * 0.25)) {
    tip = `Outstanding! You achieved over a 25% savings rate. Consider moving a portion into an emergency fund or higher-yield student savings account.`;
  }

  return {
    summaryText: summary,
    tipText: tip,
    source: 'heuristic',
  };
};

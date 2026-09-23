import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

interface TrendData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface SpendingTrendProps {
  data: TrendData[];
  currency?: string;
}

export const SpendingTrend: React.FC<SpendingTrendProps> = ({ data, currency = 'USD' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs text-slate-400">Not enough monthly data to render trend</p>
      </div>
    );
  }

  // Format month to short name (e.g. "2026-03" -> "Mar")
  const formattedData = data.map((d) => {
    const parts = d.month.split('-');
    const monthNum = parseInt(parts[1], 10) - 1;
    const date = new Date(2026, monthNum, 1);
    const label = date.toLocaleDateString(undefined, { month: 'short' });
    return {
      ...d,
      monthLabel: label,
    };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `${Number(v) / 1000}k`}
          />
          <Tooltip
            formatter={(value: any, name: any) => [
              formatCurrency(Number(value), currency),
              name === 'income' ? 'Income' : 'Expenses',
            ]}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#incomeGradient)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#expenseGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

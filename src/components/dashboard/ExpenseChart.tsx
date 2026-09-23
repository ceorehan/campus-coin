import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

interface CategoryChartItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface ExpenseChartProps {
  data: CategoryChartItem[];
  currency?: string;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, currency = 'USD' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs text-slate-400">No expense records found for this period</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value), currency), 'Spent']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-2 mt-4 max-h-36 overflow-y-auto pr-1">
        {data.slice(0, 6).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{item.name}</span>
            </div>
            <span className="text-slate-900 dark:text-slate-100 font-bold ml-2">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

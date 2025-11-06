import React from 'react';
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface KpiSeriesPoint {
  date: Date;
  actual: number;
  target?: number | null; // Made optional to match the main interface
}

interface RevenueBulletProps {
  data: KpiSeriesPoint[];
  currentValue: number;
  variance: string;
  isHovered?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.date);
    const formattedDate = date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const variance = ((data.actual - data.target) / data.target * 100).toFixed(0);
    const varianceNum = parseFloat(variance);
    const varianceSign = varianceNum >= 0 ? '+' : '';
    
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{formattedDate}</p>
        <p className="text-muted-foreground">
          R{(data.actual / 1000).toFixed(0)}k (Target R{(data.target || 0 / 1000).toFixed(0)}k, {varianceSign}{variance}%)
        </p>
      </div>
    );
  }
  return null;
};

const RevenueBullet: React.FC<RevenueBulletProps> = ({ 
  data, 
  currentValue, 
  variance,
  isHovered = false 
}) => {
  const chartData = data.map(point => ({
    ...point,
    date: point.date.toISOString(),
    day: point.date.toLocaleDateString('en-US', { weekday: 'short' })
  }));

  const maxValue = Math.max(...data.map(d => Math.max(d.actual, d.target || 0)));
  const targetValue = data[data.length - 1]?.target || 0;

  return (
    <div 
      className={`transition-opacity duration-200 ${isHovered ? 'opacity-80' : 'opacity-100'}`}
      aria-label="Revenue bullet graph week-to-date"
    >
      <div className="h-20 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide domain={[0, maxValue * 1.1]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={targetValue} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <Bar 
              dataKey="actual" 
              fill="hsl(var(--primary))" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xl font-semibold text-foreground mb-1">
        R {(currentValue / 1000000).toFixed(1)}M
      </div>
      
      <div className={`text-xs flex items-center gap-1 ${
        variance.includes('+') ? 'text-green-600' : 'text-red-600'
      }`}>
        <span>{variance.includes('+') ? '⬆︎' : '⬇︎'}</span>
        <span>{variance}</span>
      </div>
    </div>
  );
};

export default RevenueBullet;
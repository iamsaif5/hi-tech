import React from 'react';
import { LineChart, Line, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart } from 'recharts';

interface KpiSeriesPoint {
  date: Date;
  actual: number;
  target?: number | null;
}

interface CashSparkLineProps {
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
    
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{formattedDate}</p>
        <p className="text-muted-foreground">
          Cash: R{(data.actual / 1000).toFixed(0)}k
        </p>
      </div>
    );
  }
  return null;
};

const CashSparkLine: React.FC<CashSparkLineProps> = ({ 
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

  return (
    <div 
      className={`transition-opacity duration-200 ${isHovered ? 'opacity-80' : 'opacity-100'}`}
      aria-label="Cash balance sparkline 7-day rolling"
    >
      <div className="h-20 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xl font-semibold text-foreground mb-1">
        R {(currentValue / 1000).toFixed(0)}K
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

export default CashSparkLine;
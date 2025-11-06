import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceArea } from 'recharts';

interface KpiSeriesPoint {
  date: Date;
  actual: number;
  target?: number | null; // Made optional to match the main interface
}

interface WasteBandLineProps {
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
    const status = data.actual <= data.target ? 'Within tolerance' : 'Above tolerance';
    
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{formattedDate}</p>
        <p className="text-muted-foreground">
          Waste: {data.actual.toFixed(1)}% (Target ≤{data.target || 3}%)
        </p>
        <p className={`text-xs ${(data.actual || 0) <= (data.target || 3) ? 'text-green-600' : 'text-red-600'}`}>
          {(data.actual || 0) <= (data.target || 3) ? 'Within tolerance' : 'Above tolerance'}
        </p>
      </div>
    );
  }
  return null;
};

const WasteBandLine: React.FC<WasteBandLineProps> = ({ 
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

  const maxWaste = Math.max(...data.map(d => d.actual));
  const tolerance = data[0]?.target || 3; // Default tolerance of 3%
  const yAxisMax = Math.max(maxWaste * 1.2, tolerance * 1.5);

  return (
    <div 
      className={`transition-opacity duration-200 ${isHovered ? 'opacity-80' : 'opacity-100'}`}
      aria-label="Waste percentage line chart with tolerance band"
    >
      <div className="h-20 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide domain={[0, yAxisMax]} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Tolerance band */}
            <ReferenceArea
              y1={0}
              y2={tolerance}
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
            />
            
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: 'hsl(var(--chart-3))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xl font-semibold text-foreground mb-1">
        {currentValue.toFixed(1)}%
      </div>
      
      <div className={`text-xs flex items-center gap-1 ${
        variance.includes('+') || variance.includes('▲') ? 'text-red-600' : 'text-green-600'
      }`}>
        <span>{variance.includes('+') || variance.includes('▲') ? '⬆︎' : '⬇︎'}</span>
        <span>{variance}</span>
      </div>
    </div>
  );
};

export default WasteBandLine;
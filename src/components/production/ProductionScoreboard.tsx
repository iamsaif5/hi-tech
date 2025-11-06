import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, Target } from 'lucide-react';

interface ScoreboardKPI {
  title: string;
  value: string;
  unit?: string;
  target?: string;
  percentDiff: number;
  isUp: boolean;
  icon: React.ComponentType<{ className?: string }>;
  status: 'success' | 'warning' | 'error' | 'neutral';
}

const ProductionScoreboard = () => {
  const kpis: ScoreboardKPI[] = [
    {
      title: 'Output vs Plan',
      value: '1,247',
      unit: 'm',
      target: '1,350 m',
      percentDiff: -7.6,
      isUp: false,
      icon: Target,
      status: 'warning'
    },
    {
      title: 'OEE Lite',
      value: '84.2',
      unit: '%',
      percentDiff: 2.1,
      isUp: true,
      icon: TrendingUp,
      status: 'success'
    },
    {
      title: 'Scrap/Waste',
      value: '3.4',
      unit: '%',
      target: '3.0%',
      percentDiff: 13.3,
      isUp: true,
      icon: AlertTriangle,
      status: 'error'
    },
    {
      title: 'Downtime',
      value: '12.8',
      unit: '%',
      percentDiff: -4.2,
      isUp: false,
      icon: Clock,
      status: 'success'
    },
    {
      title: 'Jobs Late',
      value: '3',
      unit: 'MOs',
      percentDiff: 0,
      isUp: false,
      icon: AlertTriangle,
      status: 'warning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-destructive/10';
      default: return 'bg-muted/50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <div key={index} className="data-card">
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className={`h-4 w-4 ${getStatusColor(kpi.status)}`} />
              <span className="text-xs font-medium text-muted-foreground">{kpi.title}</span>
            </div>
            
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-lg font-semibold">{kpi.value}</span>
              {kpi.unit && <span className="text-xs text-muted-foreground">{kpi.unit}</span>}
            </div>
            
            <div className="flex items-center justify-between">
              {kpi.target && (
                <span className="text-xs text-muted-foreground">Target: {kpi.target}</span>
              )}
              {kpi.percentDiff !== 0 && (
                <div className={`flex items-center text-xs ${kpi.isUp ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.isUp ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(kpi.percentDiff)}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductionScoreboard;
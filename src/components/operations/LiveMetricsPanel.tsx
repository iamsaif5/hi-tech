import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Target, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  Activity,
  Bell
} from 'lucide-react';

const LiveMetricsPanel = () => {
  const metrics = [
    {
      title: 'Jobs in Progress',
      value: '12',
      change: '+3 from yesterday',
      status: 'good',
      icon: Package
    },
    {
      title: 'Loomage This Week',
      value: '45,280m',
      change: '92% of target',
      status: 'good',
      icon: Target
    },
    {
      title: 'Orders Due Today',
      value: '8',
      change: '2 at risk',
      status: 'warning',
      icon: Clock
    },
    {
      title: 'Estimated Delays',
      value: '3',
      change: 'Down from 5',
      status: 'warning',
      icon: AlertTriangle
    },
    {
      title: '7-Day Utilisation',
      value: '87.5%',
      change: '+2.3% vs last week',
      status: 'good',
      icon: TrendingUp
    },
    {
      title: 'Completed Jobs',
      value: '156',
      change: 'This week',
      status: 'good',
      icon: CheckCircle
    },
    {
      title: 'Jobs At Risk',
      value: '5',
      change: 'QC/Machine issues',
      status: 'critical',
      icon: Activity
    },
    {
      title: 'Machine Alerts',
      value: '2',
      change: 'Requires attention',
      status: 'warning',
      icon: Bell
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Status Indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Live Factory Status</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">
            Updated {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="data-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.title}
                </span>
              </div>
              {metric.status === 'critical' && (
                <Badge className="bg-red-100 text-red-800 text-xs">
                  Alert
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">{metric.value}</p>
              <p className={`text-xs ${getStatusColor(metric.status)}`}>
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Summary Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Daily AI Summary</h3>
            <p className="text-sm text-blue-800">
              3 jobs below target, 2 delayed due to material shortage. 
              <span className="font-medium"> Suggestion:</span> Reallocate Operator Team B to Cutter A2 for optimal throughput.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMetricsPanel;
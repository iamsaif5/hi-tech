import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  Phone, 
  RefreshCw,
  Factory,
  Zap,
  BarChart3,
  Clock
} from 'lucide-react';

interface ProductionMetricsHeaderProps {
  onEmergencyStop: () => void;
  onCallSupervisor: () => void;
  onRefreshData: () => void;
}

const ProductionMetricsHeader = ({ 
  onEmergencyStop, 
  onCallSupervisor, 
  onRefreshData 
}: ProductionMetricsHeaderProps) => {
  const currentTime = new Date().toLocaleTimeString();
  const currentShift = "Day Shift (06:00-18:00)";

  const metrics = [
    {
      title: "Total Machines",
      value: "28 Active",
      subtitle: "35 Total",
      icon: Factory,
      status: "active"
    },
    {
      title: "Overall Efficiency", 
      value: "87.5%",
      subtitle: "Target: 85%",
      icon: Zap,
      status: "success"
    },
    {
      title: "Today's Output",
      value: "45,280m",
      subtitle: "92% of target: 49,000m", 
      icon: BarChart3,
      status: "active"
    },
    {
      title: "Average Cycle Time",
      value: "12.3 min",
      subtitle: "Target: 12.0 min",
      icon: Clock,
      status: "warning"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header Status Bar */}
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <Badge variant="outline" className="text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              Factory Online
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Last Updated: {currentTime}
          </div>
          
          <div className="text-sm">
            {currentShift}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onEmergencyStop}
            className="text-xs"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Emergency Stop
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCallSupervisor}
            className="text-xs"
          >
            <Phone className="h-4 w-4 mr-1" />
            Call Supervisor
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefreshData}
            className="text-xs"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{metric.title}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                </div>
                <div className={`p-2 rounded-full ${
                  metric.status === 'success' ? 'bg-green-100' :
                  metric.status === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  <metric.icon className={`h-5 w-5 ${
                    metric.status === 'success' ? 'text-green-600' :
                    metric.status === 'warning' ? 'text-orange-600' : 'text-blue-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductionMetricsHeader;
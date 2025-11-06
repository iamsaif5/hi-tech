import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface StageData {
  name: string;
  utilisation: number;
  efficiency: number;
  waste: number;
  status: 'good' | 'warning' | 'error';
  runningMachines: number;
  totalMachines: number;
}

interface StageSnapshotProps {
  onViewMachines: (stageName: string) => void;
}

const StageSnapshot: React.FC<StageSnapshotProps> = ({ onViewMachines }) => {
  const stages: StageData[] = [
    {
      name: 'Loomage',
      utilisation: 87,
      efficiency: 94,
      waste: 2.1,
      status: 'good',
      runningMachines: 7,
      totalMachines: 8
    },
    {
      name: 'Tubing',
      utilisation: 75,
      efficiency: 88,
      waste: 3.2,
      status: 'warning',
      runningMachines: 3,
      totalMachines: 4
    },
    {
      name: 'Cutting',
      utilisation: 60,
      efficiency: 72,
      waste: 4.8,
      status: 'error',
      runningMachines: 3,
      totalMachines: 5
    },
    {
      name: 'Printing',
      utilisation: 92,
      efficiency: 91,
      waste: 2.8,
      status: 'good',
      runningMachines: 11,
      totalMachines: 12
    },
    {
      name: 'Bagging',
      utilisation: 83,
      efficiency: 89,
      waste: 1.9,
      status: 'good',
      runningMachines: 5,
      totalMachines: 6
    },
    {
      name: 'QC',
      utilisation: 78,
      efficiency: 85,
      waste: 3.5,
      status: 'warning',
      runningMachines: 7,
      totalMachines: 9
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'good': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-destructive/10';
      default: return 'bg-muted/50';
    }
  };

  return (
    <div className="space-y-4 mb-4">
      <h3 className="text-sm font-medium">Stage Snapshot</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map((stage) => {
          const IconComponent = getStatusIcon(stage.status);
          return (
            <Card key={stage.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-3 w-3 ${getStatusColor(stage.status)}`} />
                    <h4 className="text-xs font-medium">{stage.name}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewMachines(stage.name)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Utilisation</span>
                    <span className="text-xs font-medium">{stage.utilisation}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Avg Efficiency</span>
                    <span className="text-xs font-medium">{stage.efficiency}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Waste</span>
                    <span className="text-xs font-medium">{stage.waste}%</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t">
                    <span className="text-xs text-muted-foreground">Machines</span>
                    <span className="text-xs font-medium">
                      {stage.runningMachines}/{stage.totalMachines} running
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StageSnapshot;
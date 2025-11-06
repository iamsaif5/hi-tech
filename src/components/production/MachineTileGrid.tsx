import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  AlertTriangle, 
  User, 
  Clock,
  Settings,
  Activity,
  CheckCircle,
  Pause,
  AlertCircle,
  XCircle,
  Minus
} from 'lucide-react';

interface MachineData {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'setup' | 'error' | 'offline';
  currentJob?: {
    orderId: string;
    product: string;
    progress: number;
    totalTarget: number;
    unit: string;
  };
  efficiency: number;
  operator?: {
    name: string;
    id: string;
  };
  timing: {
    started?: string;
    estimated?: string;
    downtime?: number;
  };
  lastUpdate: string;
}

interface MachineTileGridProps {
  machines?: MachineData[];
  onViewMachine?: (machineId: string) => void;
  onReportIssue?: (machineId: string) => void;
  onAssignOperator?: (machineId: string) => void;
}

const MachineTileGrid: React.FC<MachineTileGridProps> = ({
  machines = [],
  onViewMachine = () => {},
  onReportIssue = () => {},
  onAssignOperator = () => {}
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'efficiency' | 'status'>('name');

  // Mock data if none provided
  const defaultMachines: MachineData[] = [
    {
      id: 'ext-a',
      name: 'Extruder Line A',
      status: 'active',
      currentJob: {
        orderId: 'ORD-0012',
        product: 'IWISA 25kg Printed',
        progress: 2450,
        totalTarget: 5000,
        unit: 'm'
      },
      efficiency: 94,
      operator: { name: 'John Smith', id: '1234' },
      timing: { started: '06:30', estimated: '14:15' },
      lastUpdate: '07:45'
    },
    {
      id: 'cut-b',
      name: 'Cutter Station B',
      status: 'setup',
      currentJob: {
        orderId: 'ORD-0013',
        product: 'Custom 5kg No Print',
        progress: 1200,
        totalTarget: 3500,
        unit: 'm'
      },
      efficiency: 84,
      operator: { name: 'Sarah Wilson', id: '5678' },
      timing: { started: '07:00', estimated: '16:00' },
      lastUpdate: '08:15'
    },
    {
      id: 'print-c',
      name: 'Printer Line C',
      status: 'error',
      efficiency: 0,
      timing: { downtime: 45 },
      lastUpdate: '07:30'
    },
    {
      id: 'bag-a',
      name: 'Bagging Line A',
      status: 'active',
      currentJob: {
        orderId: 'ORD-0011',
        product: 'MegaBag Industrial',
        progress: 4500,
        totalTarget: 5000,
        unit: 'm'
      },
      efficiency: 96,
      operator: { name: 'Peter Wilson', id: '9012' },
      timing: { started: '08:00', estimated: '12:45' },
      lastUpdate: '08:10'
    },
    {
      id: 'bag-b',
      name: 'Bagging Line B',
      status: 'idle',
      efficiency: 0,
      timing: {},
      lastUpdate: '08:00'
    },
    {
      id: 'qc-1',
      name: 'QC Station 1',
      status: 'active',
      currentJob: {
        orderId: 'ORD-0010',
        product: 'Lion Group Bags',
        progress: 180,
        totalTarget: 200,
        unit: 'samples'
      },
      efficiency: 88,
      operator: { name: 'Tina Adams', id: '3456' },
      timing: { started: '07:30', estimated: '10:30' },
      lastUpdate: '08:20'
    }
  ];

  const machineData = machines.length > 0 ? machines : defaultMachines;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-hitec-success bg-hitec-success/5';
      case 'idle': return 'border-primary bg-primary/5';
      case 'setup': return 'border-hitec-highlight bg-hitec-highlight/5';
      case 'error': return 'border-destructive bg-destructive/5';
      case 'offline': return 'border-muted-foreground bg-muted/20';
      default: return 'border-border bg-card';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-hitec-success" />;
      case 'idle': return <Pause className="h-4 w-4 text-primary" />;
      case 'setup': return <Settings className="h-4 w-4 text-hitec-highlight" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'offline': return <Minus className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600';
    if (efficiency >= 80) return 'text-orange-500';
    return 'text-red-600';
  };

  const sortedMachines = [...machineData].sort((a, b) => {
    switch (sortBy) {
      case 'efficiency':
        return b.efficiency - a.efficiency;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="space-y-4">
      {/* Header with Sort Options */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Machine Status Grid</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-border rounded px-2 py-1 bg-card h-8"
          >
            <option value="name">Name</option>
            <option value="efficiency">Utilisation</option>
            <option value="status">State</option>
          </select>
        </div>
      </div>

      {/* Machine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedMachines.map((machine) => (
          <Card key={machine.id} className={`${getStatusColor(machine.status)} border-2 transition-all hover:shadow-md`}>
            <CardContent className="p-4">
              {/* Machine Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(machine.status)}
                  <h3 className="font-medium text-sm">{machine.name}</h3>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {machine.status}
                </Badge>
              </div>

              {/* Current Job */}
              {machine.currentJob ? (
                <div className="space-y-2 mb-3">
                  <div className="text-xs text-muted-foreground">Current Job</div>
                  <div>
                    <div className="font-medium text-sm mb-1">{machine.currentJob.orderId}</div>
                    <div className="text-xs text-muted-foreground mb-2">{machine.currentJob.product}</div>
                    
                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{machine.currentJob.progress.toLocaleString()}{machine.currentJob.unit}</span>
                        <span>{Math.round((machine.currentJob.progress / machine.currentJob.totalTarget) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(machine.currentJob.progress / machine.currentJob.totalTarget) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        Target: {machine.currentJob.totalTarget.toLocaleString()}{machine.currentJob.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground mb-3 py-4 text-center">
                  {machine.status === 'error' ? 'Machine Error' : 
                   machine.status === 'offline' ? 'Offline' : 'No Active Job'}
                </div>
              )}

              {/* Efficiency */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-muted-foreground">Efficiency</span>
                <span className={`font-medium ${getEfficiencyColor(machine.efficiency)}`}>
                  {machine.efficiency}%
                </span>
              </div>

              {/* Operator */}
              {machine.operator ? (
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span>{machine.operator.name}</span>
                  <span className="text-muted-foreground">({machine.operator.id})</span>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground mb-3">No operator assigned</div>
              )}

              {/* Timing */}
              {machine.timing && (
                <div className="space-y-1 mb-3 text-xs">
                  {machine.timing.started && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started</span>
                      <span>{machine.timing.started}</span>
                    </div>
                  )}
                  {machine.timing.estimated && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ETA</span>
                      <span>{machine.timing.estimated}</span>
                    </div>
                  )}
                  {machine.timing.downtime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downtime</span>
                      <span className="text-destructive">{machine.timing.downtime} min</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mini Sparkline Placeholder */}
              <div 
                className="h-8 bg-muted/30 rounded mb-3 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => console.log(`Open telemetry modal for ${machine.id}`)}
                title="View machine telemetry"
              >
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewMachine(machine.id)}
                  className="flex-1 h-8 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                
                {machine.status === 'error' || machine.efficiency < 85 ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReportIssue(machine.id)}
                    className="flex-1 h-8 text-xs"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Issue
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAssignOperator(machine.id)}
                    className="flex-1 h-8 text-xs"
                  >
                    <User className="h-3 w-3 mr-1" />
                    Operator
                  </Button>
                )}
              </div>

              {/* Last Update */}
              <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {machine.lastUpdate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MachineTileGrid;
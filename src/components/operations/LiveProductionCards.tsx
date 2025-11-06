import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User,
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface LiveProductionCardsProps {
  selectedFactory: string;
  selectedShift: string;
}

const LiveProductionCards = ({ selectedFactory, selectedShift }: LiveProductionCardsProps) => {
  const machines = [
    {
      id: 'EXT-01',
      name: 'Extruder Line A',
      location: 'Johannesburg',
      shift: 'Day',
      orderNo: 'ORD-0012',
      jobId: 'JOB-A-001',
      product: 'IWISA 25kg Printed',
      operator: 'John Mthembu',
      stage: 'Extrusion',
      status: 'Active',
      outputRate: '850 m/hr',
      totalMeters: '6,800m',
      targetMeters: '8,000m',
      loomageProgress: 85,
      lastUpdated: '2 min ago',
      tags: ['High Priority', 'On Target'],
      alerts: []
    },
    {
      id: 'CUT-02',
      name: 'Cutter Station B',
      location: 'Johannesburg', 
      shift: 'Day',
      orderNo: 'ORD-0013',
      jobId: 'JOB-B-002',
      product: 'Lion 10kg White',
      operator: 'Sarah Nkomo',
      stage: 'Cutting',
      status: 'At Risk',
      outputRate: '420 m/hr',
      totalMeters: '2,100m',
      targetMeters: '4,500m',
      loomageProgress: 47,
      lastUpdated: '1 min ago',
      tags: ['Behind Schedule'],
      alerts: ['Low Output Rate']
    },
    {
      id: 'PRT-03',
      name: 'Printer Unit C',
      location: 'Cape Town',
      shift: 'Day',
      orderNo: 'ORD-0014',
      jobId: 'JOB-C-003',
      product: 'Custom 5kg No Print',
      operator: 'David Molefe',
      stage: 'Printing',
      status: 'Idle',
      outputRate: '0 m/hr',
      totalMeters: '0m',
      targetMeters: '3,200m',
      loomageProgress: 0,
      lastUpdated: '15 min ago',
      tags: ['Maintenance'],
      alerts: ['Machine Offline']
    },
    {
      id: 'LAM-04',
      name: 'Lamination Line D',
      location: 'Durban',
      shift: 'Night',
      orderNo: 'ORD-0015',
      jobId: 'JOB-D-004',
      product: 'IWISA 25kg Printed',
      operator: 'Mike Zulu',
      stage: 'Lamination',
      status: 'Active',
      outputRate: '720 m/hr',
      totalMeters: '5,760m',
      targetMeters: '6,000m',
      loomageProgress: 96,
      lastUpdated: '30 sec ago',
      tags: ['Exceeding Target', 'Quality Passed'],
      alerts: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'At Risk': return 'bg-orange-100 text-orange-800';
      case 'Idle': return 'bg-gray-100 text-gray-800';
      case 'Offline': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <Activity className="h-4 w-4 text-green-600" />;
      case 'At Risk': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Idle': return <Pause className="h-4 w-4 text-gray-600" />;
      case 'Offline': return <Settings className="h-4 w-4 text-red-600" />;
      default: return <Play className="h-4 w-4 text-blue-600" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const filteredMachines = machines.filter(machine => {
    const factoryMatch = selectedFactory === 'all' || machine.location.toLowerCase().includes(selectedFactory.toLowerCase());
    const shiftMatch = selectedShift === 'all' || machine.shift.toLowerCase().includes(selectedShift.toLowerCase());
    return factoryMatch && shiftMatch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {filteredMachines.map((machine) => (
        <Card key={machine.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(machine.status)}
                <div>
                  <CardTitle className="text-sm font-semibold">{machine.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {machine.location} • {machine.shift} Shift
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(machine.status)}>
                {machine.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order No</p>
                <p className="font-medium">{machine.orderNo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Job ID</p>
                <p className="font-medium">{machine.jobId}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Product</p>
                <p className="font-medium">{machine.product}</p>
              </div>
            </div>

            {/* Operator & Stage */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{machine.operator}</span>
              </div>
              <Badge variant="outline">{machine.stage}</Badge>
            </div>

            {/* Output Metrics */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Output Rate</span>
                <span className="font-medium">{machine.outputRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Meters</span>
                <span className="font-medium">{machine.totalMeters}</span>
              </div>
            </div>

            {/* Loomage Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loomage vs Target</span>
                <span className="font-medium">{machine.loomageProgress}%</span>
              </div>
              <div className="relative">
                <Progress value={machine.loomageProgress} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(machine.loomageProgress)}`}
                  style={{ width: `${machine.loomageProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Target: {machine.targetMeters}
              </p>
            </div>

            {/* Alerts */}
            {machine.alerts.length > 0 && (
              <div className="space-y-1">
                {machine.alerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {machine.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Updated {machine.lastUpdated}</span>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveProductionCards;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertTriangle, Clock } from 'lucide-react';

interface MachineUptimeCardsProps {
  selectedFactory: string;
}

const MachineUptimeCards = ({ selectedFactory }: MachineUptimeCardsProps) => {
  const machineData = [
    {
      machine: 'Loom A1',
      factory: 'Midrand',
      status: 'Running',
      uptime: 98.5,
      hoursRun: 23.6,
      totalHours: 24,
      startMeter: 1200,
      endMeter: 2700,
      output: 1500,
      lastMaintenance: '2 days ago',
      nextMaintenance: 'In 5 days',
      lastUpdated: '2025-06-29 14:30'
    },
    {
      machine: 'Cutter A1',
      factory: 'Midrand',
      status: 'Running',
      uptime: 95.2,
      hoursRun: 22.8,
      totalHours: 24,
      startMeter: 800,
      endMeter: 2300,
      output: 1500,
      lastMaintenance: '1 week ago',
      nextMaintenance: 'In 2 days',
      lastUpdated: '2025-06-29 14:15'
    },
    {
      machine: 'Printer D1',
      factory: 'Boksburg',
      status: 'Maintenance',
      uptime: 85.3,
      hoursRun: 20.5,
      totalHours: 24,
      startMeter: 500,
      endMeter: 1350,
      output: 850,
      lastMaintenance: 'Now',
      nextMaintenance: 'Completed',
      lastUpdated: '2025-06-29 13:45'
    },
    {
      machine: 'Bagger 1',
      factory: 'Germiston',
      status: 'Running',
      uptime: 99.1,
      hoursRun: 23.8,
      totalHours: 24,
      startMeter: 1000,
      endMeter: 2800,
      output: 1800,
      lastMaintenance: '3 days ago',
      nextMaintenance: 'In 4 days',
      lastUpdated: '2025-06-29 14:25'
    }
  ];

  const filteredMachines = machineData.filter(machine => {
    return selectedFactory === 'all' || machine.factory.toLowerCase() === selectedFactory.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Running': 'bg-green-600 text-white',
      'Maintenance': 'bg-orange-600 text-white',
      'Stopped': 'bg-red-600 text-white',
      'Idle': 'bg-gray-600 text-white'
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-600 text-white'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Machine Uptime ({filteredMachines.length})</h3>
        <p className="text-sm text-gray-600">Current shift utilisation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((machine, index) => (
          <Card key={index} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  {machine.machine}
                </CardTitle>
                {getStatusBadge(machine.status)}
              </div>
              <p className="text-sm text-gray-600">{machine.factory}</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Utilisation:</span>
                  <span className="font-semibold">{machine.uptime}%</span>
                </div>
                <Progress 
                  value={machine.uptime} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500 text-center">
                  {machine.hoursRun}h / {machine.totalHours}h available
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-gray-600">Start Meter:</span>
                  <p className="font-medium">{machine.startMeter}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">End Meter:</span>
                  <p className="font-medium">{machine.endMeter}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-600">Output:</span>
                  <p className="font-semibold text-blue-600">{machine.output} units</p>
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Last maintenance: {machine.lastMaintenance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Next: {machine.nextMaintenance}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  Last Updated: {new Date(machine.lastUpdated).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No machines found for the selected factory.
        </div>
      )}
    </div>
  );
};

export default MachineUptimeCards;

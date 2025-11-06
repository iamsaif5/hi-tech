
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Factory, User, Clock, AlertTriangle } from 'lucide-react';

interface ProductionSchedulerProps {
  selectedFactory: string;
  selectedFilter: string;
}

const ProductionScheduler = ({ selectedFactory, selectedFilter }: ProductionSchedulerProps) => {
  const machines = [
    {
      name: 'Cutter A1',
      status: 'Active',
      uptime: '3h 14m',
      utilization: 75,
      factory: 'Midrand'
    },
    {
      name: 'Slitter B2',
      status: 'Active',
      uptime: '2h 45m',
      utilization: 60,
      factory: 'Midrand'
    },
    {
      name: 'Extruder C1',
      status: 'Maintenance',
      uptime: '0h 0m',
      utilization: 0,
      factory: 'Boksburg'
    },
    {
      name: 'Printer D1',
      status: 'Active',
      uptime: '4h 20m',
      utilization: 85,
      factory: 'Germiston'
    }
  ];

  const jobs = [
    {
      jobId: 'PROD-0543',
      orderId: 'ORD-0012',
      client: 'Lion Group',
      product: 'IWISA 25kg Printed',
      stage: 'Tubing',
      machine: 'Cutter A1',
      operator: 'Amelia Anderson',
      status: 'In Progress',
      qtyPlanned: 6000,
      qtyProgress: 2400,
      estimatedEnd: '15:30',
      factory: 'Midrand'
    },
    {
      jobId: 'PROD-0544',
      orderId: 'ORD-0013',
      client: 'Freedom Foods',
      product: 'Lion 10kg White',
      stage: 'Cutting',
      machine: 'Slitter B2',
      operator: 'J. Moyo',
      status: 'At Risk',
      qtyPlanned: 3500,
      qtyProgress: 1100,
      estimatedEnd: '17:00',
      factory: 'Midrand'
    },
    {
      jobId: 'PROD-0545',
      orderId: 'ORD-0014',
      client: 'Umoya Group',
      product: 'Custom 5kg No Print',
      stage: 'Printing',
      machine: 'Printer D1',
      operator: 'S. Patel',
      status: 'In Progress',
      qtyPlanned: 2000,
      qtyProgress: 1800,
      estimatedEnd: '14:45',
      factory: 'Germiston'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'At Risk': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobsByMachine = (machineName: string) => {
    return jobs.filter(job => job.machine === machineName);
  };

  const filteredMachines = machines.filter(machine => 
    selectedFactory === 'all' || machine.factory === selectedFactory
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {filteredMachines.map((machine, index) => (
        <div key={index} className="space-y-4">
          {/* Machine Header Card */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Factory className="h-5 w-5 text-gray-600" />
                  {machine.name}
                </CardTitle>
                <Badge className={getStatusColor(machine.status)}>
                  {machine.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Uptime: {machine.uptime}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Daily Utilization</span>
                    <span>{machine.utilization}%</span>
                  </div>
                  <Progress value={machine.utilization} className="h-2" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Job Cards for this Machine */}
          <div className="space-y-3 min-h-[300px]">
            {getJobsByMachine(machine.name).map((job, jobIndex) => (
              <Card key={jobIndex} className="bg-white border-gray-200 hover:shadow-md transition-shadow cursor-move">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm text-blue-600">{job.jobId}</div>
                      <Badge className={getJobStatusColor(job.status)}>
                        {job.status === 'At Risk' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div><strong>Client:</strong> {job.client}</div>
                      <div><strong>Product:</strong> {job.product}</div>
                      <div><strong>Order ID:</strong> {job.orderId}</div>
                      <div><strong>Operation:</strong> {job.stage}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{job.qtyProgress.toLocaleString()} / {job.qtyPlanned.toLocaleString()}</span>
                      </div>
                      <Progress value={(job.qtyProgress / job.qtyPlanned) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {job.operator}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        ETA: {job.estimatedEnd}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductionScheduler;

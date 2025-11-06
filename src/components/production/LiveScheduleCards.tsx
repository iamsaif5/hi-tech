
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Settings } from 'lucide-react';

interface LiveScheduleCardsProps {
  selectedFactory: string;
  selectedShift: string;
}

const LiveScheduleCards = ({ selectedFactory, selectedShift }: LiveScheduleCardsProps) => {
  const activeJobs = [
    {
      machine: 'Slitter B2',
      jobId: 'PROD-0543',
      orderId: 'ORD-0015',
      product: 'Lion 10kg White',
      client: 'Freedom Foods',
      operator: 'Sarah Brown',
      stage: 'Tubing',
      status: 'Active',
      factory: 'Midrand',
      shift: 'Day',
      qtyProgress: 2100,
      qtyTotal: 3500,
      startTime: '09:15',
      estimatedFinish: '13:30',
      lastUpdate: '2 mins ago'
    },
    {
      machine: 'Cutter A1',
      jobId: 'PROD-0542',
      orderId: 'ORD-0012',
      product: 'IWISA 25kg',
      client: 'Lion Group',
      operator: 'Mike Davis',
      stage: 'Cutting',
      status: 'Active',
      factory: 'Midrand',
      shift: 'Day',
      qtyProgress: 4500,
      qtyTotal: 6000,
      startTime: '08:30',
      estimatedFinish: '14:10',
      lastUpdate: '5 mins ago'
    },
    {
      machine: 'Printer D1',
      jobId: 'PROD-0545',
      orderId: 'ORD-0014',
      product: 'Custom 5kg No Print',
      client: 'Umoya Group',
      operator: 'S. Patel',
      stage: 'Printing',
      status: 'At Risk',
      factory: 'Boksburg',
      shift: 'Day',
      qtyProgress: 1800,
      qtyTotal: 2000,
      startTime: '10:00',
      estimatedFinish: '16:45',
      lastUpdate: '1 min ago'
    },
    {
      machine: 'Bagger 1',
      jobId: 'PROD-0546',
      orderId: 'ORD-0016',
      product: 'IWISA 10kg',
      client: 'Lion Group',
      operator: 'Lisa G.',
      stage: 'Bagging',
      status: 'Active',
      factory: 'Germiston',
      shift: 'Night',
      qtyProgress: 800,
      qtyTotal: 1200,
      startTime: '22:15',
      estimatedFinish: '15:20',
      lastUpdate: '8 mins ago'
    }
  ];

  const filteredJobs = activeJobs.filter(job => {
    const factoryMatch = selectedFactory === 'all' || job.factory.toLowerCase() === selectedFactory.toLowerCase();
    const shiftMatch = selectedShift === 'all' || job.shift.toLowerCase() === selectedShift.toLowerCase();
    return factoryMatch && shiftMatch;
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'bg-blue-600 text-white',
      'At Risk': 'bg-orange-600 text-white',
      'Delayed': 'bg-red-600 text-white',
      'Completed': 'bg-green-600 text-white'
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-600 text-white'}>
        {status}
      </Badge>
    );
  };

  const calculateProgress = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Current Jobs ({filteredJobs.length})</h3>
        <p className="text-sm text-gray-600">Showing jobs from last 48 hours</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredJobs.map((job, index) => (
          <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  {job.machine}
                </CardTitle>
                {getStatusBadge(job.status)}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  {job.factory}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {job.shift} Shift
                </span>
                <span>Updated {job.lastUpdate}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-600">Job ID:</span>
                  <p className="font-medium text-blue-600 cursor-pointer hover:underline text-sm">
                    {job.jobId}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Order:</span>
                  <p className="font-medium text-sm">{job.orderId}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-600">Product:</span>
                  <p className="font-medium text-sm">{job.product}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Client:</span>
                  <p className="font-medium text-sm">{job.client}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Stage:</span>
                  <p className="font-medium text-sm">{job.stage}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{job.operator}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-semibold">
                    {job.qtyProgress.toLocaleString()} / {job.qtyTotal.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={calculateProgress(job.qtyProgress, job.qtyTotal)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Started: {job.startTime}</span>
                  <span className="font-medium text-blue-600">Est. Finish: {job.estimatedFinish}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No active jobs found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default LiveScheduleCards;

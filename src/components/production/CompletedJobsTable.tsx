
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

interface CompletedJobsTableProps {
  selectedFactory: string;
  selectedShift: string;
}

const CompletedJobsTable = ({ selectedFactory, selectedShift }: CompletedJobsTableProps) => {
  const completedJobs = [
    {
      jobId: 'PROD-0540',
      orderId: 'ORD-0010',
      client: 'Lion Group',
      product: 'IWISA 25kg Printed',
      stage: 'Cutting',
      machine: 'Cutter A1',
      operator: 'Mike Davis',
      factory: 'Midrand',
      shift: 'Day',
      status: 'Completed',
      qtyCompleted: 5000,
      qtyTarget: 5000,
      efficiency: 100,
      startTime: '08:00',
      completedTime: '12:30',
      duration: '4h 30m',
      completedDate: '2025-06-28'
    },
    {
      jobId: 'PROD-0541',
      orderId: 'ORD-0011',
      client: 'Freedom Foods',
      product: 'Lion 10kg White',
      stage: 'Tubing',
      machine: 'Slitter B2',
      operator: 'Sarah Brown',
      factory: 'Midrand',
      shift: 'Day',
      status: 'Completed',
      qtyCompleted: 3200,
      qtyTarget: 3200,
      efficiency: 100,
      startTime: '09:15',
      completedTime: '11:15',
      duration: '2h 00m',
      completedDate: '2025-06-28'
    },
    {
      jobId: 'PROD-0539',
      orderId: 'ORD-0009',
      client: 'Umoya Group',
      product: 'Custom 5kg',
      stage: 'Printing',
      machine: 'Printer D1',
      operator: 'S. Patel',
      factory: 'Boksburg',
      shift: 'Night',
      status: 'Completed',
      qtyCompleted: 1480,
      qtyTarget: 1500,
      efficiency: 98.7,
      startTime: '22:00',
      completedTime: '10:45',
      duration: '12h 45m',
      completedDate: '2025-06-27'
    },
    {
      jobId: 'PROD-0538',
      orderId: 'ORD-0008',
      client: 'Industrial Co',
      product: 'Bulk 50kg Heavy',
      stage: 'Bagging',
      machine: 'Bagger 1',
      operator: 'Lisa G.',
      factory: 'Germiston',
      shift: 'Day',
      status: 'Completed',
      qtyCompleted: 2500,
      qtyTarget: 2500,
      efficiency: 100,
      startTime: '07:30',
      completedTime: '15:00',
      duration: '7h 30m',
      completedDate: '2025-06-27'
    }
  ];

  const filteredJobs = completedJobs.filter(job => {
    const factoryMatch = selectedFactory === 'all' || job.factory.toLowerCase() === selectedFactory.toLowerCase();
    const shiftMatch = selectedShift === 'all' || job.shift.toLowerCase() === selectedShift.toLowerCase();
    return factoryMatch && shiftMatch;
  });

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 100) {
      return <Badge className="bg-green-600 text-white">{efficiency}%</Badge>;
    } else if (efficiency >= 95) {
      return <Badge className="bg-blue-600 text-white">{efficiency}%</Badge>;
    } else if (efficiency >= 85) {
      return <Badge className="bg-yellow-600 text-white">{efficiency}%</Badge>;
    } else {
      return <Badge className="bg-orange-600 text-white">{efficiency}%</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recently Completed Jobs ({filteredJobs.length})</h3>
        <p className="text-sm text-gray-600">Jobs completed in the last 48 hours</p>
      </div>

      <Card className="bg-white border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-900">Job Details</TableHead>
                  <TableHead className="font-semibold text-gray-900">Product & Client</TableHead>
                  <TableHead className="font-semibold text-gray-900">Machine & Operator</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">Quantity</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">Efficiency</TableHead>
                  <TableHead className="font-semibold text-gray-900">Timing</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job, index) => (
                  <TableRow key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-blue-600 cursor-pointer hover:underline">
                          {job.jobId}
                        </p>
                        <p className="text-sm text-gray-600">{job.orderId}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{job.factory}</span>
                          <span>•</span>
                          <span>{job.shift} Shift</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{job.product}</p>
                        <p className="text-sm text-gray-600">{job.client}</p>
                        <p className="text-xs text-gray-500">{job.stage}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{job.machine}</p>
                        <p className="text-sm text-gray-600">{job.operator}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <p className="font-semibold">{job.qtyCompleted.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">/ {job.qtyTarget.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getEfficiencyBadge(job.efficiency)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{job.duration}</span>
                        </div>
                        <p className="text-xs text-gray-500">Started: {job.startTime}</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs">{job.completedTime}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-600 text-white">
                        {job.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredJobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No completed jobs found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default CompletedJobsTable;

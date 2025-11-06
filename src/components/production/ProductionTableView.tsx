
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductionTableViewProps {
  viewType: 'schedule' | 'completed' | 'uptime';
}

const ProductionTableView = ({ viewType }: ProductionTableViewProps) => {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'At Risk': 'bg-orange-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'Completed': 'bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'Blocked': 'bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'Maintenance': 'bg-gray-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'OK': 'bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium'
    };
    
    return <span className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-600 text-white px-2 py-1 rounded-md text-xs font-medium'}>{status}</span>;
  };

  const liveScheduleData = [
    {
      machine: 'Slitter B2',
      jobId: 'PROD-0543',
      orderId: 'ORD-0015',
      product: 'Lion 10kg White',
      client: 'Freedom Foods',
      operator: 'Sarah Brown',
      stage: 'Tubing',
      status: 'Active',
      qtyProgress: '2,100',
      qtyTotal: '3,500',
      estimatedFinish: '13:30'
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
      qtyProgress: '4,500',
      qtyTotal: '6,000',
      estimatedFinish: '14:10'
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
      qtyProgress: '1,800',
      qtyTotal: '2,000',
      estimatedFinish: '16:45'
    }
  ];

  const completedJobs = [
    {
      jobId: 'PROD-0540',
      orderId: 'ORD-0010',
      client: 'Lion Group',
      product: 'IWISA 25kg Printed',
      stage: 'Cutting',
      machine: 'Cutter A1',
      operator: 'Mike Davis',
      status: 'Completed',
      qty: '5,000 / 5,000',
      completedAt: '12:30'
    },
    {
      jobId: 'PROD-0541',
      orderId: 'ORD-0011',
      client: 'Freedom Foods',
      product: 'Lion 10kg White',
      stage: 'Tubing',
      machine: 'Slitter B2',
      operator: 'Sarah Brown',
      status: 'Completed',
      qty: '3,200 / 3,200',
      completedAt: '11:15'
    }
  ];

  const machineUptime = [
    {
      machine: 'Cutter A1',
      factory: 'Midrand',
      status: 'Active',
      uptime: '7h 45m',
      utilization: '85%',
      lastMaintenance: '2025-06-20',
      nextMaintenance: '2025-07-05'
    },
    {
      machine: 'Slitter B2',
      factory: 'Midrand',
      status: 'Active',
      uptime: '6h 30m',
      utilization: '72%',
      lastMaintenance: '2025-06-22',
      nextMaintenance: '2025-07-10'
    },
    {
      machine: 'Extruder C1',
      factory: 'Boksburg',
      status: 'Maintenance',
      uptime: '0h 0m',
      utilization: '0%',
      lastMaintenance: '2025-06-27',
      nextMaintenance: '2025-06-28'
    }
  ];

  const renderTable = () => {
    switch (viewType) {
      case 'schedule':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Job ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qty Progress</TableHead>
                <TableHead>Est. Finish</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveScheduleData.map((job, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{job.machine}</TableCell>
                  <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">{job.jobId}</TableCell>
                  <TableCell>{job.orderId}</TableCell>
                  <TableCell>{job.product}</TableCell>
                  <TableCell>{job.client}</TableCell>
                  <TableCell>{job.operator}</TableCell>
                  <TableCell>{job.stage}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>{job.qtyProgress} / {job.qtyTotal}</TableCell>
                  <TableCell>{job.estimatedFinish}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'completed':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Completed Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedJobs.map((job, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">{job.jobId}</TableCell>
                  <TableCell>{job.orderId}</TableCell>
                  <TableCell>{job.client}</TableCell>
                  <TableCell>{job.product}</TableCell>
                  <TableCell>{job.stage}</TableCell>
                  <TableCell>{job.machine}</TableCell>
                  <TableCell>{job.operator}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>{job.qty}</TableCell>
                  <TableCell>{job.completedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'uptime':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uptime Today</TableHead>
                <TableHead>Utilisation</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Next Scheduled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machineUptime.map((machine, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{machine.machine}</TableCell>
                  <TableCell>{machine.factory}</TableCell>
                  <TableCell>{getStatusBadge(machine.status)}</TableCell>
                  <TableCell>{machine.uptime}</TableCell>
                  <TableCell>{machine.utilization}</TableCell>
                  <TableCell>{machine.lastMaintenance}</TableCell>
                  <TableCell>{machine.nextMaintenance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            No data available for this view.
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (viewType) {
      case 'schedule':
        return 'Live Production Schedule';
      case 'completed':
        return 'Completed Jobs';
      case 'uptime':
        return 'Machine Uptime Status';
      default:
        return 'Production Data';
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {renderTable()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionTableView;

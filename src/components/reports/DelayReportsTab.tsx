import React, { useState } from 'react';
import { KPICard } from './KPICard';
import { ReportsChart } from './ReportsChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Factory, Users, Clock } from 'lucide-react';

interface DelayReportsTabProps {
  timeFilter: string;
}

export const DelayReportsTab: React.FC<DelayReportsTabProps> = ({ timeFilter }) => {
  const [selectedMachine, setSelectedMachine] = useState('all');

  const hasDelays = true; // This would be determined by actual data

  if (!hasDelays) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">No delays this period.</p>
      </div>
    );
  }

  const summaryData = [
    {
      title: 'Jobs delayed this week',
      value: '12',
      subtitle: 'out of 45 total jobs',
      icon: <Clock className="h-5 w-5" />,
      status: 'warning' as const
    },
    {
      title: 'Most common delay cause',
      value: 'Machine Setup',
      subtitle: '35% of delays',
      icon: <Factory className="h-5 w-5" />,
      status: 'neutral' as const
    },
    {
      title: 'Machine-related delays',
      value: '8',
      subtitle: '66% of total delays',
      icon: <Factory className="h-5 w-5" />,
      status: 'warning' as const
    },
    {
      title: 'Operator-related delays',
      value: '4',
      subtitle: '34% of total delays',
      icon: <Users className="h-5 w-5" />,
      status: 'neutral' as const
    }
  ];

  const delayReasonsData = [
    { name: 'Machine Setup', value: 35, fill: '#3b82f6' },
    { name: 'Material Shortage', value: 25, fill: '#ef4444' },
    { name: 'Quality Issues', value: 20, fill: '#f59e0b' },
    { name: 'Operator Absence', value: 15, fill: '#6b7280' },
    { name: 'Equipment Failure', value: 5, fill: '#8b5cf6' }
  ];

  const delayHoursData = [
    { name: 'PROD-2024-015', hours: 4.5 },
    { name: 'PROD-2024-016', hours: 3.2 },
    { name: 'PROD-2024-017', hours: 6.8 },
    { name: 'PROD-2024-018', hours: 2.1 },
    { name: 'PROD-2024-019', hours: 5.5 }
  ];

  const delayData = [
    {
      jobID: 'PROD-2024-015',
      delayReason: 'Machine Setup',
      duration: '4.5h',
      machine: 'Cutter A1',
      operator: 'Sarah Brown',
    },
    {
      jobID: 'PROD-2024-016',
      delayReason: 'Material Shortage',
      duration: '3.2h',
      machine: 'Slitter B2',
      operator: 'Mike Davis',
    },
    {
      jobID: 'PROD-2024-017',
      delayReason: 'Quality Issues',
      duration: '6.8h',
      machine: 'Printer D1',
      operator: 'Josh M.',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <KPICard
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            status={item.status}
          />
        ))}
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-gray-500" />
            <Select value={selectedMachine} onValueChange={setSelectedMachine}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Machine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Machines</SelectItem>
                <SelectItem value="cutter">Cutter A1</SelectItem>
                <SelectItem value="slitter">Slitter B2</SelectItem>
                <SelectItem value="printer">Printer D1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChart
          title="Delay Reasons by %"
          type="pie"
          data={delayReasonsData}
          dataKey="value"
          xAxisKey="name"
        />
        
        <ReportsChart
          title="Delay Hours by Job"
          type="bar"
          data={delayHoursData}
          dataKey="hours"
          xAxisKey="name"
        />
      </div>

      {/* Delay Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Delay Reason</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delayData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.jobID}</TableCell>
                    <TableCell>{item.delayReason}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>{item.machine}</TableCell>
                    <TableCell>{item.operator}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Clock className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

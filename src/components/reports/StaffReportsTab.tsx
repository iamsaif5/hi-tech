import React, { useState } from 'react';
import { KPICard } from './KPICard';
import { ReportsChart } from './ReportsChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, Users, Clock, Calendar } from 'lucide-react';

interface StaffReportsTabProps {
  timeFilter: string;
}

export const StaffReportsTab: React.FC<StaffReportsTabProps> = ({ timeFilter }) => {
  const [selectedFactory, setSelectedFactory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');

  const summaryData = [
    {
      title: 'Total hours this week',
      value: '1,248h',
      subtitle: 'across all staff',
      icon: <Clock className="h-5 w-5" />,
      status: 'good' as const
    },
    {
      title: 'Avg hours per operator',
      value: '39.2h',
      subtitle: 'per week',
      icon: <Users className="h-5 w-5" />,
      status: 'good' as const
    },
    {
      title: 'Overtime instances',
      value: '8',
      subtitle: 'this week',
      icon: <Calendar className="h-5 w-5" />,
      status: 'warning' as const
    },
    {
      title: 'Sick days this week',
      value: '5',
      subtitle: 'total days',
      icon: <Users className="h-5 w-5" />,
      status: 'neutral' as const
    }
  ];

  const attendanceData = [
    { name: 'Sarah Brown', attendance: 95, hours: 38 },
    { name: 'Mike Davis', attendance: 98, hours: 42 },
    { name: 'S. Patel', attendance: 92, hours: 40 },
    { name: 'Josh M.', attendance: 88, hours: 37 },
    { name: 'R. Kumar', attendance: 100, hours: 40 }
  ];

  const dailyHoursData = [
    { day: 'Mon', hours: 184 },
    { day: 'Tue', hours: 176 },
    { day: 'Wed', hours: 168 },
    { day: 'Thu', hours: 192 },
    { day: 'Fri', hours: 188 },
    { day: 'Sat', hours: 144 },
    { day: 'Sun', hours: 96 }
  ];

  const absenceData = [
    { name: 'Sick Leave', value: 60, fill: '#ef4444' },
    { name: 'Personal Leave', value: 25, fill: '#f59e0b' },
    { name: 'Family Emergency', value: 10, fill: '#6b7280' },
    { name: 'Training', value: 5, fill: '#3b82f6' }
  ];

  const staffData = [
    {
      operator: 'Sarah Brown',
      totalHours: 38.5,
      overtime: 0,
      leaveDays: 0,
      gtgStatus: 'Synced',
      shift: 'Day',
    },
    {
      operator: 'Mike Davis',
      totalHours: 42.0,
      overtime: 2.0,
      leaveDays: 0,
      gtgStatus: 'Synced',
      shift: 'Day',
    },
    {
      operator: 'Josh M.',
      totalHours: 37.2,
      overtime: 0,
      leaveDays: 1,
      gtgStatus: 'Pending',
      shift: 'Night',
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
            <Select value={selectedFactory} onValueChange={setSelectedFactory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Factory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Factories</SelectItem>
                <SelectItem value="main">Main Factory</SelectItem>
                <SelectItem value="secondary">Secondary Factory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="qc">Quality Control</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="day">Day Shift</SelectItem>
                <SelectItem value="night">Night Shift</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReportsChart
          title="Operator Attendance Trend"
          type="bar"
          data={attendanceData}
          dataKey="attendance"
          xAxisKey="name"
        />
        
        <ReportsChart
          title="Daily Hours Logged"
          type="line"
          data={dailyHoursData}
          dataKey="hours"
          xAxisKey="day"
        />
        
        <ReportsChart
          title="Absence Reasons"
          type="pie"
          data={absenceData}
          dataKey="value"
          xAxisKey="name"
        />
      </div>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Leave Days</TableHead>
                  <TableHead>GTG Match</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffData.map((staff, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{staff.operator}</TableCell>
                    <TableCell>{staff.totalHours}h</TableCell>
                    <TableCell>{staff.overtime > 0 ? `${staff.overtime}h` : ''}</TableCell>
                    <TableCell>{staff.leaveDays > 0 ? staff.leaveDays : ''}</TableCell>
                    <TableCell>
                      <Badge className={staff.gtgStatus === 'Synced' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {staff.gtgStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.shift}</TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-800">View</button>
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


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Clock, Plus } from 'lucide-react';

const AttendanceTracking = () => {
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDate, setFilterDate] = useState('this-week');

  const attendanceData = [
    {
      name: 'Maria Santos',
      totalHours: 41.2,
      expectedHours: 40,
      lateEntries: 2,
      overtime: 1.2,
      status: 'OK'
    },
    {
      name: 'Sarah Brown',
      totalHours: 39.5,
      expectedHours: 40,
      lateEntries: 1,
      overtime: 0,
      status: 'OK'
    },
    {
      name: 'Mike Davis',
      totalHours: 42.8,
      expectedHours: 40,
      lateEntries: 0,
      overtime: 2.8,
      status: 'OK'
    },
    {
      name: 'Josh M.',
      totalHours: 37.2,
      expectedHours: 40,
      lateEntries: 3,
      overtime: 0,
      status: 'Warning'
    },
    {
      name: 'S. Patel',
      totalHours: 40.0,
      expectedHours: 40,
      lateEntries: 0,
      overtime: 0,
      status: 'OK'
    },
    {
      name: 'R. Kumar',
      totalHours: 0,
      expectedHours: 40,
      lateEntries: 0,
      overtime: 0,
      status: 'On Leave'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-green-100 text-green-800';
      case 'Warning': return 'bg-orange-100 text-orange-800';
      case 'On Leave': return 'bg-blue-100 text-blue-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadCSV = () => {
    console.log('Downloading attendance CSV...');
  };

  const handleLogMissedClockIn = () => {
    console.log('Logging missed clock-in...');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Hours & attendance</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              Auto-imports coming soon via GTG integration
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogMissedClockIn} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Log missed clock-in
            </Button>
            <Button onClick={handleDownloadCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="QC">QC</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="Operator">Operator</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Technician">Technician</SelectItem>
              <SelectItem value="Inspector">Inspector</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDate} onValueChange={setFilterDate}>
            <SelectTrigger>
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="last-week">Last week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total hours (WTD)</TableHead>
                <TableHead>Expected hours</TableHead>
                <TableHead>Late entries</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((staff, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.totalHours}h</TableCell>
                  <TableCell>{staff.expectedHours}h</TableCell>
                  <TableCell>{staff.lateEntries}</TableCell>
                  <TableCell>{staff.overtime}h</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(staff.status)}>
                      {staff.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Integration notice</h4>
          <p className="text-sm text-blue-800">
            This module is designed to automatically sync with GTG Digital biometric/RFID systems. 
            Manual entry is currently supported for immediate use.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracking;

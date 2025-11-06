
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Grid, Copy } from 'lucide-react';

const ShiftSchedule = () => {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const scheduleData = [
    {
      name: 'Josh M.',
      mon: { shift: 'Day', time: '7-3', status: 'scheduled' },
      tue: { shift: 'Day', time: '7-3', status: 'scheduled' },
      wed: { shift: 'Off', time: '', status: 'off' },
      thu: { shift: 'Off', time: '', status: 'off' },
      fri: { shift: 'Night', time: '7-3', status: 'scheduled' },
      sat: { shift: 'Night', time: '7-3', status: 'scheduled' },
      sun: { shift: 'Off', time: '', status: 'off' }
    },
    {
      name: 'Sarah Brown',
      mon: { shift: 'Day', time: '6-2', status: 'scheduled' },
      tue: { shift: 'Day', time: '6-2', status: 'scheduled' },
      wed: { shift: 'Day', time: '6-2', status: 'scheduled' },
      thu: { shift: 'Day', time: '6-2', status: 'scheduled' },
      fri: { shift: 'Day', time: '6-2', status: 'scheduled' },
      sat: { shift: 'Off', time: '', status: 'off' },
      sun: { shift: 'Off', time: '', status: 'off' }
    },
    {
      name: 'Mike Davis',
      mon: { shift: 'Day', time: '8-4', status: 'scheduled' },
      tue: { shift: 'Day', time: '8-4', status: 'scheduled' },
      wed: { shift: 'Day', time: '8-4', status: 'scheduled' },
      thu: { shift: 'Day', time: '8-4', status: 'scheduled' },
      fri: { shift: 'Day', time: '8-4', status: 'scheduled' },
      sat: { shift: 'Sick', time: '', status: 'sick' },
      sun: { shift: 'Off', time: '', status: 'off' }
    },
    {
      name: 'S. Patel',
      mon: { shift: 'Night', time: '10-6', status: 'scheduled' },
      tue: { shift: 'Night', time: '10-6', status: 'scheduled' },
      wed: { shift: 'Night', time: '10-6', status: 'scheduled' },
      thu: { shift: 'Night', time: '10-6', status: 'scheduled' },
      fri: { shift: 'Off', time: '', status: 'off' },
      sat: { shift: 'Off', time: '', status: 'off' },
      sun: { shift: 'Night', time: '10-6', status: 'scheduled' }
    }
  ];

  const getShiftColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'off': return 'bg-gray-100 text-gray-800';
      case 'sick': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatShiftCell = (dayData: any) => {
    if (dayData.status === 'off') {
      return <Badge className={getShiftColor(dayData.status)}>Off</Badge>;
    }
    if (dayData.status === 'sick') {
      return <Badge className={getShiftColor(dayData.status)}>Sick</Badge>;
    }
    return (
      <div className="text-center">
        <Badge className={getShiftColor(dayData.status)}>
          {dayData.shift}
        </Badge>
        <div className="text-xs text-gray-500 mt-1">{dayData.time}</div>
      </div>
    );
  };

  const handleDuplicateWeek = () => {
    console.log('Duplicating last week\'s shifts...');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Weekly staff schedule</h3>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Table
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </div>
            <Button onClick={handleDuplicateWeek} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate last week
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign shift
            </Button>
          </div>
        </div>

        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mon</TableHead>
                  <TableHead>Tue</TableHead>
                  <TableHead>Wed</TableHead>
                  <TableHead>Thu</TableHead>
                  <TableHead>Fri</TableHead>
                  <TableHead>Sat</TableHead>
                  <TableHead>Sun</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((staff, index) => (
                  <TableRow key={index} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{formatShiftCell(staff.mon)}</TableCell>
                    <TableCell>{formatShiftCell(staff.tue)}</TableCell>
                    <TableCell>{formatShiftCell(staff.wed)}</TableCell>
                    <TableCell>{formatShiftCell(staff.thu)}</TableCell>
                    <TableCell>{formatShiftCell(staff.fri)}</TableCell>
                    <TableCell>{formatShiftCell(staff.sat)}</TableCell>
                    <TableCell>{formatShiftCell(staff.sun)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4" />
            <p>Calendar view coming soon</p>
            <p className="text-sm">Switch to table view to see current schedule</p>
          </div>
        )}

        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
            <span className="text-gray-600">Regular shift</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gray-100 text-gray-800">Off</Badge>
            <span className="text-gray-600">Day off</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800">Sick</Badge>
            <span className="text-gray-600">Sick leave</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftSchedule;

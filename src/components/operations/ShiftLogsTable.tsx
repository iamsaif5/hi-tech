import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Filter, Download, Eye } from 'lucide-react';

interface ShiftLogsTableProps {
  selectedFactory: string;
  selectedShift: string;
}

const ShiftLogsTable = ({ selectedFactory, selectedShift }: ShiftLogsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [operatorFilter, setOperatorFilter] = useState('all');

  const shiftLogs = [
    {
      id: 'SHIFT-001',
      date: '2025-01-06',
      shift: 'Day',
      factory: 'Johannesburg',
      operator: 'John Mthembu',
      machine: 'Extruder Line A',
      product: 'IWISA 25kg Printed',
      loomageOutput: '8,500m',
      loomageTarget: '8,000m',
      qcPassed: 12,
      qcFailed: 1,
      wastePercent: 2.3,
      downtime: '0 min',
      downtimeReason: '-',
      supervisorNotes: 'Excellent performance, exceeded target',
      efficiency: 106.25
    },
    {
      id: 'SHIFT-002',
      date: '2025-01-06',
      shift: 'Day',
      factory: 'Johannesburg',
      operator: 'Sarah Nkomo',
      machine: 'Cutter Station B',
      product: 'Lion 10kg White',
      loomageOutput: '3,800m',
      loomageTarget: '4,500m',
      qcPassed: 8,
      qcFailed: 2,
      wastePercent: 4.1,
      downtime: '45 min',
      downtimeReason: 'Blade replacement',
      supervisorNotes: 'Behind target due to maintenance',
      efficiency: 84.4
    },
    {
      id: 'SHIFT-003',
      date: '2025-01-06',
      shift: 'Night',
      factory: 'Cape Town',
      operator: 'Mike Zulu',
      machine: 'Lamination Line D',
      product: 'Custom 5kg No Print',
      loomageOutput: '6,200m',
      loomageTarget: '6,000m',
      qcPassed: 15,
      qcFailed: 0,
      wastePercent: 1.8,
      downtime: '0 min',
      downtimeReason: '-',
      supervisorNotes: 'Perfect run, zero defects',
      efficiency: 103.3
    },
    {
      id: 'SHIFT-004',
      date: '2025-01-05',
      shift: 'Day',
      factory: 'Durban',
      operator: 'David Molefe',
      machine: 'Printer Unit C',
      product: 'IWISA 25kg Printed',
      loomageOutput: '2,800m',
      loomageTarget: '3,500m',
      qcPassed: 6,
      qcFailed: 3,
      wastePercent: 5.2,
      downtime: '120 min',
      downtimeReason: 'Ink system failure',
      supervisorNotes: 'Technical issue resolved, performance improved',
      efficiency: 80.0
    }
  ];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return 'bg-green-100 text-green-800';
    if (efficiency >= 90) return 'bg-blue-100 text-blue-800';
    if (efficiency >= 80) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getWasteColor = (waste: number) => {
    if (waste <= 2) return 'text-green-600';
    if (waste <= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredLogs = shiftLogs.filter(log => {
    const factoryMatch = selectedFactory === 'all' || log.factory.toLowerCase().includes(selectedFactory.toLowerCase());
    const shiftMatch = selectedShift === 'all' || log.shift.toLowerCase().includes(selectedShift.toLowerCase());
    const searchMatch = searchTerm === '' || 
      log.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.machine.toLowerCase().includes(searchTerm.toLowerCase());
    const operatorMatch = operatorFilter === 'all' || log.operator === operatorFilter;
    
    return factoryMatch && shiftMatch && searchMatch && operatorMatch;
  });

  const uniqueOperators = [...new Set(shiftLogs.map(log => log.operator))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Shift Production Logs</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search operator, product, machine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 w-64 text-xs"
            />
          </div>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={operatorFilter} onValueChange={setOperatorFilter}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operators</SelectItem>
              {uniqueOperators.map(operator => (
                <SelectItem key={operator} value={operator}>{operator}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Shift Details</TableHead>
                <TableHead className="text-xs">Machine & Product</TableHead>
                <TableHead className="text-xs">Loomage Output</TableHead>
                <TableHead className="text-xs">QC Summary</TableHead>
                <TableHead className="text-xs">Waste %</TableHead>
                <TableHead className="text-xs">Downtime</TableHead>
                <TableHead className="text-xs">Efficiency</TableHead>
                <TableHead className="text-xs">Notes</TableHead>
                <TableHead className="text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{log.date}</p>
                      <p className="text-xs text-muted-foreground">{log.shift} Shift</p>
                      <p className="text-xs text-muted-foreground">{log.factory}</p>
                      <p className="text-xs font-medium">{log.operator}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{log.machine}</p>
                      <p className="text-xs text-muted-foreground">{log.product}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{log.loomageOutput}</p>
                      <p className="text-xs text-muted-foreground">Target: {log.loomageTarget}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">{log.qcPassed} Passed</span>
                        {log.qcFailed > 0 && (
                          <span className="text-sm text-red-600">{log.qcFailed} Failed</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${getWasteColor(log.wastePercent)}`}>
                      {log.wastePercent}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{log.downtime}</p>
                      {log.downtimeReason !== '-' && (
                        <p className="text-xs text-muted-foreground">{log.downtimeReason}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEfficiencyColor(log.efficiency)}>
                      {log.efficiency}%
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-48">
                    <p className="text-xs text-muted-foreground truncate">
                      {log.supervisorNotes}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftLogsTable;
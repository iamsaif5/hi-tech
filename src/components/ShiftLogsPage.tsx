import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  Calendar, 
  Clock, 
  User, 
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { KPICard } from './reports/KPICard';

interface ShiftLog {
  id: string;
  date: string;
  shift: 'Day' | 'Night';
  operator: string;
  machine: string;
  product: string;
  loomageOutput: number;
  targetOutput: number;
  efficiency: number;
  wastePercentage: number;
  downtime: number;
  qcResult: 'Pass' | 'Fail' | 'Review';
  clockIn: string;
  clockOut: string;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  notes: string;
  breakdownByHour: Array<{
    hour: string;
    output: number;
    issues: string;
  }>;
  attachments: string[];
}

interface ShiftLogModalProps {
  shiftLog: ShiftLog;
  isOpen: boolean;
  onClose: () => void;
}

const ShiftLogModal: React.FC<ShiftLogModalProps> = ({ shiftLog, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Shift Details - {shiftLog.operator} ({shiftLog.shift} Shift)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Loomage Output</div>
                <div className="text-lg font-semibold">{shiftLog.loomageOutput.toLocaleString()}m</div>
                <div className="text-xs text-muted-foreground">Target: {shiftLog.targetOutput.toLocaleString()}m</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Efficiency</div>
                <div className={`text-lg font-semibold ${
                  shiftLog.efficiency >= 100 ? 'text-green-600' : 
                  shiftLog.efficiency >= 90 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {shiftLog.efficiency}%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Waste</div>
                <div className={`text-lg font-semibold ${shiftLog.wastePercentage > 3 ? 'text-red-600' : 'text-foreground'}`}>
                  {shiftLog.wastePercentage}%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Downtime</div>
                <div className="text-lg font-semibold">{shiftLog.downtime} min</div>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Breakdown */}
          <div>
            <h3 className="text-sm font-medium mb-3">Hourly Breakdown</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Hour</TableHead>
                    <TableHead className="text-xs">Output (m)</TableHead>
                    <TableHead className="text-xs">Issues/Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shiftLog.breakdownByHour.map((hour, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{hour.hour}</TableCell>
                      <TableCell className="text-sm">{hour.output.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{hour.issues || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes and Attachments */}
          <div>
            <h3 className="text-sm font-medium mb-2">Operator Notes</h3>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              {shiftLog.notes || 'No notes recorded'}
            </div>
          </div>

          {shiftLog.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Attachments</h3>
              <div className="space-y-2">
                {shiftLog.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer">
                    📎 {attachment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ShiftLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [machineFilter, setMachineFilter] = useState('all');
  const [selectedShiftLog, setSelectedShiftLog] = useState<ShiftLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - in real app, this would come from API
  const [shiftLogs] = useState<ShiftLog[]>([
    {
      id: '1',
      date: '2025-01-10',
      shift: 'Day',
      operator: 'John Smith',
      machine: 'Loom-A1',
      product: 'IWISA 25kg Printed',
      loomageOutput: 4850,
      targetOutput: 5000,
      efficiency: 97,
      wastePercentage: 2.1,
      downtime: 15,
      qcResult: 'Pass',
      clockIn: '07:00',
      clockOut: '19:00',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      notes: 'Smooth operation, minor jam at 14:30 resolved quickly',
      breakdownByHour: [
        { hour: '07:00-08:00', output: 420, issues: '' },
        { hour: '08:00-09:00', output: 415, issues: '' },
        { hour: '09:00-10:00', output: 408, issues: 'Brief material change' },
        // ... more hours
      ],
      attachments: ['quality_report_day1.pdf']
    },
    {
      id: '2',
      date: '2025-01-10',
      shift: 'Night',
      operator: 'Sarah Wilson',
      machine: 'Loom-B2',
      product: 'Custom 5kg No Print',
      loomageOutput: 3200,
      targetOutput: 4000,
      efficiency: 80,
      wastePercentage: 4.2,
      downtime: 45,
      qcResult: 'Review',
      clockIn: '19:10',
      clockOut: '06:45',
      lateMinutes: 10,
      earlyLeaveMinutes: 15,
      notes: 'Multiple equipment issues, maintenance called twice',
      breakdownByHour: [
        { hour: '19:00-20:00', output: 280, issues: 'Late start' },
        { hour: '20:00-21:00', output: 320, issues: '' },
        // ... more hours
      ],
      attachments: ['incident_report_night1.pdf', 'maintenance_log.pdf']
    },
    {
      id: '3',
      date: '2025-01-09',
      shift: 'Day',
      operator: 'Mike Chen',
      machine: 'Loom-C3',
      product: 'IWISA 10kg Standard',
      loomageOutput: 5200,
      targetOutput: 4800,
      efficiency: 108,
      wastePercentage: 1.8,
      downtime: 5,
      qcResult: 'Pass',
      clockIn: '06:58',
      clockOut: '19:02',
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      notes: 'Excellent performance, exceeded target',
      breakdownByHour: [
        { hour: '07:00-08:00', output: 450, issues: '' },
        { hour: '08:00-09:00', output: 445, issues: '' },
        // ... more hours
      ],
      attachments: []
    }
  ]);

  // Calculate KPIs
  const filteredLogs = shiftLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesShift = shiftFilter === 'all' || log.shift.toLowerCase() === shiftFilter;
    const matchesOperator = operatorFilter === 'all' || log.operator === operatorFilter;
    const matchesMachine = machineFilter === 'all' || log.machine === machineFilter;
    
    return matchesSearch && matchesShift && matchesOperator && matchesMachine;
  });

  const kpiData = {
    shiftsLogged: filteredLogs.length,
    totalLoomageOutput: filteredLogs.reduce((sum, log) => sum + log.loomageOutput, 0),
    avgEfficiency: filteredLogs.length > 0 ? 
      Math.round(filteredLogs.reduce((sum, log) => sum + log.efficiency, 0) / filteredLogs.length) : 0,
    staffPenalties: filteredLogs.reduce((sum, log) => sum + log.lateMinutes + log.earlyLeaveMinutes, 0),
    totalHours: filteredLogs.reduce((sum, log) => {
      const clockIn = new Date(`2024-01-01 ${log.clockIn}`);
      const clockOut = new Date(`2024-01-01 ${log.clockOut}`);
      let hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
      if (hours < 0) hours += 24; // Handle overnight shifts
      return sum + hours;
    }, 0),
    headCount: new Set(filteredLogs.map(log => log.operator)).size
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return 'text-green-600 bg-green-100';
    if (efficiency >= 90) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getWasteColor = (waste: number) => {
    return waste > 3 ? 'text-red-600 bg-red-100' : 'text-foreground bg-muted';
  };

  const getQCIcon = (result: string) => {
    switch (result) {
      case 'Pass': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'Fail': return <XCircle className="h-3 w-3 text-red-600" />;
      case 'Review': return <AlertTriangle className="h-3 w-3 text-amber-600" />;
      default: return null;
    }
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting shift logs...');
  };

  const openShiftLogModal = (shiftLog: ShiftLog) => {
    setSelectedShiftLog(shiftLog);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Filter Row */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg border">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search (operator, machine, product)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-[120px]">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="day">Day (07:00-19:00)</SelectItem>
            <SelectItem value="night">Night (19:00-07:00)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={operatorFilter} onValueChange={setOperatorFilter}>
          <SelectTrigger className="w-[140px]">
            <User className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Operators</SelectItem>
            <SelectItem value="John Smith">John Smith</SelectItem>
            <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
            <SelectItem value="Mike Chen">Mike Chen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={machineFilter} onValueChange={setMachineFilter}>
          <SelectTrigger className="w-[130px]">
            <Settings className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Machines</SelectItem>
            <SelectItem value="Loom-A1">Loom-A1</SelectItem>
            <SelectItem value="Loom-B2">Loom-B2</SelectItem>
            <SelectItem value="Loom-C3">Loom-C3</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          title="Shifts Logged"
          value={kpiData.shiftsLogged.toString()}
          subtitle="Total shifts recorded"
          icon={<Clock className="h-4 w-4" />}
          status="neutral"
        />
        <KPICard
          title="Total Loomage Output"
          value={`${kpiData.totalLoomageOutput.toLocaleString()}m`}
          subtitle="Combined production"
          icon={<Settings className="h-4 w-4" />}
          status="good"
        />
        <KPICard
          title="Avg Efficiency"
          value={`${kpiData.avgEfficiency}%`}
          subtitle="Across all shifts"
          icon={<CheckCircle className="h-4 w-4" />}
          status={kpiData.avgEfficiency >= 95 ? "good" : kpiData.avgEfficiency >= 85 ? "warning" : "critical"}
        />
        <KPICard
          title="Staff Penalties"
          value={`${kpiData.staffPenalties} mins`}
          subtitle="Late/early departures"
          icon={<AlertTriangle className="h-4 w-4" />}
          status={kpiData.staffPenalties === 0 ? "good" : kpiData.staffPenalties < 30 ? "warning" : "critical"}
        />
        <KPICard
          title="Total Hours"
          value={`${Math.round(kpiData.totalHours)}h`}
          subtitle="Combined work hours"
          icon={<Clock className="h-4 w-4" />}
          status="neutral"
        />
        <KPICard
          title="Head-count"
          value={kpiData.headCount.toString()}
          subtitle="Unique operators"
          icon={<User className="h-4 w-4" />}
          status="neutral"
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Shift Details</TableHead>
                  <TableHead className="text-xs font-medium">Machine & Product</TableHead>
                  <TableHead className="text-xs font-medium">Loomage Output</TableHead>
                  <TableHead className="text-xs font-medium">QC Summary</TableHead>
                  <TableHead className="text-xs font-medium">Waste %</TableHead>
                  <TableHead className="text-xs font-medium">Downtime</TableHead>
                  <TableHead className="text-xs font-medium">Efficiency</TableHead>
                  <TableHead className="text-xs font-medium">Penalties</TableHead>
                  <TableHead className="text-xs font-medium">Notes</TableHead>
                  <TableHead className="text-xs font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => openShiftLogModal(log)}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{log.operator}</div>
                        <div className="text-xs text-muted-foreground">{log.date} • {log.shift} Shift</div>
                        <div className="text-xs text-muted-foreground">{log.clockIn} - {log.clockOut}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{log.machine}</div>
                        <div className="text-xs text-muted-foreground">{log.product}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{log.loomageOutput.toLocaleString()}m</div>
                        <div className="text-xs text-muted-foreground">Target: {log.targetOutput.toLocaleString()}m</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getQCIcon(log.qcResult)}
                        <span className="text-sm">{log.qcResult}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getWasteColor(log.wastePercentage)} text-xs`}>
                        {log.wastePercentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{log.downtime} min</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getEfficiencyColor(log.efficiency)} text-xs`}>
                        {log.efficiency}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(log.lateMinutes + log.earlyLeaveMinutes) > 0 ? (
                        <Badge className="bg-red-100 text-red-600 text-xs">
                          {log.lateMinutes + log.earlyLeaveMinutes} min
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">On time</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {log.notes || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openShiftLogModal(log);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Shift Log Modal */}
      {selectedShiftLog && (
        <ShiftLogModal
          shiftLog={selectedShiftLog}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ShiftLogsPage;
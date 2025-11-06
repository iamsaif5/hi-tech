import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  TableRow,
} from '@/components/ui/table';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users,
  Activity,
  AlertTriangle,
  Download,
  MoreHorizontal,
  PieChart,
  BarChart3,
  Calendar,
  Factory,
  Shield,
  Clock
} from 'lucide-react';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

export const StandardReportsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('financial');
  const [dateRange, setDateRange] = useState('this-week');
  const [site, setSite] = useState('all');
  const [shift, setShift] = useState('all');
  const [selectedDrawerData, setSelectedDrawerData] = useState(null);

  // Mock data for different tabs
  const getFinancialData = () => ({
    tiles: [
      { title: 'Revenue', value: 'R2.8M', icon: DollarSign, color: 'text-green-600' },
      { title: 'Gross Margin %', value: '24.8%', icon: TrendingUp, color: 'text-blue-600' },
      { title: 'Outstanding AR', value: 'R450K', icon: FileText, color: 'text-amber-600' },
      { title: 'Top Customer Value', value: 'R875K', icon: Users, color: 'text-purple-600' }
    ],
    tableData: [
      { invoice: 'INV-2024-001', client: 'Lion Group', amount: 125000, daysOverdue: 5, status: 'overdue' },
      { invoice: 'INV-2024-002', client: 'Tiger Brands', amount: 85000, daysOverdue: 15, status: 'overdue' },
      { invoice: 'INV-2024-003', client: 'Freedom Foods', amount: 65000, daysOverdue: 0, status: 'current' },
      { invoice: 'INV-2024-004', client: 'Pioneer Foods', amount: 45000, daysOverdue: 32, status: 'overdue' }
    ]
  });

  const getProductionData = () => ({
    tiles: [
      { title: 'OEE', value: '82%', icon: Activity, color: 'text-green-600' },
      { title: 'Avg Runtime (hr)', value: '18.5', icon: Factory, color: 'text-blue-600' },
      { title: 'Downtime (hr)', value: '2.3', icon: AlertTriangle, color: 'text-red-600' },
      { title: 'Jobs on Target %', value: '87%', icon: TrendingUp, color: 'text-green-600' }
    ],
    tableData: [
      { machine: 'Extruder A1', efficiency: 92, runtime: 19.2, downtime: 1.8, oee: 88 },
      { machine: 'Extruder B1', efficiency: 85, runtime: 17.8, downtime: 3.2, oee: 79 },
      { machine: 'Loom 57', efficiency: 89, runtime: 18.5, downtime: 2.1, oee: 84 },
      { machine: 'Print Line A', efficiency: 78, runtime: 16.2, downtime: 4.8, oee: 72 }
    ]
  });

  const getQCData = () => ({
    tiles: [
      { title: 'Pass Rate %', value: '94.5%', icon: Shield, color: 'text-green-600' },
      { title: 'Failed Tests', value: '12', icon: AlertTriangle, color: 'text-red-600' },
      { title: 'Waste (kg)', value: '487', icon: AlertTriangle, color: 'text-amber-600' },
      { title: 'Scrap Cost (R)', value: '15.2K', icon: DollarSign, color: 'text-red-600' }
    ],
    tableData: [
      { testId: 'QC-2024-001', product: 'IWISA 25kg', defect: 'Print misalignment', severity: 'high', date: '2024-01-15' },
      { testId: 'QC-2024-002', product: 'Lion 10kg', defect: 'Weak seal', severity: 'medium', date: '2024-01-15' },
      { testId: 'QC-2024-003', product: 'Custom 5kg', defect: 'Color variance', severity: 'low', date: '2024-01-14' },
      { testId: 'QC-2024-004', product: 'IWISA 25kg', defect: 'Dimension error', severity: 'high', date: '2024-01-14' }
    ]
  });

  const getStaffingData = () => ({
    tiles: [
      { title: 'Attendance %', value: '96.2%', icon: Users, color: 'text-green-600' },
      { title: 'Overtime (hrs)', value: '124', icon: Clock, color: 'text-amber-600' },
      { title: 'Penalties (R)', value: '2.8K', icon: AlertTriangle, color: 'text-red-600' },
      { title: 'Avg Eff %', value: '89%', icon: TrendingUp, color: 'text-green-600' },
      { title: 'Labour Cost (R)', value: '485K', icon: DollarSign, color: 'text-blue-600' },
      { title: 'Cost per Kg', value: 'R12.50', icon: Activity, color: 'text-purple-600' }
    ],
    tableData: [
      { operator: 'John Smith', shift: 'Day', efficiency: 92, hours: 8.5, penalties: 0 },
      { operator: 'Sarah Jones', shift: 'Night', efficiency: 87, hours: 8.0, penalties: 150 },
      { operator: 'Mike Wilson', shift: 'Day', efficiency: 94, hours: 9.2, penalties: 0 },
      { operator: 'Lisa Brown', shift: 'Night', efficiency: 85, hours: 7.8, penalties: 300 }
    ]
  });

  const getCurrentData = () => {
    switch (activeSubTab) {
      case 'financial': return getFinancialData();
      case 'production': return getProductionData();
      case 'qc': return getQCData();
      case 'staffing': return getStaffingData();
      default: return getFinancialData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-500';
      case 'current': return 'bg-green-500';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleRowClick = (rowData: any) => {
    setSelectedDrawerData(rowData);
  };

  const data = getCurrentData();

  return (
    <div className="space-y-6">
      {/* Global Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Global Filters</h3>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Site/Plant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="main">Main Factory</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
              <Select value={shift} onValueChange={setShift}>
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
        </CardContent>
      </Card>

      {/* Secondary Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="clean-tabs">
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="production">Production - Efficiency</TabsTrigger>
          <TabsTrigger value="qc">QC & Waste</TabsTrigger>
          <TabsTrigger value="staffing">Staffing</TabsTrigger>
        </TabsList>

        <TabsContent value={activeSubTab} className="mt-4 space-y-6">
          {/* Row 1 - Metric Tiles */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${activeSubTab === 'staffing' ? 'lg:grid-cols-6' : 'lg:grid-cols-4'}`}>
            {data.tiles.map((tile, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <tile.icon className={`w-4 h-4 ${tile.color}`} />
                    <div className="text-xs text-muted-foreground">{tile.title}</div>
                  </div>
                  <div className="text-lg font-semibold">{tile.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Row 2 - Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>
                    {activeSubTab === 'staffing' ? 'Overtime Cost Trend' : 'Trend Analysis'}
                  </span>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {activeSubTab === 'staffing' ? 'Area chart showing overtime costs over time' : 'Chart visualization would appear here'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>
                    {activeSubTab === 'staffing' ? 'Wages by Staff Type' : 'Breakdown Analysis'}
                  </span>
                  <Button variant="ghost" size="sm">
                    <PieChart className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {activeSubTab === 'staffing' ? 'Stacked bar chart showing wages by staff type' : 'Chart visualization would appear here'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3 - Data Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>
                  {activeSubTab === 'staffing' ? 'Shift Summary Matrix' : 'Detailed Data'}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(data.tableData[0] || {}).map((key) => (
                        <TableHead key={key} className="text-xs">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </TableHead>
                      ))}
                      <TableHead className="text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.tableData.map((row, index) => (
                      <TableRow 
                        key={index} 
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleRowClick(row)}
                      >
                        {Object.entries(row).map(([key, value], cellIndex) => (
                          <TableCell key={cellIndex} className="text-xs">
                            {key === 'status' || key === 'severity' ? (
                              <Badge className={`${getStatusColor(value as string)} text-white text-xs`}>
                                {String(value)}
                              </Badge>
                            ) : (
                              String(value)
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(row);
                          }}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Drawer */}
      <Drawer open={!!selectedDrawerData} onOpenChange={() => setSelectedDrawerData(null)}>
        <DrawerContent className="max-w-4xl mx-auto max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Record Details</DrawerTitle>
            <DrawerDescription>
              Detailed information for the selected record
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {selectedDrawerData && (
              <div className="space-y-4">
                {Object.entries(selectedDrawerData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span>{value as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
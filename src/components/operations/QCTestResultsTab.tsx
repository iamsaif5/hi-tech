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
import { Search, Filter, Download, Eye, Upload, FileImage } from 'lucide-react';

const QCTestResultsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('week');
  const [clientFilter, setClientFilter] = useState('all');

  const testResults = [
    {
      id: 'QC-2024-001',
      date: '2025-01-06',
      time: '14:30',
      product: 'IWISA 25kg Printed',
      bagSpecs: '450mm x 700mm, 80 micron',
      testType: 'Tensile Strength',
      result: 'Passed',
      moNumber: 'MO-001',
      orderNo: 'ORD-0012',
      client: 'Lion Group',
      supervisor: 'Mary Johnson',
      machine: 'Extruder Line A',
      batch: 'B-2024-156',
      testValues: '28.5 N/mm (Min: 25 N/mm)',
      hasPhoto: true,
      notes: 'Within specification limits'
    },
    {
      id: 'QC-2024-002',
      date: '2025-01-06',
      time: '14:15',
      product: 'Lion 10kg White',
      bagSpecs: '300mm x 500mm, 60 micron',
      testType: 'Seal Integrity',
      result: 'Failed',
      moNumber: 'MO-002',
      orderNo: 'ORD-0013',
      client: 'Freedom Foods',
      supervisor: 'David Kim',
      machine: 'Cutter Station B',
      batch: 'B-2024-157',
      testValues: '15.2 N/15mm (Min: 18 N/15mm)',
      hasPhoto: true,
      notes: 'Seal strength below minimum requirement'
    },
    {
      id: 'QC-2024-003',
      date: '2025-01-06',
      time: '14:00',
      product: 'Custom 5kg No Print',
      bagSpecs: '250mm x 400mm, 70 micron',
      testType: 'Print Quality',
      result: 'Pending',
      moNumber: 'MO-003',
      orderNo: 'ORD-0014',
      client: 'Tiger Brands',
      supervisor: 'Sarah Lee',
      machine: 'Printer Unit C',
      batch: 'B-2024-158',
      testValues: 'Visual inspection in progress',
      hasPhoto: false,
      notes: 'Awaiting color match verification'
    },
    {
      id: 'QC-2024-004',
      date: '2025-01-06',
      time: '13:45',
      product: 'IWISA 25kg Printed',
      bagSpecs: '450mm x 700mm, 80 micron',
      testType: 'Dimensional Check',
      result: 'Passed',
      moNumber: 'MO-004',
      orderNo: 'ORD-0015',
      client: 'Umoya Group',
      supervisor: 'Mike Chen',
      machine: 'Lamination Line D',
      batch: 'B-2024-159',
      testValues: 'W: 449.8mm, L: 699.5mm (Tolerance: ±2mm)',
      hasPhoto: true,
      notes: 'All dimensions within tolerance'
    },
    {
      id: 'QC-2024-005',
      date: '2025-01-05',
      time: '16:20',
      product: 'Lion 10kg White',
      bagSpecs: '300mm x 500mm, 60 micron',
      testType: 'Barrier Properties',
      result: 'Passed',
      moNumber: 'MO-005',
      orderNo: 'ORD-0016',
      client: 'Freedom Foods',
      supervisor: 'Lisa Wang',
      machine: 'Extruder Line A',
      batch: 'B-2024-160',
      testValues: 'WVTR: 0.85 g/m²/day (Max: 1.0)',
      hasPhoto: false,
      notes: 'Excellent barrier performance'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResults = testResults.filter(result => {
    const statusMatch = statusFilter === 'all' || result.result === statusFilter;
    const clientMatch = clientFilter === 'all' || result.client === clientFilter;
    const searchMatch = searchTerm === '' || 
      result.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.batch.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && clientMatch && searchMatch;
  });

  const uniqueClients = [...new Set(testResults.map(result => result.client))];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Quality Control Logbook</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Results
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search product, client, order, batch..."
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
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {uniqueClients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
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
                  <TableHead className="text-xs">Test Details</TableHead>
                  <TableHead className="text-xs">Product & Specs</TableHead>
                  <TableHead className="text-xs">Order Info</TableHead>
                  <TableHead className="text-xs">Test Results</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Supervisor</TableHead>
                  <TableHead className="text-xs">Notes</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{result.id}</p>
                        <p className="text-xs text-muted-foreground">{result.date} {result.time}</p>
                        <Badge variant="outline" className="text-xs">{result.testType}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{result.product}</p>
                        <p className="text-xs text-muted-foreground">{result.bagSpecs}</p>
                        <p className="text-xs text-muted-foreground">Machine: {result.machine}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{result.client}</p>
                        <p className="text-xs text-muted-foreground">Order: {result.orderNo}</p>
                        <p className="text-xs text-muted-foreground">MO: {result.moNumber}</p>
                        <p className="text-xs text-muted-foreground">Batch: {result.batch}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{result.testValues}</p>
                        {result.hasPhoto && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <FileImage className="h-3 w-3" />
                            <span>Photo Available</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(result.result)}>
                        {result.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{result.supervisor}</p>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="text-xs text-muted-foreground truncate">
                        {result.notes}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {result.hasPhoto && (
                          <Button size="sm" variant="outline">
                            <FileImage className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
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

export default QCTestResultsTab;
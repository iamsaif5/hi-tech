import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { 
  Search, 
  Eye, 
  Edit, 
  FileText, 
  Calendar,
  Settings,
  Send
} from 'lucide-react';

interface ManufacturingOrder {
  id: string;
  moNumber: string;
  salesOrder: string;
  client: string;
  productSpec: string;
  quantity: string;
  loomingRequired: boolean;
  dueDate: string;
  status: 'in-draft' | 'scheduled' | 'on-hold' | 'in-production';
  wastePercentage?: number;
}

const ManufacturingOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  const mockMOs: ManufacturingOrder[] = [
    {
      id: '1',
      moNumber: 'MO-2025-001',
      salesOrder: 'ORD-0012',
      client: 'Lion Group',
      productSpec: '25kg Printed - White with handle',
      quantity: '5,000m',
      loomingRequired: true,
      dueDate: '2025-01-10',
      status: 'in-production',
      wastePercentage: 2.5
    },
    {
      id: '2',
      moNumber: 'MO-2025-002',
      salesOrder: 'ORD-0013',
      client: 'IWISA',
      productSpec: '10kg White Bags - Standard handle',
      quantity: '3,500m',
      loomingRequired: false,
      dueDate: '2025-01-12',
      status: 'scheduled',
      wastePercentage: 1.8
    },
    {
      id: '3',
      moNumber: 'MO-2025-003',
      salesOrder: 'ORD-0014',
      client: 'Custom Client',
      productSpec: '5kg No Print - Basic design',
      quantity: '2,000m',
      loomingRequired: true,
      dueDate: '2025-01-15',
      status: 'in-draft',
      wastePercentage: 3.2
    },
    {
      id: '4',
      moNumber: 'MO-2025-004',
      salesOrder: 'ORD-0011',
      client: 'MegaBag Corp',
      productSpec: 'Industrial 50kg - Heavy duty',
      quantity: '1,500m',
      loomingRequired: true,
      dueDate: '2025-01-07',
      status: 'in-production',
      wastePercentage: 1.2
    },
    {
      id: '5',
      moNumber: 'MO-2025-005',
      salesOrder: 'ORD-0015',
      client: 'Standard Co',
      productSpec: '25kg Standard - Blue print',
      quantity: '4,000m',
      loomingRequired: false,
      dueDate: '2025-01-18',
      status: 'on-hold',
      wastePercentage: 4.1
    }
  ];

  const filteredMOs = mockMOs.filter(mo => {
    const matchesSearch = searchTerm === '' || 
      mo.moNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.productSpec.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || mo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'in-draft': return { text: 'In Draft', color: 'bg-gray-500' };
      case 'scheduled': return { text: 'Scheduled', color: 'bg-blue-500' };
      case 'on-hold': return { text: 'On Hold', color: 'bg-red-500' };
      case 'in-production': return { text: 'In Production', color: 'bg-green-500' };
      default: return { text: 'Unknown', color: 'bg-gray-400' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by MO ID / Client / Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-draft">In Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="in-production">In Production</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Manufacturing Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>MO ID</TableHead>
                  <TableHead>SO ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Product & Spec</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Looming Required</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waste %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMOs.map((mo) => (
                  <TableRow key={mo.id}>
                    <TableCell>
                      <button className="font-medium text-sm text-primary hover:underline">
                        {mo.moNumber}
                      </button>
                    </TableCell>
                    <TableCell>
                      <button className="text-sm text-primary hover:underline">
                        {mo.salesOrder}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{mo.client}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm truncate max-w-48 block" title={mo.productSpec}>
                        {mo.productSpec}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{mo.quantity}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${mo.loomingRequired ? 'text-orange-600' : 'text-green-600'}`}>
                        {mo.loomingRequired ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{mo.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`px-3 py-1 rounded-md text-white text-sm font-medium ${getStatusDisplay(mo.status).color}`}>
                        {getStatusDisplay(mo.status).text}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {mo.wastePercentage ? `${mo.wastePercentage}%` : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="h-3 w-3" />
                        </Button>
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

export default ManufacturingOrders;
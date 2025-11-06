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
import { Search, Filter, Eye, Edit, AlertTriangle } from 'lucide-react';

interface JobOrder {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  quantity: number;
  unit: string;
  status: 'in-progress' | 'blocked' | 'waiting' | 'completed';
  stage: string;
  inventoryStatus: 'available' | 'low' | 'critical' | 'not-available';
  startDate: string;
  dueDate: string;
  progress: number;
  assignedOperator?: string;
  priority: 'high' | 'medium' | 'low';
}

const JobListView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const mockOrders: JobOrder[] = [
    {
      id: '1',
      orderId: 'ORD-0012',
      customer: 'IWISA',
      product: 'IWISA 25kg Printed',
      quantity: 5000,
      unit: 'm',
      status: 'in-progress',
      stage: 'Cutting',
      inventoryStatus: 'available',
      startDate: '2025-01-06',
      dueDate: '2025-01-10',
      progress: 65,
      assignedOperator: 'Sarah Wilson',
      priority: 'high'
    },
    {
      id: '2',
      orderId: 'ORD-0013',
      customer: 'Lion Group',
      product: 'Lion 10kg White',
      quantity: 3500,
      unit: 'm',
      status: 'blocked',
      stage: 'Printing',
      inventoryStatus: 'critical',
      startDate: '2025-01-05',
      dueDate: '2025-01-08',
      progress: 40,
      assignedOperator: 'Mike Johnson',
      priority: 'high'
    },
    {
      id: '3',
      orderId: 'ORD-0014',
      customer: 'Custom Client',
      product: 'Custom 5kg No Print',
      quantity: 2000,
      unit: 'm',
      status: 'waiting',
      stage: 'Planning',
      inventoryStatus: 'low',
      startDate: '2025-01-07',
      dueDate: '2025-01-12',
      progress: 0,
      priority: 'medium'
    },
    {
      id: '4',
      orderId: 'ORD-0011',
      customer: 'MegaBag Corp',
      product: 'MegaBag Industrial',
      quantity: 1500,
      unit: 'm',
      status: 'completed',
      stage: 'Complete',
      inventoryStatus: 'available',
      startDate: '2025-01-03',
      dueDate: '2025-01-07',
      progress: 100,
      assignedOperator: 'David Chen',
      priority: 'medium'
    },
    {
      id: '5',
      orderId: 'ORD-0015',
      customer: 'Standard Co',
      product: 'Standard 25kg',
      quantity: 4000,
      unit: 'm',
      status: 'in-progress',
      stage: 'QC',
      inventoryStatus: 'available',
      startDate: '2025-01-04',
      dueDate: '2025-01-09',
      progress: 85,
      assignedOperator: 'Anna Smith',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'waiting': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'not-available': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Job List View</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all manufacturing orders and their current status
            </p>
          </div>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Customer & Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.orderId}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getPriorityColor(order.priority)} text-xs`}>
                          {order.priority}
                        </Badge>
                        {order.status === 'blocked' && (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.product}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.quantity.toLocaleString()}{order.unit}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} text-xs capitalize`}>
                      {order.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{order.stage}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${getInventoryStatusColor(order.inventoryStatus)}`}>
                      {order.inventoryStatus.replace('-', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 w-20">
                      <div className="flex justify-between text-xs">
                        <span>{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <p>Start: {order.startDate}</p>
                      <p className={order.dueDate < new Date().toISOString().split('T')[0] ? 'text-red-600' : ''}>
                        Due: {order.dueDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {order.assignedOperator || 'Unassigned'}
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
                    </div>
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

export default JobListView;
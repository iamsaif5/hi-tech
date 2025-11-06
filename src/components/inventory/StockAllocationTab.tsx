
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, CheckCircle, AlertTriangle, Package } from 'lucide-react';

const StockAllocationTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const allocations = [
    {
      orderId: 'ORD-0012',
      product: 'IWISA 25kg Printed',
      quantity: 6000,
      allocated: 6000,
      remaining: 0,
      status: 'Fully Allocated'
    },
    {
      orderId: 'ORD-0014',
      product: 'Lion 10kg White',
      quantity: 3500,
      allocated: 2000,
      remaining: 1500,
      status: 'Partial'
    },
    {
      orderId: 'ORD-0015',
      product: 'Lion 25kg Printed',
      quantity: 2800,
      allocated: 2800,
      remaining: 0,
      status: 'Fully Allocated'
    },
    {
      orderId: 'ORD-0016',
      product: 'Custom 50kg Industrial',
      quantity: 500,
      allocated: 0,
      remaining: 500,
      status: 'Pending'
    },
    {
      orderId: 'ORD-0017',
      product: 'IWISA 25kg Printed',
      quantity: 4200,
      allocated: 3000,
      remaining: 1200,
      status: 'Partial'
    }
  ];

  const filteredAllocations = allocations.filter(allocation =>
    searchTerm === '' ||
    allocation.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Fully Allocated':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Partial':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Pending':
        return <Package className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fully Allocated':
        return 'bg-green-100 text-green-800';
      case 'Partial':
        return 'bg-orange-100 text-orange-800';
      case 'Pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const totalAllocations = allocations.length;
  const fullyAllocated = allocations.filter(a => a.status === 'Fully Allocated').length;
  const pendingAllocations = allocations.filter(a => a.status === 'Pending').length;
  const totalUnitsAllocated = allocations.reduce((sum, a) => sum + a.allocated, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Total orders</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{totalAllocations}</p>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Fully allocated</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{fullyAllocated}</p>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-medium text-gray-600">Pending</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{pendingAllocations}</p>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-600">Units allocated</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{totalUnitsAllocated.toLocaleString()}</p>
        </div>
      </div>

      {/* Stock Allocation Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stock Allocation</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Allocation %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllocations.map((allocation) => {
                const allocationPercentage = Math.round((allocation.allocated / allocation.quantity) * 100);
                
                return (
                  <TableRow key={allocation.orderId}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{allocation.orderId}</Badge>
                    </TableCell>
                    <TableCell>{allocation.product}</TableCell>
                    <TableCell>{allocation.quantity.toLocaleString()}</TableCell>
                    <TableCell>{allocation.allocated.toLocaleString()}</TableCell>
                    <TableCell>
                      {allocation.remaining > 0 ? (
                        <span className="text-orange-600 font-medium">
                          {allocation.remaining.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(allocation.status)}
                        <Badge className={getStatusColor(allocation.status)}>
                          {allocation.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              allocationPercentage === 100 ? 'bg-green-500' : 
                              allocationPercentage > 50 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${allocationPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{allocationPercentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAllocationTab;

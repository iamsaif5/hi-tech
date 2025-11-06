
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Factory, Users, Package, Calendar, FileText } from 'lucide-react';

interface CustomReportsTabProps {
  timeFilter: string;
}

export const CustomReportsTab: React.FC<CustomReportsTabProps> = ({ timeFilter }) => {
  const [selectedFactory, setSelectedFactory] = useState('all');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedOrderID, setSelectedOrderID] = useState('all');

  const [selectedColumns, setSelectedColumns] = useState({
    date: true,
    factory: true,
    operator: true,
    client: true,
    product: true,
    orderID: true,
    revenue: false,
    efficiency: false,
    defects: false
  });

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-gray-500" />
            <Select value={selectedFactory} onValueChange={setSelectedFactory}>
              <SelectTrigger className="w-full">
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
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operators</SelectItem>
                <SelectItem value="sarah">Sarah Brown</SelectItem>
                <SelectItem value="mike">Mike Davis</SelectItem>
                <SelectItem value="josh">Josh M.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="freedom">Freedom Foods</SelectItem>
                <SelectItem value="lion">Lion Group</SelectItem>
                <SelectItem value="umoya">Umoya Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="lion-10kg">Lion 10kg White</SelectItem>
                <SelectItem value="iwisa-25kg">IWISA 25kg</SelectItem>
                <SelectItem value="no-print-5kg">5kg No Print</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <Select value={selectedOrderID} onValueChange={setSelectedOrderID}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Order ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="ord-001">ORD-2024-001</SelectItem>
                <SelectItem value="ord-002">ORD-2024-002</SelectItem>
                <SelectItem value="ord-003">ORD-2024-003</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Column Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Columns</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(selectedColumns).map(([column, checked]) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={checked}
                onCheckedChange={() => handleColumnToggle(column)}
              />
              <label htmlFor={column} className="text-sm capitalize">
                {column.replace(/([A-Z])/g, ' $1').trim()}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Custom Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedColumns.date && <TableHead>Date</TableHead>}
                  {selectedColumns.factory && <TableHead>Factory</TableHead>}
                  {selectedColumns.operator && <TableHead>Operator</TableHead>}
                  {selectedColumns.client && <TableHead>Client</TableHead>}
                  {selectedColumns.product && <TableHead>Product</TableHead>}
                  {selectedColumns.orderID && <TableHead>Order ID</TableHead>}
                  {selectedColumns.revenue && <TableHead>Revenue</TableHead>}
                  {selectedColumns.efficiency && <TableHead>Efficiency</TableHead>}
                  {selectedColumns.defects && <TableHead>Defects</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    date: '2025-06-27',
                    factory: 'Main Factory',
                    operator: 'Sarah Brown',
                    client: 'Freedom Foods',
                    product: 'Lion 10kg White',
                    orderID: 'ORD-2024-001',
                    revenue: 185000,
                    efficiency: '92%',
                    defects: 3
                  },
                  {
                    date: '2025-06-26',
                    factory: 'Main Factory',
                    operator: 'Mike Davis',
                    client: 'Lion Group',
                    product: 'IWISA 25kg',
                    orderID: 'ORD-2024-002',
                    revenue: 220000,
                    efficiency: '89%',
                    defects: 5
                  },
                  {
                    date: '2025-06-25',
                    factory: 'Main Factory',
                    operator: 'Josh M.',
                    client: 'Umoya Group',
                    product: '5kg No Print',
                    orderID: 'ORD-2024-003',
                    revenue: 165000,
                    efficiency: '94%',
                    defects: 2
                  }
                ].map((item, index) => (
                  <TableRow key={index}>
                    {selectedColumns.date && <TableCell>{item.date}</TableCell>}
                    {selectedColumns.factory && <TableCell>{item.factory}</TableCell>}
                    {selectedColumns.operator && <TableCell>{item.operator}</TableCell>}
                    {selectedColumns.client && <TableCell>{item.client}</TableCell>}
                    {selectedColumns.product && <TableCell>{item.product}</TableCell>}
                    {selectedColumns.orderID && <TableCell>{item.orderID}</TableCell>}
                    {selectedColumns.revenue && <TableCell>R {item.revenue.toLocaleString()}</TableCell>}
                    {selectedColumns.efficiency && <TableCell>{item.efficiency}</TableCell>}
                    {selectedColumns.defects && <TableCell>{item.defects}</TableCell>}
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

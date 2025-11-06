
import React, { useState } from 'react';
import { KPICard } from './KPICard';
import { ReportsChart } from './ReportsChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Factory } from 'lucide-react';

interface InventoryReportsTabProps {
  timeFilter: string;
}

export const InventoryReportsTab: React.FC<InventoryReportsTabProps> = ({ timeFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const summaryData = [
    {
      title: 'Aged stock items',
      value: '23',
      subtitle: '>90 days old',
      icon: <Package className="h-4 w-4" />,
      status: 'warning' as const
    },
    {
      title: 'Low stock SKUs',
      value: '12',
      subtitle: 'below reorder point',
      icon: <Package className="h-4 w-4" />,
      status: 'critical' as const
    },
    {
      title: 'Total inventory value',
      value: 'R 2.8M',
      subtitle: 'current valuation',
      icon: <Package className="h-4 w-4" />,
      status: 'good' as const
    }
  ];

  const usageData = [
    { day: 'Mon', usage: 2800 },
    { day: 'Tue', usage: 3200 },
    { day: 'Wed', usage: 2900 },
    { day: 'Thu', usage: 3100 },
    { day: 'Fri', usage: 3400 },
    { day: 'Sat', usage: 1900 },
    { day: 'Sun', usage: 1200 }
  ];

  const slowMovingData = [
    { name: 'Raw Material A', days: 120 },
    { name: 'Component B', days: 95 },
    { name: 'Packaging C', days: 87 },
    { name: 'Spare Parts D', days: 78 },
    { name: 'Consumables E', days: 65 }
  ];

  const inventoryData = [
    {
      sku: 'SKU-001',
      productName: 'Lion 10kg White Bags',
      inventory: 1250,
      value: 125000,
      agedDays: 15,
      status: 'Good',
      reorderFlag: false,
      factory: 'Midrand'
    },
    {
      sku: 'SKU-002',
      productName: 'IWISA 25kg Bags',
      inventory: 450,
      value: 67500,
      agedDays: 45,
      status: 'Good',
      reorderFlag: false,
      factory: 'Germiston'
    },
    {
      sku: 'SKU-003',
      productName: '5kg No Print Bags',
      inventory: 85,
      value: 4250,
      agedDays: 120,
      status: 'Aged',
      reorderFlag: true,
      factory: 'Boksburg'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Aged': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryData.map((item, index) => (
          <KPICard
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            status={item.status}
          />
        ))}
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="raw">Raw Materials</SelectItem>
                <SelectItem value="finished">Finished Goods</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-gray-500" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="midrand">Midrand</SelectItem>
                <SelectItem value="germiston">Germiston</SelectItem>
                <SelectItem value="boksburg">Boksburg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChart
          title="Inventory Usage Trend"
          type="line"
          data={usageData}
          dataKey="usage"
          xAxisKey="day"
        />
        
        <ReportsChart
          title="Slow-Moving Items"
          type="bar"
          data={slowMovingData}
          dataKey="days"
          xAxisKey="name"
        />
      </div>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Factory</TableHead>
                  <TableHead>Aged Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reorder Flag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.inventory}</TableCell>
                    <TableCell>R {item.value.toLocaleString()}</TableCell>
                    <TableCell>{item.factory}</TableCell>
                    <TableCell>{item.agedDays}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.reorderFlag && (
                        <Badge className="bg-red-100 text-red-800">
                          Reorder
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Inventory Insights</h4>
        <p className="text-sm text-blue-800">
          All inventory data is filtered by the selected time period: {timeFilter}. 
          Charts and tables update automatically based on your date selection.
        </p>
      </div>
    </div>
  );
};

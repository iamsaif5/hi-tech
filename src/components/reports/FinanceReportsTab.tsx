
import React, { useState } from 'react';
import { KPICard } from './KPICard';
import { ReportsChart } from './ReportsChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText } from 'lucide-react';

interface FinanceReportsTabProps {
  timeFilter: string;
}

export const FinanceReportsTab: React.FC<FinanceReportsTabProps> = ({ timeFilter }) => {
  const [selectedClient, setSelectedClient] = useState('all');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total revenue this week"
          value="R 2,450,000"
          subtitle="+12% vs last week"
          icon={<FileText className="h-5 w-5" />}
          status="good"
        />
        <KPICard
          title="Cost of goods sold (COGS)"
          value="R 1,680,000"
          subtitle="68.6% of revenue"
          icon={<FileText className="h-5 w-5" />}
          status="neutral"
        />
        <KPICard
          title="Profit margin %"
          value="31.4%"
          subtitle="+2.1% vs last week"
          icon={<FileText className="h-5 w-5" />}
          status="good"
        />
        <KPICard
          title="Invoices overdue"
          value="8"
          subtitle="R 340,000 total"
          icon={<FileText className="h-5 w-5" />}
          status="warning"
        />
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-40">
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
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChart
          title="Revenue vs Expenses Trend"
          type="line"
          data={[
            { day: 'Mon', revenue: 320000, expenses: 220000 },
            { day: 'Tue', revenue: 380000, expenses: 260000 },
            { day: 'Wed', revenue: 290000, expenses: 200000 },
            { day: 'Thu', revenue: 420000, expenses: 290000 },
            { day: 'Fri', revenue: 450000, expenses: 310000 },
            { day: 'Sat', revenue: 360000, expenses: 250000 },
            { day: 'Sun', revenue: 230000, expenses: 150000 }
          ]}
          dataKey="revenue"
          xAxisKey="day"
        />
        
        <ReportsChart
          title="Most Profitable Clients"
          type="bar"
          data={[
            { name: 'Freedom Foods', profit: 450000 },
            { name: 'Lion Group', profit: 380000 },
            { name: 'Umoya Group', profit: 320000 },
            { name: 'Premier Foods', profit: 280000 },
            { name: 'Clover Industries', profit: 240000 }
          ]}
          dataKey="profit"
          xAxisKey="name"
        />
      </div>

      {/* Finance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Margin %</TableHead>
                  <TableHead>Invoice Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    orderID: 'ORD-2024-001',
                    client: 'Freedom Foods',
                    revenue: 185000,
                    cost: 125000,
                    margin: '32.4%',
                    invoiceStatus: 'Paid',
                    paymentDate: '2025-06-25'
                  },
                  {
                    orderID: 'ORD-2024-002',
                    client: 'Lion Group',
                    revenue: 220000,
                    cost: 150000,
                    margin: '31.8%',
                    invoiceStatus: 'Overdue',
                    paymentDate: 'Pending'
                  },
                  {
                    orderID: 'ORD-2024-003',
                    client: 'Umoya Group',
                    revenue: 165000,
                    cost: 110000,
                    margin: '33.3%',
                    invoiceStatus: 'Paid',
                    paymentDate: '2025-06-24'
                  }
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.orderID}</TableCell>
                    <TableCell>{item.client}</TableCell>
                    <TableCell>R {item.revenue.toLocaleString()}</TableCell>
                    <TableCell>R {item.cost.toLocaleString()}</TableCell>
                    <TableCell>{item.margin}</TableCell>
                    <TableCell>
                      <Badge className={item.invoiceStatus === 'Paid' ? 'bg-green-100 text-green-800' : item.invoiceStatus === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {item.invoiceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.paymentDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Finance Visibility</h4>
        <p className="text-sm text-blue-800">
          All financial data is filtered by the selected time period: {timeFilter}. 
          Charts and tables update automatically based on your date selection.
        </p>
      </div>
    </div>
  );
};

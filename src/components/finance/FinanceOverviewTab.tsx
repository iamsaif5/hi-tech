
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportsChart } from '../reports/ReportsChart';
import { KPICard } from '../reports/KPICard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, FileText, AlertCircle, CheckCircle, PieChart } from 'lucide-react';

export const FinanceOverviewTab = () => {
  const invoiceTrendsData = [
    { name: 'Mon', invoiced: 45000, paid: 38000 },
    { name: 'Tue', invoiced: 52000, paid: 45000 },
    { name: 'Wed', invoiced: 38000, paid: 35000 },
    { name: 'Thu', invoiced: 61000, paid: 52000 },
    { name: 'Fri', invoiced: 58000, paid: 48000 },
    { name: 'Sat', invoiced: 42000, paid: 39000 },
    { name: 'Sun', invoiced: 35000, paid: 32000 }
  ];

  const expenseCategoriesData = [
    { name: 'Staff', value: 45, fill: '#3b82f6' },
    { name: 'Inventory', value: 30, fill: '#8b5cf6' },
    { name: 'Repairs', value: 15, fill: '#f59e0b' },
    { name: 'Freight', value: 10, fill: '#6b7280' }
  ];

  const profitMarginData = [
    { name: 'Week 1', margin: 28.5 },
    { name: 'Week 2', margin: 31.2 },
    { name: 'Week 3', margin: 29.8 },
    { name: 'Week 4', margin: 32.1 }
  ];

  const invoiceStatusData = [
    {
      invoiceId: 'INV-2024-001',
      client: 'Freedom Foods',
      amount: 185000,
      status: 'Paid',
      dueDate: '2025-06-30',
      daysPending: 0
    },
    {
      invoiceId: 'INV-2024-002',
      client: 'Lion Group',
      amount: 220000,
      status: 'Overdue',
      dueDate: '2025-06-25',
      daysPending: 5
    },
    {
      invoiceId: 'INV-2024-003',
      client: 'Umoya Group',
      amount: 165000,
      status: 'Pending',
      dueDate: '2025-07-05',
      daysPending: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Revenue"
          value="R 1.2M"
          subtitle="+12.5% from last month"
          icon={<TrendingUp className="h-4 w-4" />}
          status="good"
        />
        <KPICard
          title="Outstanding Invoices"
          value="R 89,500"
          subtitle="3 invoices overdue"
          icon={<AlertCircle className="h-4 w-4" />}
          status="warning"
        />
        <KPICard
          title="Profit Margin"
          value="31.4%"
          subtitle="+2.1% vs last period"
          icon={<PieChart className="h-4 w-4" />}
          status="good"
        />
        <KPICard
          title="Collection Rate"
          value="94.2%"
          subtitle="Within 30 days"
          icon={<CheckCircle className="h-4 w-4" />}
          status="good"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportsChart
          title="Invoice Trends (Invoiced vs Paid)"
          type="line"
          data={invoiceTrendsData}
          dataKey="invoiced"
          xAxisKey="name"
        />
        
        <ReportsChart
          title="Expense Categories"
          type="pie"
          data={expenseCategoriesData}
          dataKey="value"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportsChart
          title="Profit Margin Trend"
          type="bar"
          data={profitMarginData}
          dataKey="margin"
          xAxisKey="name"
        />

        {/* Paid vs Unpaid Status Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Invoice Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Invoice ID</TableHead>
                  <TableHead className="text-xs">Client</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceStatusData.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm font-medium">{invoice.invoiceId}</TableCell>
                    <TableCell className="text-sm">{invoice.client}</TableCell>
                    <TableCell className="text-sm">R {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Calendar } from 'lucide-react';

export const ProfitCashFlowTab: React.FC = () => {
  const [selectedFactory, setSelectedFactory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const profitSummaryData = [
    {
      period: 'This week',
      revenue: 850000,
      cogs: 620000,
      grossProfit: 230000,
      grossMargin: '27.1%',
      netProfit: 185000
    },
    {
      period: 'Last week',
      revenue: 780000,
      cogs: 580000,
      grossProfit: 200000,
      grossMargin: '25.6%',
      netProfit: 165000
    },
    {
      period: 'This month',
      revenue: 3450000,
      cogs: 2520000,
      grossProfit: 930000,
      grossMargin: '27.0%',
      netProfit: 770000
    },
    {
      period: 'Last month',
      revenue: 3100000,
      cogs: 2350000,
      grossProfit: 750000,
      grossMargin: '24.2%',
      netProfit: 650000
    },
    {
      period: 'This quarter',
      revenue: 9850000,
      cogs: 7200000,
      grossProfit: 2650000,
      grossMargin: '26.9%',
      netProfit: 2200000
    }
  ];

  const cashFlowData = [
    { week: 'Week 1', inflow: 820000, outflow: 650000, net: 170000 },
    { week: 'Week 2', inflow: 750000, outflow: 680000, net: 70000 },
    { week: 'Week 3', inflow: 920000, outflow: 720000, net: 200000 },
    { week: 'Week 4', inflow: 850000, outflow: 695000, net: 155000 },
    { week: 'Week 5', inflow: 780000, outflow: 640000, net: 140000 },
    { week: 'Week 6', inflow: 880000, outflow: 705000, net: 175000 }
  ];

  const payrollTrendData = [
    { week: 'Week 1', payroll: 95000 },
    { week: 'Week 2', payroll: 88000 },
    { week: 'Week 3', payroll: 92000 },
    { week: 'Week 4', payroll: 85000 },
    { week: 'Week 5', payroll: 90000 },
    { week: 'Week 6', payroll: 87000 }
  ];

  const cogsBreakdown = [
    { category: 'Raw materials', amount: 1580000, percentage: '62.7%' },
    { category: 'Direct labour', amount: 520000, percentage: '20.6%' },
    { category: 'Machine operation', amount: 280000, percentage: '11.1%' },
    { category: 'Packaging', amount: 140000, percentage: '5.6%' }
  ];

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Factory:</span>
              <Select value={selectedFactory} onValueChange={setSelectedFactory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Factory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All factories</SelectItem>
                  <SelectItem value="main">Main factory</SelectItem>
                  <SelectItem value="secondary">Secondary factory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Department:</span>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="quality">Quality control</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">This month</SelectItem>
                  <SelectItem value="90d">Last month</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Xero CSV
          </Button>
        </div>
      </Card>

      {/* Profit Summary Table */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit summary</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>COGS</TableHead>
                  <TableHead>Gross profit</TableHead>
                  <TableHead>Gross margin %</TableHead>
                  <TableHead>Net profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitSummaryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.period}</TableCell>
                    <TableCell>R {item.revenue.toLocaleString()}</TableCell>
                    <TableCell>R {item.cogs.toLocaleString()}</TableCell>
                    <TableCell>R {item.grossProfit.toLocaleString()}</TableCell>
                    <TableCell>{item.grossMargin}</TableCell>
                    <TableCell className="font-medium">R {item.netProfit.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash flow forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `R ${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="inflow" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll trendline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={payrollTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `R ${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="payroll" stroke="#ea580c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* COGS Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">COGS summary (this month)</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Percentage of COGS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cogsBreakdown.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>R {item.amount.toLocaleString()}</TableCell>
                    <TableCell>{item.percentage}</TableCell>
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

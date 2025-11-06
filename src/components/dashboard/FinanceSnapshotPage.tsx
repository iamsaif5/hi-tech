import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  FileText, 
  Clock,
  CreditCard,
  Target,
  BarChart3,
  Download,
  Plus,
  Receipt
} from 'lucide-react';

const FinanceSnapshotPage = () => {
  const [periodFilter, setPeriodFilter] = useState<'today' | 'wtd' | 'mtd'>('today');

  // Mock data for KPIs
  const kpiData = {
    today: {
      invoicesPaid: { amount: 45200, count: 8, change: '+12%' },
      outstandingInvoices: { amount: 67500, count: 12, isHigh: true },
      cashOnHand: { amount: 245000, change: '+5.2%' },
      monthlyRevenue: { amount: 875000, target: 950000, percentage: 92 },
      activeOrdersValue: { amount: 1250000 },
      creditLimitUsage: { percentage: 68 },
      receivables30d: { amount: 42000 },
      grossMarginYTD: { percentage: 24.5 }
    }
  };

  const currentData = kpiData.today;

  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  // Mock financial insights
  const financialInsights = [
    { id: 1, message: "Outstanding invoice payment overdue by 15 days - Tiger Brands R18,500", severity: "warning" },
    { id: 2, message: "Cash flow forecast: positive R45k this week based on pending invoices", severity: "info" },
    { id: 3, message: "Credit limit usage at 68% - consider reviewing customer credit terms", severity: "warning" },
    { id: 4, message: "Gross margin improved 2.1% vs last month - packaging efficiency gains", severity: "info" },
    { id: 5, message: "3 invoices due for payment today totaling R22,400", severity: "info" },
    { id: 6, message: "Receivables >30 days increased by R8,200 this week", severity: "warning" }
  ];

  // Mock top customers YTD
  const topCustomers = [
    { name: "Lion Group", revenue: 875000, margin: 24.5 },
    { name: "Tiger Brands", revenue: 623000, margin: 22.1 },
    { name: "Freedom Foods", revenue: 445000, margin: 26.3 },
    { name: "Pioneer Foods", revenue: 387000, margin: 21.8 },
    { name: "Rainbow Chicken", revenue: 298000, margin: 25.2 }
  ];

  // Mock aged receivables data
  const agedReceivables = [
    { period: "0-30 days", amount: 125000, percentage: 45 },
    { period: "31-60 days", amount: 87500, percentage: 32 },
    { period: "61-90 days", amount: 42000, percentage: 15 },
    { period: "90+ days", amount: 22500, percentage: 8 }
  ];

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'border-l-amber-500 bg-amber-50/50';
      case 'error': return 'border-l-red-500 bg-red-50/50';
      default: return 'border-l-blue-500 bg-blue-50/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with period toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Live financial data – updated {new Date().toLocaleTimeString()}
        </div>
        
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {[
            { key: 'today', label: 'Today' },
            { key: 'wtd', label: 'Week-to-date' },
            { key: 'mtd', label: 'Month-to-date' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setPeriodFilter(period.key as any)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                periodFilter === period.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div className="text-xs text-muted-foreground">Invoices paid</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(currentData.invoicesPaid.amount)}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{currentData.invoicesPaid.count} invoices</div>
              <div className={`text-xs ${getChangeColor(currentData.invoicesPaid.change)}`}>
                {currentData.invoicesPaid.change}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <div className="text-xs text-muted-foreground">Outstanding invoices</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(currentData.outstandingInvoices.amount)}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{currentData.outstandingInvoices.count} invoices</div>
              {currentData.outstandingInvoices.isHigh && (
                <div className="text-xs text-red-600">Above R50k</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div className="text-xs text-muted-foreground">Cash on hand</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(currentData.cashOnHand.amount)}</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <div className="text-xs text-green-600">{currentData.cashOnHand.change} (7d)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <div className="text-xs text-muted-foreground">Monthly revenue</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(currentData.monthlyRevenue.amount)}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{currentData.monthlyRevenue.percentage}% of target</div>
              <div className="text-xs text-blue-600">R {(currentData.monthlyRevenue.target - currentData.monthlyRevenue.amount).toLocaleString()} to go</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <div className="text-xs text-muted-foreground">Active orders value</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(currentData.activeOrdersValue.amount)}</div>
            <div className="text-xs text-muted-foreground">In production pipeline</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-orange-600" />
              <div className="text-xs text-muted-foreground">Credit-limit usage</div>
            </div>
            <div className="text-lg font-semibold">{currentData.creditLimitUsage.percentage}%</div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted mt-2">
              <div 
                className="h-full transition-all bg-orange-500" 
                style={{ width: `${currentData.creditLimitUsage.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <div className="text-xs text-muted-foreground">Receivables &gt;30d</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(currentData.receivables30d.amount)}</div>
            <div className="text-xs text-amber-600">Needs attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div className="text-xs text-muted-foreground">Gross margin YTD</div>
            </div>
            <div className="text-lg font-semibold">{currentData.grossMarginYTD.percentage}%</div>
            <div className="text-xs text-green-600">Above target</div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash-flow chart */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cash Flow (30 days)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <div>Cash flow chart will be rendered here</div>
                  <div className="text-xs mt-1">Blue line, auto-scaling</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-1">Revenue vs Target</div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full transition-all bg-green-500" 
                    style={{ width: `${currentData.monthlyRevenue.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatCurrency(currentData.monthlyRevenue.amount)}</span>
                  <span>{formatCurrency(currentData.monthlyRevenue.target)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial AI Insights */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Financial AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {financialInsights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className={`border-l-2 pl-3 p-2 rounded-r-lg ${getInsightColor(insight.severity)}`}
                  >
                    <div className="text-xs">{insight.message}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aged receivables */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Aged Receivables</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {agedReceivables.map((item, index) => {
                  const getProgressColor = (percentage: number) => {
                    if (percentage <= 25) return 'bg-green-500';
                    if (percentage <= 50) return 'bg-yellow-500';
                    return 'bg-orange-500';
                  };
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">{item.period}</div>
                        <div className="relative h-2 w-20 overflow-hidden rounded-full bg-muted">
                          <div 
                            className={`h-full transition-all ${getProgressColor(item.percentage)}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{formatCurrency(item.amount)}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Create Invoice
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                  <Receipt className="w-4 h-4" />
                  Record Payment
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default FinanceSnapshotPage;
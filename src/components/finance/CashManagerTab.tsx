import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Download, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  CheckCircle,
  FileText,
  Plus
} from 'lucide-react';

export const CashManagerTab: React.FC = () => {
  const [sevenDayOpen, setSevenDayOpen] = useState(true);
  const [thirtyDayOpen, setThirtyDayOpen] = useState(false);

  // Mock 7-day cash flow data
  const sevenDayFlows = [
    {
      date: '2025-07-11',
      day: 'Today',
      inflows: [
        { description: 'INV-2025-001 - Lion Group payment expected', amount: 245000, confirmed: false },
        { description: 'INV-2024-089 - Freedom Foods payment', amount: 125000, confirmed: true }
      ],
      outflows: [
        { description: 'BATCH-20250711-001 - Supplier payments', amount: 85000, confirmed: true },
        { description: 'Payroll - Week ending 12 Jul', amount: 92000, confirmed: true }
      ]
    },
    {
      date: '2025-07-12',
      day: 'Tomorrow',
      inflows: [
        { description: 'INV-2025-003 - Umoya Group payment expected', amount: 167000, confirmed: false }
      ],
      outflows: [
        { description: 'Rent payment - Factory lease', amount: 45000, confirmed: true }
      ]
    },
    {
      date: '2025-07-13',
      day: 'Sunday',
      inflows: [],
      outflows: []
    },
    {
      date: '2025-07-14',
      day: 'Monday',
      inflows: [
        { description: 'INV-2025-002 - Premier Foods payment', amount: 142000, confirmed: false }
      ],
      outflows: [
        { description: 'Insurance premium - Monthly', amount: 15000, confirmed: true }
      ]
    },
    {
      date: '2025-07-15',
      day: 'Tuesday',
      inflows: [],
      outflows: [
        { description: 'BATCH-20250715-001 - Utilities payment', amount: 28000, confirmed: false }
      ]
    },
    {
      date: '2025-07-16',
      day: 'Wednesday',
      inflows: [
        { description: 'INV-2024-095 - Lion Group payment', amount: 89000, confirmed: true }
      ],
      outflows: []
    },
    {
      date: '2025-07-17',
      day: 'Thursday',
      inflows: [],
      outflows: [
        { description: 'Raw materials - IWISA payment due', amount: 51750, confirmed: false }
      ]
    }
  ];

  // Calculate running balance
  let runningBalance = 450000; // Starting balance
  const scheduleWithBalance = sevenDayFlows.map(day => {
    const dayInflows = day.inflows.reduce((sum, flow) => sum + flow.amount, 0);
    const dayOutflows = day.outflows.reduce((sum, flow) => sum + flow.amount, 0);
    const netFlow = dayInflows - dayOutflows;
    runningBalance += netFlow;
    
    return {
      ...day,
      dayInflows,
      dayOutflows,
      netFlow,
      runningBalance
    };
  });

  // Calculate totals for KPIs
  const totalInflows = scheduleWithBalance.reduce((sum, day) => sum + day.dayInflows, 0);
  const totalOutflows = scheduleWithBalance.reduce((sum, day) => sum + day.dayOutflows, 0);
  const endingBalance = scheduleWithBalance[scheduleWithBalance.length - 1]?.runningBalance || 450000;

  // Mock 30-day summary
  const thirtyDaySummary = {
    totalInflows: 2450000,
    totalOutflows: 2100000,
    netPosition: 350000,
    confirmedInflows: 1850000,
    confirmedOutflows: 1750000,
    endingBalance: 800000
  };

  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;
  
  // Calculate summary KPIs
  const kpiData = [
    {
      title: "Current Balance",
      value: formatCurrency(endingBalance),
      icon: DollarSign,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      subtext: "Available funds"
    },
    {
      title: "Weekly Inflow",
      value: formatCurrency(totalInflows),
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      subtext: "Expected receipts"
    },
    {
      title: "Weekly Outflow",
      value: formatCurrency(totalOutflows),
      icon: TrendingDown,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      subtext: "Planned payments"
    },
    {
      title: "Net Position",
      value: formatCurrency(Math.abs(totalInflows - totalOutflows)),
      icon: Activity,
      bgColor: totalInflows - totalOutflows >= 0 ? "bg-green-100" : "bg-red-100",
      iconColor: totalInflows - totalOutflows >= 0 ? "text-green-600" : "text-red-600",
      subtext: totalInflows - totalOutflows >= 0 ? "Positive flow" : "Negative flow"
    }
  ];

  const getBalanceColor = (balance: number) => {
    if (balance < 100000) return 'text-red-600';
    if (balance < 200000) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getFlowTypeColor = (type: 'inflow' | 'outflow') => {
    return type === 'inflow' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-4">
        {/* KPI Summary Cards - Dashboard Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
                  <div className="text-xs text-muted-foreground">{kpi.title}</div>
                </div>
                <div className="text-lg font-semibold">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.subtext}</div>
              </CardContent>
            </Card>
          ))}
        </div>

      {/* Cash Flow Management Header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Cash Flow Management</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" className="h-10">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Batch as Paid
          </Button>
          <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Entry
          </Button>
        </div>
      </div>

      {/* 7-Day Cash Flow Schedule */}
      <Collapsible open={sevenDayOpen} onOpenChange={setSevenDayOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {sevenDayOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Next 7 Days Cash Flow Schedule
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Current balance: <span className={getBalanceColor(450000)}>R 450,000</span>
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-accent">
                    <tr>
                      <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Date</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Inflows</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Outflows</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Net Flow</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleWithBalance.map((day) => (
                      <tr key={day.date} className="border-b border-border hover:bg-muted/30">
                        <td className="py-2 px-3 text-xs text-foreground">
                          <div>
                            <div className="font-medium">{day.day}</div>
                            <div className="text-xs text-muted-foreground">{day.date}</div>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground">
                          <div className="space-y-1">
                            {day.inflows.map((flow, index) => (
                              <div key={index} className="text-sm">
                                <div className={`font-medium ${getFlowTypeColor('inflow')}`}>
                                  +{formatCurrency(flow.amount)}
                                </div>
                                <div className="text-xs text-muted-foreground max-w-xs truncate">
                                  {flow.description}
                                  {!flow.confirmed && (
                                    <Badge variant="outline" className="ml-1 text-xs">Expected</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                            {day.inflows.length === 0 && (
                              <div className="text-sm text-muted-foreground">No inflows</div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground">
                          <div className="space-y-1">
                            {day.outflows.map((flow, index) => (
                              <div key={index} className="text-sm">
                                <div className={`font-medium ${getFlowTypeColor('outflow')}`}>
                                  -{formatCurrency(flow.amount)}
                                </div>
                                <div className="text-xs text-muted-foreground max-w-xs truncate">
                                  {flow.description}
                                  {!flow.confirmed && (
                                    <Badge variant="outline" className="ml-1 text-xs">Pending</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                            {day.outflows.length === 0 && (
                              <div className="text-sm text-muted-foreground">No outflows</div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground">
                          <div className={`font-medium ${day.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {day.netFlow >= 0 ? '+' : ''}{formatCurrency(day.netFlow)}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground">
                          <div className={`font-medium ${getBalanceColor(day.runningBalance)}`}>
                            {formatCurrency(day.runningBalance)}
                            {day.runningBalance < 100000 && (
                              <AlertTriangle className="inline h-4 w-4 ml-1" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 30-Day Summary */}
      <Collapsible open={thirtyDayOpen} onOpenChange={setThirtyDayOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {thirtyDayOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Next 30 Days Summary
                </CardTitle>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Expected Inflows</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(thirtyDaySummary.totalInflows)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confirmed: {formatCurrency(thirtyDaySummary.confirmedInflows)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Expected Outflows</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(thirtyDaySummary.totalOutflows)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confirmed: {formatCurrency(thirtyDaySummary.confirmedOutflows)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Net Position (30 days)</div>
                  <div className={`text-2xl font-bold ${getBalanceColor(thirtyDaySummary.netPosition)}`}>
                    +{formatCurrency(thirtyDaySummary.netPosition)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ending balance: {formatCurrency(thirtyDaySummary.endingBalance)}
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
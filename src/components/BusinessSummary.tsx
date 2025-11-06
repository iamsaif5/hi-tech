import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Clock, 
  Users,
  BarChart3,
  Activity,
  Zap,
  Factory,
  Layers
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useManufacturingOrders } from '@/hooks/useManufacturingOrders';
import KpiMiniCharts from './charts/KpiMiniCharts';

interface BusinessSummaryProps {
  lastUpdated: Date;
}

const BusinessSummary = ({ lastUpdated }: BusinessSummaryProps) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'yesterday' | 'week'>('today');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { orders } = useOrders();
  const { manufacturingOrders } = useManufacturingOrders();

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for KPIs (in real app, this would come from APIs)
  const mockKPIs = {
    salesBooked: { value: 127500, change: '+12%' },
    grossMargin: { value: 23.8, change: '+2.1%' },
    cashIn: { value: 45200, change: '+5%' },
    ordersAwaitingMO: orders.filter(o => o.status === 'Confirmed' && !manufacturingOrders.some(mo => mo.order_id === o.id)).length,
    invoicesOverdue: { count: 3, value: 18750 },
    highRiskOrders: manufacturingOrders.filter(mo => new Date(mo.due_date) < new Date() && mo.status !== 'Completed').length
  };

  // Mock AI summary data
  const aiSummary = [
    { id: 1, message: "MO-2025-012 finished Tubing; Cutting starts 09:00.", time: "08:45", severity: "info" },
    { id: 2, message: "QC: 2 failed tape tests on IWISA 25 kg Printed – recheck.", time: "08:30", severity: "warning" },
    { id: 3, message: "Waste 4.1% (▲ 1.1% vs tgt). Cause: print mis-alignment Line B.", time: "08:15", severity: "warning" },
    { id: 4, message: "Machine \"Extruder A1\" vibration flagged (severity Low).", time: "08:00", severity: "info" }
  ];

  // Mock top customers data
  const topCustomers = [
    { name: "Lion Group", value: 875000, margin: 24.5 },
    { name: "Tiger Brands", value: 623000, margin: 22.1 },
    { name: "Freedom Foods", value: 445000, margin: 26.3 },
    { name: "Pioneer Foods", value: 387000, margin: 21.8 },
    { name: "Rainbow Chicken", value: 298000, margin: 25.2 }
  ];

  // Factory Pulse data
  const factoryPulse = {
    mosInProduction: manufacturingOrders.filter(mo => mo.status === 'In Production').length,
    mosScheduled: manufacturingOrders.filter(mo => mo.status === 'Scheduled').length,
    mosOnHold: manufacturingOrders.filter(mo => mo.status === 'On Hold').length,
    machineUptime: 92, // Mock value - rolling 8h
    shiftWaste: { value: 4.1, change: 1.1, target: 3.0 },
    qcFails: 3, // Mock value - today
    unplannedDowntime: [
      { machine: "Extruder A1", severity: "medium" },
      { machine: "Loom 57", severity: "low" }
    ]
  };

  // Mock action items
  const actionItems = [
    { type: "QC issues awaiting sign-off", count: 2 },
    { type: "Delivery bookings today", count: 5 },
    { type: "Overdue invoices", count: 3 },
    { type: "Machine maintenance due", count: 1 }
  ];

  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;

  const getStatusColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'text-amber-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getRiskColor = (count: number) => {
    if (count === 0) return 'text-green-600';
    if (count <= 2) return 'text-amber-600';
    return 'text-red-600';
  };

  const getPillColor = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return 'bg-green-500 text-white';
    if (value >= threshold.warning) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-amber-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with filters and timestamp */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Live data – updated {currentTime.toLocaleTimeString()}
        </div>
        
        <div className="flex gap-2">
          {['today', 'yesterday', 'week'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as any)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                timeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter === 'week' ? 'Week-to-Date' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPI strip (6 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div className="text-xs text-muted-foreground">Sales booked today</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(mockKPIs.salesBooked.value)}</div>
            <div className="text-xs text-green-600">{mockKPIs.salesBooked.change}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div className="text-xs text-muted-foreground">Gross margin %</div>
            </div>
            <div className="text-lg font-semibold">{mockKPIs.grossMargin.value}%</div>
            <div className="text-xs text-green-600">{mockKPIs.grossMargin.change}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <div className="text-xs text-muted-foreground">Cash-in today</div>
            </div>
            <div className="text-lg font-semibold">{formatCurrency(mockKPIs.cashIn.value)}</div>
            <div className="text-xs text-green-600">{mockKPIs.cashIn.change}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <div className="text-xs text-muted-foreground">Orders awaiting MO</div>
            </div>
            <div className="text-lg font-semibold">{mockKPIs.ordersAwaitingMO}</div>
            <div className="text-xs text-muted-foreground">Need processing</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-red-600" />
              <div className="text-xs text-muted-foreground">Invoices overdue</div>
            </div>
            <div className="text-lg font-semibold">{mockKPIs.invoicesOverdue.count}</div>
            <div className="text-xs text-red-600">{formatCurrency(mockKPIs.invoicesOverdue.value)}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${getRiskColor(mockKPIs.highRiskOrders)}`} />
              <div className="text-xs text-muted-foreground">High-risk orders</div>
            </div>
            <div className="text-lg font-semibold">{mockKPIs.highRiskOrders}</div>
            <div className={`text-xs ${getRiskColor(mockKPIs.highRiskOrders)}`}>
              {mockKPIs.highRiskOrders === 0 ? 'All on track' : 'Past due date'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 - Daily AI Summary + Factory Pulse */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily AI Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily AI Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {aiSummary.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(item.severity)}`} />
                  <div className="flex-1">
                    <div className="text-sm">{item.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Factory Pulse */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Factory className="w-4 h-4" />
              Factory Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* MO Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">MO Status</span>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                    {factoryPulse.mosInProduction} Prod
                  </Badge>
                  <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                    {factoryPulse.mosScheduled} Sched
                  </Badge>
                  <Badge className="bg-amber-500 text-white text-xs px-2 py-1">
                    {factoryPulse.mosOnHold} Hold
                  </Badge>
                </div>
              </div>

              {/* Machine Uptime */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Machine Uptime (8h)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{factoryPulse.machineUptime}%</span>
                  <Badge className={getPillColor(factoryPulse.machineUptime, { good: 90, warning: 80 })}>
                    {factoryPulse.machineUptime >= 90 ? 'Good' : factoryPulse.machineUptime >= 80 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </div>

              {/* Shift Waste */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Shift Waste %</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{factoryPulse.shiftWaste.value}%</span>
                  <Badge className={getPillColor(factoryPulse.shiftWaste.target - factoryPulse.shiftWaste.value, { good: 0, warning: -0.5 })}>
                    ▲ {factoryPulse.shiftWaste.change} ppt
                  </Badge>
                </div>
              </div>

              {/* QC Fails */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">QC Fails Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{factoryPulse.qcFails} bags</span>
                  <Badge className={getPillColor(-factoryPulse.qcFails, { good: 0, warning: -2 })}>
                    {factoryPulse.qcFails === 0 ? 'None' : factoryPulse.qcFails <= 2 ? 'Low' : 'High'}
                  </Badge>
                </div>
              </div>

              {/* Unplanned Downtime */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Unplanned Downtime</span>
                </div>
                <div className="space-y-1">
                  {factoryPulse.unplannedDowntime.map((event, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span>{event.machine}</span>
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity)}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 - KPI Mini Charts */}
      <KpiMiniCharts 
        revenueData={[]}
        cashData={[]}
        wasteData={[]}
        featureFlags={{ kpiMiniChartsV2: true }}
      />

      {/* Row 4 - Tables (split 50/50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 customers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top 5 Customers by Value (YTD)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.margin}% GP</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatCurrency(customer.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open action items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Action Items</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {actionItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm">{item.type}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessSummary;
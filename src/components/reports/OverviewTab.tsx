
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportsChart } from './ReportsChart';
import { KPICard } from './KPICard';
import { SummaryCard } from './SummaryCard';
import { WeeklyAISummary } from './WeeklyAISummary';
import { AlertTriangle, TrendingUp, Package, DollarSign } from 'lucide-react';

interface OverviewTabProps {
  timeFilter: string;
}

export const OverviewTab = ({ timeFilter }: OverviewTabProps) => {
  // Mock data for the new charts
  const extruderWasteData = [
    { name: 'Mon', waste: 3.2 },
    { name: 'Tue', waste: 2.8 },
    { name: 'Wed', waste: 4.1 },
    { name: 'Thu', waste: 3.5 },
    { name: 'Fri', waste: 2.9 },
    { name: 'Sat', waste: 3.8 },
    { name: 'Sun', waste: 3.1 }
  ];

  const loomageEfficiencyData = [
    { name: 'Mon', loomage: 12500, efficiency: 87 },
    { name: 'Tue', loomage: 13200, efficiency: 91 },
    { name: 'Wed', loomage: 11800, efficiency: 83 },
    { name: 'Thu', loomage: 14100, efficiency: 94 },
    { name: 'Fri', loomage: 13800, efficiency: 92 },
    { name: 'Sat', loomage: 12900, efficiency: 88 },
    { name: 'Sun', loomage: 13500, efficiency: 90 }
  ];

  const productionOverviewData = [
    { name: 'IWISA 25kg', value: 45, fill: '#3b82f6' },
    { name: 'Lion 10kg', value: 30, fill: '#8b5cf6' },
    { name: 'Custom 5kg', value: 15, fill: '#f59e0b' },
    { name: 'Other', value: 10, fill: '#6b7280' }
  ];

  return (
    <div className="space-y-4">
      <WeeklyAISummary />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Production Efficiency"
          value="89.5%"
          subtitle="+2.3% from last period"
          icon={<TrendingUp className="h-4 w-4" />}
          status="good"
        />
        <KPICard
          title="Avg Waste Rate"
          value="3.3%"
          subtitle="-0.8% from last period"
          icon={<AlertTriangle className="h-4 w-4" />}
          status="good"
        />
        <KPICard
          title="Orders Complete"
          value="94.2%"
          subtitle="+1.7% from last period"
          icon={<Package className="h-4 w-4" />}
          status="good"
        />
        <KPICard
          title="Revenue"
          value="R 2.1M"
          subtitle="+5.4% from last period"
          icon={<DollarSign className="h-4 w-4" />}
          status="good"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportsChart
          title="Extruder Waste Report"
          type="bar"
          data={extruderWasteData}
          dataKey="waste"
          xAxisKey="name"
        />
        
        <ReportsChart
          title="Production Overview"
          type="pie"
          data={productionOverviewData}
          dataKey="value"
        />
      </div>

      {/* Loomage + Efficiency Combined Chart */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Loomage + Efficiency Combined View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ReportsChart
              title=""
              type="line"
              data={loomageEfficiencyData}
              dataKey="loomage"
              xAxisKey="name"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Loomage (metres)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Efficiency (%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon="target"
          title="Quality Metrics"
          value="96.8%"
          desc="Pass rate this period"
          color="green"
        />
        <SummaryCard
          icon="cube"
          title="Production Summary"
          value="89,200"
          desc="Total units produced"
          color="blue"
        />
        <SummaryCard
          icon="clock"
          title="Financial Overview"
          value="R 2.1M"
          desc="Revenue this period"
          color="green"
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReportsChart } from '@/components/reports/ReportsChart';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Download,
  BarChart3
} from 'lucide-react';

const QCWasteManagementTab = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [factoryFilter, setFactoryFilter] = useState('all');

  // Waste metrics
  const wasteMetrics = [
    {
      title: 'Current Waste %',
      value: '3.2%',
      change: '-0.8% from last week',
      status: 'good',
      icon: TrendingDown
    },
    {
      title: 'Target Waste %',
      value: '2.5%',
      change: 'Monthly target',
      status: 'neutral',
      icon: Target
    },
    {
      title: 'Waste Trend',
      value: 'Improving',
      change: '5 days consecutive reduction',
      status: 'good',
      icon: TrendingDown
    },
    {
      title: 'Highest Waste Product',
      value: 'Custom 5kg',
      change: '5.2% average',
      status: 'warning',
      icon: AlertTriangle
    }
  ];

  // Waste by day data
  const wasteByDayData = [
    { name: 'Mon', waste: 3.8, target: 2.5 },
    { name: 'Tue', waste: 3.5, target: 2.5 },
    { name: 'Wed', waste: 3.2, target: 2.5 },
    { name: 'Thu', waste: 2.9, target: 2.5 },
    { name: 'Fri', waste: 3.1, target: 2.5 },
    { name: 'Sat', waste: 2.8, target: 2.5 },
    { name: 'Sun', waste: 3.0, target: 2.5 }
  ];

  // Waste by product data
  const wasteByProductData = [
    { name: 'IWISA 25kg', waste: 2.8 },
    { name: 'Lion 10kg', waste: 3.1 },
    { name: 'Custom 5kg', waste: 5.2 },
    { name: 'Tiger 20kg', waste: 2.4 },
    { name: 'Freedom 15kg', waste: 3.6 }
  ];

  // Top waste causes
  const topWasteCauses = [
    { cause: 'Printing Misalignment', percentage: 28.5, trend: 'up' },
    { cause: 'Seal Defects', percentage: 22.3, trend: 'down' },
    { cause: 'Material Thickness Variation', percentage: 18.7, trend: 'stable' },
    { cause: 'Cutting Precision', percentage: 15.2, trend: 'down' },
    { cause: 'Color Matching Issues', percentage: 15.3, trend: 'up' }
  ];

  // Waste by machine/operator
  const wasteByMachineData = [
    { name: 'Extruder A', waste: 2.1, operator: 'John M.' },
    { name: 'Extruder B', waste: 3.8, operator: 'Sarah N.' },
    { name: 'Cutter A', waste: 4.2, operator: 'Mike Z.' },
    { name: 'Cutter B', waste: 2.9, operator: 'David M.' },
    { name: 'Printer A', waste: 5.1, operator: 'Lisa W.' },
    { name: 'Printer B', waste: 2.3, operator: 'Mary J.' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-600" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-600" />;
      default: return <span className="w-3 h-3 rounded-full bg-gray-400"></span>;
    }
  };

  const getWasteColor = (waste: number) => {
    if (waste <= 2.5) return 'text-green-600';
    if (waste <= 4.0) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Waste Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wasteMetrics.map((metric, index) => (
          <div key={index} className="data-card">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
              <h3 className="text-xs font-medium text-muted-foreground">{metric.title}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">{metric.value}</p>
              <p className={`text-xs ${getStatusColor(metric.status)}`}>
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>

        <Select value={factoryFilter} onValueChange={setFactoryFilter}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Factory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Factories</SelectItem>
            <SelectItem value="johannesburg">Johannesburg</SelectItem>
            <SelectItem value="cape-town">Cape Town</SelectItem>
            <SelectItem value="durban">Durban</SelectItem>
          </SelectContent>
        </Select>

        <Button size="sm" variant="outline" className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportsChart
          title="Waste % Trend vs Target"
          type="line"
          data={wasteByDayData}
          dataKey="waste"
          xAxisKey="name"
        />
        
        <ReportsChart
          title="Waste by Product Type"
          type="bar"
          data={wasteByProductData}
          dataKey="waste"
          xAxisKey="name"
        />
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Waste Causes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top 5 Waste Causes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topWasteCauses.map((cause, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{cause.cause}</p>
                      <p className="text-xs text-muted-foreground">
                        {cause.percentage}% of total waste
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(cause.trend)}
                    <span className="text-sm font-medium">
                      {cause.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Waste by Machine/Operator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Waste by Machine & Operator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wasteByMachineData.map((machine, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{machine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Operator: {machine.operator}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getWasteColor(machine.waste)}`}>
                      {machine.waste}%
                    </p>
                    <p className="text-xs text-muted-foreground">waste rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <CardTitle className="text-base font-semibold text-orange-900">
              Waste Reduction Insights
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Line B trending high waste from printing misalignment
                </p>
                <p className="text-xs text-orange-800">
                  Recommend calibrating print heads and checking material tension
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Custom 5kg products consistently above target
                </p>
                <p className="text-xs text-orange-800">
                  Consider reviewing cutting parameters and operator training
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QCWasteManagementTab;
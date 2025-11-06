import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Brain, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Users, 
  Activity,
  Mail,
  Download,
  Calendar,
  RefreshCw,
  Zap,
  Target,
  BarChart3,
  LineChart
} from 'lucide-react';

export const AIOverviewTab = () => {
  const [dateFilter, setDateFilter] = useState('this-week');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock AI insights data
  const aiInsights = [
    "Revenue increased 12% vs last week, driven primarily by Lion Group orders (+45% week-over-week)",
    "Production efficiency improved 3.2 percentage points to 87%, with Extruder A1 showing strongest gains",
    "Quality issues down 18% but material waste up 1.1% due to print alignment issues on Line B",
    "Staff attendance excellent at 96.2%, though overtime costs increased 8% due to rush orders",
    "Outstanding receivables decreased by R125k, but 3 invoices now overdue by >30 days",
    "OEE target achievement at 82% across all lines, with maintenance-related downtime reduced by 15%"
  ];

  // Mock KPI data
  const kpis = [
    { 
      title: 'Revenue', 
      value: 'R2.8M', 
      change: '+12%', 
      changeType: 'positive',
      icon: DollarSign 
    },
    { 
      title: 'GP %', 
      value: '24.8%', 
      change: '+2.1%', 
      changeType: 'positive',
      icon: TrendingUp 
    },
    { 
      title: 'Waste %', 
      value: '4.1%', 
      change: '+1.1%', 
      changeType: 'negative',
      icon: AlertTriangle 
    },
    { 
      title: 'OEE', 
      value: '82%', 
      change: '+3.2%', 
      changeType: 'positive',
      icon: Activity 
    },
    { 
      title: 'On-time Delivery %', 
      value: '94.5%', 
      change: '-2.1%', 
      changeType: 'negative',
      icon: Clock 
    },
    { 
      title: 'Staff Attendance %', 
      value: '96.2%', 
      change: '+1.5%', 
      changeType: 'positive',
      icon: Users 
    }
  ];

  // Mock anomalies data
  const anomalies = [
    { id: 1, metric: 'Extruder A1 Vibration', severity: 'medium', description: 'Unusual vibration pattern detected' },
    { id: 2, metric: 'Print Quality Line B', severity: 'high', description: 'Alignment issues causing 4.1% waste' },
    { id: 3, metric: 'Overtime Costs', severity: 'medium', description: '8% increase vs baseline' },
    { id: 4, metric: 'Customer Payment Delay', severity: 'low', description: 'Tiger Brands invoice 5 days overdue' }
  ];

  // Mock forecast data
  const forecastData = [
    { week: 'This Week', demand: 85, capacity: 100 },
    { week: 'Next Week', demand: 95, capacity: 100 },
    { week: 'Week 3', demand: 110, capacity: 100 },
    { week: 'Week 4', demand: 88, capacity: 100 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getChangeColor = (type: string) => {
    return type === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header with date filter and refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">AI Overview</h2>
          <div className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Section A - BrainBoard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            BrainBoard - AI Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section B - KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="w-4 h-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">{kpi.title}</div>
              </div>
              <div className="text-lg font-semibold">{kpi.value}</div>
              <div className={`text-xs ${getChangeColor(kpi.changeType)}`}>
                {kpi.change} vs comparison period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section C - Spotlight Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Anomalies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              Top Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(anomaly.severity)}`} />
                    <div>
                      <div className="text-sm font-medium">{anomaly.metric}</div>
                      <div className="text-xs text-muted-foreground">{anomaly.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {anomaly.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forecast Next 4 Weeks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Forecast Next 4 Weeks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forecastData.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{week.week}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${week.demand > week.capacity ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min((week.demand / week.capacity) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {week.demand}% of capacity
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Actions</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email Summary
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Weekly
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Eye,
  FileText,
  Upload
} from 'lucide-react';

const QCOverviewTab = () => {
  const qcMetrics = [
    { 
      label: 'Tests Today', 
      value: '47', 
      change: '+8 from yesterday',
      icon: CheckCircle, 
      color: 'text-blue-600',
      status: 'good'
    },
    { 
      label: 'Failed Tests', 
      value: '3', 
      change: 'Down from 5',
      icon: AlertTriangle, 
      color: 'text-red-600',
      status: 'warning'
    },
    { 
      label: 'Pending Tests', 
      value: '12', 
      change: '8 in progress',
      icon: Clock, 
      color: 'text-orange-600',
      status: 'neutral'
    },
    { 
      label: 'Pass Rate', 
      value: '93.6%', 
      change: '+2.1% vs last week',
      icon: TrendingUp, 
      color: 'text-green-600',
      status: 'good'
    },
  ];

  const recentTests = [
    { 
      id: 'QC-001', 
      product: 'IWISA 25kg Printed', 
      batch: 'B-2024-156', 
      client: 'Lion Group',
      orderNo: 'ORD-0012',
      status: 'Passed', 
      time: '14:30',
      supervisor: 'Mary Johnson',
      testType: 'Tensile Strength'
    },
    { 
      id: 'QC-002', 
      product: 'Lion 10kg White', 
      batch: 'B-2024-157', 
      client: 'Freedom Foods',
      orderNo: 'ORD-0013',
      status: 'Failed', 
      time: '14:15',
      supervisor: 'David Kim',
      testType: 'Seal Integrity'
    },
    { 
      id: 'QC-003', 
      product: 'Custom 5kg', 
      batch: 'B-2024-158', 
      client: 'Tiger Brands',
      orderNo: 'ORD-0014',
      status: 'Pending', 
      time: '14:00',
      supervisor: 'Sarah Lee',
      testType: 'Print Quality'
    },
    { 
      id: 'QC-004', 
      product: 'IWISA 25kg Printed', 
      batch: 'B-2024-159', 
      client: 'Umoya Group',
      orderNo: 'ORD-0015',
      status: 'In Progress', 
      time: '13:45',
      supervisor: 'Mike Chen',
      testType: 'Dimensional Check'
    },
    { 
      id: 'QC-005', 
      product: 'Lion 10kg White', 
      batch: 'B-2024-160', 
      client: 'Freedom Foods',
      orderNo: 'ORD-0016',
      status: 'Passed', 
      time: '13:30',
      supervisor: 'Lisa Wang',
      testType: 'Barrier Properties'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* QC Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {qcMetrics.map((metric, index) => (
          <div key={index} className="data-card">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
              <h3 className="text-xs font-medium text-muted-foreground">{metric.label}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">{metric.value}</p>
              <p className={`text-xs ${getMetricColor(metric.status)}`}>
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quality Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Quality Tests</CardTitle>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View All Tests
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{test.id}</span>
                        <Badge variant="outline" className="text-xs">{test.testType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{test.product}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Batch: {test.batch}</span>
                        <span>•</span>
                        <span>Order: {test.orderNo}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Client: {test.client}</p>
                      <p>Supervisor: {test.supervisor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground text-right">
                      <p>{test.time}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Daily QC Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Today's QC Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tests Completed</span>
                  <span className="font-medium">35/47</span>
                </div>
                <Progress value={74} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pass Rate</span>
                  <span className="font-medium text-green-600">93.6%</span>
                </div>
                <Progress value={93.6} className="h-2" />
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Passed</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Failed</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-orange-600">Pending</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full justify-start" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Test Results
              </Button>
              <Button size="sm" className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate QC Report
              </Button>
              <Button size="sm" className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Review Failed Tests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QCOverviewTab;
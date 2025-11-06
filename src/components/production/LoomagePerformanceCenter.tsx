import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Activity,
  Lightbulb,
  Package,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react';

const LoomagePerformanceCenter = () => {
  const loomBanks = [
    {
      id: 1,
      name: 'Bank 1',
      machines: 5,
      status: 'active',
      todayOutput: '15,280m',
      targetAchievement: 92,
      avgSpeed: '685 m/h',
      activeCount: 5,
      statusText: 'All 5 Active'
    },
    {
      id: 2,
      name: 'Bank 2', 
      machines: 5,
      status: 'warning',
      todayOutput: '14,850m',
      targetAchievement: 89,
      avgSpeed: '650 m/h',
      activeCount: 4,
      statusText: '1 Setup, 4 Run'
    },
    {
      id: 3,
      name: 'Bank 3',
      machines: 5,
      status: 'active',
      todayOutput: '15,150m',
      targetAchievement: 91,
      avgSpeed: '678 m/h',
      activeCount: 5,
      statusText: 'All 5 Active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-hitec-success/10 text-hitec-success border-hitec-success/20';
      case 'warning': return 'bg-hitec-highlight/10 text-hitec-highlight border-hitec-highlight/20';
      case 'down': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-hitec-success" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-hitec-highlight" />;
      case 'down': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              LOOMAGE PERFORMANCE CENTER
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              Most Critical Section
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Today's Total</p>
              <p className="text-lg font-semibold">45,280m</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="text-lg font-semibold">49,000m</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Achievement</p>
              <p className="text-lg font-semibold text-hitec-success">92%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Efficiency</p>
              <p className="text-lg font-semibold text-primary">91.2%</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Loom Banks */}
            {loomBanks.map((bank) => (
              <Card key={bank.id} className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(bank.status)}
                      <h3 className="font-semibold">{bank.name} ({bank.machines})</h3>
                    </div>
                    <Badge className={getStatusColor(bank.status)}>
                      {bank.status === 'active' ? 'Active' : bank.status === 'warning' ? 'Monitor' : 'Down'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Today's Output</span>
                      <span className="font-medium">{bank.todayOutput}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target Achievement</span>
                      <span className={`font-medium ${bank.targetAchievement >= 90 ? 'text-hitec-success' : 'text-hitec-highlight'}`}>
                        {bank.targetAchievement}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">{bank.statusText}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Speed</span>
                      <span className="font-medium">{bank.avgSpeed}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={bank.targetAchievement} className="h-2" />
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    {bank.status === 'warning' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Monitor
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Top Performer */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Performance
                  </h3>
                  <TrendingUp className="h-4 w-4 text-hitec-success" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-medium text-hitec-success">91.2%</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trend</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-hitec-success" />
                        <span className="font-medium text-hitec-success">+3.2%</span>
                      </div>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Above Target
                    </Badge>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full mt-3">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  View Trends
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance Indicators
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-hitec-success" />
                  <span className="text-muted-foreground">Efficiency Trend:</span>
                  <span className="font-medium text-hitec-success">+3.2% vs yesterday</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-hitec-success" />
                  <span className="text-muted-foreground">On Track:</span>
                  <span className="font-medium">8/10 orders meeting targets</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-hitec-highlight" />
                  <span className="text-muted-foreground">Watch:</span>
                  <span className="font-medium text-hitec-highlight">Bank 2 efficiency dropped 5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Opportunity:</span>
                  <span className="font-medium text-primary">Bank 1 can take extra capacity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoomagePerformanceCenter;
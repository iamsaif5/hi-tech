import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  BookOpen,
  RotateCcw,
  Target,
  DollarSign,
  Coffee,
  Activity,
  Clock,
  BarChart3
} from 'lucide-react';

const StaffEfficiencyTracker = () => {
  const topPerformers = [
    {
      name: 'John Smith',
      efficiency: 106,
      station: 'Extruder A',
      avgSpeed: '1,250 m/h',
      trend: 'up'
    },
    {
      name: 'Mike Zulu', 
      efficiency: 103,
      station: 'Lamination D',
      avgSpeed: '1,180 m/h',
      trend: 'up'
    }
  ];

  const needsAttention = [
    {
      name: 'Sarah Nkomo',
      efficiency: 84,
      issue: 'Training needed',
      station: 'Cutter B',
      action: 'Schedule Training'
    },
    {
      name: 'Peter Wilson',
      efficiency: 87,
      issue: 'Slight dip from 92%',
      station: 'Bagging A',
      action: 'Performance Review'
    }
  ];

  const shiftStats = {
    averageEfficiency: 89.2,
    target: 85,
    trend: 3.2,
    present: 24,
    total: 26,
    active: 22,
    onBreak: 2,
    sickLeave: 0,
    lateToday: 0
  };

  const performanceGoals = {
    above85: 20,
    total: 24,
    needImprovement: 4
  };

  const payMetrics = {
    totalMeters: 42450,
    targetMeters: 45000,
    bonusEligible: 18,
    totalOperators: 24,
    shiftValue: 14250,
    projectedValue: 18450
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              OPERATOR EFFICIENCY - Live Performance
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Shift Average:</span>
              <span className="font-semibold text-green-600">{shiftStats.averageEfficiency}%</span>
              <span className="text-muted-foreground">Target:</span>
              <span className="font-semibold">{shiftStats.target}%</span>
              <Badge className="bg-green-100 text-green-800">
                <Target className="h-3 w-3 mr-1" />
                ABOVE TARGET
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Trend:</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">+{shiftStats.trend}%</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Top Performers */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  TOP PERFORMERS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{index === 0 ? '🏆' : '🥈'}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{performer.name}</p>
                        <p className="text-xs text-muted-foreground">{performer.station}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className="font-medium text-green-600">{performer.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Speed</span>
                        <span className="font-medium">{performer.avgSpeed}</span>
                      </div>
                    </div>
                    {index < topPerformers.length - 1 && <hr className="border-yellow-200" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  CURRENT STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Present</span>
                    </div>
                    <span className="font-medium">{shiftStats.present}/{shiftStats.total}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">🟢</span>
                      <span className="text-muted-foreground">Active</span>
                    </div>
                    <span className="font-medium">{shiftStats.active}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-yellow-600" />
                      <span className="text-muted-foreground">On Break</span>
                    </div>
                    <span className="font-medium">{shiftStats.onBreak}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">🏥</span>
                      <span className="text-muted-foreground">Sick Leave</span>
                    </div>
                    <span className="font-medium">{shiftStats.sickLeave}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-muted-foreground">Late Today</span>
                    </div>
                    <span className="font-medium">{shiftStats.lateToday}</span>
                  </div>
                </div>

                <hr className="border-blue-200" />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Performance Goals
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Above 85%</span>
                      <span className="font-medium text-green-600">
                        {performanceGoals.above85}/{performanceGoals.total} ✅
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Need improvement</span>
                      <span className="font-medium text-yellow-600">{performanceGoals.needImprovement}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Needs Attention */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  NEEDS ATTENTION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {needsAttention.map((person, index) => (
                  <div key={person.name} className="space-y-2">
                    <div>
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.station}</p>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className="font-medium text-yellow-600">{person.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issue</span>
                        <span className="font-medium text-xs">{person.issue}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {person.action}
                    </Button>
                    {index < needsAttention.length - 1 && <hr className="border-yellow-200" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shift Summary */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  SHIFT SUMMARY
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">All KPIs</span>
                    <span className="font-medium">📊</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-medium text-green-600">{shiftStats.averageEfficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loomage</span>
                    <span className="font-medium">45,280m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quality</span>
                    <span className="font-medium text-green-600">94.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Safety</span>
                    <span className="font-medium text-green-600">0 incidents</span>
                  </div>
                </div>

                <hr className="border-green-200" />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Shift Value
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Earned</span>
                      <span className="font-medium">R{payMetrics.shiftValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projected</span>
                      <span className="font-medium text-green-600">R{payMetrics.projectedValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pay-Per-Meter Tracking */}
          <Card className="mt-4 bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                Pay-Per-Meter Tracking (Live)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total meters by staff:</span>
                  <span className="font-medium">{payMetrics.totalMeters.toLocaleString()}m</span>
                  <span className="text-green-600">(93% of target)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Bonus eligible:</span>
                  <span className="font-medium text-green-600">{payMetrics.bonusEligible}/{payMetrics.totalOperators} operators</span>
                  <span className="text-xs">(above 90% efficiency)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Training needed:</span>
                  <span className="font-medium text-yellow-600">{performanceGoals.needImprovement} operators</span>
                  <span className="text-xs">(below 85% efficiency)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-muted-foreground">Daily MVP:</span>
                  <span className="font-medium">John Smith</span>
                  <span className="text-xs">(consistent high performance)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffEfficiencyTracker;
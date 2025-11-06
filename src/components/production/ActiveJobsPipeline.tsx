import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock,
  User,
  Calendar
} from 'lucide-react';

interface JobData {
  orderId: string;
  product: string;
  progress: number;
  totalTarget: number;
  unit: string;
  status: 'active' | 'paused' | 'completed' | 'scheduled';
  stage: string;
  operator: string;
  eta: string;
  efficiency: number;
}

interface ActiveJobsPipelineProps {
  onMonitorJob: (orderId: string) => void;
  onHelpJob: (orderId: string) => void;
  onViewJob: (orderId: string) => void;
}

const ActiveJobsPipeline: React.FC<ActiveJobsPipelineProps> = ({
  onMonitorJob,
  onHelpJob,
  onViewJob
}) => {
  const [expandedStages, setExpandedStages] = useState<string[]>(['loomage', 'cutting']);

  const toggleStage = (stage: string) => {
    setExpandedStages(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const mockJobs: JobData[] = [
    {
      orderId: 'ORD-0012',
      product: 'IWISA 25kg Printed',
      progress: 2450,
      totalTarget: 5000,
      unit: 'm',
      status: 'active',
      stage: 'loomage',
      operator: 'John Smith',
      eta: '14:15',
      efficiency: 94
    },
    {
      orderId: 'ORD-0013',
      product: 'Custom 5kg No Print',
      progress: 1200,
      totalTarget: 3500,
      unit: 'm',
      status: 'paused',
      stage: 'cutting',
      operator: 'Sarah Wilson',
      eta: '16:30',
      efficiency: 0
    },
    {
      orderId: 'ORD-0014',
      product: 'IWISA 10kg Standard',
      progress: 8500,
      totalTarget: 8500,
      unit: 'm',
      status: 'completed',
      stage: 'printing',
      operator: 'Mike Chen',
      eta: 'Completed',
      efficiency: 98
    }
  ];

  const stages = [
    { name: 'loomage', title: 'Loomage', jobs: mockJobs.filter(j => j.stage === 'loomage') },
    { name: 'cutting', title: 'Cutting', jobs: mockJobs.filter(j => j.stage === 'cutting') },
    { name: 'printing', title: 'Printing', jobs: mockJobs.filter(j => j.stage === 'printing') },
    { name: 'bagging', title: 'Bagging', jobs: mockJobs.filter(j => j.stage === 'bagging') },
    { name: 'qc', title: 'Quality Control', jobs: mockJobs.filter(j => j.stage === 'qc') }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play;
      case 'paused': return Pause;
      case 'completed': return CheckCircle;
      case 'scheduled': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'paused': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'scheduled': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getActionButton = (job: JobData) => {
    switch (job.status) {
      case 'active':
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onMonitorJob(job.orderId)}
          >
            Monitor
          </Button>
        );
      case 'paused':
        return (
          <Button 
            size="sm" 
            variant="default"
            onClick={() => onHelpJob(job.orderId)}
          >
            Help
          </Button>
        );
      default:
        return (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onViewJob(job.orderId)}
          >
            View
          </Button>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Active Jobs Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {stages.map((stage) => (
          <div key={stage.name} className="border rounded-lg">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto text-xs font-medium"
              onClick={() => toggleStage(stage.name)}
            >
              <span className="flex items-center gap-2">
                {stage.title}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {stage.jobs.length}
                </Badge>
              </span>
              {expandedStages.includes(stage.name) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>

            {expandedStages.includes(stage.name) && (
              <div className="px-3 pb-3 space-y-2">
                {stage.jobs.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 text-center">
                    No active jobs in this stage
                  </p>
                ) : (
                  stage.jobs.map((job) => {
                    const StatusIcon = getStatusIcon(job.status);
                    const progressPercentage = (job.progress / job.totalTarget) * 100;

                    return (
                      <Card key={job.orderId} className="border border-border/50">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(job.status)} >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {job.status.toUpperCase()}
                              </Badge>
                              <span className="text-xs font-medium">{job.orderId}</span>
                            </div>
                            {getActionButton(job)}
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-medium">{job.product}</h4>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress</span>
                              <span className="font-medium">
                                {job.progress.toLocaleString()} / {job.totalTarget.toLocaleString()} {job.unit}
                              </span>
                            </div>
                            <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                              <div 
                                className={`h-full transition-all ${
                                  progressPercentage >= 90 ? 'bg-green-500' : 
                                  progressPercentage >= 50 ? 'bg-yellow-500' : 
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground truncate">{job.operator}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">ETA: {job.eta}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-medium">{job.efficiency}% eff.</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActiveJobsPipeline;
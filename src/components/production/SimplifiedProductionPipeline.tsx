import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Eye, 
  AlertTriangle, 
  FileText,
  Clock,
  User
} from 'lucide-react';

interface JobData {
  orderId: string;
  product: string;
  operator?: string;
  progress: number;
  totalTarget: number;
  unit: string;
  efficiency: number;
  eta: string;
  status: 'normal' | 'monitor' | 'help' | 'setup';
}

interface SimplifiedProductionPipelineProps {
  onMonitorJob?: (orderId: string) => void;
  onHelpJob?: (orderId: string) => void;
  onViewJob?: (orderId: string) => void;
}

const SimplifiedProductionPipeline: React.FC<SimplifiedProductionPipelineProps> = ({
  onMonitorJob = () => {},
  onHelpJob = () => {},
  onViewJob = () => {}
}) => {
  const stages = [
    { id: 'loomage', name: 'Loomage', machines: '15 Looms' },
    { id: 'tubing', name: 'Tubing', machines: '3 Stations' },
    { id: 'cutting', name: 'Cutting', machines: '4 Cutters' },
    { id: 'printing', name: 'Printing', machines: '2 Printers' },
    { id: 'bagging', name: 'Bagging', machines: '3 Lines' },
    { id: 'qc', name: 'QC', machines: 'Inspection' },
    { id: 'complete', name: 'Complete', machines: 'Ready Ship' }
  ];

  const activeJobs: Record<string, JobData> = {
    loomage: {
      orderId: 'ORD-0012',
      product: 'IWISA 25kg',
      operator: 'J.Smith',
      progress: 2450,
      totalTarget: 5000,
      unit: 'm',
      efficiency: 94,
      eta: '14:15',
      status: 'normal'
    },
    tubing: {
      orderId: 'ORD-0015',
      product: 'Lion 10kg',
      operator: 'M.Jones',
      progress: 1200,
      totalTarget: 2000,
      unit: 'm',
      efficiency: 89,
      eta: '11:30',
      status: 'normal'
    },
    cutting: {
      orderId: 'ORD-0013',
      product: 'Custom 5kg',
      operator: 'S.Nkomo',
      progress: 3800,
      totalTarget: 4500,
      unit: 'm',
      efficiency: 84,
      eta: '16:00',
      status: 'monitor'
    },
    printing: {
      orderId: 'ORD-0014',
      product: 'IWISA 25kg',
      operator: 'D.Molefe',
      progress: 750,
      totalTarget: 2500,
      unit: 'm',
      efficiency: 0,
      eta: '19:00',
      status: 'setup'
    },
    bagging: {
      orderId: 'ORD-0011',
      product: 'MegaBag',
      operator: 'P.Wilson',
      progress: 4500,
      totalTarget: 5000,
      unit: 'm',
      efficiency: 96,
      eta: '12:45',
      status: 'normal'
    },
    qc: {
      orderId: 'ORD-0010',
      product: 'Lion Group',
      operator: 'T.Adams',
      progress: 18,
      totalTarget: 20,
      unit: 'samples',
      efficiency: 88,
      eta: '10:30',
      status: 'normal'
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'border-hitec-success bg-hitec-success/5';
      case 'monitor': return 'border-hitec-highlight bg-hitec-highlight/5';
      case 'help': return 'border-destructive bg-destructive/5';
      case 'setup': return 'border-primary bg-primary/5';
      default: return 'border-border bg-card';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-hitec-success';
    if (efficiency >= 85) return 'text-hitec-highlight';
    if (efficiency > 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getActionButton = (job: JobData) => {
    switch (job.status) {
      case 'monitor':
        return (
          <Button size="sm" variant="outline" onClick={() => onMonitorJob(job.orderId)} className="h-7 text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Monitor
          </Button>
        );
      case 'help':
        return (
          <Button size="sm" variant="outline" onClick={() => onHelpJob(job.orderId)} className="h-7 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Help
          </Button>
        );
      case 'setup':
        return (
          <Button size="sm" variant="outline" onClick={() => onViewJob(job.orderId)} className="h-7 text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Setup
          </Button>
        );
      default:
        return (
          <Button size="sm" variant="outline" onClick={() => onViewJob(job.orderId)} className="h-7 text-xs">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Production Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Horizontal scroll container for mobile */}
        <div className="overflow-x-auto">
          <div className="space-y-4 min-w-[800px]">
            {/* Stage Headers */}
            <div className="grid grid-cols-7 gap-4 pb-2 border-b border-border">
              {stages.map((stage, index) => (
                <div key={stage.id} className="text-center">
                  <div className="font-medium text-sm">{stage.name}</div>
                  <div className="text-xs text-muted-foreground">{stage.machines}</div>
                  {index < stages.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-7 gap-4">
              {stages.map((stage) => {
                const job = activeJobs[stage.id];
                
                if (!job) {
                  return (
                    <div key={stage.id} className="text-center py-6 text-muted-foreground text-xs">
                      Available
                    </div>
                  );
                }

                const progressPercent = Math.round((job.progress / job.totalTarget) * 100);

                return (
                  <Card 
                    key={stage.id} 
                    className={`${getJobStatusColor(job.status)} border cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => onViewJob(job.orderId)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        {/* Order & Product */}
                        <div>
                          <div className="font-medium text-xs">{job.orderId}</div>
                          <div className="text-xs text-muted-foreground truncate" title={job.product}>
                            {job.product}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <Progress 
                            value={progressPercent} 
                            className="h-2"
                            style={{
                              '--progress-background': job.status === 'normal' ? 'hsl(var(--primary))' : 
                                                     job.status === 'setup' ? 'hsl(var(--primary))' : 'hsl(var(--primary))'
                            } as React.CSSProperties}
                          />
                          <div className="text-xs text-center">
                            {job.progress.toLocaleString()}/{job.totalTarget.toLocaleString()}{job.unit}
                          </div>
                        </div>

                        {/* Efficiency */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Efficiency</span>
                          <span className={`font-medium ${getEfficiencyColor(job.efficiency)}`}>
                            {job.efficiency > 0 ? `${job.efficiency}%` : 'Setup'}
                            {job.efficiency >= 95 && <span className="text-green-600 ml-1" aria-label="Excellent">✓</span>}
                            {job.efficiency >= 80 && job.efficiency < 95 && <span className="text-orange-500 ml-1" aria-label="Monitor">⚠️</span>}
                            {job.efficiency < 80 && job.efficiency > 0 && <span className="text-red-600 ml-1" aria-label="Poor">⚠️</span>}
                          </span>
                        </div>

                        {/* Operator & ETA */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{job.operator}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>ETA: {job.eta}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-xs capitalize">
                            {job.status === 'normal' ? 'On Track' : 
                             job.status === 'monitor' ? 'Monitor' :
                             job.status === 'setup' ? 'Setup' : 'Help Needed'}
                          </Badge>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center">
                          {getActionButton(job)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pipeline Summary with Auto-Aggregation */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border text-center text-xs">
              <div>
                <div className="font-medium text-green-600">5 jobs</div>
                <div className="text-muted-foreground">on track</div>
              </div>
              <div>
                <div className="font-medium text-orange-500">1 job</div>
                <div className="text-muted-foreground">monitor</div>
              </div>
              <div>
                <div className="font-medium text-blue-600">1 job</div>
                <div className="text-muted-foreground">setup</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">89%</div>
                <div className="text-muted-foreground">pipeline efficiency</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedProductionPipeline;
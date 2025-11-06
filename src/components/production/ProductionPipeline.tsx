import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  CheckCircle, 
  Eye,
  FileText,
  Clock,
  User,
  Package,
  RotateCcw,
  Scissors,
  Printer,
  ShoppingBag,
  Search,
  Lightbulb,
  Circle,
  AlertCircle
} from 'lucide-react';

interface Job {
  id: string;
  orderNumber: string;
  product: string;
  progress: number;
  totalTarget: number;
  unit: string;
  efficiency: number;
  operator: string;
  eta: string;
  status: 'active' | 'setup' | 'warning' | 'complete' | 'qc';
  statusText: string;
}

const ProductionPipeline = () => {
  const stages = [
    {
      id: 'loomage',
      name: 'LOOMAGE',
      icon: <Package className="h-5 w-5 text-primary" />,
      capacity: '15 Looms',
      jobs: [
        {
          id: 'job1',
          orderNumber: 'ORD-0012',
          product: 'IWISA 25kg',
          progress: 2450,
          totalTarget: 5000,
          unit: 'm',
          efficiency: 94,
          operator: 'J.Smith',
          eta: '14:15',
          status: 'active' as const,
          statusText: 'Active Production'
        }
      ]
    },
    {
      id: 'tubing',
      name: 'TUBING',
      icon: <RotateCcw className="h-5 w-5 text-blue-600" />,
      capacity: '3 Stations',
      jobs: [
        {
          id: 'job2',
          orderNumber: 'ORD-0015',
          product: 'Lion 10kg',
          progress: 1200,
          totalTarget: 2000,
          unit: 'm',
          efficiency: 89,
          operator: 'M.Jones',
          eta: '11:30',
          status: 'active' as const,
          statusText: 'Active Production'
        }
      ]
    },
    {
      id: 'cutting',
      name: 'CUTTING',
      icon: <Scissors className="h-5 w-5 text-purple-600" />,
      capacity: '4 Cutters',
      jobs: [
        {
          id: 'job3',
          orderNumber: 'ORD-0013',
          product: 'Custom 5kg',
          progress: 3800,
          totalTarget: 4500,
          unit: 'm',
          efficiency: 84,
          operator: 'S.Nkomo',
          eta: '16:00',
          status: 'warning' as const,
          statusText: 'Below Target'
        }
      ]
    },
    {
      id: 'printing',
      name: 'PRINTING',
      icon: <Printer className="h-5 w-5 text-indigo-600" />,
      capacity: '2 Printers',
      jobs: [
        {
          id: 'job4',
          orderNumber: 'ORD-0014',
          product: 'IWISA 25kg',
          progress: 0,
          totalTarget: 5000,
          unit: 'm',
          efficiency: 0,
          operator: 'D.Molefe',
          eta: '19:00',
          status: 'setup' as const,
          statusText: 'Setup Phase'
        }
      ]
    },
    {
      id: 'bagging',
      name: 'BAGGING',
      icon: <ShoppingBag className="h-5 w-5 text-green-600" />,
      capacity: '3 Lines',
      jobs: [
        {
          id: 'job5',
          orderNumber: 'ORD-0011',
          product: 'MegaBag',
          progress: 4500,
          totalTarget: 5000,
          unit: 'm',
          efficiency: 96,
          operator: 'P.Wilson',
          eta: '12:45',
          status: 'active' as const,
          statusText: 'Active Production'
        }
      ]
    },
    {
      id: 'qc',
      name: 'QC',
      icon: <Search className="h-5 w-5 text-orange-600" />,
      capacity: 'Inspection',
      jobs: [
        {
          id: 'job6',
          orderNumber: 'ORD-0010',
          product: 'Lion Group',
          progress: 5000,
          totalTarget: 5000,
          unit: 'm',
          efficiency: 98,
          operator: 'T.Adams',
          eta: '10:30',
          status: 'qc' as const,
          statusText: 'QC Testing'
        }
      ]
    },
    {
      id: 'complete',
      name: 'COMPLETE',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      capacity: 'Ready Ship',
      jobs: [
        {
          id: 'job7',
          orderNumber: 'ORD-0009',
          product: 'Freedom',
          progress: 5000,
          totalTarget: 5000,
          unit: 'm',
          efficiency: 100,
          operator: '',
          eta: 'Complete',
          status: 'complete' as const,
          statusText: 'Ready for Dispatch'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-hitec-success/10 text-hitec-success border-hitec-success/20';
      case 'warning': return 'bg-hitec-highlight/10 text-hitec-highlight border-hitec-highlight/20';
      case 'setup': return 'bg-primary/10 text-primary border-primary/20';
      case 'qc': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'complete': return 'bg-hitec-success/10 text-hitec-success border-hitec-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getActionButton = (job: Job) => {
    switch (job.status) {
      case 'active':
        return (
          <Button size="sm" variant="outline">
            <BarChart3 className="h-3 w-3 mr-1" />
            Monitor
          </Button>
        );
      case 'warning':
        return (
          <Button size="sm" variant="outline" className="text-yellow-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Help
          </Button>
        );
      case 'setup':
        return (
          <Button size="sm" variant="outline">
            <Settings className="h-3 w-3 mr-1" />
            Setup
          </Button>
        );
      case 'qc':
        return (
          <Button size="sm" variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            Review
          </Button>
        );
      case 'complete':
        return (
          <Button size="sm" variant="outline">
            <FileText className="h-3 w-3 mr-1" />
            Invoice
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">PRODUCTION PIPELINE - Live Job Flow</CardTitle>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>LOOMAGE →</span>
                <RotateCcw className="h-4 w-4" />
                <span>TUBING →</span> 
                <Scissors className="h-4 w-4" />
                <span>CUTTING →</span>
                <Printer className="h-4 w-4" />
                <span>PRINTING →</span>
                <ShoppingBag className="h-4 w-4" />
                <span>BAGGING →</span>
                <Search className="h-4 w-4" />
                <span>QC →</span>
                <CheckCircle className="h-4 w-4" />
                <span>COMPLETE</span>
              </div>
            </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {stages.map((stage) => (
              <Card key={stage.id} className="bg-card border">
                <CardHeader className="pb-2">
                  <div className="text-center">
                    <div className="flex justify-center mb-1">{stage.icon}</div>
                    <h3 className="font-semibold text-sm">{stage.name}</h3>
                    <p className="text-xs text-muted-foreground">{stage.capacity}</p>
                  </div>
                </CardHeader>

                <CardContent className="p-3 pt-0">
                  {stage.jobs.map((job) => (
                    <div key={job.id} className="space-y-3">
                      <div className="text-center">
                        <p className="font-medium text-sm">{job.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{job.product}</p>
                      </div>

                      {job.status !== 'complete' && (
                        <div className="space-y-1">
                          <Progress 
                            value={(job.progress / job.totalTarget) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs">
                            <span>{job.progress.toLocaleString()}{job.unit}</span>
                            <span>{job.totalTarget.toLocaleString()}{job.unit}</span>
                          </div>
                          <div className="text-center text-xs">
                            <span className={`font-medium ${job.efficiency >= 90 ? 'text-hitec-success' : job.efficiency >= 80 ? 'text-hitec-highlight' : 'text-destructive'}`}>
                              {job.efficiency}% eff
                            </span>
                            {job.efficiency < 85 && <AlertTriangle className="h-3 w-3 text-hitec-highlight inline ml-1" />}
                          </div>
                        </div>
                      )}

                        {job.status === 'complete' && (
                          <div className="text-center">
                            <div className="text-hitec-success text-sm font-medium flex items-center justify-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              {job.totalTarget.toLocaleString()}{job.unit}
                            </div>
                            <div className="text-xs text-hitec-success">Complete</div>
                          </div>
                        )}

                      <div className="space-y-1">
                        <Badge className={`${getStatusColor(job.status)} w-full justify-center text-xs`}>
                          {job.statusText}
                        </Badge>
                        
                        {job.operator && (
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{job.operator}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>ETA: {job.eta}</span>
                        </div>
                      </div>

                      {getActionButton(job)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pipeline Status Summary */}
          <Card className="mt-4 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Pipeline Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Healthy Flow:</span>
                  <span className="font-medium">6 jobs progressing normally</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-muted-foreground">Bottleneck:</span>
                  <span className="font-medium text-yellow-600">Cutting section (84% efficiency)</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-muted-foreground">Risk:</span>
                  <span className="font-medium text-red-600">ORD-0013 may miss delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium text-blue-600">Loomage can take 1 more urgent job</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionPipeline;
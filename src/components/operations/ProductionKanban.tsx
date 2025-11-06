import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Clock, 
  Package,
  ArrowRight,
  MoreVertical,
  Plus
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface JobCard {
  id: string;
  orderId: string;
  product: string;
  customer: string;
  quantity: number;
  unit: string;
  progress: number;
  operator?: string;
  priority: 'high' | 'medium' | 'low';
  eta: string;
  dueDate: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  jobs: JobCard[];
  color: string;
}

const ProductionKanban = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'planning',
      title: 'Planning',
      color: 'bg-slate-100',
      jobs: [
        {
          id: 'job-1',
          orderId: 'ORD-0015',
          product: 'IWISA 25kg Printed',
          customer: 'IWISA',
          quantity: 5000,
          unit: 'm',
          progress: 0,
          priority: 'high',
          eta: '2 days',
          dueDate: '2025-01-10'
        }
      ]
    },
    {
      id: 'cutting',
      title: 'Cutting',
      color: 'bg-blue-50',
      jobs: [
        {
          id: 'job-2',
          orderId: 'ORD-0012',
          product: 'Lion 10kg White',
          customer: 'Lion Group',
          quantity: 3500,
          unit: 'm',
          progress: 65,
          operator: 'Sarah Wilson',
          priority: 'medium',
          eta: '4 hours',
          dueDate: '2025-01-08'
        }
      ]
    },
    {
      id: 'folding',
      title: 'Folding',
      color: 'bg-amber-50',
      jobs: [
        {
          id: 'job-3',
          orderId: 'ORD-0013',
          product: 'Custom 5kg No Print',
          customer: 'Custom Client',
          quantity: 2000,
          unit: 'm',
          progress: 40,
          operator: 'Mike Johnson',
          priority: 'low',
          eta: '6 hours',
          dueDate: '2025-01-09'
        }
      ]
    },
    {
      id: 'printing',
      title: 'Printing',
      color: 'bg-green-50',
      jobs: [
        {
          id: 'job-4',
          orderId: 'ORD-0014',
          product: 'MegaBag Industrial',
          customer: 'MegaBag Corp',
          quantity: 1500,
          unit: 'm',
          progress: 80,
          operator: 'David Chen',
          priority: 'high',
          eta: '2 hours',
          dueDate: '2025-01-07'
        }
      ]
    },
    {
      id: 'qc',
      title: 'QC',
      color: 'bg-purple-50',
      jobs: [
        {
          id: 'job-5',
          orderId: 'ORD-0011',
          product: 'Standard 25kg',
          customer: 'Standard Co',
          quantity: 4000,
          unit: 'm',
          progress: 95,
          operator: 'Anna Smith',
          priority: 'medium',
          eta: '1 hour',
          dueDate: '2025-01-07'
        }
      ]
    },
    {
      id: 'complete',
      title: 'Complete',
      color: 'bg-emerald-50',
      jobs: [
        {
          id: 'job-6',
          orderId: 'ORD-0010',
          product: 'Premium 10kg',
          customer: 'Premium Ltd',
          quantity: 2500,
          unit: 'm',
          progress: 100,
          operator: 'Complete',
          priority: 'medium',
          eta: 'Ready',
          dueDate: '2025-01-06'
        }
      ]
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJobMove = (jobId: string, fromColumn: string, toColumn: string) => {
    // In a real app, this would update the backend
    console.log(`Moving job ${jobId} from ${fromColumn} to ${toColumn}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Production Planning - Kanban View</h2>
          <p className="text-muted-foreground">Drag and drop jobs between production stages</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Job
        </Button>
      </div>

      <div className="grid grid-cols-6 gap-4 min-h-[600px]">
        {columns.map((column, index) => (
          <div key={column.id} className="space-y-3">
            {/* Column Header */}
            <div className={`${column.color} rounded-lg p-3 border`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.jobs.length}
                </Badge>
              </div>
              {index < columns.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto mt-2" />
              )}
            </div>

            {/* Job Cards */}
            <div className="space-y-3">
              {column.jobs.map((job) => (
                <Card key={job.id} className="cursor-move hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium text-xs">{job.orderId}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Job</DropdownMenuItem>
                            <DropdownMenuItem>Assign Operator</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Product & Customer */}
                      <div>
                        <p className="font-medium text-sm">{job.product}</p>
                        <p className="text-xs text-muted-foreground">{job.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.quantity.toLocaleString()}{job.unit}
                        </p>
                      </div>

                      {/* Progress */}
                      {job.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-1" />
                        </div>
                      )}

                      {/* Priority */}
                      <div className="flex justify-between items-center">
                        <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
                          {job.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Due: {job.dueDate}</span>
                      </div>

                      {/* Operator & ETA */}
                      <div className="space-y-1">
                        {job.operator && job.operator !== 'Complete' && (
                          <div className="flex items-center gap-1 text-xs">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span>{job.operator}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>ETA: {job.eta}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">6</div>
          <div className="text-xs text-muted-foreground">Active Jobs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">1</div>
          <div className="text-xs text-muted-foreground">Completed Today</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-amber-600">2</div>
          <div className="text-xs text-muted-foreground">High Priority</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-600">85%</div>
          <div className="text-xs text-muted-foreground">On Schedule</div>
        </div>
      </div>
    </div>
  );
};

export default ProductionKanban;
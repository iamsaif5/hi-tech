import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  Settings,
  Pause,
  Play,
  Camera,
  Edit,
  Wrench,
  Phone,
  FileText,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

export interface MachineData {
  id: string;
  name: string;
  section: string;
  status: 'active' | 'down' | 'setup' | 'maintenance' | 'idle';
  currentJob?: {
    orderId: string;
    product: string;
    progress: number;
    totalTarget: number;
    unit: string;
  };
  operator?: {
    name: string;
    id: string;
  };
  timing?: {
    started?: string;
    estimated?: string;
    downtime?: number;
  };
  performance?: {
    speed: number;
    targetSpeed: number;
    efficiency: number;
  };
  quality?: {
    status: 'passed' | 'failed' | 'pending';
    nextCheck?: string;
  };
  issue?: {
    description: string;
    reportedAt: string;
    estimatedFix?: string;
  };
  setup?: {
    progress: number;
    checklist: Array<{item: string; completed: boolean}>;
    nextJob?: string;
  };
  lastUpdate: string;
  updatedBy: string;
}

interface MachineStatusCardProps {
  machine: MachineData;
  onUpdateStatus: (machineId: string) => void;
  onTakePhoto: (machineId: string) => void;
  onReportIssue: (machineId: string) => void;
  onCallTechnician?: (machineId: string) => void;
}

const MachineStatusCard = ({ 
  machine, 
  onUpdateStatus, 
  onTakePhoto, 
  onReportIssue,
  onCallTechnician 
}: MachineStatusCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-600" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'setup': return <Settings className="h-4 w-4 text-yellow-600" />;
      case 'maintenance': return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'idle': return <Pause className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'down': return 'bg-red-100 text-red-800 border-red-200';
      case 'setup': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'idle': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-l-green-500';
      case 'down': return 'border-l-red-500'; 
      case 'setup': return 'border-l-yellow-500';
      case 'maintenance': return 'border-l-orange-500';
      case 'idle': return 'border-l-gray-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <Card className={`border-l-4 ${getCardBorderColor(machine.status)} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(machine.status)}
            <div>
              <h3 className="font-semibold text-sm">{machine.name}</h3>
              <p className="text-xs text-muted-foreground">{machine.section}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(machine.status)}>
              {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
            </Badge>
            
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => onTakePhoto(machine.id)}>
                <Camera className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onUpdateStatus(machine.id)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onReportIssue(machine.id)}>
                <AlertTriangle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Active Machine Content */}
        {machine.status === 'active' && (
          <>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Current Job:</strong> {machine.currentJob?.orderId} - {machine.currentJob?.product}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{machine.operator?.name} (ID: {machine.operator?.id})</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Started:</span> {machine.timing?.started}
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Complete:</span> {machine.timing?.estimated}
                </div>
              </div>
            </div>

            {machine.currentJob && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span>{machine.currentJob.progress.toLocaleString()}{machine.currentJob.unit} / {machine.currentJob.totalTarget.toLocaleString()}{machine.currentJob.unit} ({Math.round((machine.currentJob.progress / machine.currentJob.totalTarget) * 100)}%)</span>
                </div>
                <Progress value={(machine.currentJob.progress / machine.currentJob.totalTarget) * 100} className="h-2" />
              </div>
            )}

            {machine.performance && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Speed:</span> {machine.performance.speed} {machine.currentJob?.unit}/min
                </div>
                <div>
                  <span className="text-muted-foreground">Target:</span> {machine.performance.targetSpeed} {machine.currentJob?.unit}/min
                </div>
                <div>
                  <span className="text-muted-foreground">Efficiency:</span> {machine.performance.efficiency}%
                </div>
              </div>
            )}

            {machine.quality && (
              <div className="space-y-1">  
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Quality Status: All checks passed</span>
                </div>
                {machine.quality.nextCheck && (
                  <div className="text-sm text-muted-foreground">
                    Next QC Check: {machine.quality.nextCheck}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant="outline">
                <Pause className="h-3 w-3 mr-1" />
                Pause Job
              </Button>
              <Button size="sm" variant="outline">
                <User className="h-3 w-3 mr-1" />
                Change Operator
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                View Details
              </Button>
              <Button size="sm" variant="outline">
                <Wrench className="h-3 w-3 mr-1" />
                Maintenance
              </Button>
            </div>
          </>
        )}

        {/* Down/Issue Machine Content */}
        {machine.status === 'down' && machine.issue && (
          <>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Status:</strong> <span className="text-red-600">{machine.issue.description}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Downtime:</span> {machine.timing?.downtime} minutes
                </div>
                <div>
                  <span className="text-muted-foreground">Started:</span> {machine.issue.reportedAt}
                </div>
              </div>

              {machine.operator && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{machine.operator.name} (ID: {machine.operator.id})</span>
                </div>
              )}
            </div>

            {machine.currentJob && (
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Current Job:</strong> {machine.currentJob.orderId} - {machine.currentJob.product} (ON HOLD)
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Progress:</span> {machine.currentJob.progress.toLocaleString()}{machine.currentJob.unit} / {machine.currentJob.totalTarget.toLocaleString()}{machine.currentJob.unit} ({Math.round((machine.currentJob.progress / machine.currentJob.totalTarget) * 100)}% complete when stopped)
                </div>
              </div>
            )}

            <div className="bg-red-50 p-3 rounded-lg text-sm space-y-1">
              <div><strong>Issue Details:</strong></div>
              <div>• QC Failed: Print registration off by 3mm</div>
              <div>• Supervisor Notified: 07:05</div>
              <div>• Technician Called: 07:10</div>
              {machine.issue.estimatedFix && (
                <div>• Est. Resolution: {machine.issue.estimatedFix}</div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant="outline">
                <CheckCircle className="h-3 w-3 mr-1" />
                QC Re-check
              </Button>
              <Button size="sm" variant="outline">
                <Play className="h-3 w-3 mr-1" />
                Resume Production
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                Incident Report
              </Button>
              {onCallTechnician && (
                <Button size="sm" variant="outline" onClick={() => onCallTechnician(machine.id)}>
                  <Phone className="h-3 w-3 mr-1" />
                  Call Tech
                </Button>
              )}
            </div>
          </>
        )}

        {/* Setup Machine Content */}
        {machine.status === 'setup' && machine.setup && (
          <>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Status:</strong> <span className="text-yellow-600">Job Changeover in Progress</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Setup Started:</span> {machine.timing?.started}
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Complete:</span> {machine.timing?.estimated}
                </div>
              </div>

              {machine.operator && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{machine.operator.name} (ID: {machine.operator.id})</span>
                </div>
              )}
            </div>

            {machine.setup.nextJob && (
              <div className="space-y-1 text-sm">
                <div><strong>Next Job:</strong> {machine.setup.nextJob}</div>
                <div className="text-muted-foreground">Previous Job: Complete (5,000m produced)</div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Setup Progress:</span>
                <span>{machine.setup.progress}%</span>
              </div>
              <Progress value={machine.setup.progress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Setup Checklist:</div>
              <div className="space-y-1 text-sm">
                {machine.setup.checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Clock className="h-3 w-3 text-yellow-600" />
                    )}
                    <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                View Checklist
              </Button>
              <Button size="sm" variant="outline" onClick={() => onTakePhoto(machine.id)}>
                <Camera className="h-3 w-3 mr-1" />
                Take Setup Photo
              </Button>
              <Button size="sm" variant="outline">
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark Complete
              </Button>
            </div>
          </>
        )}

        {/* Footer - Last Update Info */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Last Update: {machine.lastUpdate} by {machine.updatedBy}
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineStatusCard;
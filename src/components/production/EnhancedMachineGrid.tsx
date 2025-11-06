import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Wrench
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MachineData {
  id: string;
  name: string;
  status: 'active' | 'error' | 'maintenance' | 'idle';
  currentJob?: {
    orderId: string;
    product: string;
    progress: number;
    totalTarget: number;
    unit: string;
  };
  efficiency: number;
  operator?: {
    name: string;
    id: string;
  };
  timing: {
    started?: string;
    estimated?: string;
    downtime?: number;
  };
  lastUpdate: string;
  stage: string;
}

interface EnhancedMachineGridProps {
  machines: MachineData[];
  onViewMachine: (machineId: string) => void;
  onReportIssue: (machineId: string) => void;
  onAssignOperator: (machineId: string) => void;
  filterStage?: string;
}

const EnhancedMachineGrid: React.FC<EnhancedMachineGridProps> = ({
  machines,
  onViewMachine,
  onReportIssue,
  onAssignOperator,
  filterStage
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHealthyMachines, setShowHealthyMachines] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState({
    meters: '',
    scrapKg: '',
    downtimeCode: ''
  });

  const filteredMachines = machines
    .filter(machine => !filterStage || machine.stage.toLowerCase() === filterStage.toLowerCase())
    .filter(machine => showHealthyMachines || machine.status !== 'active' || machine.efficiency < 90);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'error': return AlertTriangle;
      case 'maintenance': return Wrench;
      case 'idle': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'error': return 'text-destructive';
      case 'maintenance': return 'text-warning';
      case 'idle': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10';
      case 'error': return 'bg-destructive/10';
      case 'maintenance': return 'bg-warning/10';
      case 'idle': return 'bg-muted/50';
      default: return 'bg-muted/50';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-success';
    if (efficiency >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const handleQuickUpdate = () => {
    // Handle quick update submission
    console.log('Quick update:', { machineId: selectedMachine, ...updateData });
    setSelectedMachine(null);
    setUpdateData({ meters: '', scrapKg: '', downtimeCode: '' });
  };

  if (!isExpanded) {
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(true)}
          className="w-full"
        >
          <ChevronDown className="h-4 w-4 mr-2" />
          Show All Machines ({machines.length})
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Machine Grid {filterStage && `- ${filterStage}`}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="healthy-machines"
                checked={showHealthyMachines}
                onCheckedChange={setShowHealthyMachines}
              />
              <Label htmlFor="healthy-machines" className="text-xs">
                Include healthy machines
              </Label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMachines.map((machine) => {
            const StatusIcon = getStatusIcon(machine.status);
            const progressPercentage = machine.currentJob 
              ? (machine.currentJob.progress / machine.currentJob.totalTarget) * 100 
              : 0;

            return (
              <Card key={machine.id} className="border border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-3 w-3 ${getStatusColor(machine.status)}`} />
                      <div>
                        <h4 className="text-xs font-medium">{machine.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{machine.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMachine(machine.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Quick Update - {machine.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="meters">Meters Produced</Label>
                              <Input
                                id="meters"
                                type="number"
                                value={updateData.meters}
                                onChange={(e) => setUpdateData(prev => ({ ...prev, meters: e.target.value }))}
                                placeholder="Enter meters"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="scrap">Scrap (kg)</Label>
                              <Input
                                id="scrap"
                                type="number"
                                value={updateData.scrapKg}
                                onChange={(e) => setUpdateData(prev => ({ ...prev, scrapKg: e.target.value }))}
                                placeholder="Enter scrap weight"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="downtime">Downtime Code</Label>
                              <Select
                                value={updateData.downtimeCode}
                                onValueChange={(value) => setUpdateData(prev => ({ ...prev, downtimeCode: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select downtime reason" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="maintenance">Planned Maintenance</SelectItem>
                                  <SelectItem value="breakdown">Machine Breakdown</SelectItem>
                                  <SelectItem value="material">Material Shortage</SelectItem>
                                  <SelectItem value="changeover">Product Changeover</SelectItem>
                                  <SelectItem value="quality">Quality Issue</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleQuickUpdate} className="w-full">
                              Update Machine Data
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewMachine(machine.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {machine.currentJob && (
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{machine.currentJob.orderId}</span>
                        <span className="text-muted-foreground">{machine.currentJob.product}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{machine.currentJob.progress.toLocaleString()} {machine.currentJob.unit}</span>
                        <span>{machine.currentJob.totalTarget.toLocaleString()} {machine.currentJob.unit}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className={`font-medium ${getEfficiencyColor(machine.efficiency)}`}>
                        {machine.efficiency}%
                      </span>
                    </div>
                    
                    {machine.operator && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{machine.operator.name}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last Update</span>
                      <span className="text-muted-foreground">{machine.lastUpdate}</span>
                    </div>
                  </div>

                  {(machine.status === 'error' || machine.efficiency < 70) && (
                    <div className="mt-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full h-6 text-xs"
                        onClick={() => onReportIssue(machine.id)}
                      >
                        Report Issue
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {showHealthyMachines 
                ? 'No machines found for the selected filters.'
                : 'All machines are running normally. Toggle "Include healthy machines" to see all machines.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMachineGrid;
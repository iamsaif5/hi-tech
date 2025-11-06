import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';

interface SupervisorDataEntryProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMachine?: string;
}

const SupervisorDataEntry = ({ isOpen, onClose, selectedMachine }: SupervisorDataEntryProps) => {
  const [formData, setFormData] = useState({
    machine: selectedMachine || '',
    operator: '',
    jobId: '',
    updateType: '',
    metersProduced: '',
    startReading: '',
    endReading: '',
    wasteAmount: '',
    speed: '',
    qualityStatus: '',
    notes: ''
  });

  const machines = [
    'Extruder Line A',
    'Extruder Line B', 
    'Extruder Line C',
    'Loom Bank 1',
    'Loom Bank 2',
    'Loom Bank 3',
    'Cutter Station A',
    'Cutter Station B',
    'Cutter Station C',
    'Printer Line A',
    'Printer Line B',
    'Bagging Line A',
    'Bagging Line B',
    'Bagging Line C'
  ];

  const operators = [
    'John Smith (1234)',
    'Sarah Wilson (5678)',
    'Mike Johnson (9012)',
    'Lisa Brown (3456)',
    'David Chen (7890)'
  ];

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving data:', formData);
    onClose();
  };

  const handleSaveAndContinue = () => {
    // TODO: Implement save and continue logic
    console.log('Saving and continuing:', formData);
    // Reset form but keep some values
    setFormData(prev => ({
      ...prev,
      metersProduced: '',
      startReading: '',
      endReading: '',
      wasteAmount: '',
      speed: '',
      notes: ''
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Production Update</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="machine">Machine</Label>
              <Select value={formData.machine} onValueChange={(value) => setFormData(prev => ({...prev, machine: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select machine" />
                </SelectTrigger>
                <SelectContent>
                  {machines.map((machine) => (
                    <SelectItem key={machine} value={machine}>{machine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="operator">Operator</Label>
              <Select value={formData.operator} onValueChange={(value) => setFormData(prev => ({...prev, operator: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((operator) => (
                    <SelectItem key={operator} value={operator}>{operator}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="jobId">Job ID</Label>
            <Input 
              id="jobId"
              value={formData.jobId}
              onChange={(e) => setFormData(prev => ({...prev, jobId: e.target.value}))}
              placeholder="Auto-filled from current job"
            />
          </div>

          <div>
            <Label>Update Type</Label>
            <RadioGroup 
              value={formData.updateType} 
              onValueChange={(value) => setFormData(prev => ({...prev, updateType: value}))}
              className="grid grid-cols-3 gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="production-progress" id="production-progress" />
                <Label htmlFor="production-progress" className="text-sm">Production Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quality-check" id="quality-check" />
                <Label htmlFor="quality-check" className="text-sm">Quality Check</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue-report" id="issue-report" />
                <Label htmlFor="issue-report" className="text-sm">Issue Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shift-handover" id="shift-handover" />
                <Label htmlFor="shift-handover" className="text-sm">Shift Handover</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintenance" id="maintenance" />
                <Label htmlFor="maintenance" className="text-sm">Maintenance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="setup-complete" id="setup-complete" />
                <Label htmlFor="setup-complete" className="text-sm">Setup Complete</Label>
              </div>
            </RadioGroup>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Production Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metersProduced">Meters Produced</Label>
                  <div className="flex">
                    <Input 
                      id="metersProduced"
                      value={formData.metersProduced}
                      onChange={(e) => setFormData(prev => ({...prev, metersProduced: e.target.value}))}
                      placeholder="0"
                    />
                    <span className="ml-2 flex items-center text-sm text-muted-foreground">m</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="speed">Speed</Label>
                  <div className="flex">
                    <Input 
                      id="speed"
                      value={formData.speed}
                      onChange={(e) => setFormData(prev => ({...prev, speed: e.target.value}))}
                      placeholder="0"
                    />
                    <span className="ml-2 flex items-center text-sm text-muted-foreground">m/min</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startReading">Start Reading</Label>
                  <div className="flex">
                    <Input 
                      id="startReading"
                      value={formData.startReading}
                      onChange={(e) => setFormData(prev => ({...prev, startReading: e.target.value}))}
                      placeholder="0"
                    />
                    <span className="ml-2 flex items-center text-sm text-muted-foreground">m</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="endReading">End Reading</Label>
                  <div className="flex">
                    <Input 
                      id="endReading"
                      value={formData.endReading}
                      onChange={(e) => setFormData(prev => ({...prev, endReading: e.target.value}))}
                      placeholder="0"
                    />
                    <span className="ml-2 flex items-center text-sm text-muted-foreground">m</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="wasteAmount">Waste Amount</Label>
                <div className="flex">
                  <Input 
                    id="wasteAmount"
                    value={formData.wasteAmount}
                    onChange={(e) => setFormData(prev => ({...prev, wasteAmount: e.target.value}))}
                    placeholder="0"
                  />
                  <span className="ml-2 flex items-center text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label>Quality Status</Label>
            <RadioGroup 
              value={formData.qualityStatus} 
              onValueChange={(value) => setFormData(prev => ({...prev, qualityStatus: value}))}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all-ok" id="all-ok" />
                <Label htmlFor="all-ok" className="text-sm">All OK</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minor-issues" id="minor-issues" />
                <Label htmlFor="minor-issues" className="text-sm">Minor Issues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="major-issues" id="major-issues" />
                <Label htmlFor="major-issues" className="text-sm">Major Issues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="failed-qc" id="failed-qc" />
                <Label htmlFor="failed-qc" className="text-sm">Failed QC</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Photos</Label>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Enter details, observations, or issues..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Update
            </Button>
            <Button onClick={handleSaveAndContinue} variant="outline" className="flex-1">
              Save & Continue
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorDataEntry;

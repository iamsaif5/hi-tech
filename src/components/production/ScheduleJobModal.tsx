import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface ScheduleJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleJobModal = ({ isOpen, onClose }: ScheduleJobModalProps) => {
  const [formData, setFormData] = useState({
    orderId: '',
    machines: [] as string[],
    operators: [] as string[],
    factory: '',
    shift: '',
    targetQuantity: '',
    operationStages: [] as string[],
    startTime: '',
    endTime: '',
    notes: ''
  });

  const orders = [
    { id: 'ORD-0012', client: 'Lion Group', product: 'IWISA 25kg Printed' },
    { id: 'ORD-0013', client: 'Freedom Foods', product: 'Lion 10kg White' },
    { id: 'ORD-0014', client: 'Umoya Group', product: 'Custom 5kg No Print' },
    { id: 'ORD-0015', client: 'Freedom Foods', product: 'Lion 20kg Special' },
    { id: 'ORD-0016', client: 'Industrial Co', product: 'Bulk 50kg Heavy Duty' }
  ];

  const operationStages = [
    'Loomage',
    'Tubing', 
    'Cutting',
    'Printing',
    'Bagging'
  ];
  
  const machines = [
    'Loom A1', 'Loom A2', 'Cutter A1', 'Cutter A2', 'Slitter B1', 'Slitter B2', 
    'Extruder C1', 'Extruder C2', 'Printer D1', 'Printer D2', 'Bagger 1', 'Bagger 2',
    'Quality Station 1', 'Quality Station 2', 'Packaging Line A', 'Packaging Line B'
  ];
  
  const operators = [
    'Amelia Anderson', 'J. Moyo', 'S. Patel', 'Mike Davis', 
    'Sarah Brown', 'Tom Wilson', 'Lisa Garcia', 'Chris Taylor',
    'David Kumar', 'Maria Santos', 'Anna Pillay', 'Josh Matthews',
    'R. Singh', 'K. Williams', 'T. Naidoo', 'L. Reddy'
  ];

  const factories = ['Midrand', 'Boksburg', 'Germiston'];
  const shifts = ['Day', 'Night', 'Overtime'];

  const handleMachineToggle = (machine: string) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.includes(machine)
        ? prev.machines.filter(m => m !== machine)
        : [...prev.machines, machine]
    }));
  };

  const handleOperatorToggle = (operator: string) => {
    setFormData(prev => ({
      ...prev,
      operators: prev.operators.includes(operator)
        ? prev.operators.filter(o => o !== operator)
        : [...prev.operators, operator]
    }));
  };

  const handleOperationStageToggle = (stage: string) => {
    setFormData(prev => ({
      ...prev,
      operationStages: prev.operationStages.includes(stage)
        ? prev.operationStages.filter(s => s !== stage)
        : [...prev.operationStages, stage]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scheduling new production job:', formData);
    
    // Here we would normally send to API/database
    // For now, just close modal and reset form
    onClose();
    setFormData({
      orderId: '',
      machines: [],
      operators: [],
      factory: '',
      shift: '',
      targetQuantity: '',
      operationStages: [],
      startTime: '',
      endTime: '',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Schedule New Production Job</DialogTitle>
          <p className="text-sm text-gray-600">Create a new production job with multiple machines and operators</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="order" className="text-sm font-medium">Order Selection</Label>
              <Select value={formData.orderId} onValueChange={(value) => setFormData({...formData, orderId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose order..." />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.client} ({order.product})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetQty" className="text-sm font-medium">Target Quantity</Label>
              <Input
                id="targetQty"
                type="number"
                placeholder="e.g. 5000"
                value={formData.targetQuantity}
                onChange={(e) => setFormData({...formData, targetQuantity: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="factory" className="text-sm font-medium">Factory Location</Label>
              <Select value={formData.factory} onValueChange={(value) => setFormData({...formData, factory: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select factory..." />
                </SelectTrigger>
                <SelectContent>
                  {factories.map((factory) => (
                    <SelectItem key={factory} value={factory}>{factory}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift" className="text-sm font-medium">Shift Assignment</Label>
              <Select value={formData.shift} onValueChange={(value) => setFormData({...formData, shift: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shift..." />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Operation Stages Required</Label>
            <div className="grid grid-cols-5 gap-3 p-4 border rounded-lg bg-gray-50">
              {operationStages.map((stage) => (
                <div key={stage} className="flex items-center space-x-2">
                  <Checkbox
                    id={stage}
                    checked={formData.operationStages.includes(stage)}
                    onCheckedChange={() => handleOperationStageToggle(stage)}
                  />
                  <Label htmlFor={stage} className="text-sm font-medium">{stage}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Assign Machines (Multiple Selection)</Label>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              {machines.map((machine) => (
                <div key={machine} className="flex items-center space-x-2">
                  <Checkbox
                    id={machine}
                    checked={formData.machines.includes(machine)}
                    onCheckedChange={() => handleMachineToggle(machine)}
                  />
                  <Label htmlFor={machine} className="text-xs">{machine}</Label>
                </div>
              ))}
            </div>
            {formData.machines.length > 0 && (
              <p className="text-xs text-blue-600">{formData.machines.length} machines selected</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Assign Operators (Multiple Selection)</Label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              {operators.map((operator) => (
                <div key={operator} className="flex items-center space-x-2">
                  <Checkbox
                    id={operator}
                    checked={formData.operators.includes(operator)}
                    onCheckedChange={() => handleOperatorToggle(operator)}
                  />
                  <Label htmlFor={operator} className="text-xs">{operator}</Label>
                </div>
              ))}
            </div>
            {formData.operators.length > 0 && (
              <p className="text-xs text-blue-600">{formData.operators.length} operators selected</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium">Expected Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">Expected End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Production Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special instructions, quality requirements, safety notes..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Production Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleJobModal;

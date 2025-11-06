
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

const SupervisorLogForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: '',
    staffOnShift: [],
    loomageOutput: '',
    tubingOutput: '',
    cuttingOutput: '',
    printingOutput: '',
    baggingOutput: '',
    downtimeDuration: '',
    downtimeReason: '',
    qcIssuesCount: '',
    qcNotes: '',
    wasteQuantity: '',
    maintenanceIssues: ''
  });

  const handleSubmit = () => {
    // Convert string inputs to numbers where needed
    const logData = {
      ...formData,
      loomageOutput: parseInt(formData.loomageOutput) || 0,
      tubingOutput: parseInt(formData.tubingOutput) || 0,
      cuttingOutput: parseInt(formData.cuttingOutput) || 0,
      printingOutput: parseInt(formData.printingOutput) || 0,
      baggingOutput: parseInt(formData.baggingOutput) || 0,
      downtimeDuration: parseInt(formData.downtimeDuration) || 0,
      qcIssuesCount: parseInt(formData.qcIssuesCount) || 0,
      wasteQuantity: parseFloat(formData.wasteQuantity) || 0
    };
    
    console.log('Supervisor Log Submitted:', logData);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      shift: '',
      staffOnShift: [],
      loomageOutput: '',
      tubingOutput: '',
      cuttingOutput: '',
      printingOutput: '',
      baggingOutput: '',
      downtimeDuration: '',
      downtimeReason: '',
      qcIssuesCount: '',
      qcNotes: '',
      wasteQuantity: '',
      maintenanceIssues: ''
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Daily Production Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Production Log - Supervisor Input</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Basic Info */}
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Shift Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({...formData, shift: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning (6:00 AM - 2:00 PM)</SelectItem>
                    <SelectItem value="Afternoon">Afternoon (2:00 PM - 10:00 PM)</SelectItem>
                    <SelectItem value="Night">Night (10:00 PM - 6:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff">Staff on Shift</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff (Multi)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="mary-johnson">Mary Johnson</SelectItem>
                    <SelectItem value="david-wilson">David Wilson</SelectItem>
                    <SelectItem value="sarah-brown">Sarah Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Machine Output */}
          <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Machine Output (Units)</h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loomageOutput">Loomage</Label>
                <Input
                  type="number"
                  value={formData.loomageOutput}
                  onChange={(e) => setFormData({...formData, loomageOutput: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tubingOutput">Tubing</Label>
                <Input
                  type="number"
                  value={formData.tubingOutput}
                  onChange={(e) => setFormData({...formData, tubingOutput: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cuttingOutput">Cutting</Label>
                <Input
                  type="number"
                  value={formData.cuttingOutput}
                  onChange={(e) => setFormData({...formData, cuttingOutput: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="printingOutput">Printing</Label>
                <Input
                  type="number"
                  value={formData.printingOutput}
                  onChange={(e) => setFormData({...formData, printingOutput: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="baggingOutput">Bagging</Label>
                <Input
                  type="number"
                  value={formData.baggingOutput}
                  onChange={(e) => setFormData({...formData, baggingOutput: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Downtime & Issues */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Downtime</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="downtimeDuration">Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.downtimeDuration}
                  onChange={(e) => setFormData({...formData, downtimeDuration: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="downtimeReason">Reason</Label>
                <Select value={formData.downtimeReason} onValueChange={(value) => setFormData({...formData, downtimeReason: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Machine Breakdown">Machine Breakdown</SelectItem>
                    <SelectItem value="Material Shortage">Material Shortage</SelectItem>
                    <SelectItem value="Quality Issue">Quality Issue</SelectItem>
                    <SelectItem value="Scheduled Maintenance">Scheduled Maintenance</SelectItem>
                    <SelectItem value="Power Outage">Power Outage</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* QC Issues */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Quality Control</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qcIssuesCount">Issues Count</Label>
                <Input
                  type="number"
                  value={formData.qcIssuesCount}
                  onChange={(e) => setFormData({...formData, qcIssuesCount: e.target.value})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qcNotes">QC Notes</Label>
                <Textarea
                  value={formData.qcNotes}
                  onChange={(e) => setFormData({...formData, qcNotes: e.target.value})}
                  placeholder="Describe quality issues observed"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Waste & Maintenance */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Waste</h3>
            <div className="space-y-2">
              <Label htmlFor="wasteQuantity">Waste Quantity (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.wasteQuantity}
                onChange={(e) => setFormData({...formData, wasteQuantity: e.target.value})}
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Maintenance</h3>
            <div className="space-y-2">
              <Label htmlFor="maintenanceIssues">Maintenance Issues</Label>
              <Textarea
                value={formData.maintenanceIssues}
                onChange={(e) => setFormData({...formData, maintenanceIssues: e.target.value})}
                placeholder="Describe any maintenance issues or requirements"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Submit Production Log
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorLogForm;

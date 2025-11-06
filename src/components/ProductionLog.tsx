
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Edit, Trash2, Clock, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProductionLogProps {
  department: string;
  filters: any;
}

const ProductionLog = ({ department, filters }: ProductionLogProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: '',
    machine: '',
    operator: '',
    outputUnits: '',
    targetUnits: '',
    speed: '',
    efficiency: '',
    downtimeMinutes: '',
    downtimeReason: '',
    notes: ''
  });

  // Mock data for display
  const productionEntries = [
    {
      id: 1,
      date: '2024-06-24',
      shift: 'Day Shift',
      machine: 'Loom 1',
      operator: 'John Smith',
      outputUnits: 2850,
      targetUnits: 3000,
      speed: 185,
      efficiency: 95.0,
      downtimeMinutes: 45,
      downtimeReason: 'Material change',
      notes: 'Running smoothly after material change'
    },
    {
      id: 2,
      date: '2024-06-24',
      shift: 'Night Shift',
      machine: 'Loom 2',
      operator: 'Mary Johnson',
      outputUnits: 2650,
      targetUnits: 3000,
      speed: 175,
      efficiency: 88.3,
      downtimeMinutes: 120,
      downtimeReason: 'Mechanical issue',
      notes: 'Maintenance required on feed mechanism'
    }
  ];

  const downtimeReasons = [
    'Material change',
    'Mechanical issue',
    'Quality check',
    'Break time',
    'Setup/Changeover',
    'Power outage',
    'Maintenance',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate efficiency when output and target are available
    if (field === 'outputUnits' || field === 'targetUnits') {
      const output = field === 'outputUnits' ? parseFloat(value) : parseFloat(formData.outputUnits);
      const target = field === 'targetUnits' ? parseFloat(value) : parseFloat(formData.targetUnits);
      
      if (output && target) {
        const efficiency = ((output / target) * 100).toFixed(1);
        setFormData(prev => ({ ...prev, efficiency }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving production entry:', formData);
    // Here you would save to your backend
    setShowForm(false);
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      shift: '',
      machine: '',
      operator: '',
      outputUnits: '',
      targetUnits: '',
      speed: '',
      efficiency: '',
      downtimeMinutes: '',
      downtimeReason: '',
      notes: ''
    });
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'bg-green-100 text-green-800';
    if (efficiency >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-700">Today's Output</h3>
            </div>
            <div className="text-2xl font-bold text-black">5,500 units</div>
            <p className="text-sm text-gray-500">Across all {department.toLowerCase()} machines</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-700">Avg Efficiency</h3>
            </div>
            <div className="text-2xl font-bold text-black">91.7%</div>
            <p className="text-sm text-gray-500">Target: 95%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <h3 className="text-sm font-medium text-gray-700">Total Downtime</h3>
            </div>
            <div className="text-2xl font-bold text-black">165 min</div>
            <p className="text-sm text-gray-500">2.7 hours today</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-sm font-medium text-gray-700">Active Issues</h3>
            </div>
            <div className="text-2xl font-bold text-black">2</div>
            <p className="text-sm text-gray-500">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">New {department} Production Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shift">Shift</Label>
                  <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Shift</SelectItem>
                      <SelectItem value="night">Night Shift</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="machine">Machine</Label>
                  <Select value={formData.machine} onValueChange={(value) => handleInputChange('machine', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select machine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loom_1">Loom 1</SelectItem>
                      <SelectItem value="loom_2">Loom 2</SelectItem>
                      <SelectItem value="cutter_a">Cutter A</SelectItem>
                      <SelectItem value="cutter_b">Cutter B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="operator">Operator</Label>
                  <Select value={formData.operator} onValueChange={(value) => handleInputChange('operator', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john_smith">John Smith</SelectItem>
                      <SelectItem value="mary_johnson">Mary Johnson</SelectItem>
                      <SelectItem value="david_brown">David Brown</SelectItem>
                      <SelectItem value="sarah_davis">Sarah Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="outputUnits">Output Units</Label>
                  <Input
                    id="outputUnits"
                    type="number"
                    value={formData.outputUnits}
                    onChange={(e) => handleInputChange('outputUnits', e.target.value)}
                    placeholder="Actual units produced"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="targetUnits">Target Units</Label>
                  <Input
                    id="targetUnits"
                    type="number"
                    value={formData.targetUnits}
                    onChange={(e) => handleInputChange('targetUnits', e.target.value)}
                    placeholder="Target units"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="speed">Speed (m/min)</Label>
                  <Input
                    id="speed"
                    type="number"
                    step="0.1"
                    value={formData.speed}
                    onChange={(e) => handleInputChange('speed', e.target.value)}
                    placeholder="Machine speed"
                  />
                </div>

                <div>
                  <Label htmlFor="efficiency">Efficiency %</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    step="0.1"
                    value={formData.efficiency}
                    onChange={(e) => handleInputChange('efficiency', e.target.value)}
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="downtimeMinutes">Downtime (Minutes)</Label>
                  <Input
                    id="downtimeMinutes"
                    type="number"
                    value={formData.downtimeMinutes}
                    onChange={(e) => handleInputChange('downtimeMinutes', e.target.value)}
                    placeholder="Total downtime"
                  />
                </div>

                <div>
                  <Label htmlFor="downtimeReason">Downtime Reason</Label>
                  <Select value={formData.downtimeReason} onValueChange={(value) => handleInputChange('downtimeReason', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {downtimeReasons.map((reason) => (
                        <SelectItem key={reason} value={reason.toLowerCase().replace(/\s+/g, '_')}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes / Comments</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional comments or notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Production Entries Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">{department} Production Log</CardTitle>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Output</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Downtime</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.shift}</TableCell>
                    <TableCell>{entry.machine}</TableCell>
                    <TableCell>{entry.operator}</TableCell>
                    <TableCell>{entry.outputUnits.toLocaleString()}</TableCell>
                    <TableCell>{entry.targetUnits.toLocaleString()}</TableCell>
                    <TableCell>{entry.speed} m/min</TableCell>
                    <TableCell>
                      <Badge className={getEfficiencyColor(entry.efficiency)}>
                        {entry.efficiency}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.downtimeMinutes} min</div>
                        <div className="text-xs text-gray-500">{entry.downtimeReason}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={entry.notes}>
                        {entry.notes}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionLog;

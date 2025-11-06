import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Download } from 'lucide-react';

const PayrollNotes = () => {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeWarnings, setIncludeWarnings] = useState(true);
  const [includeMedical, setIncludeMedical] = useState(true);
  const [includeMissedShifts, setIncludeMissedShifts] = useState(true);

  const notesData = [
    {
      name: 'Josh M.',
      missedShifts: 1,
      warnings: 1,
      leaveRequests: 0,
      medicalNotes: 0,
      notes: 'Late arrival on Tuesday - mechanical issue with transport'
    },
    {
      name: 'Sarah Brown',
      missedShifts: 0,
      warnings: 0,
      leaveRequests: 1,
      medicalNotes: 0,
      notes: 'Annual leave request for next month approved'
    },
    {
      name: 'Mike Davis',
      missedShifts: 1,
      warnings: 0,
      leaveRequests: 0,
      medicalNotes: 1,
      notes: 'Sick leave Saturday - medical certificate provided'
    },
    {
      name: 'S. Patel',
      missedShifts: 0,
      warnings: 0,
      leaveRequests: 0,
      medicalNotes: 0,
      notes: 'Excellent attendance record'
    },
    {
      name: 'R. Kumar',
      missedShifts: 0,
      warnings: 0,
      leaveRequests: 1,
      medicalNotes: 0,
      notes: 'Currently on approved annual leave'
    }
  ];

  const handleGeneratePayroll = () => {
    console.log('Generating payroll summary...');
    console.log('Include warnings:', includeWarnings);
    console.log('Include medical:', includeMedical);
    console.log('Include missed shifts:', includeMissedShifts);
    console.log('Export format:', exportFormat);
  };

  const handleExportPayroll = () => {
    console.log(`Exporting payroll prep as ${exportFormat.toUpperCase()}...`);
  };

  const getBadgeColor = (count: number) => {
    if (count === 0) return 'bg-green-100 text-green-800';
    if (count <= 2) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Notes & payroll prep</h3>
          <div className="flex gap-2">
            <Button onClick={handleGeneratePayroll} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate payroll summary
            </Button>
            <Button onClick={handleExportPayroll}>
              <Download className="h-4 w-4 mr-2" />
              Export payroll prep
            </Button>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium mb-3">Export format</h4>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xls">XLS (Excel)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xero">Xero compatible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-medium mb-3">Include in export</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="warnings" 
                  checked={includeWarnings}
                  onCheckedChange={(checked) => setIncludeWarnings(checked === true)}
                />
                <label htmlFor="warnings" className="text-sm">Include warnings</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medical" 
                  checked={includeMedical}
                  onCheckedChange={(checked) => setIncludeMedical(checked === true)}
                />
                <label htmlFor="medical" className="text-sm">Include medical</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="missed-shifts" 
                  checked={includeMissedShifts}
                  onCheckedChange={(checked) => setIncludeMissedShifts(checked === true)}
                />
                <label htmlFor="missed-shifts" className="text-sm">Include missed shifts</label>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Missed shifts</TableHead>
                <TableHead>Warnings</TableHead>
                <TableHead>Leave requests</TableHead>
                <TableHead>Medical notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notesData.map((staff, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(staff.missedShifts)}>
                      {staff.missedShifts}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(staff.warnings)}>
                      {staff.warnings}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(staff.leaveRequests)}>
                      {staff.leaveRequests}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(staff.medicalNotes)}>
                      {staff.medicalNotes}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedStaff(staff.name)}>
                          View notes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Staff notes - {staff.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Current notes</label>
                            <Textarea
                              defaultValue={staff.notes}
                              className="mt-1"
                              rows={4}
                              placeholder="Add notes visible to HR/ops only..."
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save notes</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Payroll summary includes:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Total hours</div>
              <div className="text-gray-600">Regular + overtime</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Overtime hours</div>
              <div className="text-gray-600">Premium rate calculation</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Deductions</div>
              <div className="text-gray-600">Late arrivals, absences</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Summary per staff</div>
              <div className="text-gray-600">Individual breakdowns</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollNotes;

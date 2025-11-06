import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, Edit, Trash2 } from 'lucide-react';
import {
  useCompanies,
  useFactories,
  useShifts,
  useUpdateCompany,
  useCreateFactory,
  useUpdateFactory,
  useCreateShift,
  useDeleteShift,
} from '@/hooks/useCompaniesAndFactories';

const FactoryTab = () => {
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: factories = [], isLoading: factoriesLoading } = useFactories();
  const { data: shifts = [], isLoading: shiftsLoading } = useShifts();
  
  const updateCompany = useUpdateCompany();
  const createFactory = useCreateFactory();
  const updateFactory = useUpdateFactory();
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();

  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [showAddFactory, setShowAddFactory] = useState(false);
  const [showEditFactory, setShowEditFactory] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [editingFactory, setEditingFactory] = useState<any>(null);
  
  const [newFactory, setNewFactory] = useState({
    name: '',
    location: '',
    status: 'Active'
  });

  const [newShift, setNewShift] = useState({
    name: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  // Select first company by default
  React.useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
      setEditingCompany(companies[0]);
    }
  }, [companies, selectedCompany]);

  const handleUpdateCompany = () => {
    if (editingCompany?.id) {
      updateCompany.mutate(editingCompany);
    }
  };

  const handleAddFactory = () => {
    if (selectedCompany?.id) {
      createFactory.mutate({
        ...newFactory,
        company_id: selectedCompany.id,
      });
      setShowAddFactory(false);
      setNewFactory({ name: '', location: '', status: 'Active' });
    }
  };

  const handleEditFactory = (factory: any) => {
    setEditingFactory(factory);
    setShowEditFactory(true);
  };

  const handleSaveFactory = () => {
    if (editingFactory?.id) {
      updateFactory.mutate(editingFactory);
      setShowEditFactory(false);
      setEditingFactory(null);
    }
  };

  const handleAddShift = () => {
    if (selectedCompany?.id) {
      createShift.mutate({
        ...newShift,
        company_id: selectedCompany.id,
      });
      setShowAddShift(false);
      setNewShift({ name: '', start_time: '', end_time: '', description: '' });
    }
  };

  const handleDeleteShift = (shiftId: string) => {
    deleteShift.mutate(shiftId);
  };

  const companyFactories = factories.filter(f => f.company_id === selectedCompany?.id);
  const companyShifts = shifts.filter(s => s.company_id === selectedCompany?.id);

  if (companiesLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Company Selector */}
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium">Viewing Company:</Label>
        <Select
          value={selectedCompany?.id}
          onValueChange={(id) => {
            const company = companies.find(c => c.id === id);
            setSelectedCompany(company);
            setEditingCompany(company);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={editingCompany?.name || ''}
                onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                className="w-48 h-8"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <Label htmlFor="currency">Default Currency</Label>
              <Input
                id="currency"
                value={editingCompany?.currency || ''}
                onChange={(e) => setEditingCompany({...editingCompany, currency: e.target.value})}
                className="w-24 h-8"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                value={editingCompany?.contact_email || ''}
                onChange={(e) => setEditingCompany({...editingCompany, contact_email: e.target.value})}
                className="w-56 h-8"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleUpdateCompany} disabled={updateCompany.isPending}>
                {updateCompany.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload company logo</p>
                <p className="text-xs text-gray-500">Recommended: 200x60px, PNG or SVG</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={editingCompany?.business_hours_start || ''}
                    onChange={(e) => setEditingCompany({...editingCompany, business_hours_start: e.target.value})}
                    className="w-24 h-8"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={editingCompany?.business_hours_end || ''}
                    onChange={(e) => setEditingCompany({...editingCompany, business_hours_end: e.target.value})}
                    className="w-24 h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Factory Locations */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Factory Locations</h3>
        <Dialog open={showAddFactory} onOpenChange={setShowAddFactory}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Factory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Factory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="factoryName">Factory Name</Label>
                <Input
                  id="factoryName"
                  value={newFactory.name}
                  onChange={(e) => setNewFactory({...newFactory, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="factoryLocation">Location</Label>
                <Input
                  id="factoryLocation"
                  value={newFactory.location}
                  onChange={(e) => setNewFactory({...newFactory, location: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddFactory(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFactory} disabled={createFactory.isPending}>
                  {createFactory.isPending ? 'Adding...' : 'Add Factory'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factory Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyFactories.map((factory) => (
                <TableRow key={factory.id}>
                  <TableCell className="font-medium">{factory.name}</TableCell>
                  <TableCell>{factory.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${factory.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-xs font-medium">{factory.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditFactory(factory)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Factory Dialog */}
      <Dialog open={showEditFactory} onOpenChange={setShowEditFactory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Factory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editFactoryName">Factory Name</Label>
              <Input
                id="editFactoryName"
                value={editingFactory?.name || ''}
                onChange={(e) => setEditingFactory({...editingFactory, name: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="editFactoryLocation">Location</Label>
              <Input
                id="editFactoryLocation"
                value={editingFactory?.location || ''}
                onChange={(e) => setEditingFactory({...editingFactory, location: e.target.value})}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditFactory(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFactory} disabled={updateFactory.isPending}>
                {updateFactory.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shift Management */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Shift Management</h3>
        <Dialog open={showAddShift} onOpenChange={setShowAddShift}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Shift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shift</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="shiftName">Shift Name</Label>
                <Input
                  id="shiftName"
                  value={newShift.name}
                  onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                  placeholder="e.g. Morning Shift"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newShift.start_time}
                    onChange={(e) => setNewShift({...newShift, start_time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newShift.end_time}
                    onChange={(e) => setNewShift({...newShift, end_time: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newShift.description}
                  onChange={(e) => setNewShift({...newShift, description: e.target.value})}
                  placeholder="Brief description of the shift"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddShift(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddShift} disabled={createShift.isPending}>
                  {createShift.isPending ? 'Adding...' : 'Add Shift'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift Name</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyShifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{shift.name}</TableCell>
                  <TableCell>{shift.start_time}</TableCell>
                  <TableCell>{shift.end_time}</TableCell>
                  <TableCell>{shift.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteShift(shift.id)}
                      disabled={deleteShift.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactoryTab;

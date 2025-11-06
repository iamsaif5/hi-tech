
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useFactories } from '@/hooks/useCompaniesAndFactories';
import { useMachines } from '@/hooks/useSupabaseData';

const FactorySetupTab = () => {
  const { data: factories = [], isLoading: factoriesLoading } = useFactories();
  const { data: machines = [], isLoading: machinesLoading } = useMachines();


  const [newMachine, setNewMachine] = useState({
    name: '',
    production_target: 0,
    target_unit: '',
    factory_id: '',
    status: 'active'
  });

  const [showAddMachine, setShowAddMachine] = useState(false);

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-xs font-medium">Active</span></div>
      : <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-xs font-medium">Inactive</span></div>;
  };

  const handleAddMachine = () => {
    console.log('Adding machine:', newMachine);
    setShowAddMachine(false);
    setNewMachine({ name: '', production_target: 0, target_unit: '', factory_id: '', status: 'active' });
  };

  if (factoriesLoading || machinesLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Factory locations are now managed in Settings → Company Config. 
          Use this section to manage production machines.
        </p>
      </div>

      {/* Machines Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">
          Production Machines
        </h3>
        <Dialog open={showAddMachine} onOpenChange={setShowAddMachine}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Machine
            </Button>
          </DialogTrigger>
          <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Machine</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="machineName">Machine Name</Label>
                    <Input
                      id="machineName"
                      value={newMachine.name}
                      onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productionTarget">Production Target</Label>
                    <Input
                      id="productionTarget"
                      type="number"
                      value={newMachine.production_target}
                      onChange={(e) => setNewMachine({...newMachine, production_target: parseInt(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetUnit">Target Unit</Label>
                    <Input
                      id="targetUnit"
                      value={newMachine.target_unit}
                      onChange={(e) => setNewMachine({...newMachine, target_unit: e.target.value})}
                      className="mt-1"
                      placeholder="e.g. units/hour, meters/shift"
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineFactory">Factory</Label>
                    <Select
                      value={newMachine.factory_id}
                      onValueChange={(value) => setNewMachine({...newMachine, factory_id: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select factory" />
                      </SelectTrigger>
                      <SelectContent>
                        {factories.map((factory) => (
                          <SelectItem key={factory.id} value={factory.id}>{factory.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowAddMachine(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMachine}>
                      Add Machine
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
                <TableHead>Machine Name</TableHead>
                <TableHead>Production Target</TableHead>
                <TableHead>Target Unit</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine) => {
                const machineFactory = factories.find(f => f.id === machine.factory_id);
                return (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.name}</TableCell>
                    <TableCell>{machine.production_target}</TableCell>
                    <TableCell>{machine.target_unit || 'N/A'}</TableCell>
                    <TableCell>{machineFactory?.name || 'Unassigned'}</TableCell>
                    <TableCell>{getStatusBadge(machine.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactorySetupTab;

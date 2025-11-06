
import React, { useState } from 'react';
import { useEmployees, useUpdateEmployee, useCreateEmployee } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Plus, User } from 'lucide-react';

interface Employee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  employee_type: string;
  company?: string | null;
  hourly_rate: number;
  department?: string | null;
  position?: string | null;
  atg_clock_number?: string | null;
  union_member?: boolean;
  bank_name?: string | null;
  bank_account_number?: string | null;
  comments?: string | null;
  is_active?: boolean;
  bonus_eligible?: boolean;
  lateness_penalty_rate?: number;
}

const StaffManagement = () => {
  const { data: employees, isLoading } = useEmployees();
  const updateEmployee = useUpdateEmployee();
  const createEmployee = useCreateEmployee();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const employeeData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      employee_type: formData.get('employee_type') as 'casual' | 'permanent',
      company: formData.get('company') as string || null,
      hourly_rate: parseFloat(formData.get('hourly_rate') as string),
      department: formData.get('department') as string,
      position: formData.get('position') as string,
      atg_clock_number: formData.get('atg_clock_number') as string,
      union_member: formData.get('union_member') === 'true',
      bank_name: formData.get('bank_name') as string,
      bank_account_number: formData.get('bank_account_number') as string,
      comments: formData.get('comments') as string,
    };

    try {
      if (editingEmployee) {
        // Update existing employee
        const updatedEmployee = {
          ...editingEmployee,
          ...employeeData,
        };
        await updateEmployee.mutateAsync(updatedEmployee);
      } else {
        // Add new employee
        const newEmployeeData = {
          ...employeeData,
          employee_number: `EMP${Date.now()}`, // Generate unique employee number
          lateness_penalty_rate: employeeData.employee_type === 'casual' ? 10.00 : 20.00,
          bonus_eligible: false, // Set based on hourly rate later
          is_active: true,
        };
        await createEmployee.mutateAsync(newEmployeeData);
      }
      
      setIsDialogOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive/10 text-destructive';
      case 'supervisor': return 'bg-brand-primary-light';
      case 'operator': return 'bg-brand-success-light';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStaffTypeColor = (staffType: string) => {
    return staffType === 'permanent' 
      ? 'bg-brand-success-light' 
      : 'bg-hitec-highlight/10 text-hitec-highlight';
  };

  const formatShift = (shift?: string) => {
    if (!shift) return 'Not assigned';
    return shift.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEmployee(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    defaultValue={editingEmployee?.first_name || ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    defaultValue={editingEmployee?.last_name || ''}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_type">Employee Type</Label>
                  <Select name="employee_type" defaultValue={editingEmployee?.employee_type || 'permanent'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select name="company" defaultValue={editingEmployee?.company || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Casual)</SelectItem>
                      <SelectItem value="R&M">R&M</SelectItem>
                      <SelectItem value="HITEC">HITEC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Hourly Rate (R)</Label>
                  <Input
                    id="hourly_rate"
                    name="hourly_rate"
                    type="number"
                    step="0.01"
                    defaultValue={editingEmployee?.hourly_rate || ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="atg_clock_number">ATG Clock Number</Label>
                  <Input
                    id="atg_clock_number"
                    name="atg_clock_number"
                    defaultValue={editingEmployee?.atg_clock_number || ''}
                    placeholder="CLK001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    defaultValue={editingEmployee?.department || ''}
                    placeholder="Production, QC, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    defaultValue={editingEmployee?.position || ''}
                    placeholder="Operator, Supervisor, etc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    name="bank_name"
                    defaultValue={editingEmployee?.bank_name || ''}
                    placeholder="FNB, Standard Bank, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Account Number</Label>
                  <Input
                    id="bank_account_number"
                    name="bank_account_number"
                    defaultValue={editingEmployee?.bank_account_number || ''}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="union_member">Union Member</Label>
                <Select name="union_member" defaultValue={editingEmployee?.union_member ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select union status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  name="comments"
                  defaultValue={editingEmployee?.comments || ''}
                  placeholder="Additional notes..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={updateEmployee.isPending || createEmployee.isPending}>
                {(updateEmployee.isPending || createEmployee.isPending) ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {employees?.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStaffTypeColor(employee.employee_type)}`}>
                      {employee.employee_type}
                    </span>
                    {employee.factory && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-primary-light">
                        {employee.factory}
                      </span>
                    )}
                    {employee.bonus_eligible && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-success-light">
                        Bonus Eligible
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span>{employee.department || 'No department'}</span>
                    <span>•</span>
                    <span>R{employee.hourly_rate}/hr</span>
                    <span>•</span>
                    <span>{employee.atg_clock_number || 'No clock number'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingEmployee(employee);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;

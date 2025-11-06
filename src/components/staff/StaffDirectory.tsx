import React, { useState, useEffect } from 'react';
import { useEmployees, useCreateEmployee, useUpdateEmployee } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Search, Filter, Mail, Phone, Calendar, Clock, DollarSign, FileText, Download, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const StaffDirectory = () => {
  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [timeRecords, setTimeRecords] = useState([]);
  const [loanDetails, setLoanDetails] = useState([]);
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showEditStaffDialog, setShowEditStaffDialog] = useState(false);
  const [loanForm, setLoanForm] = useState({
    loan_type: '',
    original_amount: '',
    monthly_payment: '',
    start_date: '',
    notes: ''
  });
  const [newStaffForm, setNewStaffForm] = useState({
    employee_number: '',
    first_name: '',
    last_name: '',
    employee_type: 'permanent',
    factory: 'Main Factory',
    hourly_rate: '',
    department: '',
    position: '',
    atg_clock_number: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editStaffForm, setEditStaffForm] = useState({
    id: '',
    employee_number: '',
    first_name: '',
    last_name: '',
    employee_type: 'permanent',
    factory: 'Main Factory',
    hourly_rate: '',
    department: '',
    position: '',
    atg_clock_number: '',
    email: '',
    phone: '',
    address: '',
    bank_name: '',
    bank_account_number: '',
    tax_number: '',
    emergency_contact: ''
  });
  const [companyNames, setCompanyNames] = useState({
    company_r_and_m: 'R&M',
    company_hitec: 'HITEC'
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['company_r_and_m', 'company_hitec']);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings = data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value || '';
          return acc;
        }, {} as Record<string, string>);

        setCompanyNames(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
      // Keep default values if fetch fails
    }
  };

  const itemsPerPage = 20;

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const filteredStaff = employees?.filter(employee => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.atg_clock_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = filterCompany === 'all' || employee.factory === filterCompany;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesType = filterType === 'all' || employee.employee_type === filterType;
    
    return matchesSearch && matchesCompany && matchesDepartment && matchesType;
  }) || [];

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIdx, startIdx + itemsPerPage);

  const handleRowClick = async (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
    
    // Fetch related data
    await Promise.all([
      fetchPayrollHistory(employee.id),
      fetchTimeRecords(employee.id),
      fetchLoanDetails(employee.id)
    ]);
  };

  const fetchPayrollHistory = async (employeeId) => {
    try {
      const { data, error } = await supabase
        .from('payroll_records')
        .select(`
          *,
          payroll_periods (
            period_name,
            start_date,
            end_date,
            pay_date
          )
        `)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      setPayrollHistory(data || []);
    } catch (error) {
      console.error('Error fetching payroll history:', error);
      setPayrollHistory([]);
    }
  };

  const fetchTimeRecords = async (employeeId) => {
    try {
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('employee_id', employeeId)
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      setTimeRecords(data || []);
    } catch (error) {
      console.error('Error fetching time records:', error);
      setTimeRecords([]);
    }
  };

  const fetchLoanDetails = async (employeeId) => {
    try {
      const { data, error } = await supabase
        .from('employee_loans')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLoanDetails(data || []);
    } catch (error) {
      console.error('Error fetching loan details:', error);
      setLoanDetails([]);
    }
  };

  const handleAddLoan = async () => {
    if (!selectedEmployee || !loanForm.loan_type || !loanForm.original_amount || !loanForm.monthly_payment || !loanForm.start_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('employee_loans')
        .insert({
          employee_id: selectedEmployee.id,
          loan_type: loanForm.loan_type,
          original_amount: parseFloat(loanForm.original_amount),
          outstanding_balance: parseFloat(loanForm.original_amount),
          monthly_payment: parseFloat(loanForm.monthly_payment),
          start_date: loanForm.start_date,
          notes: loanForm.notes || null,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Loan added successfully",
      });

      // Reset form and close dialog
      setLoanForm({
        loan_type: '',
        original_amount: '',
        monthly_payment: '',
        start_date: '',
        notes: ''
      });
      setShowLoanDialog(false);
      
      // Refresh loan details
      fetchLoanDetails(selectedEmployee.id);
    } catch (error) {
      console.error('Error adding loan:', error);
      toast({
        title: "Error",
        description: "Failed to add loan",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    console.log('Exporting staff directory to CSV...');
  };

  const handleAddNewStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStaffForm.employee_number || !newStaffForm.first_name || !newStaffForm.last_name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      await createEmployee.mutateAsync({
        employee_number: newStaffForm.employee_number,
        first_name: newStaffForm.first_name,
        last_name: newStaffForm.last_name,
        employee_type: newStaffForm.employee_type,
        hourly_rate: parseFloat(newStaffForm.hourly_rate) || 0,
        department: newStaffForm.department,
        position: newStaffForm.position,
        atg_clock_number: newStaffForm.atg_clock_number
      });

      // Reset form and close dialog
      setNewStaffForm({
        employee_number: '',
        first_name: '',
        last_name: '',
        employee_type: 'permanent',
        factory: 'Main Factory',
        hourly_rate: '',
        department: '',
        position: '',
        atg_clock_number: '',
        email: '',
        phone: '',
        address: ''
      });
      setShowAddStaffDialog(false);

      toast({
        title: "Success",
        description: "Staff member added successfully"
      });
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add staff member"
      });
    }
  };

  const handleEditStaff = (employee: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditStaffForm({
      id: employee.id,
      employee_number: employee.employee_number || '',
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      employee_type: employee.employee_type || 'permanent',
      factory: employee.factory || 'Main Factory',
      hourly_rate: employee.hourly_rate?.toString() || '',
      department: employee.department || '',
      position: employee.position || '',
      atg_clock_number: employee.atg_clock_number || '',
      email: employee.email || '',
      phone: employee.phone || '',
      address: employee.address || '',
      bank_name: employee.bank_name || '',
      bank_account_number: employee.bank_account_number || '',
      tax_number: employee.tax_number || '',
      emergency_contact: employee.emergency_contact || ''
    });
    setShowEditStaffDialog(true);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editStaffForm.employee_number || !editStaffForm.first_name || !editStaffForm.last_name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      await updateEmployee.mutateAsync({
        id: editStaffForm.id,
        employee_number: editStaffForm.employee_number,
        first_name: editStaffForm.first_name,
        last_name: editStaffForm.last_name,
        employee_type: editStaffForm.employee_type,
        factory: editStaffForm.factory,
        hourly_rate: parseFloat(editStaffForm.hourly_rate) || 0,
        department: editStaffForm.department,
        position: editStaffForm.position,
        atg_clock_number: editStaffForm.atg_clock_number,
        email: editStaffForm.email,
        phone: editStaffForm.phone,
        address: editStaffForm.address,
        bank_name: editStaffForm.bank_name,
        bank_account_number: editStaffForm.bank_account_number,
        tax_number: editStaffForm.tax_number,
        emergency_contact: editStaffForm.emergency_contact
      });

      setShowEditStaffDialog(false);

      toast({
        title: "Success",
        description: "Staff member updated successfully"
      });
    } catch (error) {
      console.error('Error updating staff:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update staff member"
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'R0.00';
    return `R${parseFloat(amount).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Loading staff directory...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header - Clients style */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Staff Directory</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
          </Button>
          <Button onClick={() => setShowAddStaffDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add new staff
          </Button>
        </div>
      </div>

      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger>
            <SelectValue placeholder="Factory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All factories</SelectItem>
            <SelectItem value={companyNames.company_r_and_m}>{companyNames.company_r_and_m}</SelectItem>
            <SelectItem value={companyNames.company_hitec}>{companyNames.company_hitec}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            <SelectItem value="CUTTING">CUTTING</SelectItem>
            <SelectItem value="UNIT 1">UNIT 1</SelectItem>
            <SelectItem value="UNIT 2">UNIT 2</SelectItem>
            <SelectItem value="UNIT 3">UNIT 3</SelectItem>
            <SelectItem value="UNIT 4">UNIT 4</SelectItem>
            <SelectItem value="UNIT 6">UNIT 6</SelectItem>
            <SelectItem value="LOOMS">LOOMS</SelectItem>
            <SelectItem value="EXTRUDER">EXTRUDER</SelectItem>
            <SelectItem value="LINERS">LINERS</SelectItem>
            <SelectItem value="BAILING">BAILING</SelectItem>
            <SelectItem value="PRINTING">PRINTING</SelectItem>
            <SelectItem value="CLEANER">CLEANER</SelectItem>
            <SelectItem value="PAINTER/NIC">PAINTER/NIC</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Permanent">Permanent</SelectItem>
            <SelectItem value="Casual">Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {/* Floating header with no container - matching Clients page */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Staff Management</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Table with grey header - matching Clients page exactly */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Employee</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Clock Number</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Hourly Rate</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedStaff.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(employee)}
                  >
                    <td className="py-2 px-4">
                      <div>
                        <p className="font-medium text-blue-600 text-xs">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{employee.employee_number}</p>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-xs">{employee.atg_clock_number || 'N/A'}</td>
                    <td className="py-2 px-4 text-xs">{employee.department || 'N/A'}</td>
                    <td className="py-2 px-4 text-xs">R{employee.hourly_rate}/hr</td>
                    <td className="py-2 px-4">
                      <Badge variant="outline" className="text-xs">{employee.employee_type}</Badge>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          employee.is_active ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs">
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={(e) => handleEditStaff(employee, e)}
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">Archive</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-600">
              Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredStaff.length)} of {filteredStaff.length} staff members
            </p>
          </div>

          {/* Enhanced Employee Details Modal - Orders Style */}
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
              {selectedEmployee && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {selectedEmployee.first_name} {selectedEmployee.last_name}
                        </h1>
                        <p className="text-gray-600">
                          {selectedEmployee.employee_number} • {selectedEmployee.department || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={selectedEmployee.is_active ? "default" : "secondary"}>
                        {selectedEmployee.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="clean-tabs">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="contact">Contact & Bank</TabsTrigger>
                      <TabsTrigger value="hours">Hours</TabsTrigger>
                      <TabsTrigger value="payslips">Payslips</TabsTrigger>
                      <TabsTrigger value="loans">Loans</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Employee Number</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-lg font-semibold text-gray-900">{selectedEmployee.employee_number}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Department</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-lg font-semibold text-gray-900">{selectedEmployee.department || 'Unassigned'}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Hourly Rate</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedEmployee.hourly_rate)}/hr</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Start Date</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-lg font-semibold text-gray-900">{formatDate(selectedEmployee.hire_date)}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Employment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Employee Type</p>
                              <p className="text-gray-900">{selectedEmployee.employee_type}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Factory Location</p>
                              <p className="text-gray-900">{selectedEmployee.factory}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Position</p>
                              <p className="text-gray-900">{selectedEmployee.position || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Clock Number</p>
                              <p className="text-gray-900">{selectedEmployee.atg_clock_number || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Union Member</p>
                              <Badge variant="outline">
                                {selectedEmployee.union_member ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Bonus Eligible</p>
                              <Badge variant="outline">
                                {selectedEmployee.bonus_eligible ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Mail className="h-5 w-5" />
                              Contact Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Email Address</Label>
                              <p className="text-gray-900">{selectedEmployee.email || 'No email on file'}</p>
                            </div>
                            <div>
                              <Label>Phone Number</Label>
                              <p className="text-gray-900">{selectedEmployee.phone || 'No phone on file'}</p>
                            </div>
                            <div>
                              <Label>Emergency Contact</Label>
                              <p className="text-gray-900">{selectedEmployee.emergency_contact || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label>Address</Label>
                              <p className="text-gray-900">{selectedEmployee.address || 'Not provided'}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5" />
                              Banking Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Bank Name</Label>
                              <p className="text-gray-900">{selectedEmployee.bank_name || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label>Account Number</Label>
                              <p className="text-gray-900">{selectedEmployee.bank_account_number || 'Not provided'}</p>
                            </div>
                            <div>
                              <Label>Payment Method</Label>
                              <p className="text-gray-900">{selectedEmployee.payment_method || 'Bank Transfer'}</p>
                            </div>
                            <div>
                              <Label>Tax Number</Label>
                              <p className="text-gray-900">{selectedEmployee.tax_number || 'Not provided'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="hours" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Time Records (Last 30 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Clock In</TableHead>
                                <TableHead>Clock Out</TableHead>
                                <TableHead>Total Hours</TableHead>
                                <TableHead>Overtime</TableHead>
                                <TableHead>Late (mins)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {timeRecords.length > 0 ? timeRecords.map((record) => (
                                <TableRow key={record.id}>
                                  <TableCell>{formatDate(record.date)}</TableCell>
                                  <TableCell>{record.clock_in || 'N/A'}</TableCell>
                                  <TableCell>{record.clock_out || 'N/A'}</TableCell>
                                  <TableCell>{record.total_hours || '0'}</TableCell>
                                  <TableCell>{record.overtime_hours || '0'}</TableCell>
                                  <TableCell>{record.late_minutes || '0'}</TableCell>
                                </TableRow>
                              )) : (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No time records found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="payslips" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Payroll History (Last 12 Months)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Regular Hours</TableHead>
                                <TableHead>Overtime Hours</TableHead>
                                <TableHead>Gross Pay</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {payrollHistory.length > 0 ? payrollHistory.map((record) => (
                                <TableRow key={record.id}>
                                  <TableCell>{record.payroll_periods?.period_name || 'N/A'}</TableCell>
                                  <TableCell>{record.regular_hours || '0'}</TableCell>
                                  <TableCell>{record.overtime_hours || '0'}</TableCell>
                                  <TableCell>{formatCurrency(record.gross_pay)}</TableCell>
                                  <TableCell>{formatCurrency(record.total_deductions)}</TableCell>
                                  <TableCell className="font-semibold">{formatCurrency(record.net_pay)}</TableCell>
                                  <TableCell>
                                    <Badge variant={record.payment_status === 'paid' ? 'default' : 'secondary'}>
                                      {record.payment_status || 'pending'}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )) : (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No payroll records found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="loans" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>Employee Loans</CardTitle>
                            <Button size="sm" onClick={() => setShowLoanDialog(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Loan
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {loanDetails.length > 0 ? loanDetails.map((loan) => (
                              <div key={loan.id} className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Loan Type</p>
                                    <p className="font-medium text-gray-900">{loan.loan_type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Original Amount</p>
                                    <p className="text-gray-900">{formatCurrency(loan.original_amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Outstanding Balance</p>
                                    <p className="font-semibold text-red-600">{formatCurrency(loan.outstanding_balance)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Monthly Payment</p>
                                    <p className="text-gray-900">{formatCurrency(loan.monthly_payment)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Start Date</p>
                                    <p className="text-gray-900">{formatDate(loan.start_date)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Status</p>
                                    <Badge variant={loan.status === 'active' ? 'destructive' : 'default'}>
                                      {loan.status}
                                    </Badge>
                                  </div>
                                </div>
                                {loan.notes && (
                                  <div className="mt-2 pt-2 border-t">
                                    <p className="text-sm text-gray-700">{loan.notes}</p>
                                  </div>
                                )}
                              </div>
                            )) : (
                              <div className="text-center text-muted-foreground py-8">
                                <p>No loans found for this employee</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Add Loan Dialog */}
          <Dialog open={showLoanDialog} onOpenChange={setShowLoanDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Employee Loan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loan_type">Loan Type</Label>
                  <Select value={loanForm.loan_type} onValueChange={(value) => setLoanForm({...loanForm, loan_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary_advance">Salary Advance</SelectItem>
                      <SelectItem value="equipment_loan">Equipment Loan</SelectItem>
                      <SelectItem value="emergency_loan">Emergency Loan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="original_amount">Loan Amount (R)</Label>
                  <Input
                    id="original_amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={loanForm.original_amount}
                    onChange={(e) => setLoanForm({...loanForm, original_amount: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="monthly_payment">Monthly Payment (R)</Label>
                  <Input
                    id="monthly_payment"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={loanForm.monthly_payment}
                    onChange={(e) => setLoanForm({...loanForm, monthly_payment: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={loanForm.start_date}
                    onChange={(e) => setLoanForm({...loanForm, start_date: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about the loan..."
                    value={loanForm.notes}
                    onChange={(e) => setLoanForm({...loanForm, notes: e.target.value})}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowLoanDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddLoan} className="flex-1">
                    Add Loan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add New Staff Dialog */}
          <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddNewStaff} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee_number">Employee Number *</Label>
                    <Input
                      id="employee_number"
                      value={newStaffForm.employee_number}
                      onChange={(e) => setNewStaffForm({...newStaffForm, employee_number: e.target.value})}
                      placeholder="EMP001"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="atg_clock_number">Clock Number</Label>
                    <Input
                      id="atg_clock_number"
                      value={newStaffForm.atg_clock_number}
                      onChange={(e) => setNewStaffForm({...newStaffForm, atg_clock_number: e.target.value})}
                      placeholder="C001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={newStaffForm.first_name}
                      onChange={(e) => setNewStaffForm({...newStaffForm, first_name: e.target.value})}
                      placeholder="John"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={newStaffForm.last_name}
                      onChange={(e) => setNewStaffForm({...newStaffForm, last_name: e.target.value})}
                      placeholder="Doe"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="employee_type">Employee Type</Label>
                    <Select value={newStaffForm.employee_type} onValueChange={(value) => setNewStaffForm({...newStaffForm, employee_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="factory">Factory</Label>
                    <Select value={newStaffForm.factory} onValueChange={(value) => setNewStaffForm({...newStaffForm, factory: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main Factory">Main Factory</SelectItem>
                        <SelectItem value={companyNames.company_r_and_m}>{companyNames.company_r_and_m}</SelectItem>
                        <SelectItem value={companyNames.company_hitec}>{companyNames.company_hitec}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newStaffForm.department} onValueChange={(value) => setNewStaffForm({...newStaffForm, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUTTING">CUTTING</SelectItem>
                        <SelectItem value="UNIT 1">UNIT 1</SelectItem>
                        <SelectItem value="UNIT 2">UNIT 2</SelectItem>
                        <SelectItem value="UNIT 3">UNIT 3</SelectItem>
                        <SelectItem value="UNIT 4">UNIT 4</SelectItem>
                        <SelectItem value="UNIT 6">UNIT 6</SelectItem>
                        <SelectItem value="LOOMS">LOOMS</SelectItem>
                        <SelectItem value="EXTRUDER">EXTRUDER</SelectItem>
                        <SelectItem value="LINERS">LINERS</SelectItem>
                        <SelectItem value="BAILING">BAILING</SelectItem>
                        <SelectItem value="PRINTING">PRINTING</SelectItem>
                        <SelectItem value="CLEANER">CLEANER</SelectItem>
                        <SelectItem value="PAINTER/NIC">PAINTER/NIC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newStaffForm.position}
                      onChange={(e) => setNewStaffForm({...newStaffForm, position: e.target.value})}
                      placeholder="Machine Operator"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (R)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      step="0.01"
                      value={newStaffForm.hourly_rate}
                      onChange={(e) => setNewStaffForm({...newStaffForm, hourly_rate: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({...newStaffForm, email: e.target.value})}
                      placeholder="john.doe@company.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({...newStaffForm, phone: e.target.value})}
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newStaffForm.address}
                    onChange={(e) => setNewStaffForm({...newStaffForm, address: e.target.value})}
                    placeholder="Full address..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddStaffDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Staff Member
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Staff Dialog */}
          <Dialog open={showEditStaffDialog} onOpenChange={setShowEditStaffDialog}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Staff Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateStaff} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="banking">Banking</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit_employee_number">Employee Number *</Label>
                        <Input
                          id="edit_employee_number"
                          value={editStaffForm.employee_number}
                          onChange={(e) => setEditStaffForm({...editStaffForm, employee_number: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_atg_clock_number">Clock Number</Label>
                        <Input
                          id="edit_atg_clock_number"
                          value={editStaffForm.atg_clock_number}
                          onChange={(e) => setEditStaffForm({...editStaffForm, atg_clock_number: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_first_name">First Name *</Label>
                        <Input
                          id="edit_first_name"
                          value={editStaffForm.first_name}
                          onChange={(e) => setEditStaffForm({...editStaffForm, first_name: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_last_name">Last Name *</Label>
                        <Input
                          id="edit_last_name"
                          value={editStaffForm.last_name}
                          onChange={(e) => setEditStaffForm({...editStaffForm, last_name: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_employee_type">Employee Type</Label>
                        <Select value={editStaffForm.employee_type} onValueChange={(value) => setEditStaffForm({...editStaffForm, employee_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="permanent">Permanent</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="edit_factory">Factory</Label>
                        <Select value={editStaffForm.factory} onValueChange={(value) => setEditStaffForm({...editStaffForm, factory: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Main Factory">Main Factory</SelectItem>
                            <SelectItem value={companyNames.company_r_and_m}>{companyNames.company_r_and_m}</SelectItem>
                            <SelectItem value={companyNames.company_hitec}>{companyNames.company_hitec}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="edit_department">Department</Label>
                        <Select value={editStaffForm.department} onValueChange={(value) => setEditStaffForm({...editStaffForm, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CUTTING">CUTTING</SelectItem>
                            <SelectItem value="UNIT 1">UNIT 1</SelectItem>
                            <SelectItem value="UNIT 2">UNIT 2</SelectItem>
                            <SelectItem value="UNIT 3">UNIT 3</SelectItem>
                            <SelectItem value="UNIT 4">UNIT 4</SelectItem>
                            <SelectItem value="UNIT 6">UNIT 6</SelectItem>
                            <SelectItem value="LOOMS">LOOMS</SelectItem>
                            <SelectItem value="EXTRUDER">EXTRUDER</SelectItem>
                            <SelectItem value="LINERS">LINERS</SelectItem>
                            <SelectItem value="BAILING">BAILING</SelectItem>
                            <SelectItem value="PRINTING">PRINTING</SelectItem>
                            <SelectItem value="CLEANER">CLEANER</SelectItem>
                            <SelectItem value="PAINTER/NIC">PAINTER/NIC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="edit_position">Position</Label>
                        <Input
                          id="edit_position"
                          value={editStaffForm.position}
                          onChange={(e) => setEditStaffForm({...editStaffForm, position: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_hourly_rate">Hourly Rate (R)</Label>
                        <Input
                          id="edit_hourly_rate"
                          type="number"
                          step="0.01"
                          value={editStaffForm.hourly_rate}
                          onChange={(e) => setEditStaffForm({...editStaffForm, hourly_rate: e.target.value})}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="edit_email">Email</Label>
                        <Input
                          id="edit_email"
                          type="email"
                          value={editStaffForm.email}
                          onChange={(e) => setEditStaffForm({...editStaffForm, email: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_phone">Phone Number</Label>
                        <Input
                          id="edit_phone"
                          value={editStaffForm.phone}
                          onChange={(e) => setEditStaffForm({...editStaffForm, phone: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_emergency_contact">Emergency Contact</Label>
                        <Input
                          id="edit_emergency_contact"
                          value={editStaffForm.emergency_contact}
                          onChange={(e) => setEditStaffForm({...editStaffForm, emergency_contact: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_address">Address</Label>
                        <Textarea
                          id="edit_address"
                          value={editStaffForm.address}
                          onChange={(e) => setEditStaffForm({...editStaffForm, address: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="banking" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="edit_bank_name">Bank Name</Label>
                        <Input
                          id="edit_bank_name"
                          value={editStaffForm.bank_name}
                          onChange={(e) => setEditStaffForm({...editStaffForm, bank_name: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_bank_account_number">Account Number</Label>
                        <Input
                          id="edit_bank_account_number"
                          value={editStaffForm.bank_account_number}
                          onChange={(e) => setEditStaffForm({...editStaffForm, bank_account_number: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit_tax_number">Tax Number</Label>
                        <Input
                          id="edit_tax_number"
                          value={editStaffForm.tax_number}
                          onChange={(e) => setEditStaffForm({...editStaffForm, tax_number: e.target.value})}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowEditStaffDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    };

export default StaffDirectory;

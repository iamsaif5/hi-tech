import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Eye, DollarSign, Users, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEmployees } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

interface Loan {
  id: string;
  employee_id: string;
  loan_type: string;
  original_amount: number;
  outstanding_balance: number;
  monthly_payment: number;
  start_date: string;
  end_date: string | null;
  status: string;
  notes: string | null;
  employees?: { first_name: string; last_name: string };
}

interface Bonus {
  id: string;
  employee_id: string;
  bonus_amount: number;
  bonus_reason: string;
  created_at: string;
  payroll_period_id: string | null;
  status: string;
  employees?: { first_name: string; last_name: string };
  payroll_periods?: { period_name: string };
}

const LoansAndBonusesTab = () => {
  const { data: employees } = useEmployees();
  const { toast } = useToast();
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('loans');
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);

  const [loanForm, setLoanForm] = useState({
    employee_id: '',
    loan_type: '',
    original_amount: '',
    interest_rate: '0',
    term_months: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [bonusForm, setBonusForm] = useState({
    employee_id: '',
    bonus_amount: '',
    bonus_reason: '',
    payroll_period_id: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchLoansAndBonuses();
  }, []);

  const fetchLoansAndBonuses = async () => {
    try {
      setLoading(true);
      
      // Fetch loans
      const { data: loansData, error: loansError } = await supabase
        .from('employee_loans')
        .select(`
          *,
          employees (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      // Fetch bonuses
      const { data: bonusesData, error: bonusesError } = await supabase
        .from('payroll_bonuses')
        .select(`
          *,
          employees (first_name, last_name),
          payroll_periods (period_name)
        `)
        .order('created_at', { ascending: false });

      if (bonusesError) throw bonusesError;

      setLoans(loansData || []);
      setBonuses(bonusesData || []);
    } catch (error) {
      console.error('Error fetching loans and bonuses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch loans and bonuses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyPayment = (amount: number, interestRate: number, termMonths: number) => {
    if (interestRate === 0) {
      return amount / termMonths;
    }
    
    const monthlyRate = interestRate / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    return payment;
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const amount = parseFloat(loanForm.original_amount);
      const interestRate = parseFloat(loanForm.interest_rate);
      const termMonths = parseInt(loanForm.term_months);
      const monthlyPayment = calculateMonthlyPayment(amount, interestRate, termMonths);
      
      const endDate = new Date(loanForm.start_date);
      endDate.setMonth(endDate.getMonth() + termMonths);

      const loanData = {
        employee_id: loanForm.employee_id,
        loan_type: loanForm.loan_type,
        original_amount: amount,
        outstanding_balance: amount,
        monthly_payment: monthlyPayment,
        start_date: loanForm.start_date,
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        notes: loanForm.notes || null
      };

      if (editingLoan) {
        const { error } = await supabase
          .from('employee_loans')
          .update(loanData)
          .eq('id', editingLoan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('employee_loans')
          .insert([loanData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Loan ${editingLoan ? 'updated' : 'created'} successfully`,
      });

      setShowLoanDialog(false);
      setEditingLoan(null);
      setLoanForm({
        employee_id: '',
        loan_type: '',
        original_amount: '',
        interest_rate: '0',
        term_months: '',
        start_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchLoansAndBonuses();
    } catch (error) {
      console.error('Error saving loan:', error);
      toast({
        title: "Error",
        description: "Failed to save loan",
        variant: "destructive",
      });
    }
  };

  const handleBonusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bonusData = {
        employee_id: bonusForm.employee_id,
        bonus_amount: parseFloat(bonusForm.bonus_amount),
        bonus_reason: bonusForm.bonus_reason,
        payroll_period_id: bonusForm.payroll_period_id || null,
        status: bonusForm.status
      };

      if (editingBonus) {
        const { error } = await supabase
          .from('payroll_bonuses')
          .update(bonusData)
          .eq('id', editingBonus.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payroll_bonuses')
          .insert([bonusData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Bonus ${editingBonus ? 'updated' : 'created'} successfully`,
      });

      setShowBonusDialog(false);
      setEditingBonus(null);
      setBonusForm({
        employee_id: '',
        bonus_amount: '',
        bonus_reason: '',
        payroll_period_id: '',
        status: 'pending'
      });
      fetchLoansAndBonuses();
    } catch (error) {
      console.error('Error saving bonus:', error);
      toast({
        title: "Error",
        description: "Failed to save bonus",
        variant: "destructive",
      });
    }
  };

  const markLoanAsPaid = async (loanId: string) => {
    try {
      const { error } = await supabase
        .from('employee_loans')
        .update({ 
          status: 'paid_off',
          outstanding_balance: 0
        })
        .eq('id', loanId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Loan marked as paid off",
      });
      
      fetchLoansAndBonuses();
    } catch (error) {
      console.error('Error updating loan:', error);
      toast({
        title: "Error",
        description: "Failed to update loan",
        variant: "destructive",
      });
    }
  };

  const editLoan = (loan: Loan) => {
    setEditingLoan(loan);
    setLoanForm({
      employee_id: loan.employee_id,
      loan_type: loan.loan_type,
      original_amount: loan.original_amount.toString(),
      interest_rate: '0', // We don't store interest rate separately
      term_months: '', // Calculate from dates if needed
      start_date: loan.start_date,
      notes: loan.notes || ''
    });
    setShowLoanDialog(true);
  };

  const editBonus = (bonus: Bonus) => {
    setEditingBonus(bonus);
    setBonusForm({
      employee_id: bonus.employee_id,
      bonus_amount: bonus.bonus_amount.toString(),
      bonus_reason: bonus.bonus_reason,
      payroll_period_id: bonus.payroll_period_id || '',
      status: bonus.status
    });
    setShowBonusDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      paid_off: 'secondary',
      defaulted: 'destructive',
      pending: 'outline',
      paid: 'default'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation Buttons - Left Aligned */}
      <div className="flex justify-start gap-2">
        <Button
          variant={activeSection === 'loans' ? 'default' : 'outline'}
          onClick={() => setActiveSection('loans')}
          className={`flex items-center gap-2 ${
            activeSection === 'loans' 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Loans
        </Button>
        <Button
          variant={activeSection === 'bonuses' ? 'default' : 'outline'}
          onClick={() => setActiveSection('bonuses')}
          className={`flex items-center gap-2 ${
            activeSection === 'bonuses' 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300'
          }`}
        >
          <Users className="h-4 w-4" />
          Bonuses
        </Button>
      </div>

      {/* Loans Section */}
      {activeSection === 'loans' && (
        <div className="space-y-4">
          {/* Floating header with no container - matching Clients page */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Employee Loans
            </h3>
            <Dialog open={showLoanDialog} onOpenChange={setShowLoanDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingLoan(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Loan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingLoan ? 'Edit Loan' : 'Create New Loan'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLoanSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="employee_id">Staff Member</Label>
                    <Select 
                      value={loanForm.employee_id} 
                      onValueChange={(value) => setLoanForm(prev => ({ ...prev, employee_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees?.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="loan_type">Loan Type</Label>
                    <Input
                      id="loan_type"
                      value={loanForm.loan_type}
                      onChange={(e) => setLoanForm(prev => ({ ...prev, loan_type: e.target.value }))}
                      placeholder="e.g., Emergency Advance, Equipment"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="original_amount">Amount</Label>
                      <Input
                        id="original_amount"
                        type="number"
                        step="0.01"
                        value={loanForm.original_amount}
                        onChange={(e) => setLoanForm(prev => ({ ...prev, original_amount: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                      <Input
                        id="interest_rate"
                        type="number"
                        step="0.1"
                        value={loanForm.interest_rate}
                        onChange={(e) => setLoanForm(prev => ({ ...prev, interest_rate: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="term_months">Term (Months)</Label>
                      <Input
                        id="term_months"
                        type="number"
                        value={loanForm.term_months}
                        onChange={(e) => setLoanForm(prev => ({ ...prev, term_months: e.target.value }))}
                        placeholder="12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={loanForm.start_date}
                        onChange={(e) => setLoanForm(prev => ({ ...prev, start_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={loanForm.notes}
                      onChange={(e) => setLoanForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                    />
                  </div>

                  {loanForm.original_amount && loanForm.term_months && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">
                        Monthly Payment: R{calculateMonthlyPayment(
                          parseFloat(loanForm.original_amount) || 0,
                          parseFloat(loanForm.interest_rate) || 0,
                          parseInt(loanForm.term_months) || 1
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingLoan ? 'Update Loan' : 'Create Loan'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowLoanDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table with grey header - matching Clients page exactly */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Staff Member</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Date Issued</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Monthly Deduction</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Outstanding</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 text-xs font-medium">
                        {loan.employees?.first_name} {loan.employees?.last_name}
                      </td>
                      <td className="py-2 px-4 text-xs">{new Date(loan.start_date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 text-xs">R{loan.original_amount.toFixed(2)}</td>
                      <td className="py-2 px-4 text-xs">R{loan.monthly_payment.toFixed(2)}</td>
                      <td className="py-2 px-4 text-xs">R{loan.outstanding_balance.toFixed(2)}</td>
                      <td className="py-2 px-4">{getStatusBadge(loan.status)}</td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editLoan(loan)} className="text-xs">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {loan.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markLoanAsPaid(loan.id)}
                              className="text-xs"
                            >
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {loans.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted-foreground py-4 text-xs">
                        No loans found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bonuses Section */}
      {activeSection === 'bonuses' && (
        <div className="space-y-4">
          {/* Floating header with no container - matching Clients page */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee Bonuses
            </h3>
            <Dialog open={showBonusDialog} onOpenChange={setShowBonusDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingBonus(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bonus
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingBonus ? 'Edit Bonus' : 'Add New Bonus'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBonusSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="employee_id">Staff Member</Label>
                    <Select 
                      value={bonusForm.employee_id} 
                      onValueChange={(value) => setBonusForm(prev => ({ ...prev, employee_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees?.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bonus_amount">Amount</Label>
                    <Input
                      id="bonus_amount"
                      type="number"
                      step="0.01"
                      value={bonusForm.bonus_amount}
                      onChange={(e) => setBonusForm(prev => ({ ...prev, bonus_amount: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bonus_reason">Reason or Notes</Label>
                    <Textarea
                      id="bonus_reason"
                      value={bonusForm.bonus_reason}
                      onChange={(e) => setBonusForm(prev => ({ ...prev, bonus_reason: e.target.value }))}
                      placeholder="Performance bonus, overtime, etc."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={bonusForm.status} 
                      onValueChange={(value) => setBonusForm(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingBonus ? 'Update Bonus' : 'Add Bonus'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowBonusDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table with grey header - matching Clients page exactly */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Staff Member</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Date Awarded</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Reason</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Pay Period</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {bonuses.map((bonus) => (
                    <tr key={bonus.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 text-xs font-medium">
                        {bonus.employees?.first_name} {bonus.employees?.last_name}
                      </td>
                      <td className="py-2 px-4 text-xs">{new Date(bonus.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-4 text-xs">R{bonus.bonus_amount.toFixed(2)}</td>
                      <td className="py-2 px-4 text-xs">{bonus.bonus_reason}</td>
                      <td className="py-2 px-4 text-xs">{bonus.payroll_periods?.period_name || 'Not assigned'}</td>
                      <td className="py-2 px-4">{getStatusBadge(bonus.status)}</td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editBonus(bonus)} className="text-xs">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bonuses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted-foreground py-4 text-xs">
                        No bonuses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansAndBonusesTab;
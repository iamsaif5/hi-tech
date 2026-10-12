import React, { useState, useEffect } from 'react';
import { fmtDate, fmtDateTime } from '@/lib/utils';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Plus, Edit, Eye, DollarSign, Users, Calendar, Clock, Paperclip, X, FileText, MessageSquare, Loader2, Download, Trash2, FileDown, Check, ChevronsUpDown, FileSpreadsheet, Truck, Smartphone, Fuel, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateBonusPDF } from '@/lib/bonusPDF';
import { generateLoanPDF } from '@/lib/loanPDF';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import useFetch from '@/hooks/useFetch';
import { useAuth } from '@/contexts/AuthContext';
import { usePost } from '@/hooks/usePost';
import { usePut } from '@/hooks/usePut';
import { fetchData, postData, deleteData, downloadFile } from '@/lib/Api';
import CommentsModal from '@/components/CommentsModal';
import DocumentManager from '@/components/documents/DocumentManager';
import WageBatchTable, { type WagePaymentType } from './loans-bonuses/WageBatchTable';
import NewPaymentFlow, { type FlowPaymentType } from './loans-bonuses/NewPaymentFlow';

interface Loan {
  id: number;
  staff_member: number;
  staff_member_name: string;
  staff_first_name?: string;
  staff_last_name?: string;
  factory?: string;
  clock_number?: string;
  bank_account_number?: string;
  bank_branch_code?: string;
  loan_type: string;
  amount: string;
  interest_rate?: string;
  total_repayment?: number;
  repayment_amount?: number;
  term_type: string;
  term_duration: number;
  start_date: string;
  notes?: string;
  approval_status?: string;
  approval_id?: number;
  query_comment?: string;
  member_reply?: string;
  comment_count?: number;
  approved_at?: string;
  approved_by?: string;
  added_by?: string;
  created_at?: string;
}

const SECTIONS: { key: string; label: string; icon: any }[] = [
  { key: 'loans', label: 'Loans', icon: DollarSign },
  { key: 'bonuses', label: 'Bonuses', icon: Users },
  { key: 'transport', label: 'Transport', icon: Truck },
  { key: 'airtime', label: 'Airtime', icon: Smartphone },
  { key: 'fuel', label: 'Fuel', icon: Fuel },
  { key: 'other', label: 'Other', icon: MoreHorizontal },
];

/** Tabs backed by WageRequestBatch rather than their own model. */
const WAGE_SECTIONS: WagePaymentType[] = ['transport', 'airtime', 'fuel', 'other'];

interface StaffMember {
  id: number;
  clock_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  employee_type: string;
  department: string;
  position: string;
  email: string;
}

interface Bonus {
  target_payroll?: string;
  bonus_reason?: string;
  sync_to_simplepay?: boolean;
  id: number;
  staff_member: number;
  staff_member_name: string;
  clock_number?: string;
  amount: string;
  reason?: string;
  status: string;
  created_at: string;
  approval_id?: number;
  query_comment?: string;
  comment_count?: number;
  approved_at?: string;
  approved_by?: string;
  added_by?: string;
}

interface BonusDoc {
  id: number;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

const LoansAndBonusesTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const canWrite = user?.role !== 'viewer';
  const isAdmin = user?.role === 'admin';

  const { data: staffMembers } = useFetch<StaffMember[]>('staff/members/');
  const { data: loansData, isLoading: loansLoading, refetch: refetchLoans } = useFetch<Loan[]>('staff/loans/');
  const { data: bonusesData, isLoading: bonusesLoading, refetch: refetchBonuses } = useFetch<Bonus[]>('staff/bonuses/');
  const { mutateAsync: postLoan } = usePost();
  const { mutateAsync: putLoan } = usePut();
  const [activeSection, setActiveSection] = useState('loans');
  // Which full-page create flow is open, if any. Null means show the tabs.
  const [flowType, setFlowType] = useState<FlowPaymentType | null>(null);
  // Bumped after a submit so the batch tables refetch.
  const [reloadKey, setReloadKey] = useState(0);
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
  const [commentsModal, setCommentsModal] = useState<{ approvalId: number; itemLabel: string; itemStatus: string } | null>(null);
  const [loanStaffPickerOpen, setLoanStaffPickerOpen] = useState(false);

  const [loanForm, setLoanForm] = useState({
    employee_id: '',
    loan_type: '',
    original_amount: '',
    interest_rate: '0',
    term_type: 'monthly',
    term_months: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: ''
  });




  const [bonusDocuments, setBonusDocuments] = useState<BonusDoc[]>([]);
  const [bonusDocUploading, setBonusDocUploading] = useState(false);

  const handleBonusDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editingBonus) return;
    const files = Array.from(e.target.files);
    setBonusDocUploading(true);
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const doc = await postData({
          url: `staff/bonuses/${editingBonus.id}/upload-document/`,
          data: formData,
        });
        setBonusDocuments(prev => [...prev, doc]);
      } catch {
        toast({ title: 'Upload failed', description: file.name, variant: 'destructive' });
      }
    }
    setBonusDocUploading(false);
    e.target.value = '';
  };

  const handleBonusDocDelete = async (doc: BonusDoc) => {
    if (!editingBonus) return;
    try {
      await deleteData({ url: `staff/bonuses/${editingBonus.id}/documents/${doc.id}/`, data: undefined });
      setBonusDocuments(prev => prev.filter(d => d.id !== doc.id));
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };


  useEffect(() => {
    // Initialization logic if needed
  }, []);

  const calculateInstallment = (amount: number, interestRate: number, duration: number, _termType: string) => {
    if (!duration) return 0;
    // Flat interest: total = principal + (principal * rate%), split evenly over term
    const totalRepayment = amount + (amount * interestRate) / 100;
    return totalRepayment / duration;
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loanData = {
        staff_member: parseInt(loanForm.employee_id),
        loan_type: loanForm.loan_type,
        amount: loanForm.original_amount,
        interest_rate: loanForm.interest_rate,
        term_type: loanForm.term_type,
        term_duration: parseInt(loanForm.term_months),
        start_date: loanForm.start_date,
        notes: loanForm.notes
      };

      if (editingLoan) {
        await putLoan({
          url: `staff/loans/${editingLoan.id}/`,
          data: loanData
        });
      } else {
        await postLoan({
          url: 'staff/loans/',
          data: loanData
        });
      }

      toast({
        title: editingLoan ? 'Loan Updated' : 'Loan Submitted for Approval',
        description: editingLoan ? 'Loan updated successfully.' : 'Awaiting approval before it takes effect.',
      });

      setShowLoanDialog(false);
      setEditingLoan(null);
      setLoanForm({
        employee_id: '',
        loan_type: '',
        original_amount: '',
        interest_rate: '0',
        term_type: 'monthly',
        term_months: '',
        start_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      refetchLoans();
    } catch (error) {
      console.error('Error saving loan:', error);
      toast({
        title: "Error",
        description: "Failed to save loan",
        variant: "destructive",
      });
    }
  };




  const handleDownloadLoanCSV = (loan: Loan) => {
    // Company (DR) bank account — only the name changes per factory
    const DR_ACCOUNT_NUMBER = '201930447';
    const DR_BRANCH_NUMBER = '051001';
    const CR_STATEMENT_REFERENCE = 'HITEC PACKAGING';
    const drAccountName = loan.factory === 'RANDM' ? 'ROB AND MARTIN' : 'HITEC PACKAGING';

    // Employee name as "LASTNAME, FIRSTNAME"
    const crAccountName = (loan.staff_last_name && loan.staff_first_name)
      ? `${loan.staff_last_name}, ${loan.staff_first_name}`
      : loan.staff_member_name;

    // Total amount with interest, comma decimal (SA format)
    const total = loan.total_repayment ?? parseFloat(loan.amount);
    const amountStr = total.toFixed(2).replace('.', ',');

    // Date as YYYYMMDD from loan start date
    const dateStr = (loan.start_date || '').replace(/-/g, '');

    const rows = [
      ['CR ACCOUNT NAME', 'CR ACCOUNT NUMBER', 'CR BRANCH NUMBER', 'CR STATEMENT REFERENCE',
       'DR ACCOUNT NAME', 'DR ACCOUNT NUMBER', 'DR BRANCH NUMBER', 'DR STATEMENT REFERENCE',
       'DATE', 'AMOUNT'],
      [
        crAccountName,
        loan.bank_account_number || '',
        loan.bank_branch_code || '',
        CR_STATEMENT_REFERENCE,
        drAccountName,
        DR_ACCOUNT_NUMBER,
        DR_BRANCH_NUMBER,
        crAccountName,
        dateStr,
        amountStr,
      ],
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-bank-${loan.id}-${loan.staff_member_name.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Same ten columns and values as the CSV above, but built server-side with xlwt
  // so the file is a real Microsoft Excel 97-2003 Worksheet, matching the general
  // payroll export the bank accepts.
  const handleDownloadLoanXLS = async (loan: Loan) => {
    try {
      await downloadFile(
        `staff/loans/${loan.id}/export-xls/`,
        `loan-bank-${loan.id}-${loan.staff_member_name.replace(/\s+/g, '-')}.xls`,
      );
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not generate the Excel file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLoan = async (loan: Loan) => {
    if (!window.confirm(`Delete loan #${loan.id} for ${loan.staff_member_name}? This cannot be undone.`)) return;
    try {
      await deleteData({ url: `staff/loans/${loan.id}/`, data: undefined });
      toast({ title: 'Loan deleted' });
      refetchLoans();
    } catch (err: any) {
      toast({
        title: 'Delete failed',
        description: err?.response?.data?.detail || 'Could not delete loan.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBonus = async (bonus: Bonus) => {
    if (!window.confirm(`Delete bonus #${bonus.id} for ${bonus.staff_member_name}? This cannot be undone.`)) return;
    try {
      await deleteData({ url: `staff/bonuses/${bonus.id}/`, data: undefined });
      toast({ title: 'Bonus deleted' });
      refetchBonuses();
    } catch (err: any) {
      toast({
        title: 'Delete failed',
        description: err?.response?.data?.detail || 'Could not delete bonus.',
        variant: 'destructive',
      });
    }
  };

  const editLoan = (loan: Loan) => {
    setEditingLoan(loan);
    setLoanForm({
      employee_id: loan.staff_member.toString(),
      loan_type: loan.loan_type,
      original_amount: loan.amount,
      interest_rate: loan.interest_rate || '0',
      term_type: loan.term_type || 'monthly',
      term_months: loan.term_duration.toString(),
      start_date: loan.start_date,
      notes: loan.notes || ''
    });
    setShowLoanDialog(true);
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

  if (loansLoading || bonusesLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const loans = loansData || [];
  const bonuses = bonusesData || [];

  // The create flow takes over the page, the way Run Payroll does.
  if (flowType) {
    return (
      <NewPaymentFlow
        paymentType={flowType}
        onBack={() => setFlowType(null)}
        onComplete={() => {
          setFlowType(null);
          setReloadKey(k => k + 1);
          refetchBonuses();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap justify-start gap-2">
        {SECTIONS.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeSection === key ? 'default' : 'outline'}
            onClick={() => setActiveSection(key)}
            className={`flex items-center gap-2 ${
              activeSection === key
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
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
              {canWrite && (
              <DialogTrigger asChild>
                <Button onClick={() => setEditingLoan(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Loan
                </Button>
              </DialogTrigger>
              )}
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingLoan ? 'Edit Loan' : 'Create New Loan'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLoanSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="employee_id">Staff Member</Label>
                    <Popover open={loanStaffPickerOpen} onOpenChange={setLoanStaffPickerOpen} modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={loanStaffPickerOpen}
                          className="w-full justify-between font-normal"
                        >
                          <span className={cn(!loanForm.employee_id && "text-muted-foreground/50")}>
                            {loanForm.employee_id
                              ? staffMembers?.find((s) => s.id.toString() === loanForm.employee_id)?.full_name
                              : "Select staff member"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search staff member..." />
                          <CommandList>
                            <CommandEmpty>No staff member found.</CommandEmpty>
                            <CommandGroup>
                              {staffMembers?.map((staff) => (
                                <CommandItem
                                  key={staff.id}
                                  value={staff.full_name}
                                  onSelect={() => {
                                    setLoanForm(prev => ({ ...prev, employee_id: staff.id.toString() }));
                                    setLoanStaffPickerOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      loanForm.employee_id === staff.id.toString() ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {staff.full_name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                      <Label htmlFor="term_type">Term Type</Label>
                      <Select
                        value={loanForm.term_type}
                        onValueChange={(value) => setLoanForm(prev => ({ ...prev, term_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select term type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="fortnightly">Fortnightly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="term_months">Term Duration</Label>
                      <Input
                        id="term_months"
                        type="number"
                        value={loanForm.term_months}
                        onChange={(e) => setLoanForm(prev => ({ ...prev, term_months: e.target.value }))}
                        placeholder="12"
                        required
                      />
                    </div>
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
                        Installment Amount: R{calculateInstallment(
                          parseFloat(loanForm.original_amount) || 0,
                          parseFloat(loanForm.interest_rate) || 0,
                          parseInt(loanForm.term_months) || 1,
                          loanForm.term_type
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}

                    {/* Real uploads. The old dropzone here collected files
                        into React state and never sent them, so nothing a user
                        attached to a loan was ever stored. */}
                    <DocumentManager
                      ownerType="loan"
                      ownerId={editingLoan?.id ?? null}
                      label="Supporting Documents"
                    />

                  <div className="flex gap-2">
                    {canWrite && editingLoan?.approval_status !== 'approved' && (
                      <Button type="submit" className="flex-1">
                        {editingLoan ? 'Update Loan' : 'Create Loan'}
                      </Button>
                    )}
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
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Loan Type</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Date Issued</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Term</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-foreground">Summary</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-foreground">CSV</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-foreground">Excel</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 text-xs font-medium">
                        {loan.staff_member_name}
                      </td>
                      <td className="py-2 px-4 text-xs">{loan.loan_type}</td>
                      <td className="py-2 px-4 text-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-default ${loan.approval_status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {loan.approval_status === 'approved' ? 'Approved' : 'Pending'}
                              </span>
                            </TooltipTrigger>
                            {loan.approval_status === 'approved' && loan.approved_by && (
                              <TooltipContent>
                                Approved by {loan.approved_by}
                                {loan.approved_at && ` on ${new Date(loan.approved_at).toLocaleString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="py-2 px-4 text-xs">{fmtDate(loan.start_date)}</td>
                      <td className="py-2 px-4 text-xs">R{parseFloat(loan.amount).toFixed(2)}</td>
                      <td className="py-2 px-4 text-xs">{loan.term_duration} {loan.term_type}</td>
                      <td className="py-2 px-4 text-center">
                        {loan.approval_status === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            title="Download Summary PDF"
                            onClick={() => generateLoanPDF(loan)}
                          >
                            <FileDown className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {loan.approval_status === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            title="Download Bank CSV"
                            onClick={() => handleDownloadLoanCSV(loan)}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {loan.approval_status === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            title="Download Bank Excel (97-2003)"
                            onClick={() => handleDownloadLoanXLS(loan)}
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => editLoan(loan)} className="text-xs">
                            {canWrite && loan.approval_status !== 'approved' ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          {loan.approval_id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground relative"
                              title="View thread"
                              onClick={() => setCommentsModal({
                                approvalId: loan.approval_id,
                                itemLabel: `Loan — ${loan.staff_member_name}`,
                                itemStatus: loan.query_comment ? 'queried' : loan.approval_status || 'pending',
                              })}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              {loan.approval_status !== 'approved' && (loan.comment_count ?? 0) > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center leading-none px-0.5">
                                  {loan.comment_count}
                                </span>
                              )}
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                              title="Delete loan"
                              onClick={() => handleDeleteLoan(loan)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {loans.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center text-muted-foreground py-4 text-xs">
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
            {canWrite && (
              <Button onClick={() => setFlowType('bonus')}>
                <Plus className="h-4 w-4 mr-2" />
                New Bonus
              </Button>
            )}
          </div>

          {/* Table with grey header - matching Clients page exactly */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Staff Member</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Date Awarded</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Paid on</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Reason</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {bonuses.map((bonus) => (
                    <tr key={bonus.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 text-xs font-medium">
                        {bonus.staff_member_name}
                      </td>
                      <td className="py-2 px-4 text-xs">{fmtDate(bonus.created_at)}</td>
                      <td className="py-2 px-4 text-xs">
                        {bonus.target_payroll === 'general' ? (
                          'Fortnight payroll'
                        ) : bonus.target_payroll === 'weekend' ? (
                          <span>
                            Off weekend payroll
                            <span className="block text-[10px] text-muted-foreground">app only</span>
                          </span>
                        ) : (
                          /* Pre-dates target_payroll — kept as history, never paid again. */
                          <span className="text-muted-foreground">Historic</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-xs">R{parseFloat(bonus.amount).toFixed(2)}</td>
                      <td className="py-2 px-4 text-xs">{bonus.reason}</td>
                      <td className="py-2 px-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-default">{getStatusBadge(bonus.status)}</span>
                            </TooltipTrigger>
                            {bonus.status === 'approved' && bonus.approved_by && (
                              <TooltipContent>
                                Approved by {bonus.approved_by}
                                {bonus.approved_at && ` on ${new Date(bonus.approved_at).toLocaleString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-1">
                          {bonus.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              title="Download Summary"
                              onClick={() => generateBonusPDF(bonus)}
                            >
                              <FileDown className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {bonus.approval_id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground relative"
                              title="View thread"
                              onClick={() => setCommentsModal({
                                approvalId: bonus.approval_id,
                                itemLabel: `Bonus — ${bonus.staff_member_name}`,
                                itemStatus: bonus.query_comment ? 'queried' : bonus.status,
                              })}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              {bonus.status !== 'approved' && (bonus.comment_count ?? 0) > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center leading-none px-0.5">
                                  {bonus.comment_count}
                                </span>
                              )}
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                              title="Delete bonus"
                              onClick={() => handleDeleteBonus(bonus)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
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
      {WAGE_SECTIONS.map(type =>
        activeSection === type ? (
          <div key={type} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2 capitalize">
                {type} payments
              </h3>
              {canWrite && (
                <Button onClick={() => setFlowType(type)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New {type}
                </Button>
              )}
            </div>
            <WageBatchTable paymentType={type} reloadKey={reloadKey} />
          </div>
        ) : null,
      )}

      {commentsModal && (
        <CommentsModal
          open={!!commentsModal}
          onOpenChange={open => { if (!open) setCommentsModal(null); }}
          approvalId={commentsModal.approvalId}
          batchLabel={commentsModal.itemLabel}
          batchStatus={commentsModal.itemStatus}
          onStatusChanged={() => setCommentsModal(null)}
        />
      )}
    </div>
  );
};

export default LoansAndBonusesTab;
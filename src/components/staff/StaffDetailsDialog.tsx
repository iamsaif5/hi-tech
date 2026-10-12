import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Mail, DollarSign, UserX, Loader2 } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { fmtDate } from '@/lib/utils';
import DocumentManager from '@/components/documents/DocumentManager';

interface Props {
  employee: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDate = (value: any) => (value ? fmtDate(value) : 'N/A');

const formatCurrency = (amount: any) => {
  const n = parseFloat(amount);
  return `R${(isNaN(n) ? 0 : n).toFixed(2)}`;
};

/** Hours are shown for the last 30 days, as the tab says. */
const thirtyDaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
};

const EmptyRow = ({ cols, children }: { cols: number; children: React.ReactNode }) => (
  <TableRow>
    <TableCell colSpan={cols} className="text-center text-muted-foreground py-6">
      {children}
    </TableCell>
  </TableRow>
);

/**
 * Everything known about one staff member.
 *
 * Split out of StaffDirectory so the Hours, Payslips, Loans and Documents tabs
 * can each load their own data for the selected person — they previously read
 * from state arrays that were never populated, so every tab showed "no records
 * found" regardless of what was in the database.
 */
const StaffDetailsDialog: React.FC<Props> = ({ employee, open, onOpenChange }) => {
  const staffId = employee?.id;
  const enabled = open && !!staffId;

  // Attendance holds a date and a total only — there is no clock in/out,
  // overtime or lateness anywhere in the system, so the table shows what
  // exists rather than columns that can never be filled.
  const { data: attendance, isLoading: hoursLoading } = useFetch<any>(
    enabled ? `atg/attendance/staff/${staffId}/?start_date=${thirtyDaysAgo()}` : '',
    { enabled },
  );
  const { data: payslips, isLoading: slipsLoading } = useFetch<any>(
    enabled ? `staff/members/${staffId}/payslips/` : '',
    { enabled },
  );
  const { data: loans, isLoading: loansLoading } = useFetch<any>(
    enabled ? `staff/members/${staffId}/loans/` : '',
    { enabled },
  );

  // by_staff paginates when the record count is large.
  const hours: any[] = Array.isArray(attendance)
    ? attendance
    : Array.isArray(attendance?.results) ? attendance.results : [];
  const slips: any[] = Array.isArray(payslips) ? payslips : [];
  const loanList: any[] = Array.isArray(loans) ? loans : [];

  const totalHours = hours.reduce((sum, r) => sum + (parseFloat(r.total_hours) || 0), 0);

  if (!employee) return null;

  const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{fullName || 'Unnamed'}</h1>
              <p className="text-gray-600">
                {/* Staff have a clock number, not an employee number — the old
                    subtitle read a field that does not exist and rendered blank. */}
                {employee.clock_number ? `Clock #${employee.clock_number} • ` : ''}
                {employee.department || 'Unassigned'}
              </p>
            </div>
            <Badge variant={employee.is_absconded ? 'secondary' : 'default'}>
              {employee.is_absconded ? 'Absconded' : 'Active'}
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="clean-tabs">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact &amp; Bank</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="payslips">Payslips</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* ── Overview ──────────────────────────────────────────────── */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Employee Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-gray-900">{fullName || '—'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Department</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-gray-900">{employee.department || 'Unassigned'}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Hourly Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(employee.hourly_rate)}/hr
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">Added On</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* There is no hire date on the record; this is when the
                        staff member was created on the system. */}
                    <p className="text-lg font-semibold text-gray-900">{formatDate(employee.created_at)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Employment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Employee Type</Label>
                      <p className="text-gray-900 capitalize">{employee.employee_type || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Company</Label>
                      <p className="text-gray-900">{employee.factory || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Position</Label>
                      <p className="text-gray-900">{employee.position || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label>Clock Number</Label>
                      <p className="text-gray-900">{employee.clock_number || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Capped Hours per Shift</Label>
                      <p className="text-gray-900">{employee.cap_hour ?? 'N/A'}</p>
                    </div>
                  </div>

                  {employee.is_absconded && (
                    <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-3 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <UserX className="h-4 w-4 text-orange-500" />
                        <p className="text-sm font-semibold text-orange-700">Absconded</p>
                        {employee.absconded_date && (
                          <span className="text-xs text-orange-500 ml-auto">
                            Since {fmtDate(employee.absconded_date)}
                          </span>
                        )}
                      </div>
                      {employee.absconded_reason ? (
                        <p className="text-sm text-orange-800">{employee.absconded_reason}</p>
                      ) : (
                        <p className="text-xs text-orange-400 italic">No reason recorded</p>
                      )}
                      {employee.reactivated_date && (
                        <p className="text-xs text-gray-500">
                          Last reactivated: {fmtDate(employee.reactivated_date)}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Contact & Bank ────────────────────────────────────────── */}
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
                      <p className="text-gray-900">{employee.email || 'No email on file'}</p>
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <p className="text-gray-900">{employee.phone_number || 'No phone on file'}</p>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <p className="text-gray-900">{employee.address || 'Not provided'}</p>
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
                      <Label>Account Number</Label>
                      <p className="text-gray-900">{employee.bank_account_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label>Branch Code</Label>
                      <p className="text-gray-900">{employee.bank_branch_code || 'Not provided'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Hours ─────────────────────────────────────────────────── */}
            <TabsContent value="hours" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Time Records (Last 30 Days)</CardTitle>
                    {!hoursLoading && hours.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {hours.length} day{hours.length === 1 ? '' : 's'} · {totalHours.toFixed(2)} hours
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Hours Worked</TableHead>
                        <TableHead>Clocked At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hoursLoading ? (
                        <EmptyRow cols={3}>
                          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                          Loading…
                        </EmptyRow>
                      ) : hours.length ? (
                        hours.map((record: any) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.work_date)}</TableCell>
                            <TableCell className="text-right">
                              {parseFloat(record.total_hours || 0).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {record.device_name || '—'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <EmptyRow cols={3}>No clockings in the last 30 days</EmptyRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Payslips ──────────────────────────────────────────────── */}
            <TabsContent value="payslips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Run</TableHead>
                        <TableHead className="text-right">Paid Hours</TableHead>
                        <TableHead className="text-right">Gross</TableHead>
                        <TableHead className="text-right">Loan</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slipsLoading ? (
                        <EmptyRow cols={8}>
                          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                          Loading…
                        </EmptyRow>
                      ) : slips.length ? (
                        slips.map((slip: any) => (
                          <TableRow key={slip.id}>
                            <TableCell className="whitespace-nowrap">
                              {formatDate(slip.start_date)} → {formatDate(slip.end_date)}
                            </TableCell>
                            <TableCell>{slip.run_type_display}</TableCell>
                            <TableCell className="text-right">
                              {parseFloat(slip.paid_hours || 0).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(slip.gross_salary)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(slip.loan_deduction)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(slip.other_deductions)}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(slip.net_salary)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={slip.status === 'completed' ? 'default' : 'secondary'}>
                                {slip.status || 'pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <EmptyRow cols={8}>No payslips yet</EmptyRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Loans ─────────────────────────────────────────────────── */}
            <TabsContent value="loans" className="space-y-4">
              <Card>
                <CardHeader>
                  {/* Loans are created from the Loans & Bonuses page, where they
                      go through approval. There is no shortcut from here. */}
                  <CardTitle>Employee Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loansLoading ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-8">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                      </div>
                    ) : loanList.length ? (
                      loanList.map((loan: any) => (
                        <div
                          key={loan.id}
                          className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Loan Type</p>
                              <p className="font-medium text-gray-900">{loan.loan_type}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Amount</p>
                              <p className="text-gray-900">{formatCurrency(loan.amount)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Total Repayment</p>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(loan.total_repayment)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Per Instalment</p>
                              <p className="text-gray-900">{formatCurrency(loan.repayment_amount)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Term</p>
                              <p className="text-gray-900 capitalize">
                                {loan.term_duration} × {loan.term_type}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Start Date</p>
                              <p className="text-gray-900">{formatDate(loan.start_date)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Status</p>
                              <Badge
                                variant={loan.approval_status === 'approved' ? 'default' : 'secondary'}
                              >
                                {loan.approval_status}
                              </Badge>
                            </div>
                            {loan.added_by && (
                              <div>
                                <p className="text-sm font-medium text-gray-700">Added By</p>
                                <p className="text-gray-900">{loan.added_by}</p>
                              </div>
                            )}
                          </div>
                          {loan.notes && (
                            <p className="mt-3 text-sm text-gray-700">{loan.notes}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <p>No loans found for this employee</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Documents ─────────────────────────────────────────────── */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* The employee's own files — contracts, ID copies — not
                      anything attached to a loan. */}
                  <DocumentManager
                    ownerType="staff"
                    ownerId={staffId ? Number(staffId) : null}
                    label=""
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;

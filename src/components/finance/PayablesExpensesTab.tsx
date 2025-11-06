import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import ExpenseDetailView from './ExpenseDetailView';
import { 
  Search, 
  Plus, 
  Upload, 
  Eye, 
  Edit, 
  Check, 
  X, 
  CreditCard,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const PayablesExpensesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Mock expenses data
  const expensesData = [
    {
      id: '1',
      expenseNumber: 'EXP-2025-001',
      supplier: 'IWISA Milling',
      billNumber: 'INV-45789',
      description: 'Raw materials - IWISA flour 25kg x 200 bags for production orders',
      category: 'Raw Materials',
      glCode: '5100',
      amount: 45000,
      taxAmount: 6750,
      totalAmount: 51750,
      dueDate: '2025-07-20',
      approvalStatus: 'Approved',
      paymentStatus: 'Unpaid',
      hasReceipt: true
    },
    {
      id: '2',
      expenseNumber: 'EXP-2025-002',
      supplier: 'City Power',
      billNumber: 'UTIL-8901',
      description: 'Monthly electricity bill - Factory operations power consumption',
      category: 'Utilities',
      glCode: '5200',
      amount: 12500,
      taxAmount: 1875,
      totalAmount: 14375,
      dueDate: '2025-07-15',
      approvalStatus: 'Pending',
      paymentStatus: 'Unpaid',
      hasReceipt: true
    },
    {
      id: '3',
      expenseNumber: 'EXP-2025-003',
      supplier: 'Fast Freight',
      billNumber: 'FF-3421',
      description: 'Delivery services to Lion Group for order ORD-2025-003',
      category: 'Freight',
      glCode: '5300',
      amount: 2800,
      taxAmount: 420,
      totalAmount: 3220,
      dueDate: '2025-07-25',
      approvalStatus: 'Approved',
      paymentStatus: 'Unpaid',
      hasReceipt: false
    },
    {
      id: '4',
      expenseNumber: 'EXP-2025-004',
      supplier: 'Maintenance Pro',
      billNumber: 'MP-7654',
      description: 'Machine A1 routine maintenance and parts replacement',
      category: 'Maintenance',
      glCode: '5400',
      amount: 8500,
      taxAmount: 1275,
      totalAmount: 9775,
      dueDate: '2025-07-18',
      approvalStatus: 'Approved',
      paymentStatus: 'Paid',
      hasReceipt: true
    }
  ];

  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;

  // Calculate KPI data
  const kpiData = [
    {
      title: "Pending Approval",
      value: formatCurrency(expensesData.filter(exp => exp.approvalStatus === 'Pending').reduce((sum, exp) => sum + exp.amount, 0)),
      icon: Clock,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      subtext: "Awaiting review"
    },
    {
      title: "Ready to Pay",
      value: expensesData.filter(exp => exp.approvalStatus === 'Approved' && exp.paymentStatus === 'Unpaid').length,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      subtext: "Approved expenses"
    },
    {
      title: "Overdue Payments",
      value: expensesData.filter(exp => new Date(exp.dueDate) < new Date() && exp.paymentStatus === 'Unpaid').length,
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      subtext: "Past due date"
    },
    {
      title: "This Month Total",
      value: formatCurrency(expensesData.reduce((sum, exp) => sum + exp.amount, 0)),
      icon: DollarSign,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      subtext: "All expenses"
    }
  ];

  const getApprovalStatusColor = (status: string): string => {
    switch (status) {
      case 'Pending': return 'bg-orange-500';
      case 'Approved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Unpaid': return 'bg-red-500';
      case 'Overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Raw Materials': return 'bg-blue-500';
      case 'Utilities': return 'bg-purple-500';
      case 'Services': return 'bg-green-500';
      case 'Utilities': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSelectExpense = (expenseId: string, checked: boolean) => {
    if (checked) {
      setSelectedExpenses([...selectedExpenses, expenseId]);
    } else {
      setSelectedExpenses(selectedExpenses.filter(id => id !== expenseId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const approvableExpenses = expensesData
        .filter(exp => exp.approvalStatus === 'Approved' && exp.paymentStatus === 'Unpaid')
        .map(exp => exp.id);
      setSelectedExpenses(approvableExpenses);
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleRowClick = (expense: any) => {
    setSelectedExpense(expense);
  };

  if (selectedExpense) {
    return <ExpenseDetailView expense={selectedExpense} onBack={() => setSelectedExpense(null)} />;
  }

  const approvedUnpaidExpenses = expensesData.filter(
    exp => exp.approvalStatus === 'Approved' && exp.paymentStatus === 'Unpaid'
  );

  return (
    <div className="space-y-4">
        {/* KPI Summary Cards - Dashboard Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
                  <div className="text-xs text-muted-foreground">{kpi.title}</div>
                </div>
                <div className="text-lg font-semibold">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.subtext}</div>
              </CardContent>
            </Card>
          ))}
        </div>

      {/* Payables & Expenses Management Header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Payables & Expenses Management</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search expenses, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-10 w-48 text-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                <SelectItem value="Services">Services</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approvals</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedExpenses.length > 0 && (
            <>
              <Button variant="outline" className="h-10">
                Approve Selected ({selectedExpenses.length})
              </Button>
              <Button variant="outline" className="h-10">
                Create Payment Batch
              </Button>
            </>
          )}
          <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Expense
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground w-12">
                  <Checkbox
                    checked={selectedExpenses.length === approvedUnpaidExpenses.length && approvedUnpaidExpenses.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Expense #</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Supplier</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Description</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Category</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Amount</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Due</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Approval</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Payment</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expensesData.map((expense) => (
                <tr 
                  key={expense.id} 
                  className="border-b border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleRowClick(expense)}
                >
                  <td className="py-2 px-3">
                    {expense.approvalStatus === 'Approved' && expense.paymentStatus === 'Unpaid' && (
                      <Checkbox
                        checked={selectedExpenses.includes(expense.id)}
                        onCheckedChange={(checked) => handleSelectExpense(expense.id, checked as boolean)}
                      />
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-xs font-medium text-primary hover:text-primary/80">
                      {expense.expenseNumber}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{expense.supplier}</td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    <span className="truncate max-w-48 block" title={expense.description}>
                      {expense.description}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(expense.category)}`}></div>
                      <span className={`${getCategoryColor(expense.category).replace('bg-', 'text-')} text-xs font-medium`}>
                        {expense.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{formatCurrency(expense.totalAmount)}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{expense.dueDate}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getApprovalStatusColor(expense.approvalStatus)}`}></div>
                      <span className="text-xs text-foreground">
                        {expense.approvalStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPaymentStatusColor(expense.paymentStatus)}`}></div>
                      <span className="text-xs text-foreground">
                        {expense.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {expense.approvalStatus === 'Pending' && (
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          Approve
                        </Button>
                      )}
                      {expense.approvalStatus === 'Approved' && expense.paymentStatus === 'Unpaid' && (
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          Pay
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
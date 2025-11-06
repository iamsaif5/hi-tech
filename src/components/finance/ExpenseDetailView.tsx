import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, DollarSign, Calendar, User, FileText, AlertTriangle, Building, Eye } from 'lucide-react';

interface ExpenseDetailViewProps {
  expense: {
    id: string;
    expenseNumber: string;
    supplier: string;
    description: string;
    category: string;
    totalAmount: number;
    dueDate: string;
    approvalStatus: string;
    paymentStatus: string;
    billNumber?: string;
    glCode?: string;
  };
  onBack: () => void;
}

const ExpenseDetailView: React.FC<ExpenseDetailViewProps> = ({ expense, onBack }) => {
  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;

  const getApprovalStatusColor = (status: string): string => {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Pending': return 'bg-amber-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Unpaid': return 'bg-orange-500';
      case 'Overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Materials': return 'bg-blue-500';
      case 'Utilities': return 'bg-green-500';
      case 'Services': return 'bg-purple-500';
      case 'Equipment': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="h-10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenses
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Expense Details</h1>
            <p className="text-sm text-muted-foreground">{expense.expenseNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getApprovalStatusColor(expense.approvalStatus)}`}></div>
            <span className="text-sm text-foreground">{expense.approvalStatus}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getPaymentStatusColor(expense.paymentStatus)}`}></div>
            <span className="text-sm text-foreground">{expense.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expense Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Expense Number</span>
                  </div>
                  <p className="font-medium">{expense.expenseNumber}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Supplier</span>
                  </div>
                  <p className="font-medium">{expense.supplier}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                  </div>
                  <p className="font-medium text-lg">{formatCurrency(expense.totalAmount)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Due Date</span>
                  </div>
                  <p className="font-medium">{expense.dueDate}</p>
                </div>
                
                {expense.billNumber && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Bill Number</span>
                    </div>
                    <p className="font-medium">{expense.billNumber}</p>
                  </div>
                )}
                
                {expense.glCode && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">GL Code</span>
                    </div>
                    <p className="font-medium">{expense.glCode}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="text-sm">{expense.description}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(expense.category)}`}></div>
                    <span className="text-sm font-medium">{expense.category}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Approval Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Expense Submitted</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                </div>
                
                {expense.approvalStatus === 'Approved' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Approved by Manager</div>
                      <div className="text-xs text-muted-foreground">Today</div>
                    </div>
                  </div>
                )}
                
                {expense.approvalStatus === 'Rejected' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Rejected by Manager</div>
                      <div className="text-xs text-muted-foreground">Today</div>
                    </div>
                  </div>
                )}
                
                {expense.paymentStatus === 'Paid' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Payment Made</div>
                      <div className="text-xs text-muted-foreground">Yesterday</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {expense.approvalStatus === 'Pending' && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Expense
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Expense
                  </Button>
                </>
              )}
              
              {expense.approvalStatus === 'Approved' && expense.paymentStatus === 'Unpaid' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Create Payment
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Receipt
              </Button>
              
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted By</span>
                <span>Current User</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submission Date</span>
                <span>Today</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Priority</span>
                <Badge variant="outline" className="text-xs">Normal</Badge>
              </div>
              {expense.approvalStatus === 'Approved' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Approved By</span>
                  <span>Finance Manager</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailView;
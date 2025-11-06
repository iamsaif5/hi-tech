import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, CreditCard, AlertTriangle, DollarSign, Calendar, User, FileText, Phone, Mail } from 'lucide-react';

interface ReceivableDetailViewProps {
  receivable: {
    id: string;
    invoiceNumber: string;
    customer: string;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    dueDate: string;
    daysOverdue: number;
    status: string;
    sentDate: string;
    lastReminder?: string;
  };
  onBack: () => void;
}

const ReceivableDetailView: React.FC<ReceivableDetailViewProps> = ({ receivable, onBack }) => {
  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Outstanding': return 'bg-blue-500';
      case 'Overdue': return 'bg-red-500';
      case 'Part-paid': return 'bg-orange-500';
      case 'Paid': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getOverdueColor = (daysOverdue: number) => {
    if (daysOverdue <= 0) return 'text-green-600';
    if (daysOverdue <= 30) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="h-10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Receivables
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Receivable Details</h1>
            <p className="text-sm text-muted-foreground">{receivable.invoiceNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(receivable.status)}`}></div>
            <span className="text-sm text-foreground">{receivable.status}</span>
          </div>
          {receivable.daysOverdue > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {receivable.daysOverdue} days overdue
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Receivable Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Receivable Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Invoice Number</span>
                  </div>
                  <p className="font-medium">{receivable.invoiceNumber}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Customer</span>
                  </div>
                  <p className="font-medium">{receivable.customer}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                  </div>
                  <p className="font-medium text-lg">{formatCurrency(receivable.totalAmount)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">Outstanding</span>
                  </div>
                  <p className="font-medium text-lg text-red-600">{formatCurrency(receivable.outstandingAmount)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Due Date</span>
                  </div>
                  <p className="font-medium">{receivable.dueDate}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Days Overdue</span>
                  </div>
                  <p className={`font-medium ${getOverdueColor(receivable.daysOverdue)}`}>
                    {receivable.daysOverdue > 0 ? `${receivable.daysOverdue} days` : 'Not overdue'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Invoice Sent</div>
                    <div className="text-xs text-muted-foreground">{receivable.sentDate}</div>
                  </div>
                </div>
                
                {receivable.lastReminder && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Last Reminder Sent</div>
                      <div className="text-xs text-muted-foreground">{receivable.lastReminder}</div>
                    </div>
                  </div>
                )}
                
                {receivable.daysOverdue > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Payment Overdue</div>
                      <div className="text-xs text-muted-foreground">{receivable.dueDate}</div>
                    </div>
                  </div>
                )}
                
                {receivable.paidAmount > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Partial Payment Received</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(receivable.paidAmount)}</div>
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
              {receivable.status === 'Outstanding' || receivable.status === 'Overdue' ? (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Log Payment
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Customer
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-medium">{formatCurrency(receivable.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid Amount</span>
                <span className="font-medium text-green-600">{formatCurrency(receivable.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="font-medium text-red-600">{formatCurrency(receivable.outstandingAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Progress</span>
                <span className="font-medium">{Math.round((receivable.paidAmount / receivable.totalAmount) * 100)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceivableDetailView;
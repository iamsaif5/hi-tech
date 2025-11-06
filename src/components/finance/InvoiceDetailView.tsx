import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Edit, Trash2, Download, DollarSign, Calendar, User, FileText } from 'lucide-react';

interface InvoiceDetailViewProps {
  invoice: {
    id: string;
    orderId: string;
    customer: string;
    amount: number;
    completedOn: string;
    invoiceStatus: string;
    creditTerms: number;
    daysSinceCompleted: number;
  };
  onBack: () => void;
}

const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({ invoice, onBack }) => {
  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Draft': return 'bg-gray-500';
      case 'Ready to Send': return 'bg-blue-500';
      case 'Sent': return 'bg-orange-500';
      case 'Paid': return 'bg-green-500';
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
            Back to Invoice Queue
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Invoice Details</h1>
            <p className="text-sm text-muted-foreground">Order {invoice.orderId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(invoice.invoiceStatus)}`}></div>
            <span className="text-sm text-foreground">{invoice.invoiceStatus}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Order ID</span>
                  </div>
                  <p className="font-medium">{invoice.orderId}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Customer</span>
                  </div>
                  <p className="font-medium">{invoice.customer}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Amount</span>
                  </div>
                  <p className="font-medium text-lg">{formatCurrency(invoice.amount)}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Completed Date</span>
                  </div>
                  <p className="font-medium">{invoice.completedOn}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Order Completed</div>
                    <div className="text-xs text-muted-foreground">{invoice.completedOn}</div>
                  </div>
                </div>
                
                {invoice.invoiceStatus !== 'Draft' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Invoice Generated</div>
                      <div className="text-xs text-muted-foreground">{invoice.completedOn}</div>
                    </div>
                  </div>
                )}
                
                {invoice.invoiceStatus === 'Sent' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Invoice Sent</div>
                      <div className="text-xs text-muted-foreground">Today</div>
                    </div>
                  </div>
                )}
                
                {invoice.invoiceStatus === 'Paid' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Payment Received</div>
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
              {invoice.invoiceStatus === 'Draft' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Complete & Send
                </Button>
              )}
              
              {invoice.invoiceStatus === 'Ready to Send' && (
                <>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Invoice
                  </Button>
                </>
              )}
              
              {invoice.invoiceStatus === 'Sent' && (
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              {invoice.invoiceStatus === 'Draft' && (
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Draft
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credit Terms</span>
                <span>{invoice.creditTerms} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Days Since Completed</span>
                <span>{invoice.daysSinceCompleted} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Due Date</span>
                <span>{new Date(new Date(invoice.completedOn).getTime() + invoice.creditTerms * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailView;
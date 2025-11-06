import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, FileText, Send, Edit, Trash2, CheckSquare, DollarSign, Clock, AlertTriangle, TrendingUp, Download, Plus } from 'lucide-react';
import InvoiceDetailView from './InvoiceDetailView';

export const InvoiceQueueTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dueDaysFilter, setDueDaysFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Mock data - completed orders ready for invoicing
  const invoiceQueueData = [
    {
      id: '1',
      orderId: 'ORD-2025-003',
      customer: 'Lion Group',
      amount: 245000,
      completedOn: '2025-07-10',
      invoiceStatus: 'Draft',
      creditTerms: 30,
      daysSinceCompleted: 0
    },
    {
      id: '2',
      orderId: 'ORD-2025-001',
      customer: 'Freedom Foods',
      amount: 185000,
      completedOn: '2025-07-09',
      invoiceStatus: 'Sent',
      creditTerms: 30,
      daysSinceCompleted: 1
    },
    {
      id: '3',
      orderId: 'ORD-2025-002',
      customer: 'Umoya Group',
      amount: 167000,
      completedOn: '2025-07-08',
      invoiceStatus: 'Ready to Send',
      creditTerms: 45,
      daysSinceCompleted: 2
    },
    {
      id: '4',
      orderId: 'ORD-2025-004',
      customer: 'Premier Foods',
      amount: 142000,
      completedOn: '2025-07-06',
      invoiceStatus: 'Paid',
      creditTerms: 30,
      daysSinceCompleted: 4
    }
  ];

  // KPI calculations
  const kpiData = [
    {
      title: "Draft Invoices",
      value: invoiceQueueData.filter(item => item.invoiceStatus === 'Draft').length,
      icon: FileText,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      subtext: "Ready to process"
    },
    {
      title: "Sent Today",
      value: invoiceQueueData.filter(item => 
        item.invoiceStatus === 'Sent' && item.daysSinceCompleted === 0
      ).length,
      icon: Send,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      subtext: "New invoices"
    },
    {
      title: "Total Value",
      value: `R ${invoiceQueueData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      subtext: "In queue"
    },
    {
      title: "Avg Processing Time",
      value: `${Math.round(
        invoiceQueueData.reduce((sum, item) => sum + item.daysSinceCompleted, 0) / invoiceQueueData.length
      )} days`,
      icon: Clock,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      subtext: "Days to invoice"
    }
  ];

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

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(invoiceQueueData.map(item => item.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleRowClick = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  if (selectedInvoice) {
    return <InvoiceDetailView invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
  }

  return (
    <div className="space-y-4">

      {/* Invoice Queue Management Header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Invoice Queue Management</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search invoices, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-10 w-48 text-sm"
              />
            </div>
            <Select value={dueDaysFilter} onValueChange={setDueDaysFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Due Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="due-today">Due Today</SelectItem>
                <SelectItem value="due-week">Due This Week</SelectItem>
              </SelectContent>
            </Select>
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="ABC Corp">ABC Corp</SelectItem>
                <SelectItem value="XYZ Ltd">XYZ Ltd</SelectItem>
                <SelectItem value="Retail Plus">Retail Plus</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ready">Ready to Send</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedInvoices.length} invoice(s) selected
          </span>
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate & Send
          </Button>
          <Button size="sm" variant="outline">
            <CheckSquare className="h-4 w-4 mr-2" />
            Mark Sent
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Draft
          </Button>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground w-12">
                  <Checkbox
                    checked={selectedInvoices.length === invoiceQueueData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Order ID</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Customer</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Amount</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Completed</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Credit Terms</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceQueueData.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className="border-b border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleRowClick(invoice)}
                >
                  <td className="py-2 px-3">
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-xs font-medium text-primary hover:text-primary/80">
                      {invoice.orderId}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{invoice.customer}</td>
                  <td className="py-2 px-3 text-xs text-foreground">{formatCurrency(invoice.amount)}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{invoice.completedOn}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(invoice.invoiceStatus)}`}></div>
                      <span className="text-xs text-foreground">
                        {invoice.invoiceStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{invoice.creditTerms} days</td>
                  <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {invoice.invoiceStatus === 'Ready to Send' && (
                        <>
                          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                            Send
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                            Edit
                          </Button>
                        </>
                      )}
                      {invoice.invoiceStatus === 'Sent' && (
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          Mark Paid
                        </Button>
                      )}
                      {invoice.invoiceStatus === 'Draft' && (
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          Complete
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
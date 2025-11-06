import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ReceivableDetailView from './ReceivableDetailView';
import { 
  Search, 
  FileText, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Phone, 
  Mail, 
  CreditCard, 
  X,
  Send,
  Edit,
  TrendingUp,
  Download,
  Plus
} from 'lucide-react';

export const ReceivablesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [selectedReceivable, setSelectedReceivable] = useState<any>(null);

  // Mock receivables data
  const receivablesData = [
    {
      id: '1',
      invoiceNumber: 'INV-2025-001',
      customer: 'Lion Group',
      totalAmount: 245000,
      paidAmount: 0,
      outstandingAmount: 245000,
      dueDate: '2025-07-25',
      daysOverdue: 0,
      status: 'Outstanding',
      sentDate: '2025-07-10',
      lastReminder: null
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-002',
      customer: 'Freedom Foods',
      totalAmount: 185000,
      paidAmount: 100000,
      outstandingAmount: 85000,
      dueDate: '2025-07-20',
      daysOverdue: 5,
      status: 'Part-paid',
      sentDate: '2025-07-05',
      lastReminder: '2025-07-22'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2025-003',
      customer: 'Umoya Group',
      totalAmount: 167000,
      paidAmount: 0,
      outstandingAmount: 167000,
      dueDate: '2025-07-15',
      daysOverdue: 10,
      status: 'Overdue',
      sentDate: '2025-06-30',
      lastReminder: '2025-07-18'
    }
  ];

  // Mock timeline data for selected invoice
  const invoiceTimeline = [
    { date: '2025-07-10', event: 'Invoice sent', status: 'completed' },
    { date: '2025-07-12', event: 'Email opened by client', status: 'completed' },
    { date: '2025-07-20', event: 'First reminder sent', status: 'completed' },
    { date: '2025-07-25', event: 'Due date', status: selectedInvoice === '3' ? 'overdue' : 'pending' }
  ];

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

  const formatCurrency = (value: number) => `R ${value.toLocaleString()}`;

  // Calculate KPI data
  const kpiData = [
    {
      title: "Total Outstanding",
      value: formatCurrency(receivablesData.reduce((sum, item) => sum + item.outstandingAmount, 0)),
      icon: DollarSign,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      subtext: "All receivables"
    },
    {
      title: "Overdue Count",
      value: receivablesData.filter(item => item.daysOverdue > 0).length,
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      subtext: "Invoices overdue"
    },
    {
      title: "Overdue Value",
      value: formatCurrency(receivablesData.filter(item => item.daysOverdue > 0).reduce((sum, item) => sum + item.outstandingAmount, 0)),
      icon: Clock,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      subtext: "Amount at risk"
    },
    {
      title: "Avg Days Overdue",
      value: Math.round(receivablesData.reduce((sum, item) => sum + (item.daysOverdue > 0 ? item.daysOverdue : 0), 0) / receivablesData.filter(item => item.daysOverdue > 0).length) || 0,
      icon: TrendingUp,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      subtext: "For overdue items"
    }
  ];

  const handleRowClick = (receivable: any) => {
    setSelectedReceivable(receivable);
  };

  if (selectedReceivable) {
    return <ReceivableDetailView receivable={selectedReceivable} onBack={() => setSelectedReceivable(null)} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-4">
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

        {/* Receivables Management Header */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold">Receivables Management</h2>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search receivables, clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-10 w-48 text-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-10 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Outstanding">Outstanding</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
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
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Invoice #</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Customer</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Total</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Outstanding</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Due Date</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receivablesData.map((receivable) => (
                  <tr 
                    key={receivable.id} 
                    className="border-b border-border hover:bg-muted/30 cursor-pointer"
                    onClick={() => handleRowClick(receivable)}
                  >
                    <td className="py-2 px-3">
                      <span className="text-xs font-medium text-primary hover:text-primary/80">
                        {receivable.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-foreground">{receivable.customer}</td>
                    <td className="py-2 px-3 text-xs text-foreground">{formatCurrency(receivable.totalAmount)}</td>
                    <td className="py-2 px-3 text-xs text-foreground">
                      <div>
                        <div className="font-medium">{formatCurrency(receivable.outstandingAmount)}</div>
                        {receivable.paidAmount > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Paid: {formatCurrency(receivable.paidAmount)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">
                      <div>
                        <div>{receivable.dueDate}</div>
                        {receivable.daysOverdue > 0 && (
                          <div className={`text-xs flex items-center gap-1 ${getOverdueColor(receivable.daysOverdue)}`}>
                            <AlertTriangle className="h-3 w-3" />
                            {receivable.daysOverdue} days overdue
                          </div>
                        )}
                      </div>
                    </td>
                      <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(receivable.status)}`}></div>
                      <span className="text-xs text-foreground">
                        {receivable.status}
                      </span>
                    </div>
                  </td>
                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          Record Payment
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          Send Reminder
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          View Invoice
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

      {/* Side Panel */}
      <div className="space-y-4">
        {selectedInvoice ? (
          <>
            {/* Selected Invoice Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Invoice Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {invoiceTimeline.map((event, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.status === 'completed' ? 'bg-green-500' :
                      event.status === 'overdue' ? 'bg-red-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{event.event}</div>
                      <div className="text-xs text-muted-foreground">{event.date}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Log Payment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Credit Note
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Write-off
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                Select an invoice to view timeline and actions
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, FileText, Eye, Edit, CheckCircle, Download, Send, Loader2 } from 'lucide-react';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';

export const InvoicesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const { generatePDF, isGenerating } = usePDFGeneration();

  const invoiceData = [
    {
      id: 'invoice-1',
      invoiceId: 'INV-2024-001',
      client: 'Freedom Foods',
      orderRef: 'ORD-2024-001',
      amount: 185000,
      status: 'Paid',
      issueDate: '2025-06-15',
      dueDate: '2025-06-30',
      method: 'EFT'
    },
    {
      id: 'invoice-2',
      invoiceId: 'INV-2024-002',
      client: 'Lion Group',
      orderRef: 'ORD-2024-002',
      amount: 220000,
      status: 'Overdue',
      issueDate: '2025-06-10',
      dueDate: '2025-06-25',
      method: 'EFT'
    },
    {
      id: 'invoice-3',
      invoiceId: 'INV-2024-003',
      client: 'Umoya Group',
      orderRef: 'ORD-2024-003',
      amount: 165000,
      status: 'Pending',
      issueDate: '2025-06-20',
      dueDate: '2025-07-05',
      method: 'Card'
    },
    {
      id: 'invoice-4',
      invoiceId: 'INV-2024-004',
      client: 'Premier Foods',
      orderRef: 'ORD-2024-004',
      amount: 142000,
      status: 'Paid',
      issueDate: '2025-06-18',
      dueDate: '2025-07-03',
      method: 'EFT'
    },
    {
      id: 'invoice-5',
      invoiceId: 'INV-2024-005',
      client: 'Clover Industries',
      orderRef: 'ORD-2024-005',
      amount: 198000,
      status: 'Pending',
      issueDate: '2025-06-22',
      dueDate: '2025-07-07',
      method: 'EFT'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    await generatePDF('invoice', invoiceId);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    // TODO: Implement send invoice functionality
    console.log('Send invoice:', invoiceId);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All clients</SelectItem>
              <SelectItem value="freedom">Freedom Foods</SelectItem>
              <SelectItem value="lion">Lion Group</SelectItem>
              <SelectItem value="umoya">Umoya Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate invoice
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Order ref</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue date</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.orderRef}</TableCell>
                    <TableCell>R {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{invoice.method}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadPDF(invoice.id)}
                              disabled={isGenerating('invoice', invoice.id)}
                            >
                              {isGenerating('invoice', invoice.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download PDF</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendInvoice(invoice.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {invoice.status !== 'Paid' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as Paid</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </TooltipProvider>
  );
};

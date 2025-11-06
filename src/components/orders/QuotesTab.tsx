import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Edit, Download, Eye, Send, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';

const QuotesTab = ({ onViewOrder }) => {
  const { quotes, loading, createQuote, updateQuote, updateQuoteStatus, convertToOrder } = useQuotes();
  const { clients } = useClients();
  const { generatePDF, isGenerating } = usePDFGeneration();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [editingQuote, setEditingQuote] = useState(null);
  
  const [quoteForm, setQuoteForm] = useState({
    client_id: '',
    product: '',
    quantity: 0,
    price_per_unit: 0,
    lead_time_days: 14,
    expiry_date: '',
    notes: '',
    terms_conditions: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-muted';
      case 'Sent': return 'bg-blue-500';
      case 'Accepted': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const handleCreateQuote = async () => {
    try {
      await createQuote({
        client_id: quoteForm.client_id,
        product: quoteForm.product,
        quantity: quoteForm.quantity,
        price_per_unit: quoteForm.price_per_unit,
        lead_time_days: quoteForm.lead_time_days,
        expiry_date: quoteForm.expiry_date,
        created_by: 'Current User', // Replace with actual user
        notes: quoteForm.notes,
        terms_conditions: quoteForm.terms_conditions
      });
      
      setQuoteForm({
        client_id: '',
        product: '',
        quantity: 0,
        price_per_unit: 0,
        lead_time_days: 14,
        expiry_date: '',
        notes: '',
        terms_conditions: ''
      });
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setQuoteForm({
      client_id: quote.client_id,
      product: quote.product,
      quantity: quote.quantity,
      price_per_unit: quote.price_per_unit,
      lead_time_days: quote.lead_time_days,
      expiry_date: quote.expiry_date,
      notes: quote.notes || '',
      terms_conditions: quote.terms_conditions || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateQuote = async () => {
    try {
      await updateQuote(editingQuote.id, {
        client_id: quoteForm.client_id,
        product: quoteForm.product,
        quantity: quoteForm.quantity,
        price_per_unit: quoteForm.price_per_unit,
        lead_time_days: quoteForm.lead_time_days,
        expiry_date: quoteForm.expiry_date,
        notes: quoteForm.notes,
        terms_conditions: quoteForm.terms_conditions,
      });
      
      setIsEditDialogOpen(false);
      setEditingQuote(null);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const clientName = quote.clients?.name || '';
    const matchesSearch = searchTerm === '' || 
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesClient = clientFilter === 'all' || clientName === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  const uniqueClients = [...new Set(quotes.map(q => q.clients?.name).filter(Boolean))];

  const handleViewOrder = (orderId) => {
    if (onViewOrder) {
      onViewOrder(orderId);
    }
  };

  const handleSendQuote = async (quoteId: string) => {
    await updateQuoteStatus(quoteId, 'Sent');
  };

  const handleMarkAccepted = async (quoteId: string) => {
    await updateQuoteStatus(quoteId, 'Accepted');
  };

  const handleMarkRejected = async (quoteId: string) => {
    await updateQuoteStatus(quoteId, 'Rejected');
  };

  const handleReactivateQuote = async (quoteId: string) => {
    await updateQuoteStatus(quoteId, 'Draft');
  };

  const handleDownloadPDF = async (quoteId: string) => {
    console.log('Download PDF clicked for quote:', quoteId);
    try {
      await generatePDF('quote', quoteId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const renderPrimaryAction = (quote: any) => {
    switch (quote.status) {
      case 'Draft':
        return (
          <Button 
            variant="default"
            size="sm" 
            className="h-8 px-6 text-xs w-full"
            onClick={() => handleSendQuote(quote.id)}
          >
            Send Quote
          </Button>
        );
      case 'Sent':
        // For sent quotes, show View Order if converted
        if (quote.converted_order_id) {
          return (
            <Button 
              variant="outline"
              size="sm" 
              className="h-8 px-6 text-xs w-full"
              onClick={() => handleViewOrder(quote.converted_order_id)}
            >
              View Order
            </Button>
          );
        } else {
          return (
            <Button 
              variant="default"
              size="sm" 
              className="h-8 px-6 text-xs w-full"
              onClick={() => handleMarkAccepted(quote.id)}
            >
              Mark Accepted
            </Button>
          );
        }
      case 'Accepted':
        if (quote.converted_order_id) {
          return (
            <Button 
              variant="outline"
              size="sm" 
              className="h-8 px-6 text-xs w-full"
              onClick={() => handleViewOrder(quote.converted_order_id)}
            >
              View Order
            </Button>
          );
        } else {
          return (
            <Button 
              variant="default"
              size="sm" 
              className="h-8 px-6 text-xs w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => convertToOrder(quote.id)}
            >
              Convert to Order
            </Button>
          );
        }
      case 'Rejected':
      case 'Expired':
        return (
          <Button 
            variant="outline"
            size="sm" 
            className="h-8 px-6 text-xs w-full"
            onClick={() => handleReactivateQuote(quote.id)}
          >
            Reactivate Quote
          </Button>
        );
      default:
        return (
          <Button 
            variant="default"
            size="sm" 
            className="h-8 px-6 text-xs w-full"
            onClick={() => handleSendQuote(quote.id)}
          >
            Send Quote
          </Button>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Quotes Management Header */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold">Quotes Management</h2>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search quotes, clients, products..."
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-32 h-10 text-sm">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map(client => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
            </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Quote</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select value={quoteForm.client_id} onValueChange={(value) => setQuoteForm(prev => ({ ...prev, client_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Input 
                      placeholder="Enter product name" 
                      value={quoteForm.product}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, product: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price per Unit (R)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={quoteForm.price_per_unit}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, price_per_unit: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Time (Days)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter lead time" 
                      value={quoteForm.lead_time_days}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, lead_time_days: parseInt(e.target.value) || 14 }))}
                    />
                  </div>
                   <div className="space-y-2">
                     <Label>Expiry Date</Label>
                     <Input 
                       type="date" 
                       value={quoteForm.expiry_date}
                       onChange={(e) => setQuoteForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                     />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Notes</Label>
                     <Textarea 
                       placeholder="Additional notes or comments..."
                       value={quoteForm.notes}
                       onChange={(e) => setQuoteForm(prev => ({ ...prev, notes: e.target.value }))}
                       className="min-h-[80px]"
                     />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Terms & Conditions</Label>
                     <Textarea 
                       placeholder="Enter terms and conditions..."
                       value={quoteForm.terms_conditions}
                       onChange={(e) => setQuoteForm(prev => ({ ...prev, terms_conditions: e.target.value }))}
                       className="min-h-[100px]"
                     />
                   </div>
                   <div className="flex justify-end gap-2 mt-4 col-span-2">
                     <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                       Cancel
                     </Button>
                     <Button onClick={handleCreateQuote}>
                       Create Quote
                     </Button>
                   </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Quote Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Quote</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select value={quoteForm.client_id} onValueChange={(value) => setQuoteForm(prev => ({ ...prev, client_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Input 
                      placeholder="Enter product name" 
                      value={quoteForm.product}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, product: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price per Unit (R)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={quoteForm.price_per_unit}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, price_per_unit: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Time (Days)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter lead time" 
                      value={quoteForm.lead_time_days}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, lead_time_days: parseInt(e.target.value) || 14 }))}
                    />
                  </div>
                   <div className="space-y-2">
                     <Label>Expiry Date</Label>
                     <Input 
                       type="date" 
                       value={quoteForm.expiry_date}
                       onChange={(e) => setQuoteForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                     />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Notes</Label>
                     <Textarea 
                       placeholder="Additional notes or comments..."
                       value={quoteForm.notes}
                       onChange={(e) => setQuoteForm(prev => ({ ...prev, notes: e.target.value }))}
                       className="min-h-[80px]"
                     />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Terms & Conditions</Label>
                     <Textarea 
                       placeholder="Enter terms and conditions..."
                       value={quoteForm.terms_conditions}
                       onChange={(e) => setQuoteForm(prev => ({ ...prev, terms_conditions: e.target.value }))}
                       className="min-h-[100px]"
                     />
                   </div>
                   <div className="flex justify-end gap-2 mt-4 col-span-2">
                     <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                       Cancel
                     </Button>
                     <Button onClick={handleUpdateQuote}>
                       Update Quote
                     </Button>
                   </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Quote ID</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Client</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Product</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Quantity</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Price/Unit</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Total Value</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Lead Time</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Expiry</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-border hover:bg-muted/30 cursor-pointer">
                    <td className="py-2 px-3">
                      <span className="text-xs font-medium text-hitec-primary hover:text-hitec-primary/80">
                        {quote.quote_number}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-foreground">{quote.clients?.name || 'Unknown Client'}</td>
                    <td className="py-2 px-3 text-xs text-foreground">
                      <span className="truncate max-w-48 block" title={quote.product}>
                        {quote.product}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-foreground">{quote.quantity.toLocaleString()}</td>
                    <td className="py-2 px-3 text-xs text-foreground">R{quote.price_per_unit.toFixed(2)}</td>
                    <td className="py-2 px-3 text-xs text-foreground">R{quote.total_value.toLocaleString()}</td>
                    <td className="py-2 px-3 text-xs text-foreground">{quote.lead_time_days} days</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(quote.status)}`}></div>
                        <span className="text-xs font-medium">{quote.status}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{quote.expiry_date}</td>
                     <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center justify-center gap-2">
                         {/* Edit Button - Always visible */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-3 text-xs"
                                onClick={() => handleEditQuote(quote)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Quote</p>
                            </TooltipContent>
                          </Tooltip>
                          
                           {/* Download Button - Always visible */}
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button 
                                 variant="outline" 
                                 size="sm" 
                                 className="h-8 px-3 text-xs"
                                 onClick={() => handleDownloadPDF(quote.id)}
                                 disabled={isGenerating('quote', quote.id)}
                               >
                                 {isGenerating('quote', quote.id) ? (
                                   <Loader2 className="h-3 w-3 animate-spin" />
                                 ) : (
                                   <Download className="h-3 w-3" />
                                 )}
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent>
                               <p>Download PDF Quote</p>
                             </TooltipContent>
                           </Tooltip>

                         {/* Primary Action Button - Status dependent */}
                         {renderPrimaryAction(quote)}
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default QuotesTab;
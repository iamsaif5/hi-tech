
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import CRMClientList from './CRMClientList';
import CRMClientProfile from './CRMClientProfile';
import { Client, useClients } from '@/hooks/useClients';

const CRMView = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const { createClient } = useClients();
  
  const [formData, setFormData] = useState({
    name: '',
    client_type: '',
    contact_person: '',
    email: '',
    phone: '',
    account_manager: '',
    credit_terms: 30,
    industry: ''
  });

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleBack = () => {
    setSelectedClient(null);
  };

  const handleAddClient = () => {
    setShowAddClientDialog(true);
  };

  const handleSaveClient = async () => {
    try {
      await createClient({
        name: formData.name,
        client_type: formData.client_type,
        contact_person: formData.contact_person,
        email: formData.email,
        phone: formData.phone,
        account_manager: formData.account_manager,
        credit_terms: formData.credit_terms,
        industry: formData.industry
      });
      
      setFormData({
        name: '',
        client_type: '',
        contact_person: '',
        email: '',
        phone: '',
        account_manager: '',
        credit_terms: 30,
        industry: ''
      });
      
      setShowAddClientDialog(false);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  if (selectedClient) {
    // Transform the client data to match CRMClientProfile expectations
    const profileClient = {
      id: selectedClient.id,
      name: selectedClient.name,
      industry: selectedClient.industry || selectedClient.client_type || '',
      contact: selectedClient.contact_person || '',
      email: selectedClient.email || '',
      phone: selectedClient.phone || '',
      status: selectedClient.status,
      lastOrder: selectedClient.last_order_date || '',
      totalOrders: selectedClient.total_orders || 0,
      creditTerms: selectedClient.credit_terms || 30
    };

    return <CRMClientProfile client={profileClient} onBack={handleBack} />;
  }

  return (
    <div className="space-y-4">      
      <CRMClientList 
        onSelectClient={handleSelectClient}
        onAddClient={handleAddClient}
      />

      <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input 
                placeholder="Enter company name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Client Type</Label>
              <Select value={formData.client_type} onValueChange={(value) => setFormData(prev => ({ ...prev, client_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="food-service">Food Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input 
                placeholder="Primary contact name" 
                value={formData.contact_person}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                placeholder="contact@company.com" 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                placeholder="+27 XX XXX XXXX" 
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Manager</Label>
              <Select value={formData.account_manager} onValueChange={(value) => setFormData(prev => ({ ...prev, account_manager: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riaz">Riaz Patel</SelectItem>
                  <SelectItem value="sharon">Sharon Molefe</SelectItem>
                  <SelectItem value="david">David Zeeman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input 
                placeholder="e.g. Food & Beverage" 
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Credit Terms</Label>
              <Select value={formData.credit_terms.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, credit_terms: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="45">45 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowAddClientDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient} className="bg-blue-600 hover:bg-blue-700">
              Add Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMView;

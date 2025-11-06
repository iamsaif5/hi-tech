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
import { Plus, Search, Filter, Building, Mail, Phone, Users, CreditCard } from 'lucide-react';
import PageBreadcrumb from './PageBreadcrumb';

const ClientsView = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      companyName: 'ABC Exports',
      billingAddress: '123 Business St, Cape Town, 8001',
      shippingAddress: '456 Warehouse Ave, Cape Town, 8002',
      vatNumber: 'VAT123456789',
      contactPerson: 'John Smith',
      email: 'john@abcexports.co.za',
      phone: '+27 21 555 0123',
      whatsapp: '+27 82 555 0123',
      paymentTerms: '30 days',
      creditLimit: 50000,
      status: 'Active'
    },
    {
      id: 2,
      companyName: 'XYZ Industries',
      billingAddress: '789 Industrial Rd, Johannesburg, 2000',
      shippingAddress: '789 Industrial Rd, Johannesburg, 2000',
      vatNumber: 'VAT987654321',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@xyzind.co.za',
      phone: '+27 11 555 0456',
      whatsapp: '+27 83 555 0456',
      paymentTerms: '60 days',
      creditLimit: 75000,
      status: 'Active'
    },
    {
      id: 3,
      companyName: 'Global Trading Co',
      billingAddress: '321 Trade Plaza, Durban, 4000',
      shippingAddress: '654 Port Access Rd, Durban, 4001',
      vatNumber: 'VAT456789123',
      contactPerson: 'Mike Davis',
      email: 'mike@globaltrading.co.za',
      phone: '+27 31 555 0789',
      whatsapp: '+27 84 555 0789',
      paymentTerms: '45 days',
      creditLimit: 100000,
      status: 'Suspended'
    }
  ]);

  const [editingClient, setEditingClient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsAddDialogOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleSaveClient = (formData) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...editingClient, ...formData } : c));
    } else {
      const newClient = { id: Date.now(), ...formData };
      setClients([...clients, newClient]);
    }
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const handleArchiveClient = (clientId) => {
    setClients(clients.map(c => c.id === clientId ? { ...c, status: 'Archived' } : c));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const totalCreditLimit = clients.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalCreditExtended = clients.reduce((sum, c) => sum + c.creditLimit, 0);
  const newThisMonth = clients.filter(c => c.status === 'Active' && c.paymentTerms === '30 days').length;

  return (
    <div className="space-y-4">
      <PageBreadcrumb items={[{ label: 'Clients & CRM' }]} />
      
      <div className="flex items-center justify-between">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            </DialogHeader>
            <ClientForm
              client={editingClient}
              onSave={handleSaveClient}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-navy-700" />
              <span className="text-sm font-medium text-navy-800 uppercase tracking-wide">Total Clients</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-700" />
              <span className="text-sm font-medium text-blue-800 uppercase tracking-wide">Active Clients</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{activeClients}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">Credit Extended</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">${totalCreditExtended.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-navy-700" />
              <span className="text-sm font-medium text-navy-800 uppercase tracking-wide">This Month</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{newThisMonth}</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-900">Client Management</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Person</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Info</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Payment Terms</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Credit Limit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-blue-600">{client.companyName}</p>
                        <p className="text-xs text-gray-500">{client.vatNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{client.contactPerson}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{client.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{client.paymentTerms}</td>
                    <td className="py-3 px-4 text-gray-900">R{client.creditLimit.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditClient(client)}>
                          Edit
                        </Button>
                        {client.status !== 'Archived' && (
                          <Button size="sm" variant="outline" onClick={() => handleArchiveClient(client.id)}>
                            Archive
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ClientForm = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: client?.companyName || '',
    billingAddress: client?.billingAddress || '',
    shippingAddress: client?.shippingAddress || '',
    vatNumber: client?.vatNumber || '',
    contactPerson: client?.contactPerson || '',
    email: client?.email || '',
    phone: client?.phone || '',
    whatsapp: client?.whatsapp || '',
    paymentTerms: client?.paymentTerms || '30 days',
    creditLimit: client?.creditLimit || 0,
    status: client?.status || 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vatNumber">VAT/Registration Number</Label>
          <Input
            id="vatNumber"
            value={formData.vatNumber}
            onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingAddress">Billing Address</Label>
        <Input
          id="billingAddress"
          value={formData.billingAddress}
          onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingAddress">Shipping Address</Label>
        <Input
          id="shippingAddress"
          value={formData.shippingAddress}
          onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Primary Contact Name *</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Contact Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="7 days">7 days</SelectItem>
              <SelectItem value="14 days">14 days</SelectItem>
              <SelectItem value="30 days">30 days</SelectItem>
              <SelectItem value="45 days">45 days</SelectItem>
              <SelectItem value="60 days">60 days</SelectItem>
              <SelectItem value="90 days">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="creditLimit">Credit Limit (R)</Label>
          <Input
            id="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {client ? 'Update Client' : 'Add Client'}
        </Button>
      </div>
    </form>
  );
};

export default ClientsView;

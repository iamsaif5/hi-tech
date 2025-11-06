
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, Plus, FileText, CreditCard, Package, Edit, Trash2, ArrowLeft } from 'lucide-react';

interface CRMClientProfileProps {
  client: {
    id: string;
    name: string;
    industry: string;
    contact: string;
    email: string;
    phone: string;
    status: string;
    lastOrder: string;
    totalOrders: number;
    creditTerms: number;
  };
  onBack: () => void;
}

const CRMClientProfile = ({ client, onBack }: CRMClientProfileProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [creditTerms, setCreditTerms] = useState(client.creditTerms);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);

  const [documents] = useState([
    {
      fileName: 'Credit-Application-Lion.pdf',
      type: 'Credit Application',
      uploadedBy: 'Admin',
      date: '2025-06-20'
    },
    {
      fileName: 'Signed-Artwork-Approval.pdf',
      type: 'Signed Artwork',
      uploadedBy: 'Sales Rep',
      date: '2025-06-24'
    }
  ]);

  const [productHistory] = useState([
    {
      product: 'IWISA 25kg Printed',
      lastOrdered: '2025-06-20',
      totalOrders: 12,
      avgQuantity: 5500,
      isPreferred: true
    },
    {
      product: 'Lion 10kg White',
      lastOrdered: '2025-05-15',
      totalOrders: 8,
      avgQuantity: 3200,
      isPreferred: true
    },
    {
      product: 'Custom 5kg No Print',
      lastOrdered: '2025-04-10',
      totalOrders: 3,
      avgQuantity: 2000,
      isPreferred: false
    }
  ]);

  const handleSaveCreditTerms = () => {
    console.log('Saving credit terms:', creditTerms);
    setIsEditingTerms(false);
  };

  const handleUploadDocument = (type: string) => {
    console.log('Uploading document of type:', type);
    // File upload logic would go here
  };

  const handleEditClient = () => {
    setIsEditingClient(true);
  };

  const handleSaveClient = () => {
    setIsEditingClient(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-500' : 'bg-gray-500';
  };

  const getStatusTextColor = (status: string) => {
    return status === 'Active' ? 'text-green-600' : 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{client.name}</h1>
            <p className="text-sm text-muted-foreground">{client.industry} • {client.contact}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(client.status)}`}></div>
            <span className={`${getStatusTextColor(client.status)} text-sm font-medium`}>
              {client.status}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleEditClient}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="clean-tabs">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Products</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Primary Contact</Label>
                  <p className="text-sm text-foreground">{client.contact}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm text-foreground">{client.email}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                  <p className="text-sm text-foreground">{client.phone}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Industry</Label>
                  <p className="text-sm text-foreground">{client.industry}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Total Orders</Label>
                  <p className="text-2xl font-bold text-foreground">{client.totalOrders}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Last Order</Label>
                  <p className="text-sm text-foreground">{client.lastOrder}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Credit Terms</Label>
                  <div className="flex items-center gap-2">
                    {isEditingTerms ? (
                      <>
                        <Input
                          type="number"
                          value={creditTerms}
                          onChange={(e) => setCreditTerms(parseInt(e.target.value))}
                          className="w-20 h-8 text-sm"
                        />
                        <span className="text-sm text-muted-foreground">days</span>
                        <Button size="sm" onClick={handleSaveCreditTerms} className="h-8 px-3 text-xs">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditingTerms(false)} className="h-8 px-3 text-xs">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-foreground">{creditTerms} days</p>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditingTerms(true)} className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-4 py-4">
            <h2 className="text-sm font-semibold">Product History & Preferences</h2>
            <Button size="sm" className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Preferred Product
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Product</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Last Ordered</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Total Orders</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Avg Quantity</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Preferred</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productHistory.map((product, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30">
                      <td className="py-2 px-3 text-xs font-medium text-foreground">{product.product}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{product.lastOrdered}</td>
                      <td className="py-2 px-3 text-xs text-foreground">{product.totalOrders}</td>
                      <td className="py-2 px-3 text-xs text-foreground">{product.avgQuantity.toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${product.isPreferred ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                          <span className={`${product.isPreferred ? 'text-green-600' : 'text-gray-600'} text-xs font-medium`}>
                            {product.isPreferred ? 'Preferred' : 'Standard'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-4 py-4">
            <h2 className="text-sm font-semibold">Client Documents</h2>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleUploadDocument('Credit Application')} className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Credit Application
              </Button>
              <Button size="sm" onClick={() => handleUploadDocument('Signed Artwork')} className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Signed Artwork
              </Button>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">File Name</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Type</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Uploaded By</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Date</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30">
                      <td className="py-2 px-3 text-xs font-medium text-foreground">{doc.fileName}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${doc.type === 'Credit Application' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                          <span className={`${doc.type === 'Credit Application' ? 'text-blue-600' : 'text-purple-600'} text-xs font-medium`}>
                            {doc.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-foreground">{doc.uploadedBy}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{doc.date}</td>
                      <td className="py-2 px-3">
                        <div className="flex justify-center">
                          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Order History</h3>
            <p className="text-sm text-muted-foreground">Order history will be displayed here...</p>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4 mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Communication Log</h3>
            <p className="text-sm text-muted-foreground">Communication history will be displayed here...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Client Dialog */}
      <Dialog open={isEditingClient} onOpenChange={setIsEditingClient}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client Information</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input defaultValue={client.name} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input defaultValue={client.industry} />
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input defaultValue={client.contact} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={client.email} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue={client.phone} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Input defaultValue={client.status} />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditingClient(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMClientProfile;

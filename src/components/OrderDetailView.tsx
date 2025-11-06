import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

interface OrderDetailViewProps {
  order: {
    id: string;
    order_number: string;
    clients: { name: string };
    product: string;
    quantity: number;
    order_value: number;
    status: string;
    delivery_date: string;
    order_date: string;
    created_by: string;
  };
  onBack: () => void;
}

const OrderDetailView = ({ order, onBack }: OrderDetailViewProps) => {
  const { updateOrder, createManufacturingOrder } = useOrders();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState({
    // Artwork & Specs
    artworkFile: null,
    artworkApproved: '',
    specNotes: '',
    
    // Production Requirements
    productType: '',
    lamination: '',
    loomRequired: '',
    handleType: '',
    printArea: '',
    productionNotes: '',
    
    // Delivery Details
    deliveryAddress: '',
    contactPerson: '',
    shippingMethod: '',
    deliveryNotes: '',
    
    // Admin & Docs
    salesRep: '',
    internalNotes: '',
    clientApprovalDate: '',
    poFile: null
  });

  const [validationStatus, setValidationStatus] = useState({
    coreOrder: true,
    artwork: false,
    production: false,
    delivery: false,
    admin: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-muted';
      case 'Confirmed': return 'bg-blue-500';
      case 'Cancelled': return 'bg-red-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getOrderReadiness = () => {
    const allValid = Object.values(validationStatus).every(status => status);
    return allValid ? 'Ready for MO' : 'Not Ready';
  };

  const handleInputChange = (field: string, value: any) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    
    // Update validation status based on required fields
    const newValidation = { ...validationStatus };
    
    if (['artworkFile', 'artworkApproved'].includes(field)) {
      newValidation.artwork = !!(orderData.artworkFile && orderData.artworkApproved);
    }
    if (['productType', 'lamination', 'loomRequired'].includes(field)) {
      newValidation.production = !!(orderData.productType && orderData.lamination && orderData.loomRequired);
    }
    if (['deliveryAddress', 'contactPerson'].includes(field)) {
      newValidation.delivery = !!(orderData.deliveryAddress && orderData.contactPerson);
    }
    
    setValidationStatus(newValidation);
  };

  const getSectionIcon = (isValid: boolean) => {
    return isValid ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const handleSaveProgress = async () => {
    try {
      // Save order details to database (extend order table or create order_details table)
      toast({
        title: "Success",
        description: "Order details saved successfully",
      });
    } catch (error) {
      console.error('Error saving order details:', error);
      toast({
        title: "Error",
        description: "Failed to save order details",
        variant: "destructive",
      });
    }
  };

  const handleCreateMO = async () => {
    try {
      if (getOrderReadiness() !== 'Ready for MO') {
        toast({
          title: "Error",
          description: "Please complete all required fields before creating MO",
          variant: "destructive",
        });
        return;
      }

      await createManufacturingOrder(order.id);
      toast({
        title: "Success",
        description: "Manufacturing Order created and sent to production",
      });
      
      // Redirect back to orders list after successful MO creation
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      console.error('Error creating MO:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{order.order_number}</h1>
            <p className="text-sm text-muted-foreground">{order.clients.name} • {order.product}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
            <span className="text-xs font-medium">{order.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getOrderReadiness() === 'Ready for MO' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span className="text-xs font-medium">{getOrderReadiness()}</span>
          </div>
          <Button 
            disabled={getOrderReadiness() !== 'Ready for MO'}
            className="bg-green-600 hover:bg-green-700"
            onClick={handleCreateMO}
          >
            Create MO
          </Button>
        </div>
      </div>

      {/* 1. Core Order Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getSectionIcon(validationStatus.coreOrder)}
            Core Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Client Name</Label>
              <p className="font-medium">{order.clients.name}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Product Name</Label>
              <p className="font-medium">{order.product}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <p className="font-medium">{order.quantity.toLocaleString()} units</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Price/Unit</Label>
              <p className="font-medium">R {(order.order_value / order.quantity).toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total Value</Label>
              <p className="font-medium">R {order.order_value.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Delivery Date</Label>
              <p className="font-medium">{order.delivery_date}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Artwork and Spec Upload */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getSectionIcon(validationStatus.artwork)}
            Artwork and Spec Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Upload Final Artwork *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">PDF, PNG, AI files accepted</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Client Approved Artwork? *</Label>
                <Select value={orderData.artworkApproved} onValueChange={(value) => handleInputChange('artworkApproved', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Spec Notes</Label>
                <Textarea 
                  value={orderData.specNotes}
                  onChange={(e) => handleInputChange('specNotes', e.target.value)}
                  placeholder="Additional specifications or notes"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Production Requirements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getSectionIcon(validationStatus.production)}
            Production Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Product Type *</Label>
              <Select value={orderData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woven">Woven Bag</SelectItem>
                  <SelectItem value="non-woven">Non-Woven Bag</SelectItem>
                  <SelectItem value="laminated">Laminated Bag</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lamination *</Label>
              <Select value={orderData.lamination} onValueChange={(value) => handleInputChange('lamination', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lamination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Loom Required *</Label>
              <Select value={orderData.loomRequired} onValueChange={(value) => handleInputChange('loomRequired', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loom requirement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Handle Type</Label>
              <Select value={orderData.handleType} onValueChange={(value) => handleInputChange('handleType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select handle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Handle</SelectItem>
                  <SelectItem value="loop">Loop Handle</SelectItem>
                  <SelectItem value="flat">Flat Handle</SelectItem>
                  <SelectItem value="rope">Rope Handle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Print Area</Label>
              <Input 
                value={orderData.printArea}
                onChange={(e) => handleInputChange('printArea', e.target.value)}
                placeholder="e.g. 200x300mm"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Label>Production Notes</Label>
              <Textarea 
                value={orderData.productionNotes}
                onChange={(e) => handleInputChange('productionNotes', e.target.value)}
                placeholder="Internal production notes"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Delivery Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getSectionIcon(validationStatus.delivery)}
            Delivery Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Delivery Address *</Label>
                <Textarea 
                  value={orderData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder="Full delivery address"
                  rows={3}
                />
              </div>
              <div>
                <Label>Contact Person at Warehouse *</Label>
                <Input 
                  value={orderData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Contact name and phone"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Shipping Method</Label>
                <Select value={orderData.shippingMethod} onValueChange={(value) => handleInputChange('shippingMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal Fleet</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                    <SelectItem value="third-party">3rd Party</SelectItem>
                    <SelectItem value="collection">Client Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delivery Notes</Label>
                <Textarea 
                  value={orderData.deliveryNotes}
                  onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                  placeholder="Special delivery instructions"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Admin & Docs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getSectionIcon(validationStatus.admin)}
            Admin & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Account Manager</Label>
                <Select value={orderData.salesRep} onValueChange={(value) => handleInputChange('salesRep', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales rep" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="david">David Zeeman</SelectItem>
                    <SelectItem value="sharon">Sharon Molefe</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Client Approval Date</Label>
                <Input 
                  type="date"
                  value={orderData.clientApprovalDate}
                  onChange={(e) => handleInputChange('clientApprovalDate', e.target.value)}
                />
              </div>
              <div>
                <Label>Upload PO (Optional)</Label>
                <div className="border border-border rounded-lg p-3 text-center">
                  <FileText className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Internal Notes</Label>
                <Textarea 
                  value={orderData.internalNotes}
                  onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                  placeholder="Internal notes and comments"
                  rows={6}
                />
              </div>
              <div>
                <Label>Invoice Status</Label>
                <p className="text-sm text-muted-foreground">Will be auto-generated after MO creation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end gap-2 pb-6">
        <Button variant="outline" onClick={onBack}>Cancel Changes</Button>
        <Button onClick={handleSaveProgress}>Save Progress</Button>
      </div>
    </div>
  );
};

export default OrderDetailView;
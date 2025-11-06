import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Package, Target, Clock, FileText, Image, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MODetailViewProps {
  mo: {
    id: string;
    orderId: string;
    client: string;
    product: string;
    quantity: number;
    dueDate: string;
    status: string;
    createdDate: string;
  };
  onBack: () => void;
}

const MODetailView = ({ mo, onBack }: MODetailViewProps) => {
  const { toast } = useToast();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500';
      case 'Scheduled': return 'bg-blue-500';
      case 'In Production': return 'bg-green-500';
      case 'Completed': return 'bg-green-600';
      case 'On Hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      // This would typically integrate with an invoicing system
      toast({
        title: "Success",
        description: "Invoice generated successfully",
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice",
        variant: "destructive",
      });
    }
  };

  const handleCreateDelivery = async () => {
    try {
      // Get the manufacturing order and related order details
      const { data: moData, error: moError } = await supabase
        .from('manufacturing_orders')
        .select(`
          *,
          orders (
            id,
            order_number,
            client_id,
            clients (name)
          )
        `)
        .eq('id', mo.id)
        .single();

      if (moError) throw moError;

      // Generate delivery number
      const { data: deliveryNumber } = await supabase.rpc('generate_delivery_number');

      // Create delivery record
      const deliveryData = {
        delivery_number: deliveryNumber,
        order_id: moData.order_id,
        mo_id: mo.id,
        client_name: moData.orders.clients.name,
        product: moData.product,
        quantity: moData.quantity,
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        method: 'Internal Fleet' as const,
        status: 'Scheduled' as const
      };

      const { error: deliveryError } = await supabase
        .from('deliveries')
        .insert([deliveryData]);

      if (deliveryError) throw deliveryError;

      toast({
        title: "Success",
        description: "Delivery scheduled successfully",
      });
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast({
        title: "Error",
        description: "Failed to create delivery",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Manufacturing Orders
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{mo.id}</h1>
            <p className="text-sm text-muted-foreground">{mo.client} • {mo.product}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(mo.status)}`}></div>
            <span className="text-sm font-medium">{mo.status}</span>
          </div>
        </div>
      </div>

      {/* MO Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Manufacturing Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">MO Number</label>
              <p className="font-medium">{mo.id}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Source Order</label>
              <p className="font-medium">{mo.orderId}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Client</label>
              <p className="font-medium">{mo.client}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Product</label>
              <p className="font-medium">{mo.product}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Quantity</label>
              <p className="font-medium">{mo.quantity.toLocaleString()} units</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Due Date</label>
              <p className="font-medium">{mo.dueDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artwork & Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Artwork & Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Artwork Files</h3>
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Final_Artwork_v2.pdf</p>
                        <p className="text-xs text-muted-foreground">Uploaded from Order {mo.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="View">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Download">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Print_Specs.png</p>
                        <p className="text-xs text-muted-foreground">Print specifications</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="View">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Download">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Artwork Approval Status</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600">Client Approved</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Print Specifications</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Print Area</label>
                  <p className="text-sm">300x400mm</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Colors</label>
                  <p className="text-sm">4-Color Process (CMYK)</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Finish</label>
                  <p className="text-sm">Matte Lamination</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Handle Type</label>
                  <p className="text-sm">Loop Handle</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Special Notes</label>
                  <p className="text-sm">Extra reinforcement on bottom seam required</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Production Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Product Type</label>
                  <p className="text-sm">Woven Bag</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Lamination</label>
                  <p className="text-sm">Yes</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Looming Required</label>
                  <p className="text-sm">Yes</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Production Schedule</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Created Date</label>
                  <p className="text-sm">{mo.createdDate}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Target Completion</label>
                  <p className="text-sm">{mo.dueDate}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Priority</label>
                  <p className="text-sm">Standard</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Production Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {mo.status === 'Completed' ? '100%' : 
                 mo.status === 'In Production' ? '65%' : 
                 mo.status === 'Scheduled' ? '10%' : '0%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: mo.status === 'Completed' ? '100%' : 
                         mo.status === 'In Production' ? '65%' : 
                         mo.status === 'Scheduled' ? '10%' : '0%' 
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2 pb-6">
        <Button variant="outline">Update Status</Button>
        <Button variant="outline">Add Notes</Button>
        {mo.status === 'Completed' && (
          <>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleGenerateInvoice}
            >
              Generate Invoice
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateDelivery}
            >
              Create Delivery
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MODetailView;
import React, { useState, useEffect } from 'react';
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
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Package, Clock, TrendingUp, AlertTriangle, CheckCircle, Hourglass, Truck, Tag } from 'lucide-react';
import OrderDetailView from './OrderDetailView';
import MODetailView from './MODetailView';
import DeliveriesView from './DeliveriesView';
import QuotesTab from './orders/QuotesTab';
import ManufacturingOrdersTab from './orders/ManufacturingOrdersTab';
import CreateMOModal from './orders/CreateMOModal';
import { useOrders } from '@/hooks/useOrders';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';

const OrdersView = () => {
  const { orders, loading, createOrder, createManufacturingOrder, refetch } = useOrders();
  const { clients, loading: clientsLoading } = useClients();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMO, setSelectedMO] = useState(null);
  const [activeTab, setActiveTab] = useState('quotes');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isCreateMOModalOpen, setIsCreateMOModalOpen] = useState(false);
  const [selectedOrderForMO, setSelectedOrderForMO] = useState(null);
  const [ordersWithMO, setOrdersWithMO] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [newOrder, setNewOrder] = useState({
    client: '',
    product: '',
    quantity: '',
    orderValue: '',
    deliveryDate: '',
    specialNotes: ''
  });

  // Check which orders have existing MOs
  useEffect(() => {
    const checkOrdersWithMO = async () => {
      try {
        const { data: mos } = await supabase
          .from('manufacturing_orders')
          .select('order_id');
        
        if (mos) {
          setOrdersWithMO(new Set(mos.map(mo => mo.order_id)));
        }
      } catch (error) {
        console.error('Error checking MOs:', error);
      }
    };

    if (orders.length > 0) {
      checkOrdersWithMO();
    }
  }, [orders]);

  const handleAddOrder = async () => {
    try {
      const clientId = clients?.find(c => c.name === newOrder.client)?.id;
      if (!clientId) {
        console.error('Client not found');
        return;
      }

      await createOrder({
        client_id: clientId,
        product: newOrder.product,
        quantity: parseInt(newOrder.quantity) || 0,
        order_value: parseInt(newOrder.orderValue) || 0,
        delivery_date: newOrder.deliveryDate,
        created_by: 'Current User',
      });

      setNewOrder({
        client: '',
        product: '',
        quantity: '',
        orderValue: '',
        deliveryDate: '',
        specialNotes: ''
      });
      setIsAddDrawerOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // Validate order completeness for MO readiness
  const validateOrderCompleteness = (order: any) => {
    // Check if order has all required basic information
    const hasBasicInfo = order.product && order.quantity && order.delivery_date && order.order_value;
    const hasClientInfo = order.clients?.name;
    
    // In a real implementation, this would check for:
    // - Artwork uploaded and approved
    // - Production specifications completed
    // - Delivery address confirmed
    // - All required fields in order detail view
    
    // For demo purposes, we'll simulate completeness based on order characteristics
    // Orders with higher values are more likely to be complete (representing more detailed orders)
    const isLikelyComplete = order.order_value > 50000;
    
    return hasBasicInfo && hasClientInfo && isLikelyComplete;
  };

  // Determine order status based on completeness and MO creation
  const getOrderStatus = (order: any) => {
    if (ordersWithMO.has(order.id)) {
      return 'MO Created';
    }
    
    if (order.status === 'Cancelled' || order.status === 'Delivered') {
      return order.status;
    }
    
    if (order.status === 'On Hold') {
      return 'On Hold';
    }
    
    const isComplete = validateOrderCompleteness(order);
    
    if (order.status === 'New' && !isComplete) {
      return 'Incomplete';
    }
    
    if (isComplete) {
      return 'Confirmed';
    }
    
    return 'New';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-muted';
      case 'Incomplete': return 'bg-orange-500';
      case 'Confirmed': return 'bg-blue-500';
      case 'MO Created': return 'bg-green-500';
      case 'On Hold': return 'bg-red-500';
      case 'Cancelled': return 'bg-red-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const filteredOrders = orders.filter(order => {
    const clientName = order.clients?.name || '';
    const orderStatus = getOrderStatus(order);
    const matchesSearch = searchTerm === '' || 
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;
    const matchesClient = clientFilter === 'all' || clientName === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  const uniqueClients = [...new Set(orders.map(o => o.clients?.name).filter(Boolean))];

  const handleRowClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleCreateMO = (order: any) => {
    setSelectedOrderForMO(order);
    setIsCreateMOModalOpen(true);
  };

  const handleMOCreated = () => {
    // Refresh the orders and MO status
    refetch();
  };

  const handleViewMO = async (orderId: string) => {
    try {
      // Fetch the manufacturing order for this order
      const { data: mo, error } = await supabase
        .from('manufacturing_orders')
        .select(`
          *,
          clients (
            name
          ),
          orders (
            order_number
          )
        `)
        .eq('order_id', orderId)
        .single();

      if (error) throw error;

      if (mo) {
        // Transform the data to match MODetailView props
        const moForDetail = {
          id: mo.id,
          orderId: mo.order_id,
          client: mo.clients?.name || 'Unknown Client',
          product: mo.product,
          quantity: mo.quantity,
          dueDate: mo.due_date,
          status: mo.status,
          createdDate: mo.created_at,
          moNumber: mo.mo_number,
          orderNumber: mo.orders?.order_number || 'Unknown'
        };
        
        setSelectedMO(moForDetail);
      }
    } catch (error) {
      console.error('Error fetching MO:', error);
    }
  };

  if (selectedMO) {
    return <MODetailView mo={selectedMO} onBack={() => setSelectedMO(null)} />;
  }

  if (selectedOrder) {
    return <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="clean-tabs">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="manufacturing-orders">Manufacturing Orders</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="mt-4">
          <QuotesTab onViewOrder={(orderId) => {
            // Find the order by ID and navigate to it
            const order = orders.find(o => o.id === orderId);
            if (order) {
              setSelectedOrder(order);
            }
          }} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 mt-4">
          {/* Orders Management Header */}
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold">Orders Management</h2>
              
              {/* Search and Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, clients, products..."
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
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Incomplete">Incomplete</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="MO Created">MO Created</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
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

            <Drawer open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Order
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-w-4xl mx-auto">
                <DrawerHeader>
                  <DrawerTitle>Create New Order</DrawerTitle>
                  <DrawerDescription>
                    Add a new order to the system with client and product details.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Order Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="client">Client</Label>
                        <Select value={newOrder.client} onValueChange={(value) => setNewOrder({...newOrder, client: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients?.map(client => (
                              <SelectItem key={client.id} value={client.name}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="product">Product</Label>
                        <Select value={newOrder.product} onValueChange={(value) => setNewOrder({...newOrder, product: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IWISA 25kg Printed">IWISA 25kg Printed</SelectItem>
                            <SelectItem value="Lion 10kg White">Lion 10kg White</SelectItem>
                            <SelectItem value="Custom 5kg No Print">Custom 5kg No Print</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          type="number"
                          value={newOrder.quantity}
                          onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                          placeholder="Enter quantity"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orderValue">Order Value (R)</Label>
                        <Input
                          type="number"
                          value={newOrder.orderValue}
                          onChange={(e) => setNewOrder({...newOrder, orderValue: e.target.value})}
                          placeholder="Enter order value"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Delivery & Additional Info</h3>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryDate">Delivery Deadline</Label>
                        <Input
                          type="date"
                          value={newOrder.deliveryDate}
                          onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialNotes">Special Notes</Label>
                        <Textarea
                          value={newOrder.specialNotes}
                          onChange={(e) => setNewOrder({...newOrder, specialNotes: e.target.value})}
                          placeholder="Special requirements, packing instructions, etc."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <div className="flex justify-end gap-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    <Button onClick={handleAddOrder} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create Order
                    </Button>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Order ID</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Client Name</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Product</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Quantity</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Order Value</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Delivery Date</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-border hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleRowClick(order)}
                    >
                      <td className="py-2 px-3">
                        <span className="text-xs font-medium text-hitec-primary hover:text-hitec-primary/80">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-foreground">{order.clients?.name}</td>
                      <td className="py-2 px-3 text-xs text-foreground">
                        <span className="truncate max-w-48 block" title={order.product}>
                          {order.product}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-foreground">{order.quantity.toLocaleString()}</td>
                      <td className="py-2 px-3 text-xs text-foreground">R {order.order_value.toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(getOrderStatus(order))}`}></div>
                          <span className="text-xs font-medium">{getOrderStatus(order)}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">
                        {order.delivery_date}
                      </td>
                      <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                        <TooltipProvider>
                          {(() => {
                            const orderStatus = getOrderStatus(order);
                            
                            if (ordersWithMO.has(order.id) || orderStatus === 'MO Created') {
                              return (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 px-6 text-xs w-full"
                                  onClick={() => handleViewMO(order.id)}
                                >
                                  View MO
                                </Button>
                              );
                            }
                            
                            if (orderStatus === 'Confirmed') {
                              return (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="h-8 px-6 text-xs w-full bg-green-600 hover:bg-green-700"
                                  onClick={() => handleCreateMO(order)}
                                >
                                  Create MO
                                </Button>
                              );
                            }
                            
                            if (orderStatus === 'New' || orderStatus === 'Incomplete') {
                              return (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="h-8 px-6 text-xs w-full text-muted-foreground"
                                      disabled
                                    >
                                      Create MO
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Complete all fields before creating MO</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            
                            return (
                              <span className="text-xs text-muted-foreground">-</span>
                            );
                          })()}
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="manufacturing-orders" className="mt-4">
          <ManufacturingOrdersTab />
        </TabsContent>

        <TabsContent value="deliveries" className="mt-4">
          <DeliveriesView />
        </TabsContent>
      </Tabs>

      {/* Create MO Modal */}
      {selectedOrderForMO && (
        <CreateMOModal
          isOpen={isCreateMOModalOpen}
          onClose={() => {
            setIsCreateMOModalOpen(false);
            setSelectedOrderForMO(null);
          }}
          order={selectedOrderForMO}
          onMOCreated={handleMOCreated}
        />
      )}
    </div>
  );
};

export default OrdersView;

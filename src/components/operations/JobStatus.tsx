import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useManufacturingOrders } from '@/hooks/useManufacturingOrders';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductionStage {
  name: string;
  completed: boolean;
  inProgress: boolean;
  quantity: string;
  target: string;
}

interface JobOrder {
  id: string;
  orderId: string;
  productId: string;
  product: string;
  externalOrderId: string;
  status: 'completed' | 'partly-done' | 'confirmed' | 'in-production' | 'on-hold';
  progress: number;
  quantity: number;
  stages: ProductionStage[];
}

const JobStatus = () => {
  const { manufacturingOrders, loading, completeManufacturingOrder, startManufacturingOrder } = useManufacturingOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Production stages for bag manufacturing
  const stageNames = [
    'Tubing',
    'Printing', 
    'Cutting',
    'Folding'
  ];

  const mockOrders: JobOrder[] = [
    {
      id: '1',
      orderId: 'MO-2025-001',
      productId: 'IWISA 25kg Printed',
      product: 'IWISA 25kg Printed',
      externalOrderId: 'ORD-0012',
      status: 'completed',
      progress: 100,
      quantity: 5000,
      stages: [
        { name: 'Products (done/all)', completed: true, inProgress: false, quantity: '5000', target: '5000' },
        { name: 'Cutting', completed: true, inProgress: false, quantity: '5000', target: '5000' },
        { name: 'Folding', completed: true, inProgress: false, quantity: '5000', target: '5000' },
        { name: 'Printing', completed: true, inProgress: false, quantity: '5000', target: '5000' },
        { name: 'QC Check', completed: true, inProgress: false, quantity: '5000', target: '5000' },
        { name: 'Packing', completed: true, inProgress: false, quantity: '5000', target: '5000' },
        { name: 'Shipping', completed: true, inProgress: false, quantity: '5000', target: '5000' }
      ]
    },
    {
      id: '2',
      orderId: 'MO-2025-002',
      productId: 'Lion 10kg White',
      product: 'Lion 10kg White',
      externalOrderId: 'ORD-0013',
      status: 'in-production',
      progress: 50,
      quantity: 3500,
      stages: [
        { name: 'Products (done/all)', completed: false, inProgress: false, quantity: '0', target: '3500' },
        { name: 'Cutting', completed: false, inProgress: true, quantity: '1750', target: '3500' },
        { name: 'Folding', completed: false, inProgress: false, quantity: '0', target: '3500' },
        { name: 'Printing', completed: false, inProgress: false, quantity: '0', target: '3500' },
        { name: 'QC Check', completed: false, inProgress: false, quantity: '0', target: '3500' },
        { name: 'Packing', completed: false, inProgress: false, quantity: '0', target: '3500' },
        { name: 'Shipping', completed: false, inProgress: false, quantity: '0', target: '3500' }
      ]
    },
    {
      id: '3',
      orderId: 'MO-2025-003',
      productId: 'IWISA 25kg Printed',
      product: 'IWISA 25kg Printed',
      externalOrderId: 'ORD-0014',
      status: 'confirmed',
      progress: 0,
      quantity: 4200,
      stages: [
        { name: 'Products (done/all)', completed: false, inProgress: false, quantity: '0', target: '4200' },
        { name: 'Cutting', completed: false, inProgress: false, quantity: '0', target: '4200' },
        { name: 'Folding', completed: false, inProgress: false, quantity: '0', target: '4200' },
        { name: 'Printing', completed: false, inProgress: false, quantity: '0', target: '4200' },
        { name: 'QC Check', completed: false, inProgress: false, quantity: '0', target: '4200' },
        { name: 'Packing', completed: false, inProgress: false, quantity: '0', target: '4200' },
        { name: 'Shipping', completed: false, inProgress: false, quantity: '0', target: '4200' }
      ]
    },
    {
      id: '4',
      orderId: 'MO-2025-004',
      productId: 'Custom 5kg No Print',
      product: 'Custom 5kg No Print',
      externalOrderId: 'ORD-0015',
      status: 'partly-done',
      progress: 25,
      quantity: 2000,
      stages: [
        { name: 'Products (done/all)', completed: false, inProgress: false, quantity: '0', target: '2000' },
        { name: 'Cutting', completed: true, inProgress: false, quantity: '2000', target: '2000' },
        { name: 'Folding', completed: false, inProgress: false, quantity: '0', target: '2000' },
        { name: 'Printing', completed: false, inProgress: false, quantity: '0', target: '2000' },
        { name: 'QC Check', completed: false, inProgress: false, quantity: '0', target: '2000' },
        { name: 'Packing', completed: false, inProgress: false, quantity: '0', target: '2000' },
        { name: 'Shipping', completed: false, inProgress: false, quantity: '0', target: '2000' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'partly-done': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-orange-100 text-orange-800';
      case 'in-production': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (stage: ProductionStage) => {
    if (stage.completed) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    } else if (stage.inProgress) {
      return <Circle className="h-4 w-4 text-blue-600 fill-current" />;
    } else {
      return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getProgressPercentage = (quantity: string, target: string) => {
    const qty = parseFloat(quantity);
    const tgt = parseFloat(target);
    return tgt > 0 ? Math.round((qty / tgt) * 100) : 0;
  };

  const handleCompleteProduction = async (moId: string) => {
    try {
      await completeManufacturingOrder(moId);
    } catch (error) {
      console.error('Error completing production:', error);
    }
  };

  const handleStartProduction = async (moId: string) => {
    try {
      await startManufacturingOrder(moId);
    } catch (error) {
      console.error('Error starting production:', error);
    }
  };

  const handleGenerateInvoice = async (moNumber: string) => {
    try {
      // This would typically integrate with an invoicing system
      toast({
        title: "Success",
        description: `Invoice generated for ${moNumber}`,
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

  const handleCreateDelivery = async (moNumber: string) => {
    try {
      // Find the MO by number
      const mo = manufacturingOrders.find(m => m.mo_number === moNumber);
      if (!mo) {
        throw new Error('Manufacturing order not found');
      }

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
        description: `Delivery scheduled for ${moNumber}`,
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

  // Convert manufacturing orders to job orders format for display
  const jobOrders = manufacturingOrders
    .filter(mo => mo.status === 'Scheduled' || mo.status === 'In Production' || mo.status === 'Completed' || mo.status === 'On Hold')
    .map(mo => {
    let jobStatus: 'completed' | 'partly-done' | 'confirmed' | 'in-production' | 'on-hold';
    
    switch (mo.status) {
      case 'Completed':
        jobStatus = 'completed';
        break;
      case 'In Production':
        jobStatus = 'in-production';
        break;
      case 'On Hold':
        jobStatus = 'on-hold';
        break;
      case 'Scheduled':
        jobStatus = 'confirmed';
        break;
      default:
        jobStatus = 'confirmed';
    }

    // Mock progress data - in real implementation this would come from production tracking
    const mockProgress = mo.status === 'Completed' ? 100 : 
                        mo.status === 'In Production' ? Math.floor(Math.random() * 80) + 10 :
                        mo.status === 'Scheduled' ? 0 :
                        0;

    return {
      id: mo.id,
      orderId: mo.mo_number,
      productId: mo.product,
      product: mo.product,
      externalOrderId: `ORD-${mo.order_id.slice(-4)}`, // Simplified for display
      status: jobStatus,
      progress: mockProgress,
      quantity: mo.quantity,
      stages: [
        { 
          name: 'Tubing', 
          completed: mockProgress >= 25, 
          inProgress: mockProgress < 25 && mockProgress > 0, 
          quantity: Math.floor((mockProgress / 100) * mo.quantity).toString(), 
          target: mo.quantity.toString() 
        },
        { 
          name: 'Printing', 
          completed: mockProgress >= 50, 
          inProgress: mockProgress >= 25 && mockProgress < 50, 
          quantity: Math.floor((Math.max(0, mockProgress - 25) / 100) * mo.quantity).toString(), 
          target: mo.quantity.toString() 
        },
        { 
          name: 'Cutting', 
          completed: mockProgress >= 75, 
          inProgress: mockProgress >= 50 && mockProgress < 75, 
          quantity: Math.floor((Math.max(0, mockProgress - 50) / 100) * mo.quantity).toString(), 
          target: mo.quantity.toString() 
        },
        { 
          name: 'Folding', 
          completed: mockProgress >= 100, 
          inProgress: mockProgress >= 75 && mockProgress < 100, 
          quantity: Math.floor((Math.max(0, mockProgress - 75) / 100) * mo.quantity).toString(), 
          target: mo.quantity.toString() 
        }
      ]
    };
  });

  const filteredOrders = jobOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.externalOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header and Search */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Live Production Tracking</h2>
          <p className="text-xs text-muted-foreground">Real-time job progress on shop floor</p>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search MO ID, products..."
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
                <SelectItem value="confirmed">Scheduled</SelectItem>
                <SelectItem value="in-production">In Production</SelectItem>
                <SelectItem value="partly-done">Partly Done</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{jobOrders.filter(j => j.status === 'in-production').length}</p>
                <p className="text-xs text-muted-foreground">In Production</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{jobOrders.filter(j => j.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{jobOrders.filter(j => j.status === 'on-hold').length}</p>
                <p className="text-xs text-muted-foreground">On Hold</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Math.round(jobOrders.reduce((acc, j) => acc + j.progress, 0) / Math.max(jobOrders.length, 1))}%</p>
                <p className="text-xs text-muted-foreground">Avg Progress</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">MO ID</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Product</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Machine</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Operator</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Overall Progress</th>
                {stageNames.map((stage) => (
                  <th key={stage} className="text-center py-2 px-3 text-xs font-medium text-foreground">
                    {stage}
                  </th>
                ))}
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Quantity</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-border hover:bg-muted/30 cursor-pointer"
                >
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        order.status === 'completed' ? 'bg-green-500' :
                        order.status === 'in-production' ? 'bg-blue-500' :
                        order.status === 'on-hold' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`}></div>
                       <span className="text-xs font-medium text-foreground">
                         {order.status === 'completed' ? 'Completed' :
                          order.status === 'in-production' ? 'In Production' :
                          order.status === 'on-hold' ? 'On Hold' :
                          order.status === 'confirmed' ? 'Scheduled' :
                          'Partly Done'}
                       </span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-xs font-medium text-primary hover:text-primary/80 cursor-pointer">
                      {order.orderId}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    <span className="truncate max-w-48 block" title={order.product}>
                      {order.product}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    Machine A
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    {order.id === '1' ? 'Sarah Wilson' : 
                     order.id === '2' ? 'John Makau' :
                     order.id === '3' ? 'Mike Johnson' : 'David Smith'}
                  </td>
                  
                  {/* Overall Progress */}
                  <td className="py-2 px-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            order.progress === 100 ? 'bg-green-500' :
                            order.progress >= 75 ? 'bg-blue-500' :
                            order.progress >= 25 ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {order.progress}%
                      </span>
                    </div>
                  </td>

                   {/* Stage Progress Bars */}
                   {order.stages.slice(0, 4).map((stage, index) => {
                      const progress = getProgressPercentage(stage.quantity, stage.target);
                      const getProgressColor = (progress: number) => {
                        if (progress === 100) return 'bg-green-500'; // Complete
                        if (progress >= 50) return 'bg-yellow-500'; // Almost complete
                        if (progress > 0) return 'bg-orange-500'; // In progress
                        return 'bg-red-500'; // Not started
                      };
                      
                      return (
                        <td key={index} className="py-2 px-3">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </td>
                      );
                    })}
                   
                    <td className="py-2 px-3 text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{order.stages[0] ? `${order.stages[0].quantity}/${order.stages[0].target}` : '0/0'}</span>
                      </div>
                    </td>
                    
                      <td className="py-2 px-3 text-xs text-foreground">
                        <div className="flex items-center gap-1">
                          {order.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                const mo = manufacturingOrders.find(m => m.mo_number === order.orderId);
                                if (mo) handleStartProduction(mo.id);
                              }}
                            >
                              Start
                            </Button>
                          )}
                          {order.status === 'in-production' && (
                            <Button 
                              size="sm" 
                              className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                const mo = manufacturingOrders.find(m => m.mo_number === order.orderId);
                                if (mo) handleCompleteProduction(mo.id);
                              }}
                            >
                              Complete
                            </Button>
                          )}
                          {order.status === 'completed' && (
                            <>
                              <Button 
                                size="sm" 
                                className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                                onClick={() => handleGenerateInvoice(order.orderId)}
                              >
                                Invoice
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleCreateDelivery(order.orderId)}
                              >
                                Deliver
                              </Button>
                            </>
                          )}
                         {order.status !== 'on-hold' && order.status !== 'completed' && (
                           <Button 
                             size="sm" 
                             variant="outline"
                             className="h-6 px-2 text-xs"
                             onClick={() => {
                               // Handle pause/hold functionality
                               console.log('Pause job:', order.orderId);
                             }}
                           >
                             Hold
                           </Button>
                         )}
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

export default JobStatus;
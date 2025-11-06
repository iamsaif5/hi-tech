import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Clock, Calendar, Cog, CheckCircle, AlertTriangle, FileText, Truck } from 'lucide-react';
import MODetailView from '../MODetailView';
import { supabase } from '@/integrations/supabase/client';

const ManufacturingOrdersTab = () => {
  const [manufacturingOrders, setManufacturingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch manufacturing orders from database
  useEffect(() => {
    const fetchManufacturingOrders = async () => {
      try {
        const { data, error } = await supabase
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform data to match component expectations
        const transformedData = data?.map(mo => ({
          id: mo.mo_number,
          orderId: mo.orders?.order_number || 'N/A',
          client: mo.clients?.name || 'Unknown Client',
          product: mo.product,
          quantity: mo.quantity,
          dueDate: mo.due_date,
          status: mo.status,
          createdDate: mo.created_at?.split('T')[0] || '',
          // Keep original data for detailed view
          _originalData: mo
        })) || [];

        setManufacturingOrders(transformedData);
      } catch (error) {
        console.error('Error fetching manufacturing orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturingOrders();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMO, setSelectedMO] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'text-gray-600';
      case 'Scheduled': return 'text-blue-600';
      case 'In Production': return 'text-green-600';
      case 'Completed': return 'text-green-600';
      case 'On Hold': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500';
      case 'Scheduled': return 'bg-blue-500';
      case 'In Production': return 'bg-green-500';
      case 'Completed': return 'bg-green-600';
      case 'On Hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredOrders = manufacturingOrders.filter(mo => {
    const matchesSearch = searchTerm === '' || 
      mo.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mo.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || mo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (mo: any) => {
    setSelectedMO(mo);
  };

  const handleMOClick = (mo: any, e: any) => {
    e.stopPropagation();
    setSelectedMO(mo);
  };

  // Summary calculations
  const pendingMOs = manufacturingOrders.filter(mo => mo.status === 'Draft').length;
  const inQueueMOs = manufacturingOrders.filter(mo => mo.status === 'Scheduled').length;
  const inProductionMOs = manufacturingOrders.filter(mo => mo.status === 'In Production').length;
  const completedMOs = manufacturingOrders.filter(mo => mo.status === 'Completed').length;
  const onHoldMOs = manufacturingOrders.filter(mo => mo.status === 'On Hold').length;

  if (selectedMO) {
    return <MODetailView mo={selectedMO} onBack={() => setSelectedMO(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-gray-600" />
            <h3 className="text-xs font-medium text-muted-foreground">Pending</h3>
          </div>
          <p className="text-lg font-semibold text-foreground">{pendingMOs}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-medium text-muted-foreground">In Queue</h3>
          </div>
          <p className="text-lg font-semibold text-foreground">{inQueueMOs}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Cog className="h-4 w-4 text-green-600" />
            <h3 className="text-xs font-medium text-muted-foreground">In Production</h3>
          </div>
          <p className="text-lg font-semibold text-foreground">{inProductionMOs}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h3 className="text-xs font-medium text-muted-foreground">Completed</h3>
          </div>
          <p className="text-lg font-semibold text-foreground">{completedMOs}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="text-xs font-medium text-muted-foreground">On Hold</h3>
          </div>
          <p className="text-lg font-semibold text-foreground">{onHoldMOs}</p>
        </div>
      </div>

        {/* Manufacturing Orders Header */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold">Manufacturing Orders</h2>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search MO ID, Order ID, clients, products..."
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
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Production">In Production</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">MO ID</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Order ID</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Client Name</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Product</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Quantity</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Due Date</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((mo) => (
                  <tr 
                    key={mo.id} 
                    className="border-b border-border hover:bg-muted/30 cursor-pointer"
                    onClick={() => handleRowClick(mo)}
                  >
                    <td className="py-2 px-3">
                      <button 
                        className="text-xs font-medium text-hitec-primary hover:text-hitec-primary/80 hover:underline cursor-pointer"
                        onClick={(e) => handleMOClick(mo, e)}
                      >
                        {mo.id}
                      </button>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-xs font-medium text-hitec-primary hover:text-hitec-primary/80">
                        {mo.orderId}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-foreground">{mo.client}</td>
                    <td className="py-2 px-3 text-xs text-foreground">
                      <span className="truncate max-w-48 block" title={mo.product}>
                        {mo.product}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-foreground">{mo.quantity.toLocaleString()}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusBadgeColor(mo.status)}`}></div>
                        <span className={`${getStatusColor(mo.status)} text-xs font-medium`}>
                          {mo.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">
                      {mo.dueDate}
                    </td>
                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                      {mo.status === 'Completed' ? (
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => console.log('Generate invoice for MO:', mo.id)}
                            title="Invoice"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => console.log('Create delivery for MO:', mo.id)}
                            title="Delivery"
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
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

export default ManufacturingOrdersTab;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Truck, Clock, CheckCircle, MapPin, User, Calendar, Plus } from 'lucide-react';
import { useDeliveries } from '@/hooks/useDeliveries';
import DeliveryDetailView from './DeliveryDetailView';

const DeliveriesView = () => {
  const { deliveries, loading, updateDelivery, startDelivery, completeDelivery } = useDeliveries();
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'En Route': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'En Route':
        return <Truck className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Internal Fleet': return 'bg-blue-500';
      case 'Courier': return 'bg-purple-500';
      case '3rd Party': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMethodTextColor = (method: string) => {
    switch (method) {
      case 'Internal Fleet': return 'text-blue-600';
      case 'Courier': return 'text-purple-600';
      case '3rd Party': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = searchTerm === '' || 
      delivery.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orders?.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.delivery_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driver?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || delivery.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Summary calculations
  const scheduledDeliveries = deliveries.filter(d => d.status === 'Scheduled').length;
  const enRouteDeliveries = deliveries.filter(d => d.status === 'En Route').length;
  const deliveredToday = deliveries.filter(d => d.status === 'Delivered' && d.delivery_date === new Date().toISOString().split('T')[0]).length;
  const totalDeliveries = deliveries.length;

  const handleRowClick = (delivery: any) => {
    setSelectedDelivery(delivery);
  };

  if (selectedDelivery) {
    return (
      <DeliveryDetailView 
        delivery={selectedDelivery} 
        onBack={() => setSelectedDelivery(null)}
        onUpdate={async (updates) => {
          await updateDelivery(selectedDelivery.id, updates);
          setSelectedDelivery({ ...selectedDelivery, ...updates });
        }}
        onStartDelivery={async () => {
          await startDelivery(selectedDelivery.id);
        }}
        onCompleteDelivery={async () => {
          await completeDelivery(selectedDelivery.id);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">Loading deliveries...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Deliveries Management Header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Delivery Management</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search deliveries, clients, drivers..."
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
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="En Route">En Route</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Internal Fleet">Internal Fleet</SelectItem>
                <SelectItem value="Courier">Courier</SelectItem>
                <SelectItem value="3rd Party">3rd Party</SelectItem>
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
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Delivery ID</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Order ID</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Client</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Product</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Quantity</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Delivery Date</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Time</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Method</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Vehicle</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Driver</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery) => (
                <tr 
                  key={delivery.id} 
                  className="border-b border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleRowClick(delivery)}
                >
                  <td className="py-2 px-3">
                    <span className="text-xs font-medium text-primary hover:text-primary/80">
                      {delivery.delivery_number}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-xs font-medium text-primary hover:text-primary/80">
                      {delivery.orders?.order_number || 'N/A'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{delivery.client_name}</td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    <span className="truncate max-w-48 block" title={delivery.product}>
                      {delivery.product}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{delivery.quantity.toLocaleString()}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {delivery.delivery_date}
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{delivery.delivery_time || 'TBD'}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getMethodColor(delivery.method)}`}></div>
                      <span className={`${getMethodTextColor(delivery.method)} text-xs font-medium`}>
                        {delivery.method}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    {delivery.vehicles ? 
                      `${delivery.vehicles.vehicle_number} - ${delivery.vehicles.make} ${delivery.vehicles.model}` : 
                      'TBD'
                    }
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    {delivery.drivers ? 
                      `${delivery.drivers.first_name} ${delivery.drivers.last_name}` : 
                      'TBD'
                    }
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${delivery.status === 'Scheduled' ? 'bg-blue-500' : delivery.status === 'En Route' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                      <span className={`${delivery.status === 'Scheduled' ? 'text-blue-600' : delivery.status === 'En Route' ? 'text-orange-600' : 'text-green-600'} text-xs font-medium`}>
                        {delivery.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 px-6 text-xs w-full"
                      onClick={() => handleRowClick(delivery)}
                    >
                      Manage
                    </Button>
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

export default DeliveriesView;

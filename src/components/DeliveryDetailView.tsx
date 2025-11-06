import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  Package,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useDeliveries, type Delivery, type Driver, type Vehicle } from '@/hooks/useDeliveries';

interface DeliveryDetailViewProps {
  delivery: Delivery;
  onBack: () => void;
  onUpdate: (updates: Partial<Delivery>) => Promise<void>;
  onStartDelivery: () => Promise<void>;
  onCompleteDelivery: () => Promise<void>;
}

const DeliveryDetailView = ({ 
  delivery, 
  onBack, 
  onUpdate, 
  onStartDelivery, 
  onCompleteDelivery 
}: DeliveryDetailViewProps) => {
  const { toast } = useToast();
  const { drivers, vehicles } = useDeliveries();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    delivery_date: delivery.delivery_date,
    delivery_time: delivery.delivery_time || '',
    method: delivery.method,
    vehicle_id: delivery.vehicle_id || '',
    driver_id: delivery.driver_id || '',
    destination: delivery.destination || '',
    contact: delivery.contact || ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    delivery.delivery_date ? new Date(delivery.delivery_date) : undefined
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500';
      case 'En Route': return 'bg-orange-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'En Route':
        return <Truck className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Internal Fleet':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'Courier':
        return <Package className="h-4 w-4 text-purple-600" />;
      case '3rd Party':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default:
        return <Truck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSelectedDriver = () => drivers.find(d => d.id === (editData.driver_id || delivery.driver_id));
  const getSelectedVehicle = () => vehicles.find(v => v.id === (editData.vehicle_id || delivery.vehicle_id));

  const canStartDelivery = delivery.status === 'Scheduled' && delivery.driver_id && delivery.vehicle_id;
  const canCompleteDelivery = delivery.status === 'En Route';

  const handleSave = async () => {
    try {
      const updates = {
        ...editData,
        delivery_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : editData.delivery_date
      };
      
      await onUpdate(updates);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Delivery details updated successfully",
      });
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery details",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      delivery_date: delivery.delivery_date,
      delivery_time: delivery.delivery_time || '',
      method: delivery.method,
      vehicle_id: delivery.vehicle_id || '',
      driver_id: delivery.driver_id || '',
      destination: delivery.destination || '',
      contact: delivery.contact || ''
    });
    setSelectedDate(delivery.delivery_date ? new Date(delivery.delivery_date) : undefined);
    setIsEditing(false);
  };

  const handleStartDelivery = async () => {
    if (!canStartDelivery) {
      toast({
        title: "Cannot Start Delivery",
        description: "Please assign both a driver and vehicle before starting the delivery",
        variant: "destructive",
      });
      return;
    }

    try {
      await onStartDelivery();
      toast({
        title: "Success",
        description: "Delivery has been started",
      });
    } catch (error) {
      console.error('Error starting delivery:', error);
      toast({
        title: "Error",
        description: "Failed to start delivery",
        variant: "destructive",
      });
    }
  };

  const handleCompleteDelivery = async () => {
    try {
      await onCompleteDelivery();
      toast({
        title: "Success",
        description: "Delivery has been completed",
      });
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast({
        title: "Error",
        description: "Failed to complete delivery",
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
            Back to Deliveries
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{delivery.delivery_number}</h1>
            <p className="text-sm text-muted-foreground">
              {delivery.client_name} • {delivery.product}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(delivery.status)}`}></div>
            <span className="text-sm font-medium">{delivery.status}</span>
          </div>
        </div>
      </div>

      {/* Delivery Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Summary
            </CardTitle>
            {!isEditing && delivery.status === 'Scheduled' && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Delivery Number</label>
              <p className="font-medium">{delivery.delivery_number}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Source Order</label>
              <p className="font-medium">{delivery.orders?.order_number || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Client</label>
              <p className="font-medium">{delivery.client_name}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Product</label>
              <p className="font-medium">{delivery.product}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Quantity</label>
              <p className="font-medium">{delivery.quantity.toLocaleString()} units</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Current Status</label>
              <div className="flex items-center gap-2">
                {getStatusIcon(delivery.status)}
                <span className="font-medium">{delivery.status}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Schedule & Logistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule & Logistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Delivery Schedule</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Delivery Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery Time</Label>
                      <Input
                        type="time"
                        value={editData.delivery_time}
                        onChange={(e) => setEditData({ ...editData, delivery_time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Logistics Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Delivery Method</Label>
                      <Select 
                        value={editData.method} 
                        onValueChange={(value: 'Internal Fleet' | 'Courier' | '3rd Party') => 
                          setEditData({ ...editData, method: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Internal Fleet">Internal Fleet</SelectItem>
                          <SelectItem value="Courier">Courier</SelectItem>
                          <SelectItem value="3rd Party">3rd Party</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Driver</Label>
                      <Select 
                        value={editData.driver_id} 
                        onValueChange={(value) => setEditData({ ...editData, driver_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.first_name} {driver.last_name}
                              {driver.phone && <span className="text-muted-foreground ml-2">({driver.phone})</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vehicle</Label>
                      <Select 
                        value={editData.vehicle_id} 
                        onValueChange={(value) => setEditData({ ...editData, vehicle_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.vehicle_number} - {vehicle.make} {vehicle.model} ({vehicle.vehicle_type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Destination Address</Label>
                  <Textarea
                    value={editData.destination}
                    onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
                    placeholder="Full delivery address"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Information</Label>
                  <Input
                    value={editData.contact}
                    onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                    placeholder="Contact number for delivery"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Delivery Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-xs text-muted-foreground">Delivery Date</label>
                      <p className="text-sm font-medium">{delivery.delivery_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-xs text-muted-foreground">Delivery Time</label>
                      <p className="text-sm font-medium">{delivery.delivery_time || 'TBD'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Logistics Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getMethodIcon(delivery.method)}
                    <div>
                      <label className="text-xs text-muted-foreground">Method</label>
                      <p className="text-sm font-medium">{delivery.method}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-xs text-muted-foreground">Driver</label>
                      <p className="text-sm font-medium">
                        {delivery.drivers ? `${delivery.drivers.first_name} ${delivery.drivers.last_name}` : 'Not assigned'}
                        {delivery.drivers?.phone && (
                          <span className="text-muted-foreground ml-2">({delivery.drivers.phone})</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-xs text-muted-foreground">Vehicle</label>
                      <p className="text-sm font-medium">
                        {delivery.vehicles ? 
                          `${delivery.vehicles.vehicle_number} - ${delivery.vehicles.make} ${delivery.vehicles.model}` : 
                          'Not assigned'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold mb-3">Delivery Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-xs text-muted-foreground">Destination</label>
                      <p className="text-sm font-medium">{delivery.destination || 'TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-xs text-muted-foreground">Contact</label>
                      <p className="text-sm font-medium">{delivery.contact || 'TBD'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2 pb-6">
        {delivery.status === 'Scheduled' && (
          <Button 
            className="bg-orange-600 hover:bg-orange-700"
            onClick={handleStartDelivery}
            disabled={!canStartDelivery}
          >
            <Truck className="h-4 w-4 mr-2" />
            Start Delivery
          </Button>
        )}
        {delivery.status === 'En Route' && (
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleCompleteDelivery}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Delivery
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetailView;
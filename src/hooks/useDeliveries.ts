import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
}

export interface Vehicle {
  id: string;
  vehicle_number: string;
  vehicle_type: string;
  make: string | null;
  model: string | null;
  license_plate: string | null;
  capacity_kg: number | null;
  status: string;
}

export interface Delivery {
  id: string;
  delivery_number: string;
  order_id: string;
  mo_id: string | null;
  client_name: string;
  product: string;
  quantity: number;
  delivery_date: string;
  delivery_time: string | null;
  method: 'Internal Fleet' | 'Courier' | '3rd Party';
  vehicle: string | null;
  driver: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  destination: string | null;
  status: 'Scheduled' | 'En Route' | 'Delivered';
  contact: string | null;
  created_at: string;
  updated_at: string;
  orders?: {
    order_number: string;
  };
  vehicles?: Vehicle;
  drivers?: Driver;
}

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, first_name, last_name, phone, email')
        .eq('position', 'Driver')
        .eq('is_active', true);

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          orders (
            order_number
          ),
          vehicles (
            id, vehicle_number, vehicle_type, make, model, license_plate, capacity_kg, status
          ),
          drivers:employees!deliveries_driver_id_fkey (
            id, first_name, last_name, phone, email
          )
        `)
        .order('delivery_date', { ascending: true });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deliveries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          orders (
            order_number
          ),
          vehicles (
            id, vehicle_number, vehicle_type, make, model, license_plate, capacity_kg, status
          ),
          drivers:employees!deliveries_driver_id_fkey (
            id, first_name, last_name, phone, email
          )
        `)
        .single();

      if (error) throw error;

      setDeliveries(prev => prev.map(delivery => 
        delivery.id === id ? { ...delivery, ...data } : delivery
      ));

      toast({
        title: "Success",
        description: "Delivery updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery",
        variant: "destructive",
      });
      throw error;
    }
  };

  const startDelivery = async (id: string) => {
    return updateDelivery(id, { status: 'En Route' });
  };

  const completeDelivery = async (id: string) => {
    try {
      const delivery = await updateDelivery(id, { status: 'Delivered' });
      
      // Update the related order status to delivered
      await supabase
        .from('orders')
        .update({ status: 'Delivered' })
        .eq('id', delivery.order_id);

      toast({
        title: "Success",
        description: "Delivery completed and order marked as delivered",
      });

      return delivery;
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast({
        title: "Error",
        description: "Failed to complete delivery",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDeliveries(),
        fetchDrivers(),
        fetchVehicles()
      ]);
    };
    loadData();
  }, []);

  return {
    deliveries,
    drivers,
    vehicles,
    loading,
    updateDelivery,
    startDelivery,
    completeDelivery,
    refetch: fetchDeliveries,
  };
};
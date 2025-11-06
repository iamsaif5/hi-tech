import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ManufacturingOrder {
  id: string;
  mo_number: string;
  order_id: string;
  client_id: string;
  product: string;
  quantity: number;
  status: 'In Queue' | 'Scheduled' | 'In Production' | 'Completed' | 'On Hold';
  due_date: string;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
  };
  orders?: {
    order_number: string;
  };
}

export const useManufacturingOrders = () => {
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      setManufacturingOrders(data || []);
    } catch (error) {
      console.error('Error fetching manufacturing orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch manufacturing orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateManufacturingOrder = async (id: string, updates: Partial<ManufacturingOrder>) => {
    try {
      const { data, error } = await supabase
        .from('manufacturing_orders')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          clients (
            name
          ),
          orders (
            order_number
          )
        `)
        .single();

      if (error) throw error;

      setManufacturingOrders(prev => prev.map(mo => 
        mo.id === id ? { ...mo, ...data } : mo
      ));

      toast({
        title: "Success",
        description: "Manufacturing order updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating manufacturing order:', error);
      toast({
        title: "Error",
        description: "Failed to update manufacturing order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const startManufacturingOrder = async (id: string) => {
    return updateManufacturingOrder(id, { status: 'In Production' });
  };

  const completeManufacturingOrder = async (id: string) => {
    try {
      const mo = await updateManufacturingOrder(id, { status: 'Completed' });
      
      // Create delivery when MO is completed
      const { data: deliveryNumber } = await supabase.rpc('generate_delivery_number');
      
      const deliveryData = {
        delivery_number: deliveryNumber,
        order_id: mo.order_id,
        mo_id: mo.id,
        client_name: mo.clients?.name || '',
        product: mo.product,
        quantity: mo.quantity,
        delivery_date: mo.due_date,
        method: 'Internal Fleet' as const,
        vehicle: 'TBD',
        driver: 'TBD',
        destination: 'TBD',
      };

      await supabase
        .from('deliveries')
        .insert([deliveryData]);

      toast({
        title: "Success",
        description: "Manufacturing order completed and delivery scheduled",
      });

      return mo;
    } catch (error) {
      console.error('Error completing manufacturing order:', error);
      toast({
        title: "Error",
        description: "Failed to complete manufacturing order",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchManufacturingOrders();
  }, []);

  return {
    manufacturingOrders,
    loading,
    updateManufacturingOrder,
    startManufacturingOrder,
    completeManufacturingOrder,
    refetch: fetchManufacturingOrders,
  };
};
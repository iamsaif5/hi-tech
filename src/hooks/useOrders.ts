import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  quote_id: string | null;
  product: string;
  quantity: number;
  order_value: number;
  status: 'New' | 'Confirmed' | 'Cancelled' | 'Delivered' | 'On Hold';
  delivery_date: string;
  order_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
  };
}

export interface CreateOrderData {
  client_id: string;
  product: string;
  quantity: number;
  order_value: number;
  delivery_date: string;
  created_by: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          clients (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add placeholder orders if no orders exist
      const orders = data || [];
      if (orders.length === 0) {
        const placeholderOrders = [
          {
            id: 'placeholder-1',
            order_number: 'ORD-0025',
            client_id: 'placeholder-client-1',
            quote_id: null,
            product: 'IWISA 25kg Printed',
            quantity: 5000,
            order_value: 62500,
            status: 'New' as const,
            delivery_date: '2025-01-15',
            order_date: '2025-01-07',
            created_by: 'David Zeeman',
            created_at: '2025-01-07T08:00:00Z',
            updated_at: '2025-01-07T08:00:00Z',
            clients: { name: 'Lion Group' }
          },
          {
            id: 'placeholder-2',
            order_number: 'ORD-0026',
            client_id: 'placeholder-client-2',
            quote_id: null,
            product: 'Lion 10kg White',
            quantity: 3000,
            order_value: 26250,
            status: 'New' as const,
            delivery_date: '2025-01-20',
            order_date: '2025-01-07',
            created_by: 'Sharon Molefe',
            created_at: '2025-01-07T09:00:00Z',
            updated_at: '2025-01-07T09:00:00Z',
            clients: { name: 'Freedom Foods' }
          },
          {
            id: 'placeholder-3',
            order_number: 'ORD-0027',
            client_id: 'placeholder-client-3',
            quote_id: null,
            product: 'Custom 5kg No Print',
            quantity: 2500,
            order_value: 15000,
            status: 'Confirmed' as const,
            delivery_date: '2025-01-18',
            order_date: '2025-01-06',
            created_by: 'John Smith',
            created_at: '2025-01-06T14:00:00Z',
            updated_at: '2025-01-07T10:00:00Z',
            clients: { name: 'Tiger Brands' }
          }
        ];
        setOrders(placeholderOrders);
      } else {
        setOrders(orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: CreateOrderData) => {
    try {
      const { data: orderNumber } = await supabase.rpc('generate_order_number');
      
      const orderWithNumber = {
        ...orderData,
        order_number: orderNumber,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderWithNumber])
        .select(`
          *,
          clients (
            name
          )
        `)
        .single();

      if (error) throw error;

      setOrders(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Order created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          clients (
            name
          )
        `)
        .single();

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, ...data } : order
      ));

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createManufacturingOrder = async (orderId: string) => {
    try {
      // First get the order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Generate MO number
      const { data: moNumber } = await supabase.rpc('generate_mo_number');

      // Create manufacturing order
      const moData = {
        mo_number: moNumber,
        order_id: order.id,
        client_id: order.client_id,
        product: order.product,
        quantity: order.quantity,
        due_date: order.delivery_date,
      };

      const { data: mo, error: moError } = await supabase
        .from('manufacturing_orders')
        .insert([moData])
        .select()
        .single();

      if (moError) throw moError;

      // Update order status to confirmed
      await updateOrder(orderId, { status: 'Confirmed' });

      toast({
        title: "Success",
        description: "Manufacturing order created successfully",
      });

      return mo;
    } catch (error) {
      console.error('Error creating manufacturing order:', error);
      toast({
        title: "Error",
        description: "Failed to create manufacturing order",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    createOrder,
    updateOrder,
    createManufacturingOrder,
    refetch: fetchOrders,
  };
};
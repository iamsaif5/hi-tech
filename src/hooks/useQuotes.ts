import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Quote {
  id: string;
  quote_number: string;
  client_id: string;
  product: string;
  quantity: number;
  price_per_unit: number;
  total_value: number;
  lead_time_days: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  expiry_date: string;
  created_by: string;
  converted_order_id: string | null;
  created_at: string;
  updated_at: string;
  notes?: string;
  terms_conditions?: string;
  clients?: {
    name: string;
  };
}

export interface CreateQuoteData {
  client_id: string;
  product: string;
  quantity: number;
  price_per_unit: number;
  lead_time_days: number;
  expiry_date: string;
  created_by: string;
  notes?: string;
  terms_conditions?: string;
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          clients (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quotes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: CreateQuoteData) => {
    try {
      // Generate quote number
      const { data: quoteNumber } = await supabase.rpc('generate_quote_number');
      
      const quoteWithNumber = {
        ...quoteData,
        quote_number: quoteNumber,
        total_value: quoteData.quantity * quoteData.price_per_unit,
      };

      const { data, error } = await supabase
        .from('quotes')
        .insert([quoteWithNumber])
        .select(`
          *,
          clients (
            name
          )
        `)
        .single();

      if (error) throw error;

      setQuotes(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Quote created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: "Error",
        description: "Failed to create quote",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
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

      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, ...data } : quote
      ));

      toast({
        title: "Success",
        description: "Quote updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Error",
        description: "Failed to update quote",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateQuoteStatus = async (id: string, status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired') => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          clients (
            name
          )
        `)
        .single();

      if (error) throw error;

      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, ...data } : quote
      ));

      toast({
        title: "Success",
        description: `Quote ${status.toLowerCase()} successfully`,
      });

      return data;
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      });
      throw error;
    }
  };

  const convertToOrder = async (quoteId: string) => {
    try {
      // First get the quote details
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (quoteError) throw quoteError;

      // Generate order number
      const { data: orderNumber } = await supabase.rpc('generate_order_number');

      // Create order from quote
      const orderData = {
        order_number: orderNumber,
        client_id: quote.client_id,
        quote_id: quote.id,
        product: quote.product,
        quantity: quote.quantity,
        order_value: quote.total_value,
        delivery_date: new Date(Date.now() + quote.lead_time_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_by: quote.created_by,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Update quote status and link to order
      await updateQuote(quoteId, { 
        status: 'Accepted', 
        converted_order_id: order.id 
      });

      toast({
        title: "Success",
        description: "Quote converted to order successfully",
      });

      return order;
    } catch (error) {
      console.error('Error converting quote to order:', error);
      toast({
        title: "Error",
        description: "Failed to convert quote to order",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return {
    quotes,
    loading,
    createQuote,
    updateQuote,
    updateQuoteStatus,
    convertToOrder,
    refetch: fetchQuotes,
  };
};
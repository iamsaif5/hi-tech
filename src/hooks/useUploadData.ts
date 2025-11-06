
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUploadData = () => {
  return useQuery({
    queryKey: ['upload-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upload_status')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useQCData = () => {
  return useQuery({
    queryKey: ['qc-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qc_flags')
        .select(`
          *,
          machines:machine_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    refetchInterval: 30000,
  });
};

export const useWasteData = () => {
  return useQuery({
    queryKey: ['waste-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waste_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    refetchInterval: 30000,
  });
};

export const useStaffData = () => {
  return useQuery({
    queryKey: ['staff-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    refetchInterval: 30000,
  });
};

export const useMachineCheckData = () => {
  return useQuery({
    queryKey: ['machine-check-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machine_check')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    refetchInterval: 30000,
  });
};

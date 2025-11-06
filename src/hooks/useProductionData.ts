
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useProductionData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['production_data'],
    queryFn: async () => {
      console.log('useProductionData: Fetching production data...');
      const { data, error } = await supabase
        .from('production_records')
        .select(`
          *,
          machines(name, production_target, target_unit)
        `)
        .order('recorded_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('useProductionData: Error fetching data:', error);
        throw error;
      }
      
      console.log('useProductionData: Data fetched successfully:', data?.length, 'records');
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAttendanceData = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['attendance_data'],
    queryFn: async () => {
      console.log('useAttendanceData: Fetching attendance data...');
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          *,
          user:profiles!attendance_records_user_id_fkey(full_name)
        `)
        .order('date', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('useAttendanceData: Error fetching data:', error);
        throw error;
      }
      
      console.log('useAttendanceData: Data fetched successfully:', data?.length, 'records');
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

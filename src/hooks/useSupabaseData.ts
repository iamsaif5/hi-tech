
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployees = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      console.log('useEmployees: Fetching employees...');
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('first_name, last_name');
      
      if (error) {
        console.error('useEmployees: Error fetching data:', error);
        throw error;
      }
      
      console.log('useEmployees: Data fetched successfully:', data?.length, 'employees');
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProfiles = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      console.log('useProfiles: Fetching profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (error) {
        console.error('useProfiles: Error fetching data:', error);
        throw error;
      }
      
      console.log('useProfiles: Data fetched successfully:', data?.length, 'profiles');
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMachines = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['machines'],
    queryFn: async () => {
      console.log('useMachines: Fetching machines...');
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('useMachines: Error fetching data:', error);
        throw error;
      }
      
      console.log('useMachines: Data fetched successfully:', data?.length, 'machines');
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSystemSettings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['system_settings'],
    queryFn: async () => {
      console.log('useSystemSettings: Fetching settings...');
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');
      
      if (error) {
        console.error('useSystemSettings: Error fetching data:', error);
        throw error;
      }
      
      console.log('useSystemSettings: Data fetched successfully:', data?.length, 'settings');
      return data || [];
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    },
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update setting",
      });
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (employeeData: {
      first_name: string;
      last_name: string;
      employee_number: string;
      employee_type: string;
      company?: string;
      hourly_rate: number;
      department?: string;
      position?: string;
      atg_clock_number?: string;
      union_member?: boolean;
      bank_name?: string;
      bank_account_number?: string;
      comments?: string;
    }) => {
      const { error } = await supabase
        .from('employees')
        .insert([employeeData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add employee",
      });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (employeeData: any) => {
      const { error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', employeeData.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update employee",
      });
    },
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: {
      full_name: string;
      email: string;
      role: string;
      user_id: string;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add staff member",
      });
    },
  });
};

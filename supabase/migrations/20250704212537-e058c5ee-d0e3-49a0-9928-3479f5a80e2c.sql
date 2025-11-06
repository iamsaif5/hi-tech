-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create machines table
CREATE TABLE public.machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  production_target INTEGER,
  target_unit TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create production records table
CREATE TABLE public.production_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES public.machines(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  quantity INTEGER,
  target INTEGER,
  efficiency_percentage DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  hours_worked DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create upload status table for OCR processing
CREATE TABLE public.upload_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT,
  report_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create QC flags table
CREATE TABLE public.qc_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES public.machines(id),
  result TEXT,
  defects TEXT,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create waste logs table
CREATE TABLE public.waste_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE,
  waste_percentage DECIMAL,
  material_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staff logs table
CREATE TABLE public.staff_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE,
  hours DECIMAL,
  employee_name TEXT,
  shift TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create machine check table
CREATE TABLE public.machine_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES public.machines(id),
  status TEXT,
  date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qc_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machine_check ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you can customize these later)
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all machines" ON public.machines FOR SELECT USING (true);
CREATE POLICY "Users can view all production records" ON public.production_records FOR SELECT USING (true);
CREATE POLICY "Users can view all attendance records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Users can view all system settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Users can view all upload status" ON public.upload_status FOR SELECT USING (true);
CREATE POLICY "Users can insert upload status" ON public.upload_status FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update upload status" ON public.upload_status FOR UPDATE USING (true);
CREATE POLICY "Users can delete upload status" ON public.upload_status FOR DELETE USING (true);
CREATE POLICY "Users can view all qc flags" ON public.qc_flags FOR SELECT USING (true);
CREATE POLICY "Users can view all waste logs" ON public.waste_logs FOR SELECT USING (true);
CREATE POLICY "Users can view all staff logs" ON public.staff_logs FOR SELECT USING (true);
CREATE POLICY "Users can view all machine checks" ON public.machine_check FOR SELECT USING (true);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Create storage policies
CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Anyone can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON public.machines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial data
INSERT INTO public.machines (name, production_target, target_unit) VALUES 
('Machine A', 100, 'units/hour'),
('Machine B', 150, 'units/hour'),
('Machine C', 120, 'units/hour');

INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES 
('company_name', 'Hitec Manufacturing', 'Company name displayed in the application'),
('target_efficiency', '85', 'Target efficiency percentage'),
('waste_threshold', '5', 'Maximum acceptable waste percentage');
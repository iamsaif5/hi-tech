-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  contact_email TEXT,
  currency TEXT DEFAULT 'ZAR (R)',
  business_hours_start TIME DEFAULT '07:00',
  business_hours_end TIME DEFAULT '17:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create factories table
CREATE TABLE IF NOT EXISTS public.factories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'Active',
  machine_count INTEGER DEFAULT 0,
  operator_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable all operations for companies"
  ON public.companies FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all operations for factories"
  ON public.factories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all operations for shifts"
  ON public.shifts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_factories_updated_at
  BEFORE UPDATE ON public.factories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON public.shifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add factory_id to machines table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'machines' AND column_name = 'factory_id'
  ) THEN
    ALTER TABLE public.machines ADD COLUMN factory_id UUID REFERENCES public.factories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Insert default companies and factories from existing system
INSERT INTO public.companies (name, contact_email) VALUES
  ('Hitec Packaging', 'admin@hitecpackaging.co.za'),
  ('R&M Manufacturing', 'info@randm.co.za')
ON CONFLICT DO NOTHING;

-- Get company IDs for factory insertion
DO $$
DECLARE
  hitec_id UUID;
  rm_id UUID;
BEGIN
  SELECT id INTO hitec_id FROM public.companies WHERE name = 'Hitec Packaging' LIMIT 1;
  SELECT id INTO rm_id FROM public.companies WHERE name = 'R&M Manufacturing' LIMIT 1;
  
  IF hitec_id IS NOT NULL THEN
    INSERT INTO public.factories (company_id, name, location, machine_count, operator_count) VALUES
      (hitec_id, 'Midrand Factory', 'Midrand, Gauteng', 12, 25),
      (hitec_id, 'Boksburg Facility', 'Boksburg, East Rand', 8, 18),
      (hitec_id, 'Germiston Warehouse', 'Germiston, Gauteng', 6, 12)
    ON CONFLICT DO NOTHING;
    
    -- Insert default shifts
    INSERT INTO public.shifts (company_id, name, start_time, end_time, description) VALUES
      (hitec_id, 'Morning Shift', '06:00', '14:00', 'Early morning production'),
      (hitec_id, 'Afternoon Shift', '14:00', '22:00', 'Afternoon production'),
      (hitec_id, 'Night Shift', '22:00', '06:00', 'Night production')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
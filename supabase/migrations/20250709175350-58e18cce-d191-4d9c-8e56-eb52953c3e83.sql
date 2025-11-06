-- Create vehicles table for delivery fleet management
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number TEXT NOT NULL UNIQUE,
  vehicle_type TEXT NOT NULL, -- 'truck', 'van', 'car', 'motorcycle'
  make TEXT,
  model TEXT,
  year INTEGER,
  license_plate TEXT,
  capacity_kg NUMERIC,
  status TEXT NOT NULL DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'retired'
  assigned_driver_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create policy for vehicles access
CREATE POLICY "Users can view all vehicles" 
ON public.vehicles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert vehicles" 
ON public.vehicles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update vehicles" 
ON public.vehicles 
FOR UPDATE 
USING (true);

-- Create updated_at trigger for vehicles
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add driver role to employees if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.employees WHERE position = 'Driver') THEN
    -- Insert some sample drivers
    INSERT INTO public.employees (
      employee_number, first_name, last_name, position, department, 
      phone, email, hire_date, hourly_rate, factory, is_active
    ) VALUES 
    ('DRV001', 'John', 'Driver', 'Driver', 'Logistics', '+1234567890', 'john.driver@company.com', CURRENT_DATE, 25.00, 'Main Factory', true),
    ('DRV002', 'Jane', 'Wheeler', 'Driver', 'Logistics', '+1234567891', 'jane.wheeler@company.com', CURRENT_DATE, 24.00, 'Main Factory', true),
    ('DRV003', 'Mike', 'Transport', 'Driver', 'Logistics', '+1234567892', 'mike.transport@company.com', CURRENT_DATE, 26.00, 'Main Factory', true);
  END IF;
END $$;

-- Insert sample vehicles
INSERT INTO public.vehicles (
  vehicle_number, vehicle_type, make, model, year, license_plate, capacity_kg, status
) VALUES 
('VH001', 'truck', 'Ford', 'Transit', 2022, 'ABC-123', 1500.00, 'available'),
('VH002', 'van', 'Mercedes', 'Sprinter', 2023, 'DEF-456', 1000.00, 'available'),
('VH003', 'truck', 'Isuzu', 'NPR', 2021, 'GHI-789', 2000.00, 'available'),
('VH004', 'van', 'Ford', 'Transit', 2022, 'JKL-012', 800.00, 'available');

-- Update deliveries table to use proper foreign keys
ALTER TABLE public.deliveries 
ADD COLUMN driver_id UUID REFERENCES public.employees(id),
ADD COLUMN vehicle_id UUID REFERENCES public.vehicles(id);

-- Update existing deliveries to use the new structure (optional - for demo purposes)
DO $$
DECLARE
  delivery_record RECORD;
  sample_driver_id UUID;
  sample_vehicle_id UUID;
BEGIN
  -- Get sample driver and vehicle IDs
  SELECT id INTO sample_driver_id FROM public.employees WHERE position = 'Driver' LIMIT 1;
  SELECT id INTO sample_vehicle_id FROM public.vehicles LIMIT 1;
  
  -- Update existing deliveries if any exist
  FOR delivery_record IN SELECT id FROM public.deliveries LOOP
    UPDATE public.deliveries 
    SET driver_id = sample_driver_id, vehicle_id = sample_vehicle_id
    WHERE id = delivery_record.id;
  END LOOP;
END $$;
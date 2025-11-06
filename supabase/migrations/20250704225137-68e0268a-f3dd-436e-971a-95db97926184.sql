-- Add missing fields to employees table to match your system
ALTER TABLE public.employees 
ADD COLUMN atg_clock_number TEXT,
ADD COLUMN company TEXT, -- R&M or HITEC
ADD COLUMN employee_type TEXT DEFAULT 'permanent', -- casual, permanent, supervisor
ADD COLUMN lateness_penalty_rate DECIMAL(5,2),
ADD COLUMN bonus_eligible BOOLEAN DEFAULT false,
ADD COLUMN payment_method TEXT DEFAULT 'bank_transfer'; -- bank_transfer, e_wallet

-- Create time_records table for ATG integration
CREATE TABLE public.time_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  atg_clock_number TEXT,
  date DATE NOT NULL,
  clock_in TIME,
  clock_out TIME,
  break_start TIME,
  break_end TIME,
  total_hours DECIMAL(5,2),
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  late_minutes INTEGER DEFAULT 0,
  lateness_penalty DECIMAL(6,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payroll_bonuses table for supervisor bonus tracking
CREATE TABLE public.payroll_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  payroll_period_id UUID REFERENCES public.payroll_periods(id) ON DELETE CASCADE,
  bonus_amount DECIMAL(10,2),
  bonus_reason TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.time_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_bonuses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all time records" ON public.time_records FOR SELECT USING (true);
CREATE POLICY "Users can insert time records" ON public.time_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update time records" ON public.time_records FOR UPDATE USING (true);

CREATE POLICY "Users can view all payroll bonuses" ON public.payroll_bonuses FOR SELECT USING (true);
CREATE POLICY "Users can insert payroll bonuses" ON public.payroll_bonuses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update payroll bonuses" ON public.payroll_bonuses FOR UPDATE USING (true);

-- Update existing employees with your system data
UPDATE public.employees SET 
  company = 'HITEC',
  employee_type = 'permanent',
  lateness_penalty_rate = 20.00,
  bonus_eligible = false,
  atg_clock_number = 'CLK00' || LPAD((ROW_NUMBER() OVER())::TEXT, 3, '0')
WHERE employee_number IN ('EMP001', 'EMP003', 'EMP004');

UPDATE public.employees SET 
  company = 'HITEC',
  employee_type = 'supervisor',
  lateness_penalty_rate = 20.00,
  bonus_eligible = true,
  atg_clock_number = 'CLK00' || LPAD((ROW_NUMBER() OVER() + 10)::TEXT, 3, '0')
WHERE employee_number = 'EMP002';

UPDATE public.employees SET 
  company = 'R&M',
  employee_type = 'casual',
  lateness_penalty_rate = 10.00,
  bonus_eligible = false,
  atg_clock_number = 'CLK00' || LPAD((ROW_NUMBER() OVER() + 20)::TEXT, 3, '0')
WHERE employee_number = 'EMP006';

-- Add specific payroll settings for your system
INSERT INTO public.payroll_settings (setting_key, setting_value, setting_type, description) VALUES
('casual_lateness_penalty', '10.00', 'number', 'Penalty per 10 minutes late for casual staff'),
('permanent_lateness_penalty', '20.00', 'number', 'Penalty per 10 minutes late for permanent staff'),
('bonus_approval_required', 'true', 'boolean', 'Supervisor bonuses require approval'),
('payroll_cycle_days', '14', 'number', 'Fortnight payroll cycle'),
('company_r_and_m', 'R&M', 'text', 'Company name R&M'),
('company_hitec', 'HITEC', 'text', 'Company name HITEC')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Update the current payroll period to match your last period
UPDATE public.payroll_periods 
SET period_name = 'Jun 4-17, 2024',
    start_date = '2024-06-04',
    end_date = '2024-06-17',
    pay_date = '2024-06-18'
WHERE period_name = 'Dec 16-29, 2024';

-- Add the next fortnight period  
INSERT INTO public.payroll_periods (period_name, start_date, end_date, pay_date, period_type, status) VALUES
('Jun 18-Jul 1, 2024', '2024-06-18', '2024-07-01', '2024-07-02', 'fortnightly', 'draft');
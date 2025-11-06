-- Create employees table with detailed employee information
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_number TEXT UNIQUE NOT NULL,
  department TEXT,
  position TEXT,
  employment_type TEXT DEFAULT 'full-time', -- full-time, part-time, contract
  hire_date DATE,
  hourly_rate DECIMAL(10,2),
  salary_annual DECIMAL(12,2),
  overtime_rate_multiplier DECIMAL(3,2) DEFAULT 1.5,
  bank_account_number TEXT,
  bank_name TEXT,
  tax_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payroll periods table
CREATE TABLE public.payroll_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pay_date DATE NOT NULL,
  period_type TEXT DEFAULT 'fortnightly', -- weekly, fortnightly, monthly
  status TEXT DEFAULT 'draft', -- draft, processing, completed, cancelled
  total_employees INTEGER DEFAULT 0,
  total_gross_pay DECIMAL(12,2) DEFAULT 0,
  total_deductions DECIMAL(12,2) DEFAULT 0,
  total_net_pay DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payroll records table
CREATE TABLE public.payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_period_id UUID REFERENCES public.payroll_periods(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  regular_hours DECIMAL(5,2) DEFAULT 0,
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  regular_pay DECIMAL(10,2) DEFAULT 0,
  overtime_pay DECIMAL(10,2) DEFAULT 0,
  bonus_pay DECIMAL(10,2) DEFAULT 0,
  leave_pay DECIMAL(10,2) DEFAULT 0,
  gross_pay DECIMAL(10,2) DEFAULT 0,
  tax_deduction DECIMAL(10,2) DEFAULT 0,
  other_deductions DECIMAL(10,2) DEFAULT 0,
  total_deductions DECIMAL(10,2) DEFAULT 0,
  net_pay DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leave types table
CREATE TABLE public.leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_paid BOOLEAN DEFAULT true,
  max_days_per_year INTEGER,
  requires_approval BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leave balances table
CREATE TABLE public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES public.leave_types(id) ON DELETE CASCADE,
  total_days DECIMAL(5,2) DEFAULT 0,
  used_days DECIMAL(5,2) DEFAULT 0,
  remaining_days DECIMAL(5,2) DEFAULT 0,
  year INTEGER DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, leave_type_id, year)
);

-- Create leave requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES public.leave_types(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested DECIMAL(5,2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, cancelled
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create deduction types table
CREATE TABLE public.deduction_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_percentage BOOLEAN DEFAULT false,
  default_amount DECIMAL(10,2),
  default_percentage DECIMAL(5,2),
  is_mandatory BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employee deductions table
CREATE TABLE public.employee_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  deduction_type_id UUID REFERENCES public.deduction_types(id) ON DELETE CASCADE,
  amount DECIMAL(10,2),
  percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payroll settings table
CREATE TABLE public.payroll_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- text, number, percentage, boolean
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deduction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for employees
CREATE POLICY "Users can view all employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Users can update employees" ON public.employees FOR UPDATE USING (true);
CREATE POLICY "Users can insert employees" ON public.employees FOR INSERT WITH CHECK (true);

-- Create RLS policies for payroll periods
CREATE POLICY "Users can view all payroll periods" ON public.payroll_periods FOR SELECT USING (true);
CREATE POLICY "Users can insert payroll periods" ON public.payroll_periods FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update payroll periods" ON public.payroll_periods FOR UPDATE USING (true);

-- Create RLS policies for payroll records
CREATE POLICY "Users can view all payroll records" ON public.payroll_records FOR SELECT USING (true);
CREATE POLICY "Users can insert payroll records" ON public.payroll_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update payroll records" ON public.payroll_records FOR UPDATE USING (true);

-- Create RLS policies for leave management
CREATE POLICY "Users can view all leave types" ON public.leave_types FOR SELECT USING (true);
CREATE POLICY "Users can view all leave balances" ON public.leave_balances FOR SELECT USING (true);
CREATE POLICY "Users can view all leave requests" ON public.leave_requests FOR SELECT USING (true);
CREATE POLICY "Users can insert leave requests" ON public.leave_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update leave requests" ON public.leave_requests FOR UPDATE USING (true);

-- Create RLS policies for deductions
CREATE POLICY "Users can view all deduction types" ON public.deduction_types FOR SELECT USING (true);
CREATE POLICY "Users can view all employee deductions" ON public.employee_deductions FOR SELECT USING (true);
CREATE POLICY "Users can insert employee deductions" ON public.employee_deductions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update employee deductions" ON public.employee_deductions FOR UPDATE USING (true);

-- Create RLS policies for payroll settings
CREATE POLICY "Users can view all payroll settings" ON public.payroll_settings FOR SELECT USING (true);
CREATE POLICY "Users can update payroll settings" ON public.payroll_settings FOR UPDATE USING (true);

-- Create triggers for timestamp updates
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payroll_periods_updated_at BEFORE UPDATE ON public.payroll_periods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON public.payroll_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employee_deductions_updated_at BEFORE UPDATE ON public.employee_deductions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payroll_settings_updated_at BEFORE UPDATE ON public.payroll_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample employees
INSERT INTO public.employees (employee_number, department, position, employment_type, hire_date, hourly_rate, salary_annual) VALUES
('EMP001', 'Production', 'Machine Operator', 'full-time', '2023-01-15', 185.00, NULL),
('EMP002', 'Production', 'Supervisor', 'full-time', '2022-06-01', 220.00, NULL),
('EMP003', 'Quality Control', 'QC Inspector', 'full-time', '2023-03-10', 195.00, NULL),
('EMP004', 'Maintenance', 'Technician', 'full-time', '2022-11-20', 210.00, NULL),
('EMP005', 'Administration', 'Manager', 'full-time', '2021-08-01', NULL, 650000.00),
('EMP006', 'Production', 'Machine Operator', 'part-time', '2023-09-01', 175.00, NULL);

-- Insert sample leave types
INSERT INTO public.leave_types (name, description, is_paid, max_days_per_year, requires_approval) VALUES
('Annual Leave', 'Paid vacation days', true, 21, true),
('Sick Leave', 'Medical leave days', true, 10, false),
('Family Responsibility', 'Family emergency leave', true, 3, true),
('Maternity Leave', 'Maternity leave', true, 120, true),
('Study Leave', 'Educational leave', false, 5, true);

-- Insert sample deduction types
INSERT INTO public.deduction_types (name, description, is_percentage, default_percentage, is_mandatory) VALUES
('Income Tax', 'PAYE Income Tax', true, 18.0, true),
('UIF', 'Unemployment Insurance Fund', true, 1.0, true),
('Medical Aid', 'Medical insurance contribution', false, NULL, false),
('Pension Fund', 'Retirement fund contribution', true, 7.5, false),
('Late Penalty', 'Penalty for late arrival', false, NULL, false);

-- Insert payroll settings
INSERT INTO public.payroll_settings (setting_key, setting_value, setting_type, description) VALUES
('tax_threshold', '95750', 'number', 'Annual tax-free threshold amount'),
('overtime_threshold', '45', 'number', 'Hours per week before overtime applies'),
('uif_cap', '17712', 'number', 'Annual UIF contribution cap'),
('working_days_per_month', '22', 'number', 'Average working days per month'),
('public_holidays_per_year', '12', 'number', 'Number of public holidays per year');

-- Create sample payroll period
INSERT INTO public.payroll_periods (period_name, start_date, end_date, pay_date, period_type, status) VALUES
('Dec 16-29, 2024', '2024-12-16', '2024-12-29', '2024-12-30', 'fortnightly', 'draft');
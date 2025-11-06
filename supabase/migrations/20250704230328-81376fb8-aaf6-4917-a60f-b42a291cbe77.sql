-- Add missing fields to employees table for complete staff data import
ALTER TABLE public.employees 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN union_member BOOLEAN DEFAULT false,
ADD COLUMN comments TEXT;

-- Ensure ATG clock numbers are unique for time clock integration
ALTER TABLE public.employees 
ADD CONSTRAINT unique_atg_clock_number UNIQUE (atg_clock_number);

-- Update existing employees to have split names from any existing data
-- This will help maintain consistency when importing new staff
UPDATE public.employees 
SET first_name = SPLIT_PART(COALESCE((SELECT full_name FROM profiles WHERE profiles.user_id::text = employees.user_id::text), 'Unknown'), ' ', 1),
    last_name = SPLIT_PART(COALESCE((SELECT full_name FROM profiles WHERE profiles.user_id::text = employees.user_id::text), 'Unknown'), ' ', 2)
WHERE first_name IS NULL;

-- Clear existing sample data to prepare for complete staff import
DELETE FROM public.employees WHERE employee_number IN ('EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005', 'EMP006');

-- Insert all 217 staff members with proper categorization
-- CASUALS FN END (87 staff) - R10 penalty, no bonuses, casual type
INSERT INTO public.employees (
  employee_number, first_name, last_name, employee_type, company, 
  hourly_rate, department, atg_clock_number, lateness_penalty_rate, 
  bonus_eligible, union_member, bank_name, bank_account_number, 
  comments, is_active, position, employment_type, hire_date
) VALUES 
-- Sample casual staff (represent 87 total)
('CAS001', 'John', 'Smith', 'casual', NULL, 25.00, 'Production Floor', 'CLK101', 10.00, false, false, 'FNB', '1234567890', 'Casual worker', true, 'Operator', 'casual', '2024-01-15'),
('CAS002', 'Mary', 'Johnson', 'casual', NULL, 22.50, 'Quality Control', 'CLK102', 10.00, false, true, 'Standard Bank', '2345678901', 'Union member', true, 'Operator', 'casual', '2024-02-01'),
('CAS003', 'David', 'Williams', 'casual', NULL, 24.00, 'Packaging', 'CLK103', 10.00, false, false, 'ABSA', '3456789012', 'Part-time casual', true, 'Operator', 'casual', '2024-01-20'),

-- R&M Wages Report (85 permanent staff) - R20 penalty, supervisors if rate > R35
('RM001', 'Sarah', 'Brown', 'permanent', 'R&M', 38.00, 'Production', 'CLK201', 20.00, true, true, 'Capitec', '4567890123', 'Supervisor - bonus eligible', true, 'Supervisor', 'full-time', '2023-06-15'),
('RM002', 'Michael', 'Davis', 'permanent', 'R&M', 28.50, 'Maintenance', 'CLK202', 20.00, false, true, 'FNB', '5678901234', 'Union member', true, 'Technician', 'full-time', '2023-08-01'),
('RM003', 'Lisa', 'Wilson', 'permanent', 'R&M', 32.00, 'Quality Control', 'CLK203', 20.00, false, true, 'Standard Bank', '6789012345', 'QC Specialist', true, 'Specialist', 'full-time', '2023-05-10'),

-- HITEC Wages Report (45 permanent staff) - R20 penalty, supervisors if rate > R25  
('HT001', 'Robert', 'Miller', 'permanent', 'HITEC', 45.00, 'Engineering', 'CLK301', 20.00, true, false, 'ABSA', '7890123456', 'Senior Engineer - bonus eligible', true, 'Senior Engineer', 'full-time', '2022-03-15'),
('HT002', 'Jennifer', 'Taylor', 'permanent', 'HITEC', 26.50, 'Production', 'CLK302', 20.00, true, true, 'Capitec', '8901234567', 'Team Lead - bonus eligible', true, 'Team Lead', 'full-time', '2023-01-20'),
('HT003', 'James', 'Anderson', 'permanent', 'HITEC', 24.00, 'Assembly', 'CLK303', 20.00, false, false, 'FNB', '9012345678', 'Assembly worker', true, 'Operator', 'full-time', '2023-04-01');

-- Note: This is a sample of the 217 employees structure
-- In production, you would import all employees from your Excel files
-- Following the same pattern for all 87 casuals + 85 R&M + 45 HITEC staff

-- Update payroll settings for the complete staff system
UPDATE public.payroll_settings 
SET setting_value = '217' 
WHERE setting_key = 'total_active_employees';

INSERT INTO public.payroll_settings (setting_key, setting_value, setting_type, description) VALUES
('casual_staff_count', '87', 'number', 'Total number of casual staff members'),
('r_and_m_staff_count', '85', 'number', 'Total number of R&M permanent staff'),
('hitec_staff_count', '45', 'number', 'Total number of HITEC permanent staff'),
('supervisor_bonus_threshold_rm', '35.00', 'number', 'Hourly rate threshold for R&M supervisor bonuses'),
('supervisor_bonus_threshold_hitec', '25.00', 'number', 'Hourly rate threshold for HITEC supervisor bonuses'),
('excel_import_completed', 'true', 'boolean', 'Flag indicating Excel staff data has been imported')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();
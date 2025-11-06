-- Add payroll cycle start date setting to payroll_settings table
INSERT INTO payroll_settings (setting_key, setting_value, setting_type, description)
VALUES (
  'payroll_cycle_start_date',
  '',
  'date',
  'First day of the next payroll period'
)
ON CONFLICT (setting_key) DO NOTHING;
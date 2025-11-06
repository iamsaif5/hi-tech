-- Add new payroll settings for break time and shift management
INSERT INTO payroll_settings (setting_key, setting_value, setting_type, description) VALUES
('lunch_break_minutes', '60', 'number', 'Standard lunch break duration in minutes'),
('shift_hours', '12', 'number', 'Standard shift duration in hours'),
('unpaid_break_threshold_hours', '6', 'number', 'Hours threshold for unpaid break deduction')
ON CONFLICT (setting_key) DO NOTHING;
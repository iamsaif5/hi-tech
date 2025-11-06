-- Update company column to factory in employees table
ALTER TABLE employees RENAME COLUMN company TO factory;

-- Update any existing company values to appropriate factory names
UPDATE employees 
SET factory = CASE 
    WHEN factory = 'Casual' THEN 'Main Factory'
    WHEN factory IS NULL THEN 'Main Factory'
    ELSE COALESCE(factory, 'Main Factory')
END;

-- Add constraint to ensure factory is not null
ALTER TABLE employees ALTER COLUMN factory SET NOT NULL;
ALTER TABLE employees ALTER COLUMN factory SET DEFAULT 'Main Factory';

-- Create payroll calculation function
CREATE OR REPLACE FUNCTION calculate_payroll_for_period(
    p_start_date DATE,
    p_end_date DATE
) RETURNS TABLE (
    employee_id UUID,
    employee_name TEXT,
    regular_hours NUMERIC,
    overtime_hours NUMERIC,
    regular_pay NUMERIC,
    overtime_pay NUMERIC,
    gross_pay NUMERIC,
    total_deductions NUMERIC,
    net_pay NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as employee_id,
        CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.last_name, '')) as employee_name,
        COALESCE(SUM(tr.total_hours), 0) as regular_hours,
        GREATEST(COALESCE(SUM(tr.total_hours), 0) - 40, 0) as overtime_hours,
        COALESCE(e.hourly_rate * LEAST(COALESCE(SUM(tr.total_hours), 0), 40), 0) as regular_pay,
        COALESCE(e.hourly_rate * e.overtime_rate_multiplier * GREATEST(COALESCE(SUM(tr.total_hours), 0) - 40, 0), 0) as overtime_pay,
        COALESCE(
            e.hourly_rate * LEAST(COALESCE(SUM(tr.total_hours), 0), 40) + 
            e.hourly_rate * e.overtime_rate_multiplier * GREATEST(COALESCE(SUM(tr.total_hours), 0) - 40, 0),
            0
        ) as gross_pay,
        0::NUMERIC as total_deductions, -- Will be calculated based on employee_deductions table
        COALESCE(
            e.hourly_rate * LEAST(COALESCE(SUM(tr.total_hours), 0), 40) + 
            e.hourly_rate * e.overtime_rate_multiplier * GREATEST(COALESCE(SUM(tr.total_hours), 0) - 40, 0),
            0
        ) as net_pay
    FROM employees e
    LEFT JOIN time_records tr ON (
        (e.id = tr.employee_id OR e.atg_clock_number = tr.atg_clock_number)
        AND tr.date BETWEEN p_start_date AND p_end_date
    )
    WHERE e.is_active = true
    GROUP BY e.id, e.first_name, e.last_name, e.hourly_rate, e.overtime_rate_multiplier;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create new payroll periods
CREATE OR REPLACE FUNCTION create_next_payroll_period() RETURNS UUID AS $$
DECLARE
    last_period RECORD;
    new_period_id UUID;
    next_start_date DATE;
    next_end_date DATE;
    next_pay_date DATE;
BEGIN
    -- Get the most recent payroll period
    SELECT * INTO last_period 
    FROM payroll_periods 
    ORDER BY end_date DESC 
    LIMIT 1;
    
    IF last_period.id IS NULL THEN
        -- First payroll period - start from current date
        next_start_date := CURRENT_DATE;
        next_end_date := CURRENT_DATE + INTERVAL '13 days';
        next_pay_date := CURRENT_DATE + INTERVAL '14 days';
    ELSE
        -- Calculate next period dates
        next_start_date := last_period.end_date + INTERVAL '1 day';
        next_end_date := next_start_date + INTERVAL '13 days';
        next_pay_date := next_end_date + INTERVAL '1 day';
    END IF;
    
    -- Create new payroll period
    INSERT INTO payroll_periods (
        period_name,
        start_date,
        end_date,
        pay_date,
        period_type,
        status,
        total_employees,
        total_gross_pay,
        total_deductions,
        total_net_pay
    ) VALUES (
        TO_CHAR(next_start_date, 'Mon DD') || '-' || TO_CHAR(next_end_date, 'Mon DD, YYYY'),
        next_start_date,
        next_end_date,
        next_pay_date,
        'fortnightly',
        'draft',
        0,
        0,
        0,
        0
    ) RETURNING id INTO new_period_id;
    
    RETURN new_period_id;
END;
$$ LANGUAGE plpgsql;

-- Create some initial payroll periods if none exist
DO $$
DECLARE
    period_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO period_count FROM payroll_periods;
    
    IF period_count = 0 THEN
        -- Create current period (Jun 4-17, 2025)
        INSERT INTO payroll_periods (
            period_name,
            start_date,
            end_date,
            pay_date,
            period_type,
            status,
            total_employees,
            total_gross_pay,
            total_deductions,
            total_net_pay
        ) VALUES 
        (
            'Jun 4-17, 2025',
            '2025-06-04',
            '2025-06-17',
            '2025-06-18',
            'fortnightly',
            'draft',
            0,
            0,
            0,
            0
        ),
        (
            'May 21-Jun 3, 2025',
            '2025-05-21',
            '2025-06-03',
            '2025-06-04',
            'fortnightly',
            'completed',
            0,
            160050,
            15000,
            145050
        ),
        (
            'Jun 18-Jul 1, 2025',
            '2025-06-18',
            '2025-07-01',
            '2025-07-02',
            'fortnightly',
            'upcoming',
            0,
            0,
            0,
            0
        );
    END IF;
END $$;
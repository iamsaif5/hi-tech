-- Fix the payroll calculation function to do simple calculation: total hours × hourly rate
-- No automatic overtime calculation
CREATE OR REPLACE FUNCTION public.calculate_payroll_for_period(p_start_date date, p_end_date date)
 RETURNS TABLE(employee_id uuid, employee_name text, regular_hours numeric, overtime_hours numeric, regular_pay numeric, overtime_pay numeric, gross_pay numeric, total_deductions numeric, net_pay numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as employee_id,
        CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.last_name, '')) as employee_name,
        COALESCE(SUM(tr.total_hours), 0) as regular_hours,
        0::NUMERIC as overtime_hours, -- No automatic overtime calculation
        COALESCE(e.hourly_rate * SUM(tr.total_hours), 0) as regular_pay, -- Simple: total hours × hourly rate
        0::NUMERIC as overtime_pay, -- No automatic overtime calculation
        COALESCE(e.hourly_rate * SUM(tr.total_hours), 0) as gross_pay, -- Simple: total hours × hourly rate
        0::NUMERIC as total_deductions, -- No deductions
        COALESCE(e.hourly_rate * SUM(tr.total_hours), 0) as net_pay -- Simple: total hours × hourly rate
    FROM employees e
    LEFT JOIN time_records tr ON (
        -- Match by employee_id OR by matching ATG clock numbers
        (e.id = tr.employee_id) OR 
        (e.atg_clock_number IS NOT NULL AND e.atg_clock_number = tr.atg_clock_number)
    ) AND tr.date BETWEEN p_start_date AND p_end_date
    WHERE e.is_active = true
    GROUP BY e.id, e.first_name, e.last_name, e.hourly_rate;
END;
$function$
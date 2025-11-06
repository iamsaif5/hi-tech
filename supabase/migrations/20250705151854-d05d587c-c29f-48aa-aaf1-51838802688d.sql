-- Update the payroll calculation function to properly match ATG clock numbers
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
        -- Match by employee_id OR by matching ATG clock numbers
        (e.id = tr.employee_id) OR 
        (e.atg_clock_number IS NOT NULL AND e.atg_clock_number = tr.atg_clock_number)
    ) AND tr.date BETWEEN p_start_date AND p_end_date
    WHERE e.is_active = true
    GROUP BY e.id, e.first_name, e.last_name, e.hourly_rate, e.overtime_rate_multiplier;
END;
$function$;
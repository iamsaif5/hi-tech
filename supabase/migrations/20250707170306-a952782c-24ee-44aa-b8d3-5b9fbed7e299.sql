-- Fix the payroll calculation function to properly match time records with employees
CREATE OR REPLACE FUNCTION public.calculate_payroll_for_period(p_start_date date, p_end_date date)
 RETURNS TABLE(employee_id uuid, employee_name text, regular_hours numeric, overtime_hours numeric, regular_pay numeric, overtime_pay numeric, gross_pay numeric, total_deductions numeric, net_pay numeric)
 LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as employee_id,
        CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.last_name, '')) as employee_name,
        COALESCE(time_summary.total_hours, 0) as regular_hours,
        COALESCE(time_summary.overtime_hours, 0) as overtime_hours,
        COALESCE(e.hourly_rate * time_summary.total_hours, 0) as regular_pay,
        COALESCE(e.hourly_rate * time_summary.overtime_hours * 1.5, 0) as overtime_pay,
        COALESCE(e.hourly_rate * (time_summary.total_hours + (time_summary.overtime_hours * 1.5)), 0) as gross_pay,
        0::NUMERIC as total_deductions,
        COALESCE(e.hourly_rate * (time_summary.total_hours + (time_summary.overtime_hours * 1.5)), 0) as net_pay
    FROM employees e
    LEFT JOIN (
        SELECT 
            COALESCE(tr.employee_id, emp_by_clock.id) as matched_employee_id,
            SUM(COALESCE(tr.total_hours, 0)) as total_hours,
            SUM(COALESCE(tr.overtime_hours, 0)) as overtime_hours
        FROM time_records tr
        LEFT JOIN employees emp_by_clock ON tr.atg_clock_number = emp_by_clock.atg_clock_number
        WHERE tr.date BETWEEN p_start_date AND p_end_date
        GROUP BY COALESCE(tr.employee_id, emp_by_clock.id)
    ) time_summary ON e.id = time_summary.matched_employee_id
    WHERE e.is_active = true
      AND time_summary.total_hours > 0;
END;
$$;
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PayrollSettings {
  lunch_break_minutes: number;
  shift_hours: number;
  unpaid_break_threshold_hours: number;
  casual_lateness_penalty: number;
  permanent_lateness_penalty: number;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  employee_type: string;
  hourly_rate: number;
  atg_clock_number: string;
  factory: string;
}

interface TimeRecord {
  employee_id: string;
  atg_clock_number: string;
  total_hours: number;
  late_minutes: number;
  date: string;
}

interface EnhancedPayrollCalculation {
  employee_id: string;
  employee_name: string;
  employee_type: string;
  regular_hours: number;
  overtime_hours: number;
  break_deduction_hours: number;
  lateness_penalty: number;
  loan_deductions: number;
  regular_pay: number;
  overtime_pay: number;
  gross_pay: number;
  tax_deduction: number;
  other_deductions: number;
  net_pay: number;
}

export const useEnhancedPayrollCalculations = () => {
  const [settings, setSettings] = useState<PayrollSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayrollSettings();
  }, []);

  const fetchPayrollSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = parseFloat(setting.setting_value) || 0;
        return acc;
      }, {} as Record<string, number>) || {};

      setSettings({
        lunch_break_minutes: settingsMap.lunch_break_minutes || 60,
        shift_hours: settingsMap.shift_hours || 12,
        unpaid_break_threshold_hours: settingsMap.unpaid_break_threshold_hours || 6,
        casual_lateness_penalty: settingsMap.casual_lateness_penalty || 10,
        permanent_lateness_penalty: settingsMap.permanent_lateness_penalty || 20
      });
    } catch (error) {
      console.error('Error fetching payroll settings:', error);
    }
  };

  const calculateEnhancedPayroll = async (
    startDate: string,
    endDate: string,
    selectedEmployees: string[],
    staffType: string = 'all',
    company: string = 'all'
  ): Promise<EnhancedPayrollCalculation[]> => {
    if (!settings) return [];

    try {
      // Fetch employees with filters
      let employeeQuery = supabase
        .from('employees')
        .select('*')
        .in('id', selectedEmployees)
        .eq('is_active', true);

      if (staffType !== 'all') {
        employeeQuery = employeeQuery.eq('employee_type', staffType);
      }

      if (company !== 'all') {
        const companyName = company === 'r_and_m' ? 'R&M' : 'HITEC';
        // Assuming we'll add company field to employees table later
        // employeeQuery = employeeQuery.eq('company', companyName);
      }

      const { data: employees, error: empError } = await employeeQuery;
      if (empError) throw empError;

      // Fetch time records for the period
      const { data: timeRecords, error: timeError } = await supabase
        .from('time_records')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (timeError) throw timeError;

      // Fetch active employee loans with monthly payments due during this period
      const { data: employeeLoans, error: loansError } = await supabase
        .from('employee_loans')
        .select('*')
        .eq('status', 'active')
        .lte('start_date', endDate)
        .gt('outstanding_balance', 0);

      if (loansError) throw loansError;

      const calculations: EnhancedPayrollCalculation[] = [];

      employees?.forEach(employee => {
        // Find time records for this employee
        const empTimeRecords = timeRecords?.filter(tr => 
          tr.employee_id === employee.id || 
          tr.atg_clock_number === employee.atg_clock_number
        ) || [];

        if (empTimeRecords.length === 0) return; // Skip employees with no time records

        // Calculate total hours and apply break time logic
        let totalHours = empTimeRecords.reduce((sum, tr) => sum + (tr.total_hours || 0), 0);
        let breakDeductionHours = 0;

        // Apply break time rules
        if (totalHours > settings.unpaid_break_threshold_hours) {
          // Deduct 1 hour unpaid break for work over 6 hours
          breakDeductionHours = 1;
          
          // Special rule: if working over 12 hours but under 12:45, pay only 11 hours
          if (totalHours > settings.shift_hours && totalHours < (settings.shift_hours + 0.75)) {
            totalHours = settings.shift_hours - 1; // 11 hours
            breakDeductionHours = 1;
          } else if (totalHours > settings.unpaid_break_threshold_hours) {
            totalHours = totalHours - 1; // Deduct 1 hour for break
          }
        }

        // Calculate overtime (anything over 8 hours per day, or over 40 hours per week)
        const regularHours = Math.min(totalHours, 40); // Assuming 40 hour work week
        const overtimeHours = Math.max(0, totalHours - 40);

        // Calculate lateness penalties
        const totalLateMinutes = empTimeRecords.reduce((sum, tr) => sum + (tr.late_minutes || 0), 0);
        const latePenaltyRate = employee.employee_type === 'casual' 
          ? settings.casual_lateness_penalty 
          : settings.permanent_lateness_penalty;
        const lateness_penalty = Math.floor(totalLateMinutes / 10) * latePenaltyRate;

        // Calculate loan deductions for this employee
        const empLoans = employeeLoans?.filter(loan => 
          loan.employee_id === employee.id && 
          new Date(loan.start_date) <= new Date(endDate)
        ) || [];
        
        const loan_deductions = empLoans.reduce((sum, loan) => {
          // Only deduct if there's outstanding balance
          return sum + (loan.outstanding_balance > 0 ? (loan.monthly_payment || 0) : 0);
        }, 0);

        // Calculate pay
        const hourlyRate = employee.hourly_rate || 0;
        const regular_pay = regularHours * hourlyRate;
        const overtime_pay = overtimeHours * hourlyRate * 1.5; // 1.5x overtime rate
        const gross_pay = regular_pay + overtime_pay;

        // Tax deductions (only for permanent staff)
        const tax_deduction = employee.employee_type === 'permanent' 
          ? gross_pay * 0.18 // 18% tax rate - placeholder, will be SimplePay integration
          : 0;

        const other_deductions = lateness_penalty + loan_deductions;
        const net_pay = gross_pay - tax_deduction - other_deductions;

        calculations.push({
          employee_id: employee.id,
          employee_name: `${employee.first_name} ${employee.last_name}`,
          employee_type: employee.employee_type,
          regular_hours: regularHours,
          overtime_hours: overtimeHours,
          break_deduction_hours: breakDeductionHours,
          lateness_penalty,
          loan_deductions,
          regular_pay,
          overtime_pay,
          gross_pay,
          tax_deduction,
          other_deductions,
          net_pay
        });
      });

      return calculations;
    } catch (error) {
      console.error('Error calculating enhanced payroll:', error);
      toast({
        title: "Error",
        description: "Failed to calculate payroll",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    settings,
    calculateEnhancedPayroll
  };
};
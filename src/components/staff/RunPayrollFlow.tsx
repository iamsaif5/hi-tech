import React, { useState, useEffect } from 'react';
import { useEmployees } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Users, Clock, Calendar, DollarSign, CheckCircle, Download, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchEntries, fetchHours } from '@/lib/Api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const titleStyle = {
  font: { bold: true, sz: 14 },
  alignment: { horizontal: "center", vertical: "center" }
};

const subtitleStyle = {
  font: { bold: true },
  alignment: { horizontal: "center" }
};

const headerStyle = {
  font: { bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "4F81BD" } },
  alignment: { horizontal: "center", vertical: "center" },
  border: {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" }
  }
};

const cellStyle = {
  border: {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" }
  }
};

const totalStyle = {
  font: { bold: true },
  fill: { fgColor: { rgb: "D9E1F2" } },
  border: {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" }
  }
};


interface RunPayrollFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

interface TimeRecord {
  id: string;
  employee_id: string;
  date: string;
  atg_clock_number: string | null;
  clock_in: string | null;
  clock_out: string | null;
  total_hours: number | null;
  overtime_hours: number | null;
  late_minutes: number | null;
}

interface PayrollCalculation {
  employee_id: string;
  regular_hours: number;
  overtime_hours: number;
  regular_pay: number;
  overtime_pay: number;
  bonus_pay: number;
  gross_pay: number;
  loan_deductions: number;
  other_deductions: number;
  net_pay: number;
}

const RunPayrollFlow = ({ onBack, onComplete }: RunPayrollFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [payrollCalculations, setPayrollCalculations] = useState<PayrollCalculation[]>([]);
  const [payRollInfo, setPayRollInfo] = useState<any>([]);
  const [availablePeriods, setAvailablePeriods] = useState<any[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [selectedStaffType, setSelectedStaffType] = useState<string>('permanent');
  const [selectedCompany, setSelectedCompany] = useState<string>('hitec');
  const [payPeriod, setPayPeriod] = useState({
    start_date: '',
    end_date: '',
    pay_date: '',
  });

  const {
    data,
    isLoading: customLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['entries', payPeriod?.start_date, payPeriod?.end_date],
    queryFn: () => fetchEntries({ date_from: payPeriod?.start_date, date_to: payPeriod?.end_date, selectedDate: null }),
    enabled: !!payPeriod?.start_date && !!payPeriod?.end_date,
  });
  
  const {
      data: hoursData,
      isLoading: hoursLoading,
  } = useQuery({
      queryKey: ['hours', payPeriod?.start_date, payPeriod?.end_date],
      queryFn: () => fetchHours({ date_from: payPeriod?.start_date, date_to: payPeriod?.end_date }),
      enabled: !!payPeriod?.start_date && !!payPeriod?.end_date,
  });
  
  console.log("data", data)

  const { data: employees, isLoading } = useEmployees();

  // Calculate dynamic fortnightly pay periods based on actual time records
  const calculatePayPeriods = () => {
    const today = new Date();

    // Base period starts June 18, 2025 (2-week cycles)
    const basePeriodStart = new Date('2025-06-18');

    // Calculate how many periods have passed since base period
    const daysDiff = Math.floor((today.getTime() - basePeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const periodsPassed = Math.floor(daysDiff / 14);

    const periods = [];

    const formatDate = (date: Date) => {
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    const addDays = (date: Date, days: number) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    };

    // Helper to push period info
    const pushPeriod = (id: number, start: Date, status: string) => {
      const end = addDays(start, 13);
      const payDate = addDays(end, 1); // Next day after endDate

      periods.push({
        id,
        dates: `${formatDate(start)}-${formatDate(end)}`,
        status: 'ready-for-payroll',
        days: 14,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        payDate: payDate.toISOString().split('T')[0],
      });
    };

    // Previous, current, next
    pushPeriod(1, addDays(basePeriodStart, (periodsPassed - 1) * 14), 'complete');
    pushPeriod(2, addDays(basePeriodStart, periodsPassed * 14), 'current');
    pushPeriod(3, addDays(basePeriodStart, (periodsPassed + 1) * 14), 'upcoming');

    return periods;
  };

  // Initialize available periods based on actual time records
  useEffect(() => {
    const loadPeriods = async () => {
      try {
        // Load time records (optional — only to confirm data exists)
        const { data: dateRange } = await supabase.from('time_records').select('date').order('date', { ascending: true });

        if (!dateRange || dateRange.length === 0) {
          console.log('No time records found — using calculated pay periods');
        }

        // ✅ Use your local calculatePayPeriods() function
        const calculatedPeriods = calculatePayPeriods();

        // Set all available periods (previous, current, upcoming)
        setAvailablePeriods(calculatedPeriods);

        // ✅ Optionally, set current period as default
        const current = calculatedPeriods.find(p => p.status === 'current');
        if (current) {
          setSelectedPeriodId(current.id);
          setPayPeriod({
            start_date: current.startDate,
            end_date: current.endDate,
            pay_date: current.payDate,
          });
        }
      } catch (error) {
        console.error('Error loading periods:', error);
      }
    };

    loadPeriods();
  }, []);

  const steps = [
    { id: 1, title: 'Select Period & Options', icon: Calendar },
    { id: 2, title: 'Select Staff', icon: Users },
    { id: 3, title: 'Calculate Pay', icon: DollarSign },
    { id: 4, title: 'Confirm & Process', icon: CheckCircle },
  ];

  // Filter employees based on staff type and time records
  const getFilteredEmployees = () => {
    if (!employees || !data) return [];

    // Map data by clock number for quick lookup
    const dataMap = data?.items?.reduce((acc, entry) => {
      const clock = entry.clock_number;
      if (clock) acc[clock] = entry;
      return acc;
    }, {});

    const filtered = employees
      .filter(emp => {
        // Filter by staff type
        if (selectedStaffType !== 'all' && emp.employee_type !== selectedStaffType) {
          return false;
        }

        // Filter by company (placeholder)
        if (selectedCompany !== 'all') {
          // future: implement when employees have company field
        }

        return true; // ✅ Keep all employees
      })
      .map(emp => {
        const matchedData = dataMap?.[emp.atg_clock_number];
        // Try to find in hoursData first if available, else fall back to entries data
        const hoursItem = hoursData?.items?.find((item: any) => item.clock_number === emp.atg_clock_number);
        
        let timeSpend = 0;
        if (hoursItem) {
             timeSpend = hoursItem.total_hours; 
        } else if (matchedData) {
             timeSpend = (matchedData.raw_payload?.timeSpend || 0) / (1000 * 60 * 60);
        }

        return {
          ...emp,
          timeSpend, // ✅ Add timeSpend (0 if not found)
        };
      });

    return filtered;
  };

  // Auto-select filtered employees when criteria change
  useEffect(() => {
    if (payPeriod.start_date && payPeriod.end_date) {
      const filteredEmployees = getFilteredEmployees();
      const employeeIds = filteredEmployees.map(emp => emp.id);

      // Auto-select employees if none are selected or if filters changed
      if (selectedEmployees.length === 0 || selectedStaffType !== 'all' || selectedCompany !== 'all') {
        setSelectedEmployees(filteredEmployees);
      }
    }
  }, [payPeriod, timeRecords, selectedStaffType, selectedCompany, hoursData]);

  // Load time records for the selected period
  useEffect(() => {
    if (payPeriod.start_date && payPeriod.end_date) {
      loadTimeRecords();
    }
  }, [payPeriod]);

  // Calculate payroll when employees or time records change
  useEffect(() => {
    if (selectedEmployees.length > 0 && timeRecords.length > 0) {
      calculatePayroll();
    }
  }, [selectedEmployees, timeRecords]);

  const loadTimeRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .gte('date', payPeriod.start_date)
        .lte('date', payPeriod.end_date);

      if (error) throw error;
      setTimeRecords(data || []);
    } catch (error) {
      console.error('Error loading time records:', error);
    }
  };

  const calculatePayroll = async () => {
    if (selectedEmployees.length === 0 || !payPeriod.start_date || !payPeriod.end_date) {
      setPayrollCalculations([]);
      return;
    }

    try {
      // Fetch active employee loans with monthly payments due during this period
      const { data: employeeLoans, error: loansError } = await supabase
        .from('employee_loans')
        .select('*')
        .eq('status', 'active')
        .lte('start_date', payPeriod.end_date)
        .gt('outstanding_balance', 0);

      if (loansError) throw loansError;

      // Use the same database function as the estimate to ensure consistency
      const { data: payrollData, error } = await supabase.rpc('calculate_payroll_for_period', {
        p_start_date: payPeriod.start_date,
        p_end_date: payPeriod.end_date,
      });

      if (error) throw error;

      if (payrollData && payrollData.length > 0) {
        // Filter to only selected employees with hours worked
        const selectedPayrollData = payrollData.filter(
          (emp: any) => selectedEmployees.includes(emp.employee_id) && parseFloat(emp.regular_hours) > 0
        );

        // Convert to the format expected by the UI and add loan deductions
        const calculations: PayrollCalculation[] = selectedPayrollData.map((emp: any) => {
          // Calculate loan deductions for this employee
          const empLoans =
            employeeLoans?.filter(
              loan => loan.employee_id === emp.employee_id && new Date(loan.start_date) <= new Date(payPeriod.end_date)
            ) || [];

          const loan_deductions = empLoans.reduce((sum, loan) => {
            // Only deduct if there's outstanding balance
            return sum + (loan.outstanding_balance > 0 ? loan.monthly_payment || 0 : 0);
          }, 0);

          const regular_pay = parseFloat(emp.regular_pay) || 0;
          const overtime_pay = parseFloat(emp.overtime_pay) || 0;
          const bonus_pay = 0; // Default bonus, will be editable
          const gross_pay = regular_pay + overtime_pay + bonus_pay;
          const base_deductions = parseFloat(emp.total_deductions) || 0;
          const total_deductions = base_deductions + loan_deductions;

          return {
            employee_id: emp.employee_id,
            regular_hours: parseFloat(emp.regular_hours) || 0,
            overtime_hours: parseFloat(emp.overtime_hours) || 0,
            regular_pay: regular_pay,
            overtime_pay: overtime_pay,
            bonus_pay: bonus_pay,
            gross_pay: gross_pay,
            loan_deductions: loan_deductions,
            other_deductions: base_deductions,
            net_pay: gross_pay - total_deductions,
          };
        });

        setPayrollCalculations(calculations);
      }
    } catch (error) {
      console.error('Error calculating payroll:', error);
      setPayrollCalculations([]);
    }
  };

  useEffect(() => {

    const enrichedEmployees = selectedEmployees.map(emp => {
      const bonus_pay = 0;
      
      // Find matching hours data
      const empHoursData = hoursData?.items?.find((item: any) => item.clock_number === emp.atg_clock_number);
      
      let totalWorkedHours = 0;
      let totalWeekendHours = 0;
      
      // Capped hours logic
      if (empHoursData) {
          const cap = emp.capped_hours || 11; // Default to 11 if not set
          
          // Calculate Total Worked Hours (Capped / Min Guaranteed)
          if (empHoursData.hours_of_each_day && empHoursData.hours_of_each_day.hours) {
              totalWorkedHours = empHoursData.hours_of_each_day.hours.reduce((sum: number, hours: number) => {
                  return sum + Math.max(hours, cap);
              }, 0);
          }
           else if (empHoursData.total_hours) {
               // Fallback
               totalWorkedHours = empHoursData.total_hours;
          }

          // Calculate Weekend Hours (Capped / Min Guaranteed)
          if (empHoursData.weekend_hours && empHoursData.weekend_hours.hours) {
              totalWeekendHours = empHoursData.weekend_hours.hours.reduce((sum: number, hours: number) => {
                   return sum + Math.max(hours, cap);
              }, 0);
          }
           else if (empHoursData.total_weekend_hours) {
              totalWeekendHours = empHoursData.total_weekend_hours;
          }
      }

      const totalPaidHours = Math.max(0, totalWorkedHours - totalWeekendHours);
      const gross_pay = (totalPaidHours * (emp.hourly_rate || 0)); // Initial gross pay without bonus/deductions

      return {
        ...emp,
        bonus_pay,
        gross_pay, // This will be recalculated in updateBonus/Loans to include additions/deductions
        net_pay: gross_pay,
        total_worked_hours: totalWorkedHours,
        total_weekend_hours: totalWeekendHours,
        total_paid_hours: totalPaidHours
      };
    });

    setPayRollInfo(enrichedEmployees);
  }, [selectedEmployees, payPeriod, hoursData]);

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Pay Period Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Pay Period</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <Label className="text-sm font-medium">Available Pay Periods</Label>
                <Select
                  value={selectedPeriodId}
                  onValueChange={value => {
                    setSelectedPeriodId(value);
                    const period = availablePeriods.find(p => p.id === value);
                    if (period) {
                      setPayPeriod({
                        start_date: period.startDate,
                        end_date: period.endDate,
                        pay_date: period.payDate,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a pay period..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePeriods.map(period => (
                      <SelectItem key={period.id} value={period.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{period.dates}</span>
                          <Badge
                            className="ml-2 bg-green-500 hover:bg-green-600 text-white"
                            variant={period.status === 'ready-for-payroll' ? 'default' : 'outline'}
                          >
                            {period.status === 'ready-for-payroll' ? 'Ready' : 'Incomplete'}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period Details */}
              {payPeriod.start_date && (
                <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg border">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground font-medium">Start Date</div>
                    <div className="text-sm font-semibold mt-1">{new Date(payPeriod.start_date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground font-medium">End Date</div>
                    <div className="text-sm font-semibold mt-1">{new Date(payPeriod.end_date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground font-medium">Pay Date</div>
                    <div className="text-sm font-semibold mt-1">{new Date(payPeriod.pay_date).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Type and Company Selection - 50/50 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Type Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Staff Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select Staff Type for Payroll</Label>
                <Select value={selectedStaffType} onValueChange={setSelectedStaffType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select staff type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    <SelectItem value="permanent">Permanent Staff Only</SelectItem>
                    <SelectItem value="casual">Casual Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-700">
                  <strong>Note:</strong> Casual staff have no tax deductions, permanent staff include tax deductions.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Company</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select Company for Payroll</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select company..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    <SelectItem value="r_and_m">R&M</SelectItem>
                    <SelectItem value="hitec">HITEC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[52px] flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-lg">
                Company filtering will affect payroll processing
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Employee Selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Select Employees ({selectedEmployees.length} selected)</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const filteredEmployees = getFilteredEmployees();
                  setSelectedEmployees(filteredEmployees);
                }}
              >
                Select All Filtered
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedEmployees([])}>
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredEmployees().map(employee => {
                const empTimeRecords = timeRecords.filter(
                  tr => tr.employee_id === employee.id || tr.atg_clock_number === employee.atg_clock_number
                );
                const totalHours = empTimeRecords.reduce((sum, tr) => sum + (tr.total_hours || 0), 0);

                // Find active loans for this employee
                const empLoans = payrollCalculations.find(calc => calc.employee_id === employee.id);
                const loanDeductions = empLoans?.loan_deductions || 0;

                return (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.some(e => e.id === employee.id)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setSelectedEmployees([...selectedEmployees, employee]);
                          } else {
                            setSelectedEmployees(selectedEmployees.filter(id => id.id !== employee.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.atg_clock_number} • {Math.round(employee?.timeSpend || 0)}h worked
                          {loanDeductions > 0 && <span className="text-orange-600 ml-2">• R{loanDeductions.toFixed(2)} loan</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>R{employee.hourly_rate}/hr</TableCell>
                    <TableCell>
                      <Badge className="capitalize" variant="outline">
                        {employee.employee_type}
                        {employee.capped_hours && ` • Cap: ${employee.capped_hours}`}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Review Hours & Attendance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Regular Hours</TableHead>
              <TableHead>Overtime Hours</TableHead>
              <TableHead>Late Minutes</TableHead>
              <TableHead>Days Worked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedEmployees.map(empId => {
              const employee = getFilteredEmployees()?.find(e => e.id === empId);
              // Match time records by both employee_id and atg_clock_number
              const empTimeRecords = timeRecords.filter(
                tr =>
                  tr.employee_id === empId || (employee && employee.atg_clock_number && tr.atg_clock_number === employee.atg_clock_number)
              );
              const totalHours = empTimeRecords.reduce((sum, tr) => sum + (tr.total_hours || 0), 0);
              const overtimeHours = empTimeRecords.reduce((sum, tr) => sum + (tr.overtime_hours || 0), 0);
              const lateMinutes = empTimeRecords.reduce((sum, tr) => sum + (tr.late_minutes || 0), 0);

              return (
                <TableRow key={empId.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {empId?.first_name} {empId?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{empId?.atg_clock_number}</div>
                    </div>
                  </TableCell>
                  <TableCell>{empId?.timeSpend?.toFixed(1)}</TableCell>
                  <TableCell>{overtimeHours.toFixed(1)}</TableCell>
                  <TableCell>{lateMinutes}</TableCell>
                  <TableCell>{empTimeRecords.length}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Format currency with commas
  const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Update bonus for employee
  const updateBonus = (atgClockNumber: string, bonusAmount: number) => {
    setPayRollInfo(prev =>
      prev.map(calc => {
        if (calc.atg_clock_number == atgClockNumber) {
          const newGrossPay = (calc.total_paid_hours * calc.hourly_rate) + bonusAmount;
          return {
            ...calc,
            bonus_pay: bonusAmount,
            gross_pay: newGrossPay,
            net_pay: newGrossPay - (calc.loan_deductions || 0) - (calc.other_deductions || 0),
          };
        }
        return calc;
      })
    );
  };
  
    // Update bonus for employee
  const updateLoans = (atgClockNumber: string, loanAmount: number) => {
    setPayRollInfo(prev =>
      prev.map(calc => {
        if (calc.atg_clock_number == atgClockNumber) {
          return {
            ...calc,
            loan_deductions: loanAmount,
            net_pay: calc.gross_pay - (calc.other_deductions || 0) - loanAmount
          };
        }
        return calc;
      })
    );
  };
  
    const updateOtherDeductions = (atgClockNumber: string, otherDeductionsAmount: number) => {
    setPayRollInfo(prev =>
      prev.map(calc => {
        if (calc.atg_clock_number == atgClockNumber) {
          return {
            ...calc,
            other_deductions: otherDeductionsAmount,
            net_pay: calc.gross_pay - (calc.loan_deductions || 0) - otherDeductionsAmount
          };
        }
        return calc;
      })
    );
  };

  const renderStep4 = () => (
    <div className="space-y-4">
      {/* Summary Totals at Top */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(payRollInfo.reduce((sum, calc) => sum + calc.gross_pay, 0))}</div>
              <div className="text-sm text-muted-foreground">Total Gross</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(payRollInfo.reduce((sum, calc) => sum + calc.bonus_pay, 0))}</div>
              <div className="text-sm text-muted-foreground">Total Additions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(payRollInfo.reduce((sum, calc) => sum + (calc.other_deductions || 0) + (calc.loan_deductions || 0), 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Deductions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(payRollInfo.reduce((sum, calc) => sum + calc.net_pay, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Net</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payroll Calculations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Capped hrs per shift</TableHead>
                <TableHead>Rate p/hr</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Total worked hours</TableHead>
                <TableHead>Total off weekend hours</TableHead>
                <TableHead>Total paid hours</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Loans</TableHead>
                <TableHead>Gross Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payRollInfo?.map(calc => {
                return (
                  <TableRow key={calc.atg_clock_number}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {calc.first_name} {calc.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{calc.atg_clock_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>{calc.capped_hours || 11}</TableCell>
                    <TableCell>{formatCurrency(calc?.hourly_rate || 0)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={calc?.bonus_pay}
                        onChange={e => updateBonus(calc?.atg_clock_number, parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-sm"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{Math.floor(calc.total_worked_hours || 0)}h</TableCell>
                    <TableCell className="text-orange-600">{Math.floor(calc.total_weekend_hours || 0)}h</TableCell>
                    <TableCell className="text-red-600">{Math.floor(calc.total_paid_hours || 0)}h</TableCell>
                    <TableCell className="font-bold text-green-600">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={calc?.other_deductions}
                        onChange={e => updateOtherDeductions(calc?.atg_clock_number, parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-sm"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
             
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={calc?.loan_deductions}
                        onChange={e => updateLoans(calc?.atg_clock_number, parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-sm"
                        placeholder="0.00"
                      />
        
                    </TableCell>
                    <TableCell className="font-bold text-green-600">{formatCurrency(calc.net_pay)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Summary */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{formatCurrency(payRollInfo.reduce((sum, calc) => sum + calc.gross_pay, 0))}</div>
                <div className="text-sm text-muted-foreground">Total Gross</div>
              </div>
              <div>
                <div className="text-lg font-bold">{formatCurrency(payRollInfo.reduce((sum, calc) => sum + calc.bonus_pay, 0))}</div>
                <div className="text-sm text-muted-foreground">Total Additions</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(payRollInfo.reduce((sum, calc) => sum + (calc.other_deductions || 0) + (calc.loan_deductions || 0), 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Deductions</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(payRollInfo.reduce((sum, calc) => sum + calc.net_pay, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Net</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep5 = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Confirm & Process Payroll
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-2">Payroll Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span>
                    {payPeriod.start_date} to {payPeriod.end_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pay Date:</span>
                  <span>{payPeriod.pay_date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employees:</span>
                  <span>{selectedEmployees.length}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Net Pay:</span>
                  <span className="text-green-600">R{payRollInfo.reduce((sum, calc) => sum + calc.net_pay, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Processing Options</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">Save payroll records</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">Export CSV report</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <span className="text-sm">Email payslips to employees</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleProcessPayroll} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Process Payroll
            </Button>
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  const handleDownloadReport = () => {
    if (!payRollInfo || payRollInfo.length === 0) return;

    // Defines headers matching the logic and structure
    const headers = [
      "NAME", "NO", "SECTION", "CAPPED HRS PER SHIFT", "RATE P/HR", 
      "TOTAL WORKED HOURS", "TOTAL OFF WEEKEND HOURS", "TOTAL PAID HOURS", 
      "DEDUCTIONS", "LOANS", "GROSS SALARY (Incl. Incentive)"
    ];

    const data = payRollInfo.map((emp: any) => [
      `${emp.first_name} ${emp.last_name}`,
      emp.atg_clock_number,
      emp.department,
      emp.capped_hours || 11,
      `R ${emp.hourly_rate}`,
      Math.floor(emp.total_worked_hours || 0),
      Math.floor(emp.total_weekend_hours || 0),
      Math.floor(emp.total_paid_hours || 0),
      emp.other_deductions || '',
      emp.loan_deductions || '',
      `R ${emp.net_pay}`
    ]);

    // Calculate totals
    const totalWorked = payRollInfo.reduce((sum: number, emp: any) => sum + (emp.total_worked_hours || 0), 0);
    const totalWeekend = payRollInfo.reduce((sum: number, emp: any) => sum + (emp.total_weekend_hours || 0), 0);
    const totalPaid = payRollInfo.reduce((sum: number, emp: any) => sum + (emp.total_paid_hours || 0), 0);
    const totalDeductions = payRollInfo.reduce((sum: number, emp: any) => sum + (emp.other_deductions || 0), 0);
    const totalLoans = payRollInfo.reduce((sum: number, emp: any) => sum + (emp.loan_deductions || 0), 0);
    const totalNet = payRollInfo.reduce((sum: number, emp: any) => sum + (emp.net_pay || 0), 0);

    // Append totals row
    data.push([
      "", "", "", "", "", 
      Math.floor(totalWorked), 
      Math.floor(totalWeekend), 
      Math.floor(totalPaid), 
      `R ${totalDeductions.toFixed(2)}`, 
      `R ${totalLoans.toFixed(2)}`, 
      `R ${totalNet.toFixed(2)}`
    ]);

    // Append Employee Count Row
    data.push(["", "", "", "", "", "", "", "", "NO. OF EMPLOYEES", payRollInfo.length, ""]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([
        ["HITEC PACKAGING - FORTNIGHT WAGES"],
        [`RUN DATE - ${payPeriod.start_date} TO ${payPeriod.end_date}`],
        [], // Empty row
        headers,
        ...data
    ]);



    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Report");

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    saveAs(dataBlob, `Payroll_Report_${payPeriod.start_date}_to_${payPeriod.end_date}.xlsx`);
  };


  const handleProcessPayroll = async () => {
    try {
      // Create payroll period
      const { data: payrollPeriod, error: periodError } = await supabase
        .from('payroll_periods')
        .insert({
          period_name: `${payPeriod.start_date} to ${payPeriod.end_date}`,
          start_date: payPeriod.start_date,
          end_date: payPeriod.end_date,
          pay_date: payPeriod.pay_date,
          total_employees: selectedEmployees.length,
          total_gross_pay: payRollInfo.reduce((sum, calc) => sum + calc.gross_pay, 0),
          // total_deductions: payRollInfo.reduce((sum, calc) => sum + calc.other_deductions + calc.loan_deductions, 0),
          total_deductions: 0,
          total_net_pay: payRollInfo.reduce((sum, calc) => sum + calc.net_pay, 0),
          status: 'completed',
          employee_info: [...payRollInfo],
        })
        .select()
        .single();

      if (periodError) throw periodError;

      // Create payroll records for each employee
      const payrollRecords = payrollCalculations.map(calc => ({
        employee_id: calc.employee_id,
        payroll_period_id: payrollPeriod.id,
        regular_hours: calc.regular_hours,
        regular_pay: calc.regular_pay,
        overtime_hours: calc.overtime_hours,
        overtime_pay: calc.overtime_pay,
        gross_pay: calc.gross_pay,
        bonus_pay: calc.bonus_pay,
        other_deductions: calc.other_deductions + calc.loan_deductions,
        total_deductions: calc.other_deductions + calc.loan_deductions,
        net_pay: calc.net_pay,
        payment_status: 'pending',
      }));

      const { error: recordsError } = await supabase.from('payroll_records').insert(payrollRecords);

      if (recordsError) throw recordsError;

      // Update employee loan balances for loans that had deductions
      for (const calc of payrollCalculations) {
        if (calc.loan_deductions > 0) {
          const { data: loans } = await supabase
            .from('employee_loans')
            .select('*')
            .eq('employee_id', calc.employee_id)
            .eq('status', 'active')
            .gt('outstanding_balance', 0);

          if (loans && loans.length > 0) {
            for (const loan of loans) {
              const newBalance = Math.max(0, loan.outstanding_balance - loan.monthly_payment);
              const newStatus = newBalance === 0 ? 'completed' : 'active';

              await supabase
                .from('employee_loans')
                .update({
                  outstanding_balance: newBalance,
                  status: newStatus,
                })
                .eq('id', loan.id);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      console.error('Error processing payroll:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep4();
      case 4:
        return renderStep5();
      default:
        return renderStep1();
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading payroll data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Run Payroll</h1>
            <p className="text-sm text-muted-foreground">
              {payPeriod.start_date} to {payPeriod.end_date}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <Card className="shadow-md">
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs
                      ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : isCompleted
                          ? 'border-green-500 bg-green-50 text-green-600'
                          : 'border-gray-300 bg-gray-50 text-gray-400'
                      }
                    `}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                    {index < steps.length - 1 && <div className={`w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />}
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs font-medium">Step {currentStep}: </span>
              <span className="text-xs text-muted-foreground">{steps[currentStep - 1]?.title}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step Content */}
      {renderCurrentStep()}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length && (
          <Button
            size="sm"
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            disabled={currentStep === 1 && selectedEmployees.length === 0}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RunPayrollFlow;

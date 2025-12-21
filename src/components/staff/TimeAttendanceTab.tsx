import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, AlertTriangle, CheckCircle, Edit, Upload, Users, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { fetchEntries } from '@/lib/Api';

const TimeAttendanceTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(2);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [pasteData, setPasteData] = useState('');
  const [uploadPeriodId, setUploadPeriodId] = useState<number | undefined>(undefined);
  const [dailyStaffData, setDailyStaffData] = useState<any>({});
  const [employees, setEmployees] = useState<any[]>([]);
  const [timeRecords, setTimeRecords] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const { toast } = useToast();
  const [timeOffRequests, setTimeOffRequests] = useState<any[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['entries', timeOffRequests?.startDate, timeOffRequests?.endDate, selectedDate],
    queryFn: () => fetchEntries({ date_from: timeOffRequests?.startDate, date_to: timeOffRequests?.endDate, selectedDate }),
    enabled: !!timeOffRequests?.startDate && !!timeOffRequests?.endDate,
  });

  useEffect(() => {
    setTimeOffRequests(payPeriods.find(p => p.id === selectedPeriod));
  }, [selectedPeriod]);

  // Calculate dynamic fortnightly pay periods based on current date
  const calculatePayPeriods = () => {
    const today = new Date();

    // Base period starts June 18, 2025 (2-week cycles)
    const basePeriodStart = new Date('2025-06-18');

    // Calculate how many periods have passed since base period
    const daysDiff = Math.floor((today.getTime() - basePeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const periodsPassed = Math.floor(daysDiff / 14);

    const periods = [];

    // Previous period (for payroll processing)
    const prevPeriodStart = new Date(basePeriodStart);
    prevPeriodStart.setDate(basePeriodStart.getDate() + (periodsPassed - 1) * 14);
    const prevPeriodEnd = new Date(prevPeriodStart);
    prevPeriodEnd.setDate(prevPeriodStart.getDate() + 13);

    // Current period (active/in progress)
    const currentPeriodStart = new Date(basePeriodStart);
    currentPeriodStart.setDate(basePeriodStart.getDate() + periodsPassed * 14);
    const currentPeriodEnd = new Date(currentPeriodStart);
    currentPeriodEnd.setDate(currentPeriodStart.getDate() + 13);

    // Next period (upcoming)
    const nextPeriodStart = new Date(basePeriodStart);
    nextPeriodStart.setDate(basePeriodStart.getDate() + (periodsPassed + 1) * 14);
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodStart.getDate() + 13);

    const formatDate = (date: Date) => {
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    };
    
    periods.push({
      id: 0,
      dates: `Nov 5-Nov 18`,
      status: 'complete',
      days: 14,
      startDate: '2025-11-05',
      endDate: '2025-11-18',
    });

    periods.push({
      id: 1,
      dates: `${formatDate(prevPeriodStart)}-${formatDate(prevPeriodEnd)}`,
      status: 'complete',
      days: 14,
      startDate: prevPeriodStart.toISOString().split('T')[0],
      endDate: prevPeriodEnd.toISOString().split('T')[0],
    });

    periods.push({
      id: 2,
      dates: `${formatDate(currentPeriodStart)}-${formatDate(currentPeriodEnd)}`,
      status: 'current',
      days: 14,
      startDate: currentPeriodStart.toISOString().split('T')[0],
      endDate: currentPeriodEnd.toISOString().split('T')[0],
    });

    periods.push({
      id: 3,
      dates: `${formatDate(nextPeriodStart)}-${formatDate(nextPeriodEnd)}`,
      status: 'upcoming',
      days: 14,
      startDate: nextPeriodStart.toISOString().split('T')[0],
      endDate: nextPeriodEnd.toISOString().split('T')[0],
    });

    return periods;
  };

  const payPeriods = calculatePayPeriods();
  
  console.log("payPeriods", payPeriods)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-hitec-success'; // Completed period - green
      case 'current':
        return 'bg-hitec-highlight'; // Current active period - orange
      case 'upcoming':
        return 'bg-muted'; // Future period - gray
      default:
        return 'bg-muted';
    }
  };

  // Generate 14 days for selected period (recalculated when period changes)
  const periodDays = React.useMemo(() => {
    const days = [];
    const today = new Date();
    const selectedPeriodData = payPeriods.find(p => p.id === selectedPeriod);
    const startDate = new Date(selectedPeriodData?.startDate || payPeriods[1].startDate); // Default to current period

    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateStr = date.toISOString().split('T')[0];
      const dayNum = date.getDate();
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isFuture = date > today;

      let status = 'future';
      if (isToday) status = 'today';
      else if (isPast) status = 'past';

      days.push({
        date: dateStr,
        day: dayNum,
        status,
        staffCount: 0, // Will be calculated later
        totalHours: 0, // Will be calculated later
      });
    }
    return days;
  }, [selectedPeriod, payPeriods]);
  const selectedPeriodData = payPeriods.find(p => p.id === selectedPeriod);

  // Set default selected period to current active period (period 2)
  useEffect(() => {
    setSelectedPeriod(2);
  }, []);

  // Set default upload period to current period (Jun 18 - Jul 1)
  useEffect(() => {
    if (payPeriods.length > 0 && !uploadPeriodId) {
      // Find the incomplete payroll period (Jun 18 - Jul 1, 2025)
      const incompletePeriod = payPeriods.find(p => p.startDate === '2025-06-18');
      if (incompletePeriod) {
        setUploadPeriodId(incompletePeriod.id);
      }
    }
  }, [payPeriods, uploadPeriodId]);

  // Set default selected date to today (only on mount)
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, []); // Only run once on mount

  // Update selected date when period changes
  // useEffect(() => {
  //   if (selectedPeriod && periodDays.length > 0) {
  //     // Set to first day of the selected period
  //     const firstDayOfPeriod = periodDays[0]?.date;
  //     if (firstDayOfPeriod) {
  //       setSelectedDate(firstDayOfPeriod);
  //     }
  //   }
  // }, [selectedPeriod]); // Run when selectedPeriod changes

  console.log(selectedDate);

  // Fetch employees and time records
  useEffect(() => {
    fetchEmployees();
    fetchTimeRecords();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase.from('employees').select('*').eq('is_active', true).order('first_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTimeRecords = async () => {
    try {
      const { data, error } = await supabase.from('time_records').select('*').order('date', { ascending: false });

      if (error) throw error;
      setTimeRecords(data || []);
    } catch (error) {
      console.error('Error fetching time records:', error);
    }
  };

  const getDayStatusColor = (status: string) => {
    switch (status) {
      case 'past':
        return 'bg-hitec-success text-white'; // Past days - green
      case 'today':
        return 'bg-hitec-highlight text-white'; // Today - orange
      case 'future':
        return 'bg-muted text-muted-foreground'; // Future days - gray
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Reset page when date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  // Get staff data for selected date - prioritize local data with names
  const getAllStaffForDate = (date: string) => {
    // ALWAYS prioritize local data which has names
    if (dailyStaffData[date] && dailyStaffData[date].length > 0) {
      return dailyStaffData[date];
    }

    // Fallback to database time records and match with employee names
    const dateTimeRecords = timeRecords.filter(record => record.date === date);

    if (dateTimeRecords.length > 0) {
      const staffData = dateTimeRecords
        .map(record => {
          // Find matching employee by ATG clock number or employee_id
          const employee = employees.find(emp => emp.atg_clock_number === record.atg_clock_number || emp.id === record.employee_id);

          // Only include records that have a matching employee
          if (!employee) return null;

          return {
            name: `${employee.first_name} ${employee.last_name}`,
            hours: record.total_hours ? record.total_hours.toString() : '0',
            clockNo: record.atg_clock_number || 'Unknown',
            employeeType: employee.employee_type || 'Unknown',
          };
        })
        .filter(item => item !== null); // Remove null entries

      return staffData;
    }

    return [];
  };

  const getEntriesByDate = targetDate => {
    if (!data?.items || !targetDate) return [];

    return data.items.filter(entry => {
      const entryDate = entry.date_created_utc?.split('T')[0]; // Extract yyyy-mm-dd
      return entryDate === targetDate;
    });
  };

  // Get paginated staff data
  const getPaginatedStaff = () => {
    const allStaff = getAllStaffForDate(selectedDate || new Date().toISOString().split('T')[0]);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allStaff.slice(startIndex, endIndex);
  };

  // Calculate pagination info
  const getTotalPages = () => {
    const allStaff = getAllStaffForDate(selectedDate || new Date().toISOString().split('T')[0]);
    return Math.ceil(allStaff.length / itemsPerPage);
  };

  const totalPages = getTotalPages();
  const totalStaff = getAllStaffForDate(selectedDate || new Date().toISOString().split('T')[0]).length;

  const handlePasteUpload = async () => {
    if (!pasteData.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste some data first',
        variant: 'destructive',
      });
      return;
    }

    if (!uploadPeriodId) {
      toast({
        title: 'Error',
        description: 'Please select a payroll period',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Get the selected period data
      const selectedUploadPeriod = payPeriods.find(p => p.id === uploadPeriodId);
      if (!selectedUploadPeriod) {
        toast({
          title: 'Error',
          description: 'Invalid period selected',
          variant: 'destructive',
        });
        return;
      }

      // Calculate the 14 days for the selected upload period
      const uploadPeriodDays = [];
      const startDate = new Date(selectedUploadPeriod.startDate);
      for (let i = 0; i < 14; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        uploadPeriodDays.push(date.toISOString().split('T')[0]);
      }

      // Parse the pasted data
      const lines = pasteData.trim().split('\n');
      const headers = lines[0].split('\t');

      const timeRecordsToInsert = [];
      const updatedDailyStaffData = { ...dailyStaffData };

      // Skip first line (headers) and process staff data
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split('\t');
        if (row.length < 3) continue; // Skip invalid rows

        const staffName = row[0]; // First column is name
        const section = row[1]; // Second column is section
        const clockNo = row[row.length - 1]; // Last column is clock number

        // Skip if no name or clock number
        if (!staffName || !clockNo || staffName.trim() === '' || clockNo.trim() === '') {
          continue;
        }

        // Process daily hours (columns 2 to 15 - skipping section column)
        for (let dayIndex = 0; dayIndex < 14; dayIndex++) {
          const hours = row[dayIndex + 2]; // +2 to skip name and section columns
          if (hours && hours.trim() !== '' && hours !== '0' && hours !== '0:00') {
            const date = uploadPeriodDays[dayIndex];
            if (date) {
              // Store in local collection for batch update
              if (!updatedDailyStaffData[date]) {
                updatedDailyStaffData[date] = [];
              }
              updatedDailyStaffData[date].push({
                name: staffName,
                hours: hours,
                clockNo: clockNo,
              });

              // Convert hours to decimal for database storage
              let totalHours = 0;
              if (hours.includes(':')) {
                const [hoursStr, minutesStr] = hours.split(':');
                totalHours = parseInt(hoursStr || '0') + parseInt(minutesStr || '0') / 60;
              } else {
                // Handle cases where hours might not be in HH:MM format
                totalHours = parseFloat(hours) || 0;
              }

              // Prepare for database insertion
              timeRecordsToInsert.push({
                date,
                atg_clock_number: clockNo,
                total_hours: totalHours,
                clock_in: null,
                clock_out: null,
              });
            }
          }
        }
      }

      // Insert into Supabase
      if (timeRecordsToInsert.length > 0) {
        const { data, error } = await supabase.from('time_records').upsert(timeRecordsToInsert, {
          onConflict: 'atg_clock_number,date',
          ignoreDuplicates: false,
        });

        if (error) {
          console.error('Error inserting time records:', error);
          toast({
            title: 'Error',
            description: `Failed to save time records: ${error.message}`,
            variant: 'destructive',
          });
          return;
        } else {
          // Update state with all collected data FIRST

          setDailyStaffData(updatedDailyStaffData);

          toast({
            title: 'Success',
            description: `Uploaded ${timeRecordsToInsert.length} time records for period ${selectedUploadPeriod.dates}`,
          });

          // Refresh time records AFTER local state is set
          setTimeout(() => {
            fetchTimeRecords();
          }, 100);
        }
      } else {
        toast({
          title: 'Warning',
          description: 'No valid time records found in the pasted data',
          variant: 'destructive',
        });
        return;
      }

      setShowUploadDialog(false);
      setPasteData('');
    } catch (error) {
      console.error('Error parsing paste data:', error);
      toast({
        title: 'Error',
        description: `Failed to parse uploaded data: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with title and controls - Clients style */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Time & Attendance</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Pay Period: {selectedPeriodData?.dates || 'Jun 18-Jul 1'}, 2025</span>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Hours
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Upload Staff Hours Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Paste your staff hours data in the format: Name, daily hours (14 columns), Total Hours, Clock No
                </p>

                {/* Period Selector */}
                <div className="space-y-2">
                  <Label htmlFor="upload-period">Upload Data For Pay Period:</Label>
                  <Select
                    value={uploadPeriodId ? uploadPeriodId.toString() : ''}
                    onValueChange={value => setUploadPeriodId(parseInt(value))}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select pay period..." />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Only show the incomplete period (Jun 18 - Jul 1) */}
                      {payPeriods
                        .filter(period => period.startDate === '2025-06-18') // Only the specific incomplete period
                        .map(period => (
                          <SelectItem key={period.id} value={period.id.toString()}>
                            {period.dates}, 2025 - {period.status === 'current' ? 'Incomplete' : period.status}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Only incomplete payroll periods are shown for data upload</p>
                </div>

                <Textarea
                  placeholder="Paste your data here..."
                  value={pasteData}
                  onChange={e => setPasteData(e.target.value)}
                  className="h-96 font-mono text-xs"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasteUpload}>Process Data</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Aligned Row - Day Blocks and Fortnightly Periods */}
      <div className="flex items-center justify-between gap-4">
        {/* Left - 14 Day Blocks */}
        <div className="flex gap-1 overflow-x-auto">
          {periodDays.map((day, index) => (
            <div
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`
                flex-shrink-0 p-2 rounded cursor-pointer transition-all border-2 min-w-[50px] h-[50px] flex flex-col justify-center items-center
                ${selectedDate === day.date ? 'border-primary' : 'border-transparent'}
                ${getDayStatusColor(day.status)}
              `}
            >
              <div className="text-xs font-medium">{day.day}</div>
              {day.status !== 'future' && (
                <div className="flex items-center gap-1">
                  <Users className="h-2 w-2" />
                  <span className="text-xs">{getEntriesByDate(day.date).length}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right - Fortnightly Periods (same height as day blocks) */}
        <div className="flex gap-1">
          {payPeriods.slice(0, 4).map(period => (
            <div
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`
                flex-shrink-0 p-2 rounded cursor-pointer transition-all border-2 min-w-[80px] h-[50px] flex items-center gap-2
                ${selectedPeriod === period.id ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'}
              `}
            >
              <div className={`w-2 h-2 rounded-full ${getStatusColor(period.status)}`}></div>
              <div className="text-xs">
                <div className="font-medium">{period.dates}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Hours Table - Clients style */}
      <div className="space-y-4">
        {/* Floating header with no container - matching Clients page */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Staff Hours</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {selectedDate ? new Date(selectedDate).toLocaleDateString() : new Date().toLocaleDateString()}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {/* Showing {Math.min(itemsPerPage, totalStaff)} of {totalStaff} entries */}
            </span>
          </div>
        </div>

        {/* Table with grey header - matching Clients page exactly */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Staff Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Staff Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Clock Time</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Clock No</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {!isLoading &&
                  data?.items?.map((staff: any, index: number) => {
                    // const employee = employees.find(emp => emp.atg_clock_number === staff.clockNo);
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-4">
                          <p className="font-medium text-blue-600 text-xs">{staff.name}</p>
                        </td>
                        <td className="py-2 px-4">
                          {/* {employee ? (
                            <Badge variant="outline" className="text-xs">
                              {employee.employee_type === 'permanent' ? 'Permanent' : 'Casual'}
                            </Badge>
                          ) : (
                            <span className="text-gray-500 text-xs">Unknown</span>
                          )} */}
                          <Badge variant="outline" className="text-xs">
                            Permanent
                          </Badge>
                        </td>
                        <td className="py-2 px-4 text-xs">
                          {staff?.raw_payload?.timeSpend ? Math.round(staff.raw_payload.timeSpend / (1000 * 60 * 60)) + ' hrs' : '—'}
                        </td>

                        <td className="py-2 px-4 text-xs">{staff.clock_number}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeAttendanceTab;

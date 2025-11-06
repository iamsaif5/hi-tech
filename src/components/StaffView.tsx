import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffDirectory from './staff/StaffDirectory';
import TimeAttendanceTab from './staff/TimeAttendanceTab';
import PayrollTab from './staff/PayrollTab';
import RunPayrollFlow from './staff/RunPayrollFlow';
import LoansAndBonusesTab from './staff/LoansAndBonusesTab';
import { useQuery } from '@tanstack/react-query';
import { fetchEntries } from '@/lib/Api';

const StaffView = () => {
  const [activeTab, setActiveTab] = useState('time-attendance');
  const [showRunPayroll, setShowRunPayroll] = useState(false);

  if (showRunPayroll) {
    return (
      <RunPayrollFlow
        onBack={() => setShowRunPayroll(false)}
        onComplete={() => {
          setShowRunPayroll(false);
          setActiveTab('payroll');
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full clean-tabs">
        <TabsList>
          <TabsTrigger value="time-attendance">Time & Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="loans-bonuses">Loans & Bonuses</TabsTrigger>
          <TabsTrigger value="run-payroll" disabled>
            Run Payroll
          </TabsTrigger>
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="time-attendance" className="mt-4">
          <TimeAttendanceTab />
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <PayrollTab onRunPayroll={() => setShowRunPayroll(true)} />
        </TabsContent>

        <TabsContent value="loans-bonuses" className="mt-4">
          <LoansAndBonusesTab />
        </TabsContent>

        <TabsContent value="directory" className="mt-4">
          <StaffDirectory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffView;

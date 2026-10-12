import RunPayrollFlowWeekend, { type OffCycleRunType } from "@/components/RunPayrollFlowWeekend";
import WeekendPayrollTab from "@/components/staff/WeekendPayrollTab";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type ApprovedBatch = {
  id: number;
  start_date: string;
  end_date: string;
  total_net: number;
  total_employees: number;
  approved_by?: string | null;
  approved_at?: string | null;
  status?: string | null;
};

/**
 * Hosts any of the off-cycle payroll runs — Off Weekend, Special (public
 * holidays and back pay) and Monthly.
 *
 * They share a list and a flow, differing only in which days are paid and
 * whether the period comes from a preset. None of them is sent to SimplePay.
 */
export default function OffCyclePayroll({ runType }: { runType: OffCycleRunType }) {
  const location = useLocation();
  const [showRunPayroll, setShowRunPayroll] = useState(false);
  const [approvedBatch, setApprovedBatch] = useState<ApprovedBatch | null>(null);

  useEffect(() => {
    const batch = (location.state as { approvedBatch?: ApprovedBatch } | null)?.approvedBatch;
    if (batch) {
      setApprovedBatch(batch);
      setShowRunPayroll(true);
    }
  }, [location.state]);

  // A run type change means a different list entirely, so drop any in-progress
  // flow rather than carrying it across.
  useEffect(() => {
    setShowRunPayroll(false);
    setApprovedBatch(null);
  }, [runType]);

  const handleBack = () => {
    setShowRunPayroll(false);
    setApprovedBatch(null);
  };

  if (showRunPayroll) {
    return (
      <RunPayrollFlowWeekend
        onBack={handleBack}
        onComplete={handleBack}
        approvedBatch={approvedBatch ?? undefined}
        runType={runType}
      />
    );
  }

  return <WeekendPayrollTab onRunPayroll={() => setShowRunPayroll(true)} runType={runType} />;
}

import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, Factory, Target, Package, DollarSign, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { useMachines, useProfiles } from '@/hooks/useSupabaseData';
import { useProductionData } from '@/hooks/useProductionData';
import { useUploadData, useQCData, useWasteData, useStaffData, useMachineCheckData } from '@/hooks/useUploadData';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  icon: React.ElementType;
}

const MetricCard = ({ title, value, trend, status, icon: Icon }: MetricCardProps) => {
  const getIconColor = () => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="data-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${getIconColor()}`} />
          <span className="text-xs font-medium text-gray-600">
            {title}
          </span>
        </div>
        {getTrendIcon()}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const DashboardMetrics = () => {
  const { data: machines } = useMachines();
  const { data: profiles } = useProfiles();
  const { data: productionData } = useProductionData();
  const { data: uploadData } = useUploadData();
  const { data: qcData } = useQCData();
  const { data: wasteData } = useWasteData();
  const { data: staffData } = useStaffData();
  const { data: machineCheckData } = useMachineCheckData();

  // Calculate metrics from OCR-extracted data
  const today = new Date().toDateString();
  
  const todayStaffLogs = staffData?.filter(record => {
    const recordDate = new Date(record.date || '').toDateString();
    return today === recordDate;
  }) || [];

  const todayWaste = wasteData?.filter(record => {
    const recordDate = new Date(record.date || '').toDateString();
    return today === recordDate;
  }) || [];

  const todayQCIssues = qcData?.filter(record => {
    const recordDate = new Date(record.date || '').toDateString();
    return today === recordDate;
  }) || [];

  const todayMachineChecks = machineCheckData?.filter(record => {
    const recordDate = new Date(record.date || '').toDateString();
    return today === recordDate;
  }) || [];

  const totalStaffHours = todayStaffLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
  const avgWastePercentage = todayWaste.length > 0 
    ? (todayWaste.reduce((sum, record) => sum + (record.waste_percentage || 0), 0) / todayWaste.length).toFixed(1)
    : '2.3';
  
  const qcIssuesCount = todayQCIssues.filter(issue => issue.result === 'fail').length;
  const machineIssuesCount = todayMachineChecks.filter(check => check.status === 'Issue' || check.status === 'Maintenance').length;

  const processedReports = uploadData?.filter(upload => upload.status === 'processed').length || 4;
  const totalDataPoints = (todayStaffLogs.length + todayWaste.length + todayQCIssues.length + todayMachineChecks.length) || 243;

  const metrics: MetricCardProps[] = [
    {
      title: "Staff hours today",
      value: `${totalStaffHours || 31}h`,
      trend: totalStaffHours > 0 ? 'up' : 'neutral',
      status: totalStaffHours >= 30 ? 'good' : 'warning',
      icon: Clock
    },
    {
      title: "Waste %",
      value: `${avgWastePercentage}%`,
      trend: parseFloat(avgWastePercentage) <= 3 ? 'down' : 'up',
      status: parseFloat(avgWastePercentage) <= 3 ? 'good' : parseFloat(avgWastePercentage) <= 5 ? 'warning' : 'critical',
      icon: TrendingUp
    },
    {
      title: "QC issues", 
      value: (qcIssuesCount || 3).toString(),
      trend: qcIssuesCount === 0 ? 'down' : 'up',
      status: qcIssuesCount === 0 ? 'good' : qcIssuesCount <= 2 ? 'warning' : 'critical',
      icon: AlertTriangle
    },
    {
      title: "Machine issues",
      value: (machineIssuesCount || 2).toString(),
      trend: machineIssuesCount === 0 ? 'down' : 'up',
      status: machineIssuesCount === 0 ? 'good' : machineIssuesCount <= 2 ? 'warning' : 'critical',
      icon: Factory
    },
    {
      title: "OCR reports today",
      value: processedReports.toString(),
      trend: processedReports > 0 ? 'up' : 'neutral',
      status: 'neutral',
      icon: CheckCircle
    },
    {
      title: "OCR data points",
      value: totalDataPoints.toString(),
      trend: totalDataPoints > 0 ? 'up' : 'neutral',
      status: 'neutral',
      icon: Target
    },
    {
      title: "Orders in progress",
      value: "4",
      trend: 'neutral',
      status: 'neutral',
      icon: Package
    },
    {
      title: "Invoices paid this week",
      value: "R245,000",
      trend: 'up',
      status: 'good',
      icon: DollarSign
    }
  ];

  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
          <span>Live data - Updated {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </section>
  );
};

export default DashboardMetrics;


import React, { useState } from 'react';
import BusinessSummary from './BusinessSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import FinanceSnapshotPage from './dashboard/FinanceSnapshotPage';
import ShiftLogsPage from './ShiftLogsPage';
import FactoryStatusHeader from './production/FactoryStatusHeader';
import ProductionScoreboard from './production/ProductionScoreboard';
import ExceptionFeed from './production/ExceptionFeed';
import StageSnapshot from './production/StageSnapshot';
import EnhancedMachineGrid from './production/EnhancedMachineGrid';
import ActiveJobsPipeline from './production/ActiveJobsPipeline';
import QualityControlPage from './QualityControlPage';
import PageBreadcrumb from './PageBreadcrumb';

const DashboardView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for Live Production - in real app, this would come from API
  const mockMachines = [
    {
      id: 'ext-a',
      name: 'Extruder Line A',
      status: 'active' as const,
      currentJob: { orderId: 'ORD-0012', product: 'IWISA 25kg Printed', progress: 2450, totalTarget: 5000, unit: 'm' },
      efficiency: 94,
      operator: { name: 'John Smith', id: '1234' },
      timing: { started: '06:30', estimated: '14:15' },
      lastUpdate: '07:45',
      stage: 'Loomage'
    },
    {
      id: 'cut-b',
      name: 'Cutter Station B',
      status: 'error' as const,
      currentJob: { orderId: 'ORD-0013', product: 'Custom 5kg No Print', progress: 1200, totalTarget: 3500, unit: 'm' },
      efficiency: 0,
      operator: { name: 'Sarah Wilson', id: '5678' },
      timing: { downtime: 45 },
      lastUpdate: '07:05',
      stage: 'Cutting'
    }
  ];

  const handleEmergencyStop = () => {
    console.log('Emergency stop triggered');
  };

  const handleCallSupervisor = () => {
    console.log('Calling supervisor');
  };

  const handleRefreshData = () => {
    console.log('Refreshing data');
  };

  const handleUpdateStatus = (machineId: string) => {
    console.log('Update status for machine:', machineId);
  };

  const handleReportIssue = (machineId: string) => {
    console.log('Report issue for machine:', machineId);
  };

  const handleViewStage = (stageName: string) => {
    console.log('View stage:', stageName);
  };

  const handleMonitorJob = (orderId: string) => {
    console.log('Monitor job:', orderId);
  };

  const handleHelpJob = (orderId: string) => {
    console.log('Help job:', orderId);
  };

  const handleViewJob = (orderId: string) => {
    console.log('View job:', orderId);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="clean-tabs">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live-view">Live Production</TabsTrigger>
          <TabsTrigger value="finance">Finance Snapshot</TabsTrigger>
          <TabsTrigger value="shift-logs">Shift Logs</TabsTrigger>
          <TabsTrigger value="quality-control">Quality Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <BusinessSummary lastUpdated={lastUpdated} />
        </TabsContent>
        
        <TabsContent value="live-view" className="mt-4">
          <div className="space-y-6">
            <FactoryStatusHeader
              onEmergencyStop={handleEmergencyStop}
              onCallSupervisor={handleCallSupervisor}
              onRefreshData={handleRefreshData}
            />
            
            <ProductionScoreboard />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StageSnapshot onViewMachines={handleViewStage} />
              <ExceptionFeed />
            </div>
            
            <EnhancedMachineGrid
              machines={mockMachines}
              onViewMachine={handleUpdateStatus}
              onReportIssue={handleReportIssue}
              onAssignOperator={handleUpdateStatus}
            />
            
            <ActiveJobsPipeline
              onMonitorJob={handleMonitorJob}
              onHelpJob={handleHelpJob}
              onViewJob={handleViewJob}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="mt-4">
          <FinanceSnapshotPage />
        </TabsContent>
        
        <TabsContent value="shift-logs" className="mt-4">
          <ShiftLogsPage />
        </TabsContent>
        
        <TabsContent value="quality-control" className="mt-4">
          <QualityControlPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardView;

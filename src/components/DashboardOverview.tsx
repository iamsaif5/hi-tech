
import React from 'react';
import DashboardMetrics from './DashboardMetrics';
import DashboardAISummary from './DashboardAISummary';
import OCRDataSummary from './OCRDataSummary';

interface DashboardOverviewProps {
  lastUpdated: Date;
}

const DashboardOverview = ({ lastUpdated }: DashboardOverviewProps) => {
  return (
    <div className="space-y-4">
      {/* High-Level Metrics */}
      <DashboardMetrics />
      
      {/* Daily AI Summary Feed */}
      <DashboardAISummary />
      
      {/* OCR + Upload Summary */}
      <OCRDataSummary lastUpdated={lastUpdated} />
    </div>
  );
};

export default DashboardOverview;

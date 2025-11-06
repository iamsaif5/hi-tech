import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionCalendar from './operations/ProductionCalendar';
import JobStatus from './operations/JobStatus';
import InventoryOverview from './operations/InventoryOverview';

const OperationsView = () => {
  const [activeTab, setActiveTab] = useState('production-calendar');

  return (
    <div className="space-y-4">
      {/* Full-width separator line behind tabs */}
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-muted"></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full clean-tabs relative">
          <TabsList>
            <TabsTrigger value="production-calendar">Production Calendar</TabsTrigger>
            <TabsTrigger value="job-status">Job Status</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4">
        {activeTab === 'production-calendar' && <ProductionCalendar />}
        {activeTab === 'job-status' && <JobStatus />}
        {activeTab === 'inventory' && <InventoryOverview />}
      </div>
    </div>
  );
};

export default OperationsView;
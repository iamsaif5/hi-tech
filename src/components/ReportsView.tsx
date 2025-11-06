import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIOverviewTab } from './reports/AIOverviewTab';
import { StandardReportsTab } from './reports/StandardReportsTab';
import { InteractiveBuilderTab } from './reports/InteractiveBuilderTab';

const ReportsView = () => {
  const [activeTab, setActiveTab] = useState('ai-overview');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full clean-tabs">
        <TabsList>
          <TabsTrigger value="ai-overview">AI Overview</TabsTrigger>
          <TabsTrigger value="standard-reports">Standard Reports</TabsTrigger>
          <TabsTrigger value="interactive-builder">Interactive Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-overview" className="mt-4">
          <AIOverviewTab />
        </TabsContent>

        <TabsContent value="standard-reports" className="mt-4">
          <StandardReportsTab />
        </TabsContent>

        <TabsContent value="interactive-builder" className="mt-4">
          <InteractiveBuilderTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsView;
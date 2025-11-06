import React, { useState } from 'react';
import ProductionKanban from './operations/ProductionKanban';
import JobListView from './operations/JobListView';
import ManufacturingOrders from './operations/ManufacturingOrders';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ProductionView = () => {
  const [activeView, setActiveView] = useState('production-planning');

  return (
    <div className="space-y-6">
      <ToggleGroup type="single" value={activeView} onValueChange={setActiveView} className="justify-start">
        <ToggleGroupItem value="production-planning" variant="outline">
          Production Planning
        </ToggleGroupItem>
        <ToggleGroupItem value="job-list-view" variant="outline">
          Job List View
        </ToggleGroupItem>
        <ToggleGroupItem value="manufacturing-orders" variant="outline">
          Manufacturing Orders
        </ToggleGroupItem>
      </ToggleGroup>

      {activeView === 'production-planning' && <ProductionKanban />}
      {activeView === 'job-list-view' && <JobListView />}
      {activeView === 'manufacturing-orders' && <ManufacturingOrders />}
    </div>
  );
};

export default ProductionView;

import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import OverviewTab from './inventory/OverviewTab';
import RawMaterialsTab from './inventory/RawMaterialsTab';
import ClothStockTab from './inventory/ClothStockTab';
import FinishedGoodsTab from './inventory/FinishedGoodsTab';
import ReorderAlertsTab from './inventory/ReorderAlertsTab';
import StockMovementsTab from './inventory/StockMovementsTab';

const InventoryView = () => {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="space-y-4">
      <ToggleGroup type="single" value={activeView} onValueChange={setActiveView} className="justify-start">
        <ToggleGroupItem value="overview" variant="outline">
          Overview
        </ToggleGroupItem>
        <ToggleGroupItem value="raw-materials" variant="outline">
          Raw Materials
        </ToggleGroupItem>
        <ToggleGroupItem value="cloth-stock" variant="outline">
          Cloth Stock
        </ToggleGroupItem>
        <ToggleGroupItem value="finished-goods" variant="outline">
          Finished Goods
        </ToggleGroupItem>
        <ToggleGroupItem value="reorder-alerts" variant="outline">
          Reorder Alerts
        </ToggleGroupItem>
        <ToggleGroupItem value="stock-movements" variant="outline">
          Stock Movements
        </ToggleGroupItem>
      </ToggleGroup>

      {activeView === 'overview' && <OverviewTab />}
      {activeView === 'raw-materials' && <RawMaterialsTab />}
      {activeView === 'cloth-stock' && <ClothStockTab />}
      {activeView === 'finished-goods' && <FinishedGoodsTab />}
      {activeView === 'reorder-alerts' && <ReorderAlertsTab />}
      {activeView === 'stock-movements' && <StockMovementsTab />}
    </div>
  );
};

export default InventoryView;

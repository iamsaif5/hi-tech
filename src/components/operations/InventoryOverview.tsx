import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Package, 
  ShoppingCart, 
  TrendingDown,
  TrendingUp,
  Eye,
  Plus,
  Filter
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InventoryItem {
  id: string;
  name: string;
  category: 'raw-material' | 'finished-goods' | 'packaging';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  status: 'in-stock' | 'low' | 'critical' | 'not-available';
  lastRestocked: string;
  supplier: string;
  unitCost: number;
  linkedMOs: string[];
  demandForecast: number;
}

const InventoryOverview = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockInventory: InventoryItem[] = [
    {
      id: '1',
      name: 'HDPE Resin - White',
      category: 'raw-material',
      currentStock: 2500,
      minStock: 1000,
      maxStock: 5000,
      unit: 'kg',
      status: 'in-stock',
      lastRestocked: '2025-01-03',
      supplier: 'Sasol Polymers',
      unitCost: 18.50,
      linkedMOs: ['MO-2025-001', 'MO-2025-002'],
      demandForecast: 1200
    },
    {
      id: '2',
      name: 'HDPE Resin - Clear',
      category: 'raw-material',
      currentStock: 800,
      minStock: 1000,
      maxStock: 4000,
      unit: 'kg',
      status: 'low',
      lastRestocked: '2024-12-28',
      supplier: 'Sasol Polymers',
      unitCost: 19.00,
      linkedMOs: ['MO-2025-003'],
      demandForecast: 600
    },
    {
      id: '3',
      name: 'Printing Ink - Black',
      category: 'raw-material',
      currentStock: 150,
      minStock: 200,
      maxStock: 800,
      unit: 'kg',
      status: 'critical',
      lastRestocked: '2024-12-20',
      supplier: 'Sun Chemical',
      unitCost: 45.00,
      linkedMOs: ['MO-2025-001'],
      demandForecast: 80
    },
    {
      id: '4',
      name: 'IWISA 25kg Bags',
      category: 'finished-goods',
      currentStock: 3200,
      minStock: 1500,
      maxStock: 8000,
      unit: 'units',
      status: 'in-stock',
      lastRestocked: '2025-01-06',
      supplier: 'Internal Production',
      unitCost: 12.50,
      linkedMOs: [],
      demandForecast: 1000
    },
    {
      id: '5',
      name: 'Cardboard Boxes - Large',
      category: 'packaging',
      currentStock: 0,
      minStock: 500,
      maxStock: 2000,
      unit: 'units',
      status: 'not-available',
      lastRestocked: '2024-12-15',
      supplier: 'Packaging Solutions',
      unitCost: 8.00,
      linkedMOs: ['MO-2025-002', 'MO-2025-003'],
      demandForecast: 300
    },
    {
      id: '6',
      name: 'Lion 10kg Bags',
      category: 'finished-goods',
      currentStock: 1800,
      minStock: 1000,
      maxStock: 6000,
      unit: 'units',
      status: 'in-stock',
      lastRestocked: '2025-01-05',
      supplier: 'Internal Production',
      unitCost: 8.75,
      linkedMOs: [],
      demandForecast: 800
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'not-available': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevel = (item: InventoryItem) => {
    return Math.round((item.currentStock / item.maxStock) * 100);
  };

  const getCriticalItems = () => {
    return mockInventory.filter(item => item.status === 'critical' || item.status === 'not-available');
  };

  const getLowItems = () => {
    return mockInventory.filter(item => item.status === 'low');
  };

  return (
    <div className="space-y-4">
      {/* Header and Filters - Following Orders page pattern */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Inventory Management</h2>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>

        <Button className="h-10 bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Reorder Materials
        </Button>
      </div>

      <div className="grid grid-cols-10 gap-6">
        {/* Left Column - Main Inventory Table (70%) */}
        <div className="col-span-7 space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Material</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Stock Level</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Unit Cost</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Linked MOs</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInventory.map((item) => (
                    <tr 
                      key={item.id} 
                      className="border-b border-border hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="py-2 px-3">
                        <div className="space-y-1">
                          <span className="text-xs font-medium">{item.name}</span>
                          <div className="text-xs text-muted-foreground">
                            {item.category.replace('-', ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={getStockLevel(item)} className="h-2 w-16" />
                            <span className="text-xs">{getStockLevel(item)}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.currentStock} / {item.maxStock} {item.unit}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-foreground">
                        R{item.unitCost}
                      </td>
                      <td className="py-2 px-3">
                        {item.linkedMOs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.linkedMOs.slice(0, 2).map(mo => (
                              <span key={mo} className="text-xs text-primary hover:text-primary/80 cursor-pointer">
                                {mo}
                              </span>
                            ))}
                            {item.linkedMOs.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{item.linkedMOs.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === 'in-stock' ? 'bg-green-500' :
                            item.status === 'low' ? 'bg-yellow-500' :
                            item.status === 'critical' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}></div>
                          <span className="text-xs font-medium text-foreground">
                            {item.status === 'in-stock' ? 'In Stock' :
                             item.status === 'low' ? 'Low' :
                             item.status === 'critical' ? 'Critical' :
                             'Not Available'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column - Alerts and Actions (30%) */}
        <div className="col-span-3 space-y-4">
          {/* Critical Items Alert */}
          {getCriticalItems().length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {getCriticalItems().length} Critical Items
                </span>
              </div>
              <div className="space-y-1">
                {getCriticalItems().slice(0, 3).map(item => (
                  <div key={item.id} className="text-xs text-muted-foreground">
                    {item.name}
                  </div>
                ))}
              </div>
              <Button size="sm" className="mt-2 h-8 px-6 text-xs bg-green-600 hover:bg-green-700">
                <Plus className="h-3 w-3 mr-1" />
                Order Critical Items
              </Button>
            </div>
          )}

          {/* Low Stock Items */}
          {getLowItems().length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {getLowItems().length} Low Stock Items
                </span>
              </div>
              <div className="space-y-1">
                {getLowItems().slice(0, 3).map(item => (
                  <div key={item.id} className="text-xs text-muted-foreground">
                    {item.name}
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="mt-2 h-8 px-6 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Reorder Items
              </Button>
            </div>
          )}

          {/* Summary Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Items:</span>
              <span className="font-medium">{mockInventory.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">In Stock:</span>
              <span className="font-medium text-green-600">
                {mockInventory.filter(item => item.status === 'in-stock').length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Low Stock:</span>
              <span className="font-medium text-yellow-600">{getLowItems().length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Critical:</span>
              <span className="font-medium text-red-600">{getCriticalItems().length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
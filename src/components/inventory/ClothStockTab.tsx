import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown,
  Search,
  Filter,
  Download
} from 'lucide-react';

const ClothStockTab = () => {
  const clothStock = [
    {
      id: 'CLT-001',
      type: 'Woven PP',
      specification: '120gsm White',
      supplier: 'Textile Suppliers SA',
      currentStock: 2400,
      unit: 'meters',
      reorderLevel: 500,
      maxLevel: 5000,
      lastReceived: '2024-01-10',
      receivedQty: 1500,
      usage7Days: 450,
      projectedDays: 12,
      status: 'adequate',
      location: 'Warehouse A-12'
    },
    {
      id: 'CLT-002', 
      type: 'Laminated PP',
      specification: '140gsm IWISA Print',
      supplier: 'Premium Films Ltd',
      currentStock: 180,
      unit: 'rolls',
      reorderLevel: 50,
      maxLevel: 500,
      lastReceived: '2024-01-05',
      receivedQty: 200,
      usage7Days: 85,
      projectedDays: 2,
      status: 'critical',
      location: 'Warehouse B-05'
    },
    {
      id: 'CLT-003',
      type: 'Non-Woven',
      specification: '80gsm Breathable',
      supplier: 'Industrial Fabrics Co',
      currentStock: 750,
      unit: 'meters',
      reorderLevel: 200,
      maxLevel: 2000,
      lastReceived: '2024-01-12',
      receivedQty: 800,
      usage7Days: 120,
      projectedDays: 15,
      status: 'adequate',
      location: 'Warehouse A-08'
    },
    {
      id: 'CLT-004',
      type: 'BOPP Film',
      specification: '25 micron Clear',
      supplier: 'Plastic Films SA',
      currentStock: 95,
      unit: 'rolls',
      reorderLevel: 30,
      maxLevel: 300,
      lastReceived: '2024-01-08',
      receivedQty: 100,
      usage7Days: 45,
      projectedDays: 5,
      status: 'low',
      location: 'Warehouse C-02'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'low':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'adequate':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const criticalItems = clothStock.filter(item => item.status === 'critical').length;
  const lowItems = clothStock.filter(item => item.status === 'low').length;
  const totalValue = clothStock.reduce((sum, item) => sum + (item.currentStock * 25), 0); // Estimated value

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clothStock.length}</div>
            <p className="text-xs text-muted-foreground">Different cloth types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{lowItems}</div>
            <p className="text-xs text-muted-foreground">Below reorder level</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Stock Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Cloth Stock Inventory
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Type & Specification</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Usage (7 Days)</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clothStock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-muted-foreground">{item.specification}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.supplier}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.currentStock.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress 
                        value={getStockPercentage(item.currentStock, item.maxLevel)} 
                        className="w-16 h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {getStockPercentage(item.currentStock, item.maxLevel)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.usage7Days}</p>
                      <p className="text-sm text-muted-foreground">{item.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={`font-medium ${item.projectedDays <= 3 ? 'text-destructive' : item.projectedDays <= 7 ? 'text-secondary-foreground' : ''}`}>
                        {item.projectedDays}
                      </span>
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.location}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{item.lastReceived}</p>
                      <p className="text-xs text-muted-foreground">+{item.receivedQty} {item.unit}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {criticalItems > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Critical Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clothStock
                .filter(item => item.status === 'critical')
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="font-medium">{item.type} - {item.specification}</p>
                        <p className="text-sm text-muted-foreground">
                          Only {item.projectedDays} days remaining at current usage rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-destructive">{item.currentStock} {item.unit}</p>
                      <p className="text-sm text-muted-foreground">Current stock</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClothStockTab;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  TrendingUp, 
  Truck,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';

const FinishedGoodsTab = () => {
  const finishedGoods = [
    {
      id: 'FG-001',
      productCode: 'IWISA-25KG-P',
      productName: 'IWISA 25kg Printed Bags',
      category: 'Agricultural',
      client: 'IWISA',
      currentStock: 4200,
      unit: 'bags',
      minStock: 1000,
      maxStock: 8000,
      lastProduced: '2024-01-15',
      producedQty: 2500,
      pending: 0,
      shipped: 1800,
      value: 168000,
      status: 'adequate',
      location: 'Warehouse FG-A'
    },
    {
      id: 'FG-002',
      productCode: 'CUST-5KG-NP',
      productName: 'Custom 5kg No Print',
      category: 'Food Grade',
      client: 'Custom Foods',
      currentStock: 850,
      unit: 'bags',
      minStock: 500,
      maxStock: 3000,
      lastProduced: '2024-01-14',
      producedQty: 1200,
      pending: 500,
      shipped: 950,
      value: 34000,
      status: 'shipping',
      location: 'Warehouse FG-B'
    },
    {
      id: 'FG-003',
      productCode: 'LION-10KG',
      productName: 'Lion Group 10kg Bags',
      category: 'Industrial',
      client: 'Lion Group',
      currentStock: 450,
      unit: 'bags',
      minStock: 800,
      maxStock: 4000,
      lastProduced: '2024-01-12',
      producedQty: 800,
      pending: 1500,
      shipped: 350,
      value: 22500,
      status: 'low',
      location: 'Warehouse FG-A'
    },
    {
      id: 'FG-004',
      productCode: 'MEGA-IND',
      productName: 'MegaBag Industrial',
      category: 'Heavy Duty',
      client: 'Industrial Corp',
      currentStock: 1200,
      unit: 'bags',
      minStock: 300,
      maxStock: 2500,
      lastProduced: '2024-01-13',
      producedQty: 800,
      pending: 0,
      shipped: 400,
      value: 72000,
      status: 'adequate',
      location: 'Warehouse FG-C'
    },
    {
      id: 'FG-005',
      productCode: 'FEED-50KG',
      productName: 'Feed Bags 50kg',
      category: 'Agricultural',
      client: 'Feed Masters',
      currentStock: 180,
      unit: 'bags',
      minStock: 500,
      maxStock: 2000,
      lastProduced: '2024-01-10',
      producedQty: 600,
      pending: 800,
      shipped: 420,
      value: 14400,
      status: 'critical',
      location: 'Warehouse FG-B'
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
      case 'shipping':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const totalItems = finishedGoods.length;
  const totalValue = finishedGoods.reduce((sum, item) => sum + item.value, 0);
  const criticalItems = finishedGoods.filter(item => item.status === 'critical').length;
  const shippingItems = finishedGoods.filter(item => item.status === 'shipping').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Different finished goods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Ship</CardTitle>
            <Truck className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">{shippingItems}</div>
            <p className="text-xs text-muted-foreground">Orders ready for dispatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">Below minimum levels</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Finished Goods Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Finished Goods Inventory
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
                <TableHead>Product Code</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Pending Orders</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finishedGoods.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productCode}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.client}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.currentStock.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress 
                        value={getStockPercentage(item.currentStock, item.maxStock)} 
                        className="w-16 h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {getStockPercentage(item.currentStock, item.maxStock)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.pending}</p>
                      <p className="text-sm text-muted-foreground">{item.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">R{item.value.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Truck className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Production and Shipping Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Recent Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finishedGoods.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Last produced: {item.lastProduced}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">+{item.producedQty}</p>
                    <p className="text-sm text-muted-foreground">{item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finishedGoods
                .filter(item => item.shipped > 0)
                .slice(0, 3)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Client: {item.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent-foreground">{item.shipped}</p>
                      <p className="text-sm text-muted-foreground">shipped</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinishedGoodsTab;
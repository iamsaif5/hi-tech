import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

const ReorderAlertsTab = () => {
  const reorderAlerts = [
    {
      id: 'RA-001',
      itemCode: 'CLT-002',
      itemName: 'Laminated PP - IWISA Print',
      category: 'Raw Materials',
      currentStock: 180,
      reorderLevel: 500,
      unit: 'rolls',
      daysRemaining: 2,
      suggestedOrder: 1000,
      supplier: 'Premium Films Ltd',
      leadTime: 7,
      lastOrderDate: '2024-01-05',
      priority: 'critical',
      status: 'pending',
      estimatedCost: 45000
    },
    {
      id: 'RA-002',
      itemCode: 'FG-005',
      itemName: 'Feed Bags 50kg',
      category: 'Finished Goods',
      currentStock: 180,
      reorderLevel: 500,
      unit: 'bags',
      daysRemaining: 3,
      suggestedOrder: 800,
      supplier: 'Internal Production',
      leadTime: 2,
      lastOrderDate: '2024-01-10',
      priority: 'critical',
      status: 'pending',
      estimatedCost: 14400
    },
    {
      id: 'RA-003',
      itemCode: 'CLT-004',
      itemName: 'BOPP Film - 25 micron Clear',
      category: 'Raw Materials',
      currentStock: 95,
      reorderLevel: 300,
      unit: 'rolls',
      daysRemaining: 5,
      suggestedOrder: 500,
      supplier: 'Plastic Films SA',
      leadTime: 5,
      lastOrderDate: '2024-01-08',
      priority: 'high',
      status: 'pending',
      estimatedCost: 28500
    },
    {
      id: 'RA-004',
      itemCode: 'INK-BLK',
      itemName: 'Printing Ink - Black',
      category: 'Consumables',
      currentStock: 12,
      reorderLevel: 25,
      unit: 'cartridges',
      daysRemaining: 4,
      suggestedOrder: 50,
      supplier: 'Ink Solutions Ltd',
      leadTime: 3,
      lastOrderDate: '2024-01-12',
      priority: 'high',
      status: 'ordered',
      estimatedCost: 8500
    },
    {
      id: 'RA-005',
      itemCode: 'ADH-001',
      itemName: 'Adhesive Compound',
      category: 'Raw Materials',
      currentStock: 45,
      reorderLevel: 100,
      unit: 'kg',
      daysRemaining: 8,
      suggestedOrder: 200,
      supplier: 'Chemical Supplies SA',
      leadTime: 10,
      lastOrderDate: '2024-01-01',
      priority: 'medium',
      status: 'pending',
      estimatedCost: 12000
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'medium':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'ordered':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'received':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStockPercentage = (current: number, reorder: number) => {
    return Math.max(0, Math.min(100, Math.round((current / reorder) * 100)));
  };

  const criticalAlerts = reorderAlerts.filter(alert => alert.priority === 'critical').length;
  const pendingOrders = reorderAlerts.filter(alert => alert.status === 'pending').length;
  const totalValue = reorderAlerts.reduce((sum, alert) => sum + alert.estimatedCost, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reorderAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Active reorder alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total reorder cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Critical Reorder Alerts - Immediate Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reorderAlerts
                .filter(alert => alert.priority === 'critical')
                .map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="font-medium">{alert.itemName}</p>
                        <p className="text-sm text-muted-foreground">
                          Only {alert.daysRemaining} days remaining at current usage
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="ml-2">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Order Now
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Reorder Alerts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Reorder Alerts Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark All Ordered
              </Button>
              <Button size="sm">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Bulk Order
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Suggested Order</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Est. Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reorderAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.itemCode}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.itemName}</p>
                      <p className="text-sm text-muted-foreground">Last order: {alert.lastOrderDate}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{alert.category}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.currentStock}</p>
                      <p className="text-sm text-muted-foreground">{alert.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress 
                        value={getStockPercentage(alert.currentStock, alert.reorderLevel)} 
                        className="w-16 h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {getStockPercentage(alert.currentStock, alert.reorderLevel)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className={`font-medium ${alert.daysRemaining <= 3 ? 'text-destructive' : alert.daysRemaining <= 7 ? 'text-secondary-foreground' : ''}`}>
                        {alert.daysRemaining}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.suggestedOrder}</p>
                      <p className="text-sm text-muted-foreground">{alert.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{alert.supplier}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{alert.leadTime}</span>
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">R{alert.estimatedCost.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {alert.status === 'pending' && (
                        <Button size="sm">
                          <ShoppingCart className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReorderAlertsTab;
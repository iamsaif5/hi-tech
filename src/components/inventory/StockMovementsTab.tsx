import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUp, 
  ArrowDown, 
  Package, 
  TrendingUp,
  Filter,
  Search,
  Download,
  Calendar
} from 'lucide-react';

const StockMovementsTab = () => {
  const [activeMovementTab, setActiveMovementTab] = useState('recent');

  const stockMovements = [
    {
      id: 'SM-001',
      timestamp: '2024-01-15 14:30',
      itemCode: 'CLT-001',
      itemName: 'Woven PP - 120gsm White',
      movementType: 'in',
      quantity: 1500,
      unit: 'meters',
      reason: 'Purchase Receipt',
      reference: 'PO-2024-001',
      location: 'Warehouse A-12',
      operator: 'John Doe',
      cost: 37500,
      runningBalance: 3900
    },
    {
      id: 'SM-002',
      timestamp: '2024-01-15 11:15',
      itemCode: 'FG-001',
      itemName: 'IWISA 25kg Printed Bags',
      movementType: 'out',
      quantity: 1800,
      unit: 'bags',
      reason: 'Customer Shipment',
      reference: 'SO-2024-012',
      location: 'Warehouse FG-A',
      operator: 'Sarah Wilson',
      cost: 72000,
      runningBalance: 4200
    },
    {
      id: 'SM-003',
      timestamp: '2024-01-15 09:45',
      itemCode: 'CLT-002',
      itemName: 'Laminated PP - IWISA Print',
      movementType: 'out',
      quantity: 85,
      unit: 'rolls',
      reason: 'Production Use',
      reference: 'MO-001',
      location: 'Production Floor',
      operator: 'Production Team',
      cost: 21250,
      runningBalance: 180
    },
    {
      id: 'SM-004',
      timestamp: '2024-01-15 08:20',
      itemCode: 'FG-002',
      itemName: 'Custom 5kg No Print',
      movementType: 'in',
      quantity: 1200,
      unit: 'bags',
      reason: 'Production Complete',
      reference: 'MO-002',
      location: 'Warehouse FG-B',
      operator: 'Production Team',
      cost: 48000,
      runningBalance: 2050
    },
    {
      id: 'SM-005',
      timestamp: '2024-01-14 16:30',
      itemCode: 'INK-BLK',
      itemName: 'Printing Ink - Black',
      movementType: 'out',
      quantity: 12,
      unit: 'cartridges',
      reason: 'Production Use',
      reference: 'MO-003',
      location: 'Printing Section',
      operator: 'David Miller',
      cost: 2040,
      runningBalance: 12
    },
    {
      id: 'SM-006',
      timestamp: '2024-01-14 14:15',
      itemCode: 'FG-005',
      itemName: 'Feed Bags 50kg',
      movementType: 'out',
      quantity: 420,
      unit: 'bags',
      reason: 'Customer Shipment',
      reference: 'SO-2024-008',
      location: 'Warehouse FG-B',
      operator: 'Mike Johnson',
      cost: 33600,
      runningBalance: 180
    },
    {
      id: 'SM-007',
      timestamp: '2024-01-14 10:00',
      itemCode: 'ADH-001',
      itemName: 'Adhesive Compound',
      movementType: 'adjustment',
      quantity: -15,
      unit: 'kg',
      reason: 'Stock Count Adjustment',
      reference: 'ADJ-001',
      location: 'Warehouse C-05',
      operator: 'Inventory Team',
      cost: 0,
      runningBalance: 45
    }
  ];

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'out':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'adjustment':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowUp className="h-3 w-3" />;
      case 'out':
        return <ArrowDown className="h-3 w-3" />;
      case 'adjustment':
        return <Package className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'Customer Shipment':
        return 'text-accent-foreground';
      case 'Production Use':
        return 'text-secondary-foreground';
      case 'Production Complete':
        return 'text-primary';
      case 'Purchase Receipt':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  // Summary calculations
  const totalInValue = stockMovements
    .filter(m => m.movementType === 'in')
    .reduce((sum, m) => sum + m.cost, 0);
  
  const totalOutValue = stockMovements
    .filter(m => m.movementType === 'out')
    .reduce((sum, m) => sum + m.cost, 0);

  const totalMovements = stockMovements.length;
  const netValue = totalInValue - totalOutValue;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovements}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock In</CardTitle>
            <ArrowUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R{totalInValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Received value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
            <ArrowDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">R{totalOutValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Issued value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netValue >= 0 ? 'text-primary' : 'text-destructive'}`}>
              R{Math.abs(netValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {netValue >= 0 ? 'Net increase' : 'Net decrease'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Movement Tabs */}
      <Tabs value={activeMovementTab} onValueChange={setActiveMovementTab} className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Movements</TabsTrigger>
          <TabsTrigger value="in">Stock In</TabsTrigger>
          <TabsTrigger value="out">Stock Out</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  All Stock Movements
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date Range
                  </Button>
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
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="text-sm">{movement.timestamp}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{movement.itemCode}</p>
                          <p className="text-sm text-muted-foreground">{movement.itemName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMovementTypeColor(movement.movementType)}>
                          {getMovementIcon(movement.movementType)}
                          <span className="ml-1">{movement.movementType.toUpperCase()}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className={`font-medium ${movement.movementType === 'out' || movement.quantity < 0 ? 'text-destructive' : 'text-primary'}`}>
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{movement.unit}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${getReasonColor(movement.reason)}`}>
                          {movement.reason}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{movement.reference}</TableCell>
                      <TableCell className="text-sm">{movement.location}</TableCell>
                      <TableCell className="text-sm">{movement.operator}</TableCell>
                      <TableCell>
                        <p className="font-medium">R{movement.cost.toLocaleString()}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{movement.runningBalance.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{movement.unit}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-primary" />
                Stock Receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements
                    .filter(movement => movement.movementType === 'in')
                    .map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">{movement.timestamp}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{movement.itemCode}</p>
                            <p className="text-sm text-muted-foreground">{movement.itemName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-primary">+{movement.quantity.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{movement.unit}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{movement.reason}</TableCell>
                        <TableCell className="text-sm font-medium">{movement.reference}</TableCell>
                        <TableCell>
                          <p className="font-medium text-primary">R{movement.cost.toLocaleString()}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="out" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-destructive" />
                Stock Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements
                    .filter(movement => movement.movementType === 'out')
                    .map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">{movement.timestamp}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{movement.itemCode}</p>
                            <p className="text-sm text-muted-foreground">{movement.itemName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-destructive">-{movement.quantity.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{movement.unit}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{movement.reason}</TableCell>
                        <TableCell className="text-sm font-medium">{movement.reference}</TableCell>
                        <TableCell>
                          <p className="font-medium text-destructive">R{movement.cost.toLocaleString()}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4 text-secondary-foreground" />
                Stock Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Operator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements
                    .filter(movement => movement.movementType === 'adjustment')
                    .map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">{movement.timestamp}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{movement.itemCode}</p>
                            <p className="text-sm text-muted-foreground">{movement.itemName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={`font-medium ${movement.quantity < 0 ? 'text-destructive' : 'text-primary'}`}>
                              {movement.quantity > 0 ? '+' : ''}{movement.quantity.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">{movement.unit}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{movement.reason}</TableCell>
                        <TableCell className="text-sm font-medium">{movement.reference}</TableCell>
                        <TableCell className="text-sm">{movement.operator}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockMovementsTab;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye,
  Package,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const InventoryProductsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [factoryFilter, setFactoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');

  const products = [
    {
      id: 'SKU-001',
      sku: 'IWISA-25KG-P',
      productName: 'IWISA 25kg Printed',
      category: 'Woven Bags',
      type: 'PP Woven',
      unitPrice: 12.50,
      totalInventory: 15420,
      johannesburg: 8500,
      capeTown: 4200,
      durban: 2720,
      activeOrders: 3,
      reservedStock: 2400,
      availableStock: 13020,
      reorderLevel: 5000,
      stockStatus: 'Good',
      lastUpdated: '2025-01-06 14:30'
    },
    {
      id: 'SKU-002',
      sku: 'LION-10KG-W',
      productName: 'Lion 10kg White',
      category: 'Woven Bags',
      type: 'PP Woven',
      unitPrice: 8.75,
      totalInventory: 8940,
      johannesburg: 5200,
      capeTown: 2340,
      durban: 1400,
      activeOrders: 2,
      reservedStock: 1800,
      availableStock: 7140,
      reorderLevel: 4000,
      stockStatus: 'Good',
      lastUpdated: '2025-01-06 13:45'
    },
    {
      id: 'SKU-003',
      sku: 'CUSTOM-5KG-NP',
      productName: 'Custom 5kg No Print',
      category: 'Woven Bags',
      type: 'PP Woven',
      unitPrice: 6.25,
      totalInventory: 3200,
      johannesburg: 1800,
      capeTown: 900,
      durban: 500,
      activeOrders: 1,
      reservedStock: 800,
      availableStock: 2400,
      reorderLevel: 3500,
      stockStatus: 'Low',
      lastUpdated: '2025-01-06 12:20'
    },
    {
      id: 'SKU-004',
      sku: 'TIGER-20KG-P',
      productName: 'Tiger 20kg Printed',
      category: 'Woven Bags',
      type: 'PP Woven',
      unitPrice: 10.50,
      totalInventory: 12800,
      johannesburg: 7200,
      capeTown: 3600,
      durban: 2000,
      activeOrders: 4,
      reservedStock: 3200,
      availableStock: 9600,
      reorderLevel: 4000,
      stockStatus: 'Good',
      lastUpdated: '2025-01-06 11:15'
    },
    {
      id: 'SKU-005',
      sku: 'FREEDOM-15KG-W',
      productName: 'Freedom 15kg White',
      category: 'Woven Bags',
      type: 'PP Woven',
      unitPrice: 9.25,
      totalInventory: 1800,
      johannesburg: 1200,
      capeTown: 400,
      durban: 200,
      activeOrders: 2,
      reservedStock: 1500,
      availableStock: 300,
      reorderLevel: 2500,
      stockStatus: 'Critical',
      lastUpdated: '2025-01-06 10:30'
    }
  ];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case 'Good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Low': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
    const stockStatusMatch = stockStatusFilter === 'all' || product.stockStatus === stockStatusFilter;
    const searchMatch = searchTerm === '' || 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && stockStatusMatch && searchMatch;
  });

  // Summary metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stockStatus === 'Low' || p.stockStatus === 'Critical').length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.totalInventory * p.unitPrice), 0);
  const totalActiveOrders = products.reduce((sum, p) => sum + p.activeOrders, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-medium text-muted-foreground">Total Products</h3>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{totalProducts}</p>
            <p className="text-xs text-muted-foreground">Active SKUs</p>
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <h3 className="text-xs font-medium text-muted-foreground">Low Stock Alerts</h3>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{lowStockProducts}</p>
            <p className="text-xs text-orange-600">Requires attention</p>
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-green-600" />
            <h3 className="text-xs font-medium text-muted-foreground">Inventory Value</h3>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">R {totalInventoryValue.toLocaleString()}</p>
            <p className="text-xs text-green-600">Current stock value</p>
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-medium text-muted-foreground">Active Orders</h3>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{totalActiveOrders}</p>
            <p className="text-xs text-blue-600">In production</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Product Inventory Management</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search products, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 w-64 text-xs"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Woven Bags">Woven Bags</SelectItem>
                <SelectItem value="FIBC Bags">FIBC Bags</SelectItem>
                <SelectItem value="Liners">Liners</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={factoryFilter} onValueChange={setFactoryFilter}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Factory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Factories</SelectItem>
                <SelectItem value="johannesburg">Johannesburg</SelectItem>
                <SelectItem value="cape-town">Cape Town</SelectItem>
                <SelectItem value="durban">Durban</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Product Details</TableHead>
                  <TableHead className="text-xs">Pricing</TableHead>
                  <TableHead className="text-xs">Total Inventory</TableHead>
                  <TableHead className="text-xs">Factory Stock Split</TableHead>
                  <TableHead className="text-xs">Orders & Allocation</TableHead>
                  <TableHead className="text-xs">Stock Status</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                        <Badge variant="outline" className="text-xs">{product.category}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">R {product.unitPrice}</p>
                        <p className="text-xs text-muted-foreground">per unit</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{product.totalInventory.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Available: {product.availableStock.toLocaleString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">JHB:</span>
                          <span className="font-medium">{product.johannesburg.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPT:</span>
                          <span className="font-medium">{product.capeTown.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">DBN:</span>
                          <span className="font-medium">{product.durban.toLocaleString()}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Active Orders: <span className="font-medium">{product.activeOrders}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reserved: <span className="font-medium">{product.reservedStock.toLocaleString()}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reorder Level: <span className="font-medium">{product.reorderLevel.toLocaleString()}</span>
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStockStatusIcon(product.stockStatus)}
                        <Badge className={getStockStatusColor(product.stockStatus)}>
                          {product.stockStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryProductsTab;
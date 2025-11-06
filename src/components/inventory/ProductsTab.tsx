
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Package } from 'lucide-react';

const ProductsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    {
      id: 1,
      name: 'IWISA 25kg Printed',
      sku: 'IWISA25P',
      type: 'Printed Bag',
      unitPrice: 5.10,
      inventory: 14800,
      moq: 1000,
      activeOrders: 3,
      factoryStock: 'Midrand: 6.2k'
    },
    {
      id: 2,
      name: 'Lion 10kg White',
      sku: 'LION10W',
      type: 'Plain Bag',
      unitPrice: 3.85,
      inventory: 9200,
      moq: 500,
      activeOrders: 1,
      factoryStock: 'Germiston: 4k'
    },
    {
      id: 3,
      name: 'Lion 25kg Printed',
      sku: 'LION25P',
      type: 'Printed Bag',
      unitPrice: 5.50,
      inventory: 8600,
      moq: 1000,
      activeOrders: 2,
      factoryStock: 'Boksburg: 3.1k'
    },
    {
      id: 4,
      name: 'Custom 50kg Industrial',
      sku: 'CUST50I',
      type: 'Industrial Bag',
      unitPrice: 12.75,
      inventory: 2400,
      moq: 200,
      activeOrders: 1,
      factoryStock: 'Midrand: 1.2k'
    }
  ];

  const filteredProducts = products.filter(product =>
    searchTerm === '' ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.inventory < p.moq * 2).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.inventory * p.unitPrice), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Total products</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{totalProducts}</p>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-600">Low stock items</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{lowStockProducts}</p>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Total value</span>
          </div>
          <p className="text-base font-semibold text-gray-900">R{totalInventoryValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products Inventory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Active Orders</TableHead>
                <TableHead>Factory Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.sku}</Badge>
                  </TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>R{product.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.inventory.toLocaleString()}</span>
                      {product.inventory < product.moq * 2 && (
                        <Badge className="bg-orange-100 text-orange-800">Low</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.moq.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">{product.activeOrders}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{product.factoryStock}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
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

export default ProductsTab;

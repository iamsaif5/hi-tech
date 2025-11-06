
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, AlertTriangle, CheckCircle, Package } from 'lucide-react';

const RawMaterialsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const rawMaterials = [
    {
      id: 1,
      name: 'Polypropylene Resin',
      code: 'RES-PP01',
      category: 'Granule',
      currentStock: 12400,
      unit: 'kg',
      factory: 'Midrand',
      minLevel: 5000,
      status: 'OK'
    },
    {
      id: 2,
      name: 'Red Ink – Flexo',
      code: 'INK-RED',
      category: 'Ink',
      currentStock: 280,
      unit: 'L',
      factory: 'Germiston',
      minLevel: 200,
      status: 'Low'
    },
    {
      id: 3,
      name: 'Thread – White',
      code: 'THR-WHT',
      category: 'Thread',
      currentStock: 4800,
      unit: 'm',
      factory: 'Midrand',
      minLevel: 3000,
      status: 'OK'
    },
    {
      id: 4,
      name: 'Black Ink – Flexo',
      code: 'INK-BLK',
      category: 'Ink',
      currentStock: 150,
      unit: 'L',
      factory: 'Boksburg',
      minLevel: 300,
      status: 'Critical'
    },
    {
      id: 5,
      name: 'Lamination Film',
      code: 'FILM-LAM',
      category: 'Film',
      currentStock: 2400,
      unit: 'm',
      factory: 'Germiston',
      minLevel: 1000,
      status: 'OK'
    }
  ];

  const filteredMaterials = rawMaterials.filter(material =>
    searchTerm === '' ||
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Low':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800';
      case 'Low':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const totalMaterials = rawMaterials.length;
  const lowStockMaterials = rawMaterials.filter(m => m.status === 'Low' || m.status === 'Critical').length;
  const criticalMaterials = rawMaterials.filter(m => m.status === 'Critical').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Total materials</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{totalMaterials}</p>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-600">Low stock</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{lowStockMaterials}</p>
        </div>

        <div className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-medium text-gray-600">Critical</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{criticalMaterials}</p>
        </div>
      </div>

      {/* Raw Materials Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Raw Materials Inventory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search materials or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Min Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{material.code}</Badge>
                  </TableCell>
                  <TableCell>{material.category}</TableCell>
                  <TableCell>
                    {material.currentStock.toLocaleString()} {material.unit}
                  </TableCell>
                  <TableCell>{material.factory}</TableCell>
                  <TableCell>
                    {material.minLevel.toLocaleString()} {material.unit}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(material.status)}
                      <Badge className={getStatusColor(material.status)}>
                        {material.status}
                      </Badge>
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

export default RawMaterialsTab;

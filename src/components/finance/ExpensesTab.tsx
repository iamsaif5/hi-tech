
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Upload, Edit, Trash2 } from 'lucide-react';

export const ExpensesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const expenseData = [
    {
      expenseId: 'EXP-2024-001',
      category: 'Staff',
      description: 'Weekly payroll - Production team',
      amount: 85000,
      date: '2025-06-27',
      paymentMethod: 'EFT',
      status: 'Paid',
      receipt: true
    },
    {
      expenseId: 'EXP-2024-002',
      category: 'Inventory',
      description: 'Raw materials - IWISA flour 25kg x 200',
      amount: 45000,
      date: '2025-06-26',
      paymentMethod: 'EFT',
      status: 'Paid',
      receipt: true
    },
    {
      expenseId: 'EXP-2024-003',
      category: 'Repairs',
      description: 'Cutter A1 blade replacement',
      amount: 3500,
      date: '2025-06-25',
      paymentMethod: 'Card',
      status: 'Pending',
      receipt: false
    },
    {
      expenseId: 'EXP-2024-004',
      category: 'Freight',
      description: 'Delivery to Freedom Foods - Order ORD-2024-001',
      amount: 2800,
      date: '2025-06-24',
      paymentMethod: 'EFT',
      status: 'Paid',
      receipt: true
    },
    {
      expenseId: 'EXP-2024-005',
      category: 'Misc',
      description: 'Office supplies and stationery',
      amount: 1200,
      date: '2025-06-23',
      paymentMethod: 'Card',
      status: 'Paid',
      receipt: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Staff': return 'bg-blue-100 text-blue-800';
      case 'Inventory': return 'bg-green-100 text-green-800';
      case 'Repairs': return 'bg-orange-100 text-orange-800';
      case 'Freight': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="repairs">Repairs</SelectItem>
              <SelectItem value="freight">Freight</SelectItem>
              <SelectItem value="misc">Misc</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add expense
        </Button>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseData.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{expense.expenseId}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={expense.description}>
                        {expense.description}
                      </div>
                    </TableCell>
                    <TableCell>R {expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(expense.status)}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expense.receipt ? (
                        <Button variant="ghost" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">No receipt</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
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

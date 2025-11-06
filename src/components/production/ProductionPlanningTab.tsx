import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Factory, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Settings,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const ProductionPlanningTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('manufacturing-orders');

  // Mock manufacturing orders data
  const manufacturingOrders = [
    {
      id: 'MO-001',
      orderId: 'ORD-0012',
      client: 'IWISA',
      product: 'IWISA 25kg Printed Bags',
      quantity: 5000,
      unit: 'm',
      status: 'in-progress',
      priority: 'high',
      startDate: '2024-01-15',
      dueDate: '2024-01-18',
      progress: 49,
      assignedMachine: 'Extruder Line A',
      estimatedCompletion: '2024-01-17 14:15'
    },
    {
      id: 'MO-002',
      orderId: 'ORD-0013',
      client: 'Custom Foods',
      product: 'Custom 5kg No Print',
      quantity: 3500,
      unit: 'm',
      status: 'in-progress',
      priority: 'medium',
      startDate: '2024-01-14',
      dueDate: '2024-01-19',
      progress: 84,
      assignedMachine: 'Cutter Station B',
      estimatedCompletion: '2024-01-18 16:00'
    },
    {
      id: 'MO-003',
      orderId: 'ORD-0014',
      client: 'Lion Group',
      product: 'Lion 10kg Bags',
      quantity: 2000,
      unit: 'm',
      status: 'setup',
      priority: 'medium',
      startDate: '2024-01-16',
      dueDate: '2024-01-20',
      progress: 15,
      assignedMachine: 'Printer Line C',
      estimatedCompletion: '2024-01-19 19:00'
    },
    {
      id: 'MO-004',
      orderId: 'ORD-0015',
      client: 'MegaBag Co',
      product: 'MegaBag Industrial',
      quantity: 5000,
      unit: 'm',
      status: 'scheduled',
      priority: 'low',
      startDate: '2024-01-18',
      dueDate: '2024-01-22',
      progress: 0,
      assignedMachine: 'Bagging Line A',
      estimatedCompletion: '2024-01-21 12:45'
    }
  ];

  // Mock machine scheduling data
  const machineSchedule = [
    {
      machine: 'Extruder Line A',
      section: 'Extrusion',
      currentJob: 'MO-001',
      utilization: 94,
      nextJob: 'MO-005',
      nextStart: '14:30',
      status: 'active'
    },
    {
      machine: 'Cutter Station B',
      section: 'Cutting',
      currentJob: 'MO-002',
      utilization: 84,
      nextJob: 'MO-006',
      nextStart: '16:15',
      status: 'monitor'
    },
    {
      machine: 'Printer Line C',
      section: 'Printing',
      currentJob: 'MO-003',
      utilization: 0,
      nextJob: 'Maintenance',
      nextStart: '19:00',
      status: 'setup'
    },
    {
      machine: 'Bagging Line A',
      section: 'Bagging',
      currentJob: 'Available',
      utilization: 96,
      nextJob: 'MO-004',
      nextStart: '18/01 08:00',
      status: 'available'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
      case 'active':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'setup':
      case 'monitor':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'scheduled':
      case 'available':  
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'low':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Factory className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Production Planning</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New MO
          </Button>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList>
          <TabsTrigger value="manufacturing-orders">Manufacturing Orders</TabsTrigger>
          <TabsTrigger value="machine-scheduling">Machine Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="manufacturing-orders" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Manufacturing Orders
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Active: 2</span>
                  <span>Scheduled: 1</span>
                  <span>Setup: 1</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MO ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manufacturingOrders.map((mo) => (
                    <TableRow key={mo.id}>
                      <TableCell className="font-medium">{mo.id}</TableCell>
                      <TableCell>{mo.orderId}</TableCell>
                      <TableCell>{mo.client}</TableCell>
                      <TableCell>{mo.product}</TableCell>
                      <TableCell>{mo.quantity.toLocaleString()}{mo.unit}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(mo.priority)}>
                          {mo.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(mo.status)}>
                          {mo.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={mo.progress} className="w-16 h-2" />
                          <span className="text-sm text-muted-foreground">{mo.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{mo.dueDate}</TableCell>
                      <TableCell>{mo.assignedMachine}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Search className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="machine-scheduling" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Machine Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {machineSchedule.map((machine) => (
                    <div key={machine.machine} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{machine.machine}</h4>
                          <p className="text-sm text-muted-foreground">{machine.section} Section</p>
                        </div>
                        <Badge className={getStatusColor(machine.status)}>
                          {machine.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current Job:</span>
                          <p className="font-medium">{machine.currentJob}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Utilization:</span>
                          <p className="font-medium">{machine.utilization}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Job:</span>
                          <p className="font-medium">{machine.nextJob}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Start:</span>
                          <p className="font-medium">{machine.nextStart}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={machine.utilization} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Capacity Summary  
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Section Utilization</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Extrusion</span>
                        <div className="flex items-center gap-2">
                          <Progress value={94} className="w-20 h-2" />
                          <span className="text-sm font-medium">94%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cutting</span>
                        <div className="flex items-center gap-2">
                          <Progress value={84} className="w-20 h-2" />
                          <span className="text-sm font-medium">84%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Printing</span>
                        <div className="flex items-center gap-2">
                          <Progress value={0} className="w-20 h-2" />
                          <span className="text-sm font-medium">0%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bagging</span>
                        <div className="flex items-center gap-2">
                          <Progress value={96} className="w-20 h-2" />
                          <span className="text-sm font-medium">96%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Today's Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Orders Active:</span>
                        <p className="font-medium">4</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Orders Completed:</span>
                        <p className="font-medium">2</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Output:</span>
                        <p className="font-medium">45,280m</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency:</span>
                        <p className="font-medium">87.5%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Upcoming</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>MO-004 (MegaBag)</span>
                        <span className="text-muted-foreground">Tomorrow 08:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance - Printer C</span>
                        <span className="text-muted-foreground">Today 19:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MO-005 (Rush Order)</span>
                        <span className="text-muted-foreground">Today 14:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionPlanningTab;
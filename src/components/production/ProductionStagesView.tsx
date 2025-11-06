
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductionStagesViewProps {
  selectedFactory: string;
}

const ProductionStagesView = ({ selectedFactory }: ProductionStagesViewProps) => {
  const [activeStage, setActiveStage] = useState('loomage');

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'OK': 'bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'Active': 'bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'Warning': 'bg-orange-600 text-white px-2 py-1 rounded-md text-xs font-medium',
      'Down': 'bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium'
    };
    
    return <span className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-600 text-white px-2 py-1 rounded-md text-xs font-medium'}>{status}</span>;
  };

  // Filter data based on selected factory - only show machines with active orders
  const stageData = {
    loomage: [
      {
        machine: 'Loom 1',
        product: 'IWISA 25kg',
        jobId: 'PROD-0542',
        operator: 'Josh M.',
        shift: 'Day',
        startMeter: '12,450',
        endMeter: '13,650',
        loomage: '1,200',
        efficiency: '92%',
        downtime: '5',
        status: 'OK',
        factory: 'Midrand'
      },
      {
        machine: 'Loom 2',
        product: 'Lion 10kg White',
        jobId: 'PROD-0543',
        operator: 'Maria S.',
        shift: 'Day',
        startMeter: '8,920',
        endMeter: '9,870',
        loomage: '950',
        efficiency: '88%',
        downtime: '12',
        status: 'Active',
        factory: 'Midrand'
      }
    ].filter(item => selectedFactory === 'all' || item.factory.toLowerCase() === selectedFactory.toLowerCase()),
    
    tubing: [
      {
        machine: 'Tube Line A',
        product: 'IWISA 25kg',
        jobId: 'PROD-0542',
        operator: 'David K.',
        shift: 'Day',
        startMeter: '15,200',
        endMeter: '16,350',
        output: '1,150',
        efficiency: '90%',
        downtime: '8',
        status: 'Active',
        factory: 'Midrand'
      }
    ].filter(item => selectedFactory === 'all' || item.factory.toLowerCase() === selectedFactory.toLowerCase()),
    
    cutting: [
      {
        machine: 'Cutter A1',
        product: 'IWISA 25kg',
        jobId: 'PROD-0542',
        operator: 'Mike Davis',
        shift: 'Day',
        qtyToday: '1,100',
        efficiency: '94%',
        downtime: '3',
        status: 'OK',
        factory: 'Midrand'
      }
    ].filter(item => selectedFactory === 'all' || item.factory.toLowerCase() === selectedFactory.toLowerCase()),
    
    printing: [
      {
        machine: 'Printer D1',
        product: 'Lion 10kg White',
        jobId: 'PROD-0543',
        operator: 'Sarah B.',
        shift: 'Night',
        qtyToday: '950',
        efficiency: '89%',
        downtime: '0',
        status: 'Active',
        factory: 'Boksburg'
      }
    ].filter(item => selectedFactory === 'all' || item.factory.toLowerCase() === selectedFactory.toLowerCase()),
    
    bagging: [
      {
        machine: 'Bagger 1',
        product: 'IWISA 25kg',
        jobId: 'PROD-0540',
        operator: 'Lisa G.',
        shift: 'Day',
        qtyToday: '1,200',
        efficiency: '96%',
        downtime: '2',
        status: 'OK',
        factory: 'Germiston'
      }
    ].filter(item => selectedFactory === 'all' || item.factory.toLowerCase() === selectedFactory.toLowerCase())
  };

  // Calculate loomage summary totals
  const calculateLoomageSummary = () => {
    const todayTotal = stageData.loomage.reduce((sum, item) => sum + parseInt(item.loomage.replace(',', '')), 0);
    const yesterdayTotal = 2850; // This would come from actual data
    const weekTotal = 18450; // This would come from actual data
    
    return {
      today: todayTotal.toLocaleString(),
      yesterday: yesterdayTotal.toLocaleString(),
      week: weekTotal.toLocaleString()
    };
  };

  const loomageSummary = calculateLoomageSummary();

  const renderLoomageTable = (data: any[]) => (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Job ID</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Start Meter</TableHead>
            <TableHead>End Meter</TableHead>
            <TableHead>Loomage (m)</TableHead>
            <TableHead>Efficiency %</TableHead>
            <TableHead>Downtime (min)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.machine}</TableCell>
              <TableCell>{item.product}</TableCell>
              <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">{item.jobId}</TableCell>
              <TableCell>{item.operator}</TableCell>
              <TableCell>{item.shift}</TableCell>
              <TableCell>{item.startMeter}</TableCell>
              <TableCell>{item.endMeter}</TableCell>
              <TableCell className="font-semibold">{item.loomage}</TableCell>
              <TableCell>{item.efficiency}</TableCell>
              <TableCell>{item.downtime}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Loomage Summary Totals */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Loomage Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{loomageSummary.today}m</p>
            <p className="text-xs text-gray-600">Today's Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{loomageSummary.yesterday}m</p>
            <p className="text-xs text-gray-600">Yesterday's Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{loomageSummary.week}m</p>
            <p className="text-xs text-gray-600">Week-to-Date</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStageTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Machine</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Job ID</TableHead>
          <TableHead>Operator</TableHead>
          <TableHead>Shift</TableHead>
          <TableHead>Qty Today</TableHead>
          <TableHead>Efficiency %</TableHead>
          <TableHead>Downtime (min)</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.machine}</TableCell>
            <TableCell>{item.product}</TableCell>
            <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">{item.jobId}</TableCell>
            <TableCell>{item.operator}</TableCell>
            <TableCell>{item.shift}</TableCell>
            <TableCell>{item.qtyToday}</TableCell>
            <TableCell>{item.efficiency}</TableCell>
            <TableCell>{item.downtime}</TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Production Stages - Active Orders Only</CardTitle>
        <p className="text-sm text-gray-600">Showing machines with active production orders</p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-50 h-12 border border-gray-200">
            <TabsTrigger value="loomage" className="data-[state=active]:bg-white">
              Loomage
            </TabsTrigger>
            <TabsTrigger value="tubing" className="data-[state=active]:bg-white">
              Tubing
            </TabsTrigger>
            <TabsTrigger value="cutting" className="data-[state=active]:bg-white">
              Cutting
            </TabsTrigger>
            <TabsTrigger value="printing" className="data-[state=active]:bg-white">
              Printing
            </TabsTrigger>
            <TabsTrigger value="bagging" className="data-[state=active]:bg-white">
              Bagging
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="loomage" className="mt-6">
            <div className="overflow-x-auto">
              {renderLoomageTable(stageData.loomage)}
            </div>
          </TabsContent>
          
          <TabsContent value="tubing" className="mt-6">
            <div className="overflow-x-auto">
              {renderStageTable(stageData.tubing)}
            </div>
          </TabsContent>
          
          <TabsContent value="cutting" className="mt-6">
            <div className="overflow-x-auto">
              {renderStageTable(stageData.cutting)}
            </div>
          </TabsContent>
          
          <TabsContent value="printing" className="mt-6">
            <div className="overflow-x-auto">
              {renderStageTable(stageData.printing)}
            </div>
          </TabsContent>
          
          <TabsContent value="bagging" className="mt-6">
            <div className="overflow-x-auto">
              {renderStageTable(stageData.bagging)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductionStagesView;

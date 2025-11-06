
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ProductionStages = () => {
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

  const stageData = {
    loomage: [
      {
        machine: 'Loom 1',
        product: 'IWISA 25kg',
        jobId: 'PROD-0542',
        operator: 'Josh M.',
        shift: 'Day',
        qtyToday: '1,200',
        efficiency: '92%',
        downtime: '5',
        status: 'OK'
      },
      {
        machine: 'Loom 2',
        product: 'Lion 10kg White',
        jobId: 'PROD-0543',
        operator: 'Maria S.',
        shift: 'Day',
        qtyToday: '950',
        efficiency: '88%',
        downtime: '12',
        status: 'Active'
      }
    ],
    tubing: [
      {
        machine: 'Tube Line A',
        product: 'IWISA 25kg',
        jobId: 'PROD-0542',
        operator: 'David K.',
        shift: 'Day',
        qtyToday: '1,150',
        efficiency: '90%',
        downtime: '8',
        status: 'Active'
      },
      {
        machine: 'Tube Line B',
        product: 'Custom 5kg',
        jobId: 'PROD-0545',
        operator: 'Anna P.',
        shift: 'Night',
        qtyToday: '800',
        efficiency: '85%',
        downtime: '15',
        status: 'Warning'
      }
    ],
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
        status: 'OK'
      },
      {
        machine: 'Slitter B2',
        product: 'Lion 10kg White',
        jobId: 'PROD-0543',
        operator: 'Sarah Brown',
        shift: 'Day',
        qtyToday: '900',
        efficiency: '87%',
        downtime: '10',
        status: 'Active'
      }
    ],
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
        status: 'Active'
      },
      {
        machine: 'Printer D2',
        product: 'IWISA 25kg',
        jobId: 'PROD-0542',
        operator: 'Tom W.',
        shift: 'Day',
        qtyToday: '1,050',
        efficiency: '91%',
        downtime: '7',
        status: 'OK'
      }
    ],
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
        status: 'OK'
      },
      {
        machine: 'Bagger 2',
        product: 'Lion 10kg White',
        jobId: 'PROD-0541',
        operator: 'Chris T.',
        shift: 'Night',
        qtyToday: '850',
        efficiency: '83%',
        downtime: '18',
        status: 'Warning'
      }
    ]
  };

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
        <CardTitle className="text-lg font-medium text-gray-900">Production Stages</CardTitle>
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
              {renderStageTable(stageData.loomage)}
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

export default ProductionStages;

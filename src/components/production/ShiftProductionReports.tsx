
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ShiftProductionReportsProps {
  selectedFactory: string;
  selectedShift: string;
}

const ShiftProductionReports = ({ selectedFactory, selectedShift }: ShiftProductionReportsProps) => {
  const reportsData = [
    {
      factory: 'Midrand',
      shift: 'Day',
      operator: 'John Smith',
      machine: 'Loom A1',
      target: 2000,
      achieved: 1950,
      efficiency: 97.5,
      waste: 50,
      timestamp: '2025-06-29 14:30'
    },
    {
      factory: 'Midrand',
      shift: 'Day',
      operator: 'Sarah Brown',
      machine: 'Cutter A1',
      target: 1500,
      achieved: 1480,
      efficiency: 98.7,
      waste: 20,
      timestamp: '2025-06-29 14:15'
    },
    {
      factory: 'Boksburg',
      shift: 'Night',
      operator: 'Mike Davis',
      machine: 'Printer D1',
      target: 1200,
      achieved: 1050,
      efficiency: 87.5,
      waste: 150,
      timestamp: '2025-06-29 06:00'
    }
  ];

  const filteredReports = reportsData.filter(report => {
    const factoryMatch = selectedFactory === 'all' || report.factory.toLowerCase() === selectedFactory.toLowerCase();
    const shiftMatch = selectedShift === 'all' || report.shift.toLowerCase() === selectedShift.toLowerCase();
    return factoryMatch && shiftMatch;
  });

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 95) {
      return <Badge className="bg-green-600 text-white">{efficiency}%</Badge>;
    } else if (efficiency >= 85) {
      return <Badge className="bg-yellow-600 text-white">{efficiency}%</Badge>;
    } else {
      return <Badge className="bg-red-600 text-white">{efficiency}%</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Shift Reports ({filteredReports.length})</h3>
        <p className="text-sm text-gray-600">Daily operator performance logs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report, index) => (
          <Card key={index} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  {report.operator}
                </CardTitle>
                {getEfficiencyBadge(report.efficiency)}
              </div>
              <div className="text-sm text-gray-600">
                {report.factory} • {report.machine} • {report.shift} Shift
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Target:</span>
                  <p className="font-semibold">{report.target.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Achieved:</span>
                  <p className="font-semibold">{report.achieved.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Waste:</span>
                  <p className="font-semibold text-red-600">{report.waste}</p>
                </div>
                <div>
                  <span className="text-gray-600">Efficiency:</span>
                  <p className="font-semibold">{report.efficiency}%</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{Math.round((report.achieved / report.target) * 100)}%</span>
                </div>
                <Progress 
                  value={(report.achieved / report.target) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="text-xs text-gray-500">
                Reported: {new Date(report.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No shift reports found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default ShiftProductionReports;

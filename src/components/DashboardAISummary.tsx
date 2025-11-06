
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Brain, AlertTriangle, Users, Wrench, Package, TrendingUp } from 'lucide-react';

const DashboardAISummary = () => {
  const summaryItems = [
    {
      icon: <Package className="h-4 w-4 text-blue-600" />,
      text: "ORD-0012: Tubing stage completed. Cutting starts 09:00."
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
      text: "QC: 2 failed tape tests for IWISA 25kg Printed – rechecking required."
    },
    {
      icon: <Users className="h-4 w-4 text-green-600" />,
      text: "Staff: All 6 operators logged hours. 1 on sick leave."
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-red-600" />,
      text: "Waste: 4.1%, above 3.0% target – caused by print misalignment on Line B."
    },
    {
      icon: <Wrench className="h-4 w-4 text-yellow-600" />,
      text: "Machine check: Extruder A1 flagged for vibration, minor severity."
    }
  ];

  return (
    <Card className="shadow-sm bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Brain className="h-4 w-4 text-blue-600" />
          Daily AI summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaryItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              {item.icon}
              <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAISummary;

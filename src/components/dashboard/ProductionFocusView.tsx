
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, AlertTriangle, Clock, TrendingUp, CheckCircle, Timer } from 'lucide-react';

interface ProductionFocusViewProps {
  lastUpdated: Date;
}

const ProductionFocusView = ({ lastUpdated }: ProductionFocusViewProps) => {
  const productionMetrics = [
    {
      title: "Jobs in progress",
      value: "5",
      icon: <Factory className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Ops at risk",
      value: "2",
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    },
    {
      title: "Orders due today",
      value: "3",
      icon: <Clock className="h-4 w-4 text-orange-600" />,
    },
    {
      title: "7d capacity utilisation",
      value: "68.3%",
      subtitle: "↑ 3.2%",
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Completed ops today",
      value: "4",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Estimated delays",
      value: "1 job",
      icon: <Timer className="h-4 w-4 text-yellow-600" />,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productionMetrics.map((metric, index) => (
          <div key={index} className="data-card">
            <div className="flex items-center gap-2 mb-2">
              {metric.icon}
              <span className="text-xs font-medium text-gray-600">
                {metric.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-gray-900">{metric.value}</p>
              {metric.subtitle && (
                <span className="text-xs text-green-600 font-medium">{metric.subtitle}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Production AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Factory className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-gray-700">ORD-0012: Tubing stage completed. Cutting starts 09:00.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-gray-700">Machine Check: Extruder A1 flagged for vibration, minor severity.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-gray-700">Estimated delay on Line B due to print misalignment issue.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionFocusView;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, Users, Clock } from 'lucide-react';

export const AISummary: React.FC = () => {
  const insights = [
    {
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      text: "Cutter B2 showed 2 QC failures (print skew)",
      severity: 'high'
    },
    {
      icon: <TrendingDown className="h-4 w-4 text-yellow-600" />,
      text: "Waste on Extruder A1 at 4.8%, exceeds target",
      severity: 'medium'
    },
    {
      icon: <Users className="h-4 w-4 text-blue-600" />,
      text: "4 of 6 operators clocked in, 2 missing logs",
      severity: 'low'
    },
    {
      icon: <Clock className="h-4 w-4 text-orange-600" />,
      text: "Downtime logged for Loom 3 due to thread break",
      severity: 'medium'
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          🧠 AI Report Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              {insight.icon}
              <span className="text-gray-700">{insight.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

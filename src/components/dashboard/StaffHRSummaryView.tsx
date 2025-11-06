
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, AlertTriangle, CheckCircle, UserCheck, UserX } from 'lucide-react';

interface StaffHRSummaryViewProps {
  lastUpdated: Date;
}

const StaffHRSummaryView = ({ lastUpdated }: StaffHRSummaryViewProps) => {
  const staffMetrics = [
    {
      title: "Staff hours today",
      value: "31h",
      icon: <Clock className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Active operators",
      value: "5",
      icon: <Users className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Attendance rate",
      value: "83%",
      icon: <UserCheck className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Overtime hours",
      value: "12h",
      icon: <Clock className="h-4 w-4 text-yellow-600" />,
    },
    {
      title: "Staff alerts",
      value: "2",
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    },
    {
      title: "Completed shifts",
      value: "24",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {staffMetrics.map((metric, index) => (
          <div key={index} className="data-card">
            <div className="flex items-center gap-2 mb-2">
              {metric.icon}
              <h3 className="text-xs font-medium text-gray-600">
                {metric.title}
              </h3>
            </div>
            <p className="text-base font-semibold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Staff AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Users className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-gray-700">Staff: All 6 operators logged hours. 1 on sick leave.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-gray-700">Missing timesheet submissions from 2 staff members.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm text-gray-700">Amelia Anderson completed double shift covering for sick leave.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffHRSummaryView;

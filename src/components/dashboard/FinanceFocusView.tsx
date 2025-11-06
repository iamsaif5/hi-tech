
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, CreditCard, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FinanceFocusViewProps {
  lastUpdated: Date;
}

const FinanceFocusView = ({ lastUpdated }: FinanceFocusViewProps) => {
  const financeMetrics = [
    {
      title: "Invoices paid this week",
      value: "R245,000",
      icon: <DollarSign className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Outstanding payments",
      value: "R89,500",
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
    },
    {
      title: "Monthly revenue",
      value: "R1.2M",
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Active orders value",
      value: "R356,000",
      icon: <FileText className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Credit limit usage",
      value: "68%",
      icon: <CreditCard className="h-4 w-4 text-yellow-600" />,
    },
    {
      title: "Processed payments",
      value: "12",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {financeMetrics.map((metric, index) => (
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
          <CardTitle className="text-lg font-medium text-gray-900">Financial AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600 mt-0.5" />
              <p className="text-sm text-gray-700">Invoice INV-2025-067 from Lion Group paid (R67,500).</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-gray-700">Payment reminder: Freedom Foods invoice overdue by 5 days.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-sm text-gray-700">Monthly revenue target 85% achieved with 1 week remaining.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceFocusView;

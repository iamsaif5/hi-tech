
import React from 'react';
import { Factory, AlertTriangle, Clock, TrendingUp, CheckCircle, Settings, Activity } from 'lucide-react';

const ProductionSummaryCards = () => {
  const summaryData = [
    {
      title: 'Jobs in progress',
      value: '5',
      icon: <Factory className="h-4 w-4 text-blue-600" />,
    },
    {
      title: 'Loomage this week',
      value: '18,450m',
      subtitle: '↑ 12%',
      icon: <Activity className="h-4 w-4 text-blue-600" />,
    },
    {
      title: 'Orders due today',
      value: '3',
      icon: <Clock className="h-4 w-4 text-red-600" />,
    },
    {
      title: 'Jobs at Risk',
      value: '2',
      icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
    },
    {
      title: 'Estimated delays',
      value: '1',
      icon: <Clock className="h-4 w-4 text-orange-600" />,
    },
    {
      title: '7-Day Utilisation',
      value: '68.3%',
      subtitle: '↑ 3.2%',
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
    },
    {
      title: 'Completed Jobs',
      value: '4',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    {
      title: 'Machine Alerts',
      value: '1',
      icon: <Settings className="h-4 w-4 text-red-600" />,
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {summaryData.map((item, index) => (
        <div key={index} className="data-card">
          <div className="flex items-center gap-2 mb-2">
            {item.icon}
            <h3 className="text-xs font-medium text-gray-600">
              {item.title}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-900">{item.value}</p>
            {item.subtitle && (
              <span className="text-xs text-green-600 font-medium">{item.subtitle}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductionSummaryCards;

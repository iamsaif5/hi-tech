
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface FactoryChecksTabProps {
  selectedFactory: string;
}

const FactoryChecksTab = ({ selectedFactory }: FactoryChecksTabProps) => {
  const checksData = [
    {
      factory: 'Midrand',
      shift: 'Day',
      checkTime: 'Morning',
      timestamp: '06:00',
      status: 'Completed',
      checkedBy: 'John Smith',
      notes: 'All equipment operational'
    },
    {
      factory: 'Midrand',
      shift: 'Day',
      checkTime: 'Lunch',
      timestamp: '12:30',
      status: 'Completed',
      checkedBy: 'Sarah Brown',
      notes: 'Minor maintenance on Loom A2'
    },
    {
      factory: 'Boksburg',
      shift: 'Day',
      checkTime: 'Morning',
      timestamp: '06:15',
      status: 'Completed',
      checkedBy: 'Mike Davis',
      notes: 'All systems normal'
    },
    {
      factory: 'Boksburg',
      shift: 'Day',
      checkTime: 'Evening',
      timestamp: '18:00',
      status: 'Pending',
      checkedBy: '',
      notes: ''
    }
  ];

  const filteredChecks = checksData.filter(check => {
    return selectedFactory === 'all' || check.factory.toLowerCase() === selectedFactory.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Completed': 'bg-green-600 text-white',
      'Pending': 'bg-orange-600 text-white',
      'Overdue': 'bg-red-600 text-white'
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-600 text-white'}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'Overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Factory Checks ({filteredChecks.length})</h3>
        <p className="text-sm text-gray-600">Today's safety and equipment checks</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChecks.map((check, index) => (
          <Card key={index} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  {check.factory} - {check.checkTime}
                </CardTitle>
                {getStatusBadge(check.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getStatusIcon(check.status)}
                <span>{check.timestamp}</span>
                <span>•</span>
                <span>{check.shift} Shift</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {check.checkedBy && (
                <div className="text-sm">
                  <span className="text-gray-600">Checked by:</span>
                  <p className="font-medium">{check.checkedBy}</p>
                </div>
              )}
              
              {check.notes && (
                <div className="text-sm">
                  <span className="text-gray-600">Notes:</span>
                  <p className="text-gray-800">{check.notes}</p>
                </div>
              )}
              
              {check.status === 'Pending' && (
                <div className="text-xs text-orange-600 font-medium">
                  Awaiting completion
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChecks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No factory checks found for the selected factory.
        </div>
      )}
    </div>
  );
};

export default FactoryChecksTab;

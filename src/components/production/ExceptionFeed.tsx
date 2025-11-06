import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, Clock, Wrench } from 'lucide-react';

interface Exception {
  id: string;
  type: 'error' | 'warning';
  category: 'machine' | 'efficiency' | 'quality' | 'schedule';
  message: string;
  timestamp: Date;
  machine?: string;
  orderId?: string;
}

const ExceptionFeed = () => {
  const [exceptions, setExceptions] = useState<Exception[]>([]);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockExceptions: Exception[] = [
      {
        id: '1',
        type: 'error',
        category: 'machine',
        message: 'Extruder Line A - Emergency stop triggered',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        machine: 'EXT-A'
      },
      {
        id: '2',
        type: 'warning',
        category: 'efficiency',
        message: 'Cutter Station B efficiency dropped to 78%',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        machine: 'CUT-B'
      },
      {
        id: '3',
        type: 'error',
        category: 'quality',
        message: 'QC Flag - Thickness variance on ORD-0124',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        orderId: 'ORD-0124'
      },
      {
        id: '4',
        type: 'warning',
        category: 'schedule',
        message: 'MO-2025-012 running 45min behind schedule',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        orderId: 'MO-2025-012'
      },
      {
        id: '5',
        type: 'warning',
        category: 'efficiency',
        message: 'Print Station C efficiency at 85%',
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        machine: 'PRT-C'
      }
    ];

    setExceptions(mockExceptions);
  }, []);

  const getExceptionIcon = (category: string) => {
    switch (category) {
      case 'machine': return XCircle;
      case 'efficiency': return AlertTriangle;
      case 'quality': return AlertTriangle;
      case 'schedule': return Clock;
      default: return Wrench;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ${diffMinutes % 60}m ago`;
  };

  return (
    <div className="space-y-4 mb-4">
      <h3 className="text-sm font-medium">Exception Feed</h3>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="h-72 overflow-y-auto p-4">
          <div className="space-y-2">
            {exceptions.map((exception) => {
              const IconComponent = getExceptionIcon(exception.category);
              return (
                <div key={exception.id} className="flex items-start gap-2 p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <IconComponent className={`h-3 w-3 mt-0.5 ${exception.type === 'error' ? 'text-red-600' : 'text-amber-600'}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={exception.type === 'error' ? 'destructive' : 'secondary'} className="text-xs py-0">
                        {exception.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(exception.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{exception.message}</p>
                    {(exception.machine || exception.orderId) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {exception.machine && `Machine: ${exception.machine}`}
                        {exception.orderId && `Order: ${exception.orderId}`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExceptionFeed;
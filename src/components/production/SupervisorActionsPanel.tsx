import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  Settings,
  Factory,
  AlertCircle,
  Package
} from 'lucide-react';

const SupervisorActionsPanel = () => {
  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    // In real implementation, this would trigger the appropriate action
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Factory className="h-5 w-5 text-blue-600" />
              PRODUCTION QUICK ACTIONS
            </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* View Modes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-blue-800">VIEW MODES</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Button 
                variant="outline" 
                className="h-14 flex flex-col items-center justify-center gap-1 bg-white hover:bg-gray-50"
                onClick={() => handleQuickAction('full-view')}
              >
                <Factory className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium">Full View</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-14 flex flex-col items-center justify-center gap-1 bg-blue-50 border-blue-200"
                onClick={() => handleQuickAction('loomage-focus')}
              >
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium">Loomage</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-14 flex flex-col items-center justify-center gap-1 bg-white hover:bg-red-50"
                onClick={() => handleQuickAction('issues-only')}
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium">Issues Only</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-14 flex flex-col items-center justify-center gap-1 bg-white hover:bg-orange-50"
                onClick={() => handleQuickAction('maintenance')}
              >
                <Settings className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-medium">Maintenance</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-14 flex flex-col items-center justify-center gap-1 bg-white hover:bg-green-50"
                onClick={() => handleQuickAction('performance')}
              >
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium">Performance</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-blue-200">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">6</p>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">2</p>
              <p className="text-xs text-muted-foreground">Critical Issues</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-orange-600">1</p>
              <p className="text-xs text-muted-foreground">Machines Down</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">87.5%</p>
              <p className="text-xs text-muted-foreground">Efficiency</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisorActionsPanel;
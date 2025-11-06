import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Phone, 
  FileText, 
  Settings, 
  Bell,
  Zap,
  Award,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'opportunity';
  title: string;
  description: string;
  assignedTo?: string;
  eta?: string;
  actions: Array<{
    label: string;
    icon: React.ReactNode;
    variant: 'default' | 'destructive' | 'outline';
  }>;
}

const AlertsPanel = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const alerts: Alert[] = [
    {
      id: 'alert1',
      type: 'critical',
      title: 'Printer C down 45 min - Ink System Failure',
      description: 'Production stopped, 2 jobs delayed',
      assignedTo: 'Tech Team',
      eta: '19:00',
      actions: [
        { label: 'Escalate', icon: <Phone className="h-3 w-3" />, variant: 'destructive' },
        { label: 'Update', icon: <FileText className="h-3 w-3" />, variant: 'outline' }
      ]
    },
    {
      id: 'alert2',
      type: 'critical',
      title: 'Material shortage risk - IWISA film (2 days remaining)',
      description: 'Production planning needed for supply',
      actions: [
        { label: 'Order Materials', icon: <Zap className="h-3 w-3" />, variant: 'destructive' },
        { label: 'Schedule', icon: <FileText className="h-3 w-3" />, variant: 'outline' }
      ]
    },
    {
      id: 'alert3',
      type: 'warning',
      title: 'Cutter B efficiency 84% for 2 hours',
      description: 'Below target performance, blade maintenance needed',
      actions: [
        { label: 'Check Blade', icon: <Settings className="h-3 w-3" />, variant: 'outline' },
        { label: 'Maintenance', icon: <Settings className="h-3 w-3" />, variant: 'outline' }
      ]
    },
    {
      id: 'alert4',
      type: 'warning',
      title: 'QC failure rate: 3 in last hour',
      description: 'Quality issues increasing, investigation needed',
      actions: [
        { label: 'Investigate', icon: <FileText className="h-3 w-3" />, variant: 'outline' },
        { label: 'Document', icon: <FileText className="h-3 w-3" />, variant: 'outline' }
      ]
    },
    {
      id: 'alert5',
      type: 'opportunity',
      title: 'Loom Bank 1 ahead of schedule - can take extra job',
      description: 'Capacity available for additional production',
      actions: [
        { label: 'Schedule', icon: <FileText className="h-3 w-3" />, variant: 'default' },
        { label: 'Capacity', icon: <Settings className="h-3 w-3" />, variant: 'outline' }
      ]
    },
    {
      id: 'alert6',
      type: 'opportunity',
      title: 'Bagging Lines running at 96% - excellent performance',
      description: 'Equipment performing above target efficiency',
      actions: [
        { label: 'Monitor', icon: <Settings className="h-3 w-3" />, variant: 'default' },
        { label: 'Optimize', icon: <Award className="h-3 w-3" />, variant: 'outline' }
      ]
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'opportunity': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'opportunity': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.type === 'critical');
  const warningAlerts = alerts.filter(alert => alert.type === 'warning');
  const opportunityAlerts = alerts.filter(alert => alert.type === 'opportunity');

  return (
    <div className="space-y-4">
      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              PRODUCTION ALERTS
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Auto-Refresh: Every 30 seconds</span>
              <Button size="sm" variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline">
                <Bell className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  CRITICAL EQUIPMENT ISSUES
                </h3>
                {criticalAlerts.map((alert) => (
                  <Card key={alert.id} className={getAlertColor(alert.type)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getAlertIcon(alert.type)}
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          {(alert.assignedTo || alert.eta) && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {alert.assignedTo && (
                                <span>Assigned to: <span className="font-medium">{alert.assignedTo}</span></span>
                              )}
                              {alert.eta && (
                                <span>ETA: <span className="font-medium">{alert.eta}</span></span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {alert.actions.map((action, index) => (
                            <Button key={index} size="sm" variant={action.variant} className="text-xs">
                              {action.icon}
                              <span className="ml-1">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Warning Alerts */}
            {warningAlerts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  PERFORMANCE WARNINGS
                </h3>
                {warningAlerts.map((alert) => (
                  <Card key={alert.id} className={getAlertColor(alert.type)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getAlertIcon(alert.type)}
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {alert.actions.map((action, index) => (
                            <Button key={index} size="sm" variant={action.variant} className="text-xs">
                              {action.icon}
                              <span className="ml-1">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Opportunities */}
            {opportunityAlerts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  OPPORTUNITIES
                </h3>
                {opportunityAlerts.map((alert) => (
                  <Card key={alert.id} className={getAlertColor(alert.type)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getAlertIcon(alert.type)}
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {alert.actions.map((action, index) => (
                            <Button key={index} size="sm" variant={action.variant} className="text-xs">
                              {action.icon}
                              <span className="ml-1">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AlertsPanel;
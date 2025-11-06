import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Settings, 
  FileText, 
  ExternalLink,
  Activity,
  AlertTriangle,
  Plus
} from 'lucide-react';

export const IntegrationsTab: React.FC = () => {
  // Mock integration status data
  const integrations = [
    {
      id: '1',
      name: 'Xero API',
      description: 'Accounting system sync for invoices, expenses, and bank reconciliation',
      status: 'Connected',
      lastSync: '2025-07-11 08:30',
      errorMessage: null,
      features: ['Invoice sync', 'Expense tracking', 'Bank reconciliation', 'Chart of accounts'],
      actions: ['Resync now', 'View settings', 'Export mappings']
    },
    {
      id: '2',
      name: 'Bank Feed',
      description: 'Automated bank transaction import and reconciliation',
      status: 'Error',
      lastSync: '2025-07-10 23:45',
      errorMessage: 'Connection timeout - bank API temporarily unavailable',
      features: ['Transaction import', 'Auto-categorization', 'Balance reconciliation'],
      actions: ['Retry connection', 'Check credentials', 'Manual import']
    },
    {
      id: '3',
      name: 'ATG Payroll',
      description: 'Time clock data and payroll calculation integration',
      status: 'Connected',
      lastSync: '2025-07-11 06:00',
      errorMessage: null,
      features: ['Time data sync', 'Payroll calculations', 'Employee records', 'Leave management'],
      actions: ['Resync now', 'View sync log', 'Configure mapping']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Disconnected': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Connected': return 'bg-green-500';
      case 'Error': return 'bg-red-500';
      case 'Disconnected': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusDescription = (status: string, lastSync: string) => {
    switch (status) {
      case 'Connected': return `Last synced: ${lastSync}`;
      case 'Error': return 'Sync failed - requires attention';
      case 'Disconnected': return 'Not connected';
      default: return 'Status unknown';
    }
  };

  // Calculate summary metrics
  const connectedSystems = integrations.filter(int => int.status === 'Connected').length;
  const errorSystems = integrations.filter(int => int.status === 'Error').length;
  const disconnectedSystems = integrations.filter(int => int.status === 'Disconnected').length;
  const healthScore = Math.round((connectedSystems / integrations.length) * 100);

  const kpiData = [
    {
      title: "Connected Systems",
      value: connectedSystems,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      subtext: "Active integrations"
    },
    {
      title: "Systems with Errors",
      value: errorSystems,
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      subtext: "Need attention"
    },
    {
      title: "Disconnected",
      value: disconnectedSystems,
      icon: AlertTriangle,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      subtext: "Not configured"
    },
    {
      title: "Health Score",
      value: `${healthScore}%`,
      icon: Activity,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      subtext: "System reliability"
    }
  ];

  return (
    <div className="space-y-4">

      {/* Integrations Management Header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Integrations Management</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card 
            key={integration.id} 
            className="relative cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => console.log('View integration details for', integration.name)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(integration.status)}
                  <div>
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {getStatusDescription(integration.status, integration.lastSync)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`}></div>
                  <span className="text-xs text-foreground">
                    {integration.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>

              {/* Error Message */}
              {integration.errorMessage && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>{integration.errorMessage}</div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <div className="text-sm font-medium mb-2">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  Test
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  Sync
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full h-8 text-xs">
              <Plus className="h-4 w-4 mr-2" />
              Configure New Integration
            </Button>
            <Button variant="outline" className="w-full h-8 text-xs">
              <FileText className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
            <Button variant="outline" className="w-full h-8 text-xs">
              <Activity className="h-4 w-4 mr-2" />
              Integration Logs
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-2">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Full Sync</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Data Quality Score</span>
              <Badge className="bg-green-500 text-white text-xs">98%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Response Time</span>
              <span className="text-sm text-muted-foreground">245ms</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
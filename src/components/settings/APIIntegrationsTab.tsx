import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Key, RefreshCw, Zap, Mail, Cloud, MessageSquare, Plus, Clock, CreditCard } from 'lucide-react';

const APIIntegrationsTab = () => {
  const [integrations, setIntegrations] = useState({
    xero: true,
    gtg: false,
    whatsapp: false,
    email: true,
    googleDrive: true,
    aiAgent: true,
    simplepay: false
  });

  const [apiKeys] = useState([
    { id: 1, name: 'Production API', description: 'Main production system access', created: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Reporting API', description: 'Analytics and reporting', created: '2024-02-10', status: 'Active' },
    { id: 3, name: 'Mobile App', description: 'Staff mobile application', created: '2024-03-01', status: 'Inactive' }
  ]);

  const handleToggle = (integration: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration as keyof typeof prev]
    }));
  };

  const generateNewKey = () => {
    console.log('Generating new API key...');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              API Key Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{key.name}</p>
                  <p className="text-xs text-gray-500">{key.description}</p>
                  <p className="text-xs text-gray-400">Created: {key.created}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${key.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs font-medium">{key.status}</span>
                </div>
              </div>
            ))}
            
            <Button variant="outline" onClick={generateNewKey} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Generate New Key
            </Button>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              System Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Xero Integration</Label>
                  <p className="text-xs text-gray-500">Accounting synchronization</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={integrations.xero}
                  onCheckedChange={() => handleToggle('xero')}
                />
                {integrations.xero && (
                  <Button variant="outline" size="sm">Sync</Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium">GTG Time Tracking</Label>
                  <p className="text-xs text-gray-500">Biometric attendance system</p>
                </div>
              </div>
              <Switch
                checked={integrations.gtg}
                onCheckedChange={() => handleToggle('gtg')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium">SimplePay Payroll</Label>
                  <p className="text-xs text-gray-500">Payroll processing & compliance</p>
                </div>
              </div>
              <Switch
                checked={integrations.simplepay}
                onCheckedChange={() => handleToggle('simplepay')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium">WhatsApp Notifications</Label>
                  <p className="text-xs text-gray-500">Production alerts & updates</p>
                </div>
              </div>
              <Switch
                checked={integrations.whatsapp}
                onCheckedChange={() => handleToggle('whatsapp')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-gray-500">System alerts & reports</p>
                </div>
              </div>
              <Switch
                checked={integrations.email}
                onCheckedChange={() => handleToggle('email')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cloud className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Google Drive Sync</Label>
                  <p className="text-xs text-gray-500">Design files & documentation</p>
                </div>
              </div>
              <Switch
                checked={integrations.googleDrive}
                onCheckedChange={() => handleToggle('googleDrive')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIIntegrationsTab;

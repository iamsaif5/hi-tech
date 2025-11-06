
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Brain, Zap, AlertTriangle, BarChart3 } from 'lucide-react';

const AIAutomationTab = () => {
  const [aiSettings, setAiSettings] = useState({
    dailySummary: true,
    weeklySummary: true,
    productionInsights: true,
    anomalyDetection: false,
    provider: 'OpenAI',
    productionThreshold: 30,
    downtimeThreshold: 15
  });

  const handleToggle = (setting: string) => {
    setAiSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleInputChange = (setting: string, value: string | number) => {
    setAiSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">AI & Automation</h2>
        <p className="text-sm text-gray-600">Configure intelligent automation and AI insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-blue-600" />
              AI Insights & Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Daily AI Summary</Label>
                <p className="text-xs text-gray-500">Automated daily production & KPI summary</p>
              </div>
              <Switch
                checked={aiSettings.dailySummary}
                onCheckedChange={() => handleToggle('dailySummary')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Weekly Top Insight Summary</Label>
                <p className="text-xs text-gray-500">Key trends and performance insights</p>
              </div>
              <Switch
                checked={aiSettings.weeklySummary}
                onCheckedChange={() => handleToggle('weeklySummary')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Production Report Insights</Label>
                <p className="text-xs text-gray-500">AI analysis on production reports</p>
              </div>
              <Switch
                checked={aiSettings.productionInsights}
                onCheckedChange={() => handleToggle('productionInsights')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Anomaly Detection</Label>
                <p className="text-xs text-gray-500">Automatic detection of unusual patterns</p>
                <span className="text-xs text-orange-600 font-medium">Phase 2</span>
              </div>
              <Switch
                checked={aiSettings.anomalyDetection}
                onCheckedChange={() => handleToggle('anomalyDetection')}
              />
            </div>

            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">AI Provider</Label>
              <select
                value={aiSettings.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                className="mt-1 w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="OpenAI">OpenAI (GPT-4)</option>
                <option value="Claude">Anthropic Claude</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-blue-600" />
              Automation Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <Label className="text-sm font-medium">Production Threshold Warnings</Label>
              </div>
              <p className="text-xs text-gray-500 mb-3">Alert when production falls below target by X minutes</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={aiSettings.productionThreshold}
                  onChange={(e) => handleInputChange('productionThreshold', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">minutes</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <Label className="text-sm font-medium">Machine Downtime Alerts</Label>
              </div>
              <p className="text-xs text-gray-500 mb-3">Auto-flag when machine downtime exceeds X minutes</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={aiSettings.downtimeThreshold}
                  onChange={(e) => handleInputChange('downtimeThreshold', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">minutes</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Coming Soon</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Predictive maintenance scheduling</li>
                  <li>• Quality control pattern detection</li>
                  <li>• Inventory optimization suggestions</li>
                  <li>• Staff performance trend analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAutomationTab;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Clock, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PayrollSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
}

const StaffSettingsTab = () => {
  const [settings, setSettings] = useState<PayrollSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    casual_lateness_penalty: '10.00',
    permanent_lateness_penalty: '20.00',
    bonus_approval_required: 'true',
    payroll_cycle_days: '14',
    payroll_cycle_start_date: '',
    lunch_break_minutes: '60',
    shift_hours: '12',
    unpaid_break_threshold_hours: '6'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;

      setSettings(data || []);
      
      // Update form data with fetched settings
      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value || '';
        return acc;
      }, {} as Record<string, string>) || {};

      setFormData(prev => ({ ...prev, ...settingsMap }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('payroll_settings')
          .update({ 
            setting_value: update.setting_value, 
            updated_at: update.updated_at 
          })
          .eq('setting_key', update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Staff settings updated successfully",
      });
      
      await fetchSettings();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update settings",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lateness Penalties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Lateness Penalties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <Label className="text-sm font-medium">Casual Staff Penalty (per 10 minutes)</Label>
                <p className="text-xs text-muted-foreground">Penalty amount deducted for every 10 minutes late</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">R</span>
                <Input
                  type="text"
                  value={formData.casual_lateness_penalty}
                  onChange={(e) => handleInputChange('casual_lateness_penalty', e.target.value)}
                  className="w-20 h-8"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Permanent Staff Penalty (per 10 minutes)</Label>
                <p className="text-xs text-muted-foreground">Penalty amount deducted for every 10 minutes late</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">R</span>
                <Input
                  type="text"
                  value={formData.permanent_lateness_penalty}
                  onChange={(e) => handleInputChange('permanent_lateness_penalty', e.target.value)}
                  className="w-20 h-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Payroll Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <Label className="text-sm font-medium">Payroll Cycle (Days)</Label>
                <p className="text-xs text-muted-foreground">Number of days in each pay period</p>
              </div>
              <Input
                type="text"
                value={formData.payroll_cycle_days}
                onChange={(e) => handleInputChange('payroll_cycle_days', e.target.value)}
                className="w-16 h-8"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <Label className="text-sm font-medium">Payroll Cycle Start Date</Label>
                <p className="text-xs text-muted-foreground">First day of the next payroll period</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-8 w-[140px] justify-start text-left font-normal",
                      !formData.payroll_cycle_start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.payroll_cycle_start_date ? (
                      format(new Date(formData.payroll_cycle_start_date), "MMM dd, yyyy")
                    ) : (
                      <span className="text-xs">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.payroll_cycle_start_date ? new Date(formData.payroll_cycle_start_date) : undefined}
                    onSelect={(date) => handleInputChange('payroll_cycle_start_date', date ? date.toISOString().split('T')[0] : '')}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Bonus Approval Required</Label>
                <p className="text-xs text-muted-foreground">Supervisor bonuses require approval</p>
              </div>
              <Switch
                checked={formData.bonus_approval_required === 'true'}
                onCheckedChange={(checked) => 
                  handleInputChange('bonus_approval_required', checked ? 'true' : 'false')
                }
              />
            </div>
          </CardContent>
        </Card>


        {/* Break Time & Shift Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Break Time & Shift Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <Label className="text-sm font-medium">Lunch Break Duration (minutes)</Label>
                <p className="text-xs text-muted-foreground">Standard lunch break duration</p>
              </div>
              <Input
                type="text"
                value={formData.lunch_break_minutes}
                onChange={(e) => handleInputChange('lunch_break_minutes', e.target.value)}
                className="w-16 h-8"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <Label className="text-sm font-medium">Standard Shift Hours</Label>
                <p className="text-xs text-muted-foreground">Standard shift duration in hours</p>
              </div>
              <Input
                type="text"
                value={formData.shift_hours}
                onChange={(e) => handleInputChange('shift_hours', e.target.value)}
                className="w-16 h-8"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Unpaid Break Threshold (hours)</Label>
                <p className="text-xs text-muted-foreground">Hours threshold for automatic unpaid break deduction</p>
              </div>
              <Input
                type="text"
                value={formData.unpaid_break_threshold_hours}
                onChange={(e) => handleInputChange('unpaid_break_threshold_hours', e.target.value)}
                className="w-16 h-8"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wage Information */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-base">
              Wage Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Casual staff penalty:</span>
                <span className="text-xs font-medium">R{formData.casual_lateness_penalty} per 10min late</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Permanent staff penalty:</span>
                <span className="text-xs font-medium">R{formData.permanent_lateness_penalty} per 10min late</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Payroll cycle:</span>
                <span className="text-xs font-medium">{formData.payroll_cycle_days} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Bonus approval:</span>
                <span className="text-xs font-medium">{formData.bonus_approval_required === 'true' ? 'Required' : 'Not required'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time & Attendance Rules */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-base">
              Time & Attendance Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Standard shift duration:</span>
                <span className="text-xs font-medium">{formData.shift_hours} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Unpaid break for shifts over:</span>
                <span className="text-xs font-medium">{formData.unpaid_break_threshold_hours} hours</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
              <h4 className="text-xs font-medium text-orange-700 mb-2">Active Rules</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Staff working over {formData.unpaid_break_threshold_hours}h get {formData.lunch_break_minutes}min unpaid break deducted</li>
                <li>• {formData.payroll_cycle_days}-day payroll cycles with automated calculations</li>
                <li>• Supervisor bonuses {formData.bonus_approval_required === 'true' ? 'require approval' : 'auto-approved'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-hitec-primary hover:bg-hitec-primary/90">
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default StaffSettingsTab;
import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { putData } from '@/lib/Api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SHIFT_BONUS_KEY = 'default_shift_bonus';

/**
 * Operator-editable defaults.
 *
 * The per-shift bonus lives here because the amount changes — Lorraine sets it
 * once and every off-cycle run pre-fills from it, rather than it being typed in
 * from memory each time. The run flow can still override it for a single run.
 */
const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const settingUrl = `staff/settings/${SHIFT_BONUS_KEY}/`;
  const { data: shiftBonusSetting, isLoading } = useFetch<any>(settingUrl);

  const [shiftBonus, setShiftBonus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shiftBonusSetting) setShiftBonus(String(shiftBonusSetting.value ?? ''));
  }, [shiftBonusSetting?.value]);

  const saveShiftBonus = async () => {
    const amount = parseFloat(shiftBonus);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: 'Enter a valid amount',
        description: 'The bonus must be 0 or more.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    try {
      await putData({ url: settingUrl, data: { value: shiftBonus } });
      // The off-weekend run flow reads the same key, so drop its cached copy.
      queryClient.invalidateQueries({ queryKey: [settingUrl] });
      toast({
        title: 'Saved',
        description: `New payroll runs will pre-fill R${amount.toFixed(2)} per shift.`,
      });
    } catch (e: any) {
      toast({
        title: 'Could not save',
        description:
          e?.response?.data?.value || e?.response?.data?.detail || e?.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updatedBy = shiftBonusSetting?.updated_by_name;
  const updatedAt = shiftBonusSetting?.updated_at;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Defaults used across payroll runs.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Default bonus per shift</CardTitle>
          <CardDescription>
            Pre-filled on Off Weekend, Special and Monthly payroll runs and
            multiplied by the shifts each person actually worked — two days at
            R50 gives R100. It can still be changed for a single run, or per
            employee, without changing this default.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Amount (R)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="mt-1 w-40"
                    value={shiftBonus}
                    onChange={e => setShiftBonus(e.target.value)}
                    placeholder="50.00"
                    disabled={!isAdmin}
                  />
                </div>
                {isAdmin && (
                  <Button onClick={saveShiftBonus} disabled={saving} className="gap-2">
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                )}
              </div>

              {!isAdmin && (
                <p className="text-xs text-muted-foreground">
                  Only an admin can change this.
                </p>
              )}

              {updatedBy && updatedAt && (
                <p className="text-xs text-muted-foreground">
                  Last changed by {updatedBy} on{' '}
                  {new Date(updatedAt).toLocaleString('en-ZA')}.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

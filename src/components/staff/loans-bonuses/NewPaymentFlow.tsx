import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Users, DollarSign, CheckCircle, Loader2, X, Search } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { postData } from '@/lib/Api';
import { useToast } from '@/hooks/use-toast';

export type FlowPaymentType = 'bonus' | 'transport' | 'airtime' | 'fuel' | 'other';

const TYPE_LABEL: Record<FlowPaymentType, string> = {
  bonus: 'Bonus',
  transport: 'Transport',
  airtime: 'Airtime',
  fuel: 'Fuel',
  other: 'Other',
};

const BONUS_REASONS = [
  { value: 'performance', label: 'Performance Bonus' },
  { value: 'special', label: 'Special Bonus' },
  { value: 'every_second_fortnight', label: 'Every Second Fortnight Bonus' },
];

/** Airtime is always reimbursed separately; the backend rejects a target on it. */
const CAN_TARGET_PAYROLL: Record<FlowPaymentType, boolean> = {
  bonus: true, other: true, transport: true, fuel: true, airtime: false,
};
/** Transport and fuel are often standing arrangements, not one-offs. */
const CAN_RECUR: Record<FlowPaymentType, boolean> = {
  bonus: false, other: false, transport: true, fuel: true, airtime: false,
};

/** 'other' must always name a run; transport/fuel may opt in. */
const MUST_TARGET_PAYROLL: Record<FlowPaymentType, boolean> = {
  bonus: true, other: true, transport: false, fuel: false, airtime: false,
};

// Guard rails before a large payment goes out.
const CONFIRM_STAFF_COUNT = 20;
const CONFIRM_RAND_TOTAL = 10000;

interface SelectedRow {
  staff_id: number;
  display: string;
  factory: string;
  employee_type: string;
  amount: string;
  overridden: boolean;
}

interface Props {
  paymentType: FlowPaymentType;
  onBack: () => void;
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: 'Details', icon: DollarSign },
  { id: 2, title: 'Select Staff', icon: Users },
  { id: 3, title: 'Amounts', icon: CheckCircle },
];

const NewPaymentFlow: React.FC<Props> = ({ paymentType, onBack, onComplete }) => {
  const { toast } = useToast();
  const label = TYPE_LABEL[paymentType];
  const isBonus = paymentType === 'bonus';

  const [step, setStep] = useState(1);
  const [targetPayroll, setTargetPayroll] = useState<'general' | 'weekend' | ''>(
    MUST_TARGET_PAYROLL[paymentType] ? 'general' : '',
  );
  const [bonusReason, setBonusReason] = useState('performance');
  const [recurrence, setRecurrence] = useState<'once_off' | 'every_fortnight'>('once_off');
  // Bonuses repeat for a fixed number of pay runs rather than until stopped,
  // so they carry a count instead of the transport/fuel 'until ended' model.
  const [repeatPeriods, setRepeatPeriods] = useState<string>('');
  const [perShift, setPerShift] = useState(false);
  const [syncToSimplePay, setSyncToSimplePay] = useState(true);
  const [customReason, setCustomReason] = useState('');
  const [defaultAmount, setDefaultAmount] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Record<number, SelectedRow>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: staffData, isLoading: staffLoading } = useFetch<any>('/staff/members/?page_size=1000');
  const staffList: any[] = useMemo(() => {
    if (!staffData) return [];
    return Array.isArray(staffData) ? staffData : staffData?.results || [];
  }, [staffData]);

  // An off-weekend run is never sent to SimplePay, so a bonus on it cannot be
  // synced either — the backend rejects that combination outright.
  const offWeekend = targetPayroll === 'weekend';

  const staffByFactory = useMemo(() => {
    const q = search.trim().toLowerCase();
    const buckets: Record<string, any[]> = {};
    for (const s of staffList) {
      if (q) {
        const hay = `${s.first_name || ''} ${s.last_name || ''} ${s.clock_number || ''} ${s.factory || ''}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      (buckets[s.factory || '(no factory)'] ||= []).push(s);
    }
    return buckets;
  }, [staffList, search]);

  const totalSelected = Object.keys(selected).length;
  const totalRand = useMemo(
    () => Object.values(selected).reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0),
    [selected],
  );

  const rowFor = (staff: any): SelectedRow => ({
    staff_id: staff.id,
    display:
      `${staff.first_name || ''} ${staff.last_name || ''}`.trim() +
      (staff.clock_number ? ` (${staff.clock_number})` : ''),
    factory: staff.factory || '',
    employee_type: staff.employee_type || '',
    amount: defaultAmount || '',
    overridden: false,
  });

  const toggleOne = (staff: any) =>
    setSelected(prev => {
      const next = { ...prev };
      if (next[staff.id]) delete next[staff.id];
      else next[staff.id] = rowFor(staff);
      return next;
    });

  const toggleFactory = (factory: string, on: boolean) =>
    setSelected(prev => {
      const next = { ...prev };
      for (const s of staffByFactory[factory] || []) {
        if (on) next[s.id] ||= rowFor(s);
        else delete next[s.id];
      }
      return next;
    });

  // Changing the default rewrites every row the operator hasn't hand-edited.
  useEffect(() => {
    setSelected(prev => {
      const next = { ...prev };
      for (const id of Object.keys(next)) {
        const row = next[Number(id)];
        if (!row.overridden) next[Number(id)] = { ...row, amount: defaultAmount || '' };
      }
      return next;
    });
  }, [defaultAmount]);

  const overrideRow = (staffId: number, amount: string) =>
    setSelected(prev => ({ ...prev, [staffId]: { ...prev[staffId], amount, overridden: true } }));

  const removeRow = (staffId: number) =>
    setSelected(prev => {
      const next = { ...prev };
      delete next[staffId];
      return next;
    });

  const detailsError = (): string | null => {
    if (MUST_TARGET_PAYROLL[paymentType] && !targetPayroll) return 'Choose which payroll this is paid on.';
    if (paymentType === 'other' && !customReason.trim()) return 'Enter a reason.';
    return null;
  };

  const amountsError = (): string | null => {
    if (!totalSelected) return 'Select at least one staff member.';
    for (const row of Object.values(selected)) {
      if (!(parseFloat(row.amount) > 0)) return `Enter a positive amount for ${row.display}.`;
    }
    return null;
  };

  const submit = async () => {
    if (submitting) return;
    const problem = detailsError() || amountsError();
    if (problem) {
      toast({ title: 'Check the form', description: problem, variant: 'destructive' });
      return;
    }
    if (!confirmOpen && (totalSelected >= CONFIRM_STAFF_COUNT || totalRand >= CONFIRM_RAND_TOTAL)) {
      setConfirmOpen(true);
      return;
    }

    setSubmitting(true);
    setConfirmOpen(false);
    try {
      if (isBonus) {
        // One submission, one approval, however many people are on it. This
        // used to post a bonus per person, so a bonus for three people
        // reached the approver as three unrelated requests.
        await postData({
          url: 'staff/bonuses/batch/',
          data: {
            target_payroll: targetPayroll,
            bonus_reason: bonusReason,
            reason: BONUS_REASONS.find(r => r.value === bonusReason)?.label || bonusReason,
            recurrence_periods: repeatPeriods ? Number(repeatPeriods) : null,
            per_shift: perShift,
            // The operator's choice, except where it cannot apply: an
            // off-weekend run never reaches SimplePay and a casual's pay
            // stays in the app. The backend enforces both per person.
            sync_to_simplepay: syncToSimplePay && !offWeekend,
            lines: Object.values(selected).map(row => ({
              staff_member: row.staff_id,
              amount: parseFloat(row.amount),
            })),
          },
        });
      } else {
        const payload: any = {
          payment_type: paymentType,
          submit: true,
          lines: Object.values(selected).map(r => ({
            staff_id: r.staff_id,
            amount: parseFloat(r.amount),
          })),
        };
        if (CAN_TARGET_PAYROLL[paymentType] && targetPayroll) payload.target_payroll = targetPayroll;
        if (CAN_RECUR[paymentType]) payload.recurrence = recurrence;
        if (paymentType === 'other') payload.custom_reason = customReason.trim();
        await postData({ url: 'staff/wage-requests/', data: payload });
      }

      toast({
        title: `${label} submitted for approval`,
        description: `${totalSelected} staff · R${totalRand.toFixed(2)}`,
      });
      onComplete();
    } catch (e: any) {
      const data = e?.response?.data;
      toast({
        title: 'Submit failed',
        description:
          data?.error || data?.detail || (data ? JSON.stringify(data) : e?.message) || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canAdvance = step === 1 ? !detailsError() : step === 2 ? totalSelected > 0 : true;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-bold">New {label}</h2>
          <p className="text-sm text-muted-foreground">
            Select staff, enter the amounts, then submit for approval.
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center border-2 ${
                        done
                          ? 'bg-green-500 border-green-500 text-white'
                          : active
                          ? 'border-blue-500 text-blue-600'
                          : 'border-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-sm ${active ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-3" />}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step 1 — details */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle className="text-base">{label} details</CardTitle></CardHeader>
          <CardContent className="space-y-4 max-w-xl">
            {CAN_TARGET_PAYROLL[paymentType] && (
              <div>
                <Label className="text-sm">
                  Paid on {MUST_TARGET_PAYROLL[paymentType] ? '' : '(optional)'}
                </Label>
                <Select
                  value={targetPayroll || 'none'}
                  onValueChange={v => setTargetPayroll(v === 'none' ? '' : (v as 'general' | 'weekend'))}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {!MUST_TARGET_PAYROLL[paymentType] && (
                      <SelectItem value="none">Paid separately (not on a payroll run)</SelectItem>
                    )}
                    <SelectItem value="general">Fortnight Payroll</SelectItem>
                    <SelectItem value="weekend">Off Weekend Payroll</SelectItem>
                  </SelectContent>
                </Select>
                {offWeekend && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Off weekend payroll is paid from the app and is never sent to SimplePay.
                  </p>
                )}
              </div>
            )}

            {CAN_RECUR[paymentType] && (
              <div>
                <Label className="text-sm">How often</Label>
                <Select value={recurrence} onValueChange={v => setRecurrence(v as any)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once_off">Once off</SelectItem>
                    <SelectItem value="every_fortnight">Every fortnight</SelectItem>
                  </SelectContent>
                </Select>
                {recurrence === 'every_fortnight' && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Keeps running until an admin ends it. Ending it stops future payments and
                    keeps the record of what was already paid.
                  </p>
                )}
              </div>
            )}

            {isBonus && (
              <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
                <div>
                  <Label className="text-sm">Repeat for</Label>
                  <Select value={repeatPeriods || 'once'} onValueChange={v => setRepeatPeriods(v === 'once' ? '' : v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once only</SelectItem>
                      {[2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} pay runs</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={perShift}
                    onCheckedChange={v => setPerShift(Boolean(v))}
                    className="mt-0.5"
                  />
                  <span className="text-sm">
                    Amount is a rate per shift
                    <span className="block text-xs text-muted-foreground">
                      Multiplied by the shifts each person actually worked, so two days at
                      R50 pays R100. Leave unticked to pay the amount as entered.
                    </span>
                  </span>
                </label>

                {repeatPeriods && (
                  <p className="text-xs text-muted-foreground">
                    Approved once, then applied automatically to the next {repeatPeriods} runs of
                    the payroll you chose above, and stopped after that. An admin can end it early.
                  </p>
                )}
              </div>
            )}

            {isBonus && (
              <div>
                <Label className="text-sm">Reason</Label>
                <Select value={bonusReason} onValueChange={setBonusReason}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BONUS_REASONS.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isBonus && (
              <div className="rounded-lg border bg-muted/30 p-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 cursor-pointer"
                    checked={syncToSimplePay && !offWeekend}
                    disabled={offWeekend}
                    onChange={e => setSyncToSimplePay(e.target.checked)}
                  />
                  <span className="text-xs">
                    <span className="font-medium">Push through to SimplePay</span>
                    <span className="block text-muted-foreground mt-0.5">
                      {offWeekend
                        ? 'Not available — off weekend payroll is always paid from the app only.'
                        : 'Untick to pay this from the app only, without it appearing on the SimplePay payslip. Casual staff are always app only.'}
                    </span>
                  </span>
                </label>
              </div>
            )}

            {paymentType === 'other' && (
              <div>
                <Label className="text-sm">Reason</Label>
                <Textarea
                  className="mt-1"
                  maxLength={200}
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  placeholder="What is this payment for?"
                />
              </div>
            )}

            {!CAN_TARGET_PAYROLL[paymentType] && (
              <p className="text-sm text-muted-foreground">
                {label} is reimbursed separately on its own bank file. It never forms part of a
                payroll run and is not sent to SimplePay.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2 — staff */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Select staff ({totalSelected} selected)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search name, clock number or factory…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {staffLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading staff…
              </div>
            ) : (
              <div className="border rounded-lg divide-y max-h-[460px] overflow-y-auto">
                {Object.entries(staffByFactory).map(([factory, list]) => {
                  const selectedHere = list.filter(s => selected[s.id]).length;
                  const allSelected = selectedHere === list.length && list.length > 0;
                  return (
                    <div key={factory}>
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 sticky top-0">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={v => toggleFactory(factory, !!v)}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wide">{factory}</span>
                        <span className="text-xs text-muted-foreground">
                          {selectedHere}/{list.length}
                        </span>
                      </div>
                      {list.map(s => (
                        <label
                          key={s.id}
                          className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                        >
                          <Checkbox checked={!!selected[s.id]} onCheckedChange={() => toggleOne(s)} />
                          <span className="flex-1">
                            {s.first_name} {s.last_name}
                            {s.clock_number && (
                              <span className="text-muted-foreground"> ({s.clock_number})</span>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {s.employee_type}
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3 — amounts */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Amounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <Label className="text-sm">Amount for everyone (R)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 w-48"
                  value={defaultAmount}
                  onChange={e => setDefaultAmount(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Fills every row. Edit a row below to override it.
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs text-muted-foreground">{totalSelected} staff</div>
                <div className="text-xl font-bold">R{totalRand.toFixed(2)}</div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium">Staff</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Factory</th>
                    <th className="text-left py-2 px-3 text-xs font-medium">Amount (R)</th>
                    <th className="py-2 px-3"><span className="sr-only">Remove</span></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(selected).map(row => (
                    <tr key={row.staff_id} className="border-t">
                      <td className="py-2 px-3 text-xs">{row.display}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{row.factory}</td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`h-8 w-32 ${row.overridden ? 'ring-1 ring-amber-400' : ''}`}
                          value={row.amount}
                          onChange={e => overrideRow(row.staff_id, e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeRow(row.staff_id)}
                          className="text-muted-foreground hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nav */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => (step === 1 ? onBack() : setStep(step - 1))}>
          {step === 1 ? 'Cancel' : 'Previous'}
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => {
              const problem = step === 1 ? detailsError() : null;
              if (problem) {
                toast({ title: 'Check the form', description: problem, variant: 'destructive' });
                return;
              }
              setStep(step + 1);
            }}
            disabled={!canAdvance}
          >
            Next
          </Button>
        ) : (
          <Button onClick={submit} disabled={submitting || !totalSelected}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit for approval
          </Button>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit this {label.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              {totalSelected} staff for a total of R{totalRand.toFixed(2)}. This goes to an admin
              for approval before any money moves.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewPaymentFlow;

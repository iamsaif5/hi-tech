import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Loader2, BarChart3 } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { downloadFile } from '@/lib/Api';
import { useToast } from '@/hooks/use-toast';

type Scope = 'current' | 'custom' | 'all';

interface Props {
  /** Defaults the filter to the run type the operator is looking at. */
  runType?: string;
  /** The period currently on screen, used by the "Current period" scope. */
  currentStart?: string;
  currentEnd?: string;
}

/**
 * Loan and bonus totals per pay run.
 *
 * Lorraine: "we had asked for a summary per pay run and what we got was a
 * summary per person." Current period, a custom range, or everything.
 */
const PayrollSummaryDialog: React.FC<Props> = ({ runType, currentStart, currentEnd }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<Scope>(currentStart ? 'current' : 'all');
  const [factory, setFactory] = useState('all');
  const [start, setStart] = useState(currentStart || '');
  const [end, setEnd] = useState(currentEnd || '');
  const [downloading, setDownloading] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (runType) params.set('run_type', runType);
    if (factory !== 'all') params.set('factory', factory);
    if (scope === 'current') {
      if (currentStart) params.set('start_date', currentStart);
      if (currentEnd) params.set('end_date', currentEnd);
    } else if (scope === 'custom') {
      if (start) params.set('start_date', start);
      if (end) params.set('end_date', end);
    }
    // 'all' deliberately sends no dates.
    return params.toString();
  }, [runType, factory, scope, start, end, currentStart, currentEnd]);

  const { data, isLoading } = useFetch<any>(
    open ? `staff/payroll-summary/?${query}` : '',
    { enabled: open },
  );

  const runs = data?.runs || [];
  const totals = data?.totals || {};

  const money = (n: number) =>
    `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  const download = async () => {
    setDownloading(true);
    try {
      await downloadFile(`staff/payroll-summary/export/?${query}`, 'payroll_summary.xls');
    } catch (e: any) {
      toast({
        title: 'Download failed',
        description: e?.response?.data?.error || e?.message,
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payroll summary</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Period</Label>
            <Select value={scope} onValueChange={v => setScope(v as Scope)}>
              <SelectTrigger className="mt-1 w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {/* Shows the dates so it is clear which period "current" means. */}
                <SelectItem value="current" disabled={!currentStart}>
                  {currentStart && currentEnd
                    ? `Current period (${currentStart} → ${currentEnd})`
                    : 'Current period'}
                </SelectItem>
                <SelectItem value="custom">Custom period</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scope === 'custom' && (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input type="date" className="mt-1" value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input type="date" className="mt-1" value={end} onChange={e => setEnd(e.target.value)} />
              </div>
            </>
          )}

          <div>
            <Label className="text-xs text-muted-foreground">Company</Label>
            <Select value={factory} onValueChange={setFactory}>
              <SelectTrigger className="mt-1 w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                <SelectItem value="hitec">Hitec</SelectItem>
                <SelectItem value="RANDM">Rob &amp; Martin</SelectItem>
                <SelectItem value="CASUALS">Casuals</SelectItem>
                <SelectItem value="YOUTH_WORK">Youth @ Work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={download} disabled={downloading || isLoading} className="ml-auto gap-2">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Download
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : !runs.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No payroll runs in this period.
          </p>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-medium">Run</th>
                  <th className="text-left py-2 px-3 text-xs font-medium">Period</th>
                  <th className="text-left py-2 px-3 text-xs font-medium">Company</th>
                  <th className="text-right py-2 px-3 text-xs font-medium">Staff</th>
                  <th className="text-right py-2 px-3 text-xs font-medium">Bonuses</th>
                  <th className="text-right py-2 px-3 text-xs font-medium">Loans</th>
                  <th className="text-right py-2 px-3 text-xs font-medium">Net</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r: any) => (
                  <tr key={r.batch_id} className="border-t">
                    <td className="py-2 px-3 text-xs">{r.run_type_display}</td>
                    <td className="py-2 px-3 text-xs whitespace-nowrap">
                      {r.start_date} → {r.end_date}
                    </td>
                    <td className="py-2 px-3 text-xs">{r.factory}</td>
                    <td className="py-2 px-3 text-xs text-right">{r.staff_count}</td>
                    <td className="py-2 px-3 text-xs text-right">{money(r.total_bonus)}</td>
                    <td className="py-2 px-3 text-xs text-right">{money(r.total_loans)}</td>
                    <td className="py-2 px-3 text-xs text-right font-medium">{money(r.total_net)}</td>
                  </tr>
                ))}
                <tr className="border-t bg-muted/40 font-semibold">
                  <td className="py-2 px-3 text-xs" colSpan={3}>
                    Total — {totals.run_count} run{totals.run_count === 1 ? '' : 's'}
                  </td>
                  <td className="py-2 px-3 text-xs text-right">
                    {runs.reduce((sum: number, r: any) => sum + r.staff_count, 0)}
                  </td>
                  <td className="py-2 px-3 text-xs text-right">{money(totals.total_bonus)}</td>
                  <td className="py-2 px-3 text-xs text-right">{money(totals.total_loans)}</td>
                  <td className="py-2 px-3 text-xs text-right">{money(totals.total_net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PayrollSummaryDialog;

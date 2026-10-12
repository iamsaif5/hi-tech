import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, CheckCircle, RotateCcw } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { downloadFile, postData } from '@/lib/Api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fmtDateTime } from '@/lib/utils';

/**
 * Batch list for the standalone payment types.
 *
 * Bonuses are deliberately absent — they live on the Bonus model with their
 * own tab, so that there is a single bonus system rather than two feeding the
 * same payroll total.
 */
export type WagePaymentType = 'transport' | 'airtime' | 'fuel' | 'other';

export interface WageBatch {
  id: number;
  payment_type: WagePaymentType;
  target_payroll: string;
  custom_reason: string;
  status: string;
  submitted_by_name: string;
  submitted_at: string | null;
  approved_by_name: string | null;
  approved_at: string | null;
  created_at: string;
  line_count: number;
  total_amount: string;
}

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    draft: 'bg-slate-200 text-slate-700',
    pending: 'bg-amber-100 text-amber-800',
    queried: 'bg-rose-100 text-rose-800',
    partially_approved: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800',
  };
  const label: Record<string, string> = {
    draft: 'Draft',
    pending: 'Pending',
    queried: 'Queried',
    partially_approved: 'Partially approved',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {label[status] || status}
    </span>
  );
};

interface Props {
  paymentType: WagePaymentType;
  /** Bumped by the parent after a new batch is submitted, to force a refetch. */
  reloadKey?: number;
}

const WageBatchTable: React.FC<Props> = ({ paymentType, reloadKey = 0 }) => {
  const { toast } = useToast();
  const { user } = useAuth() as any;
  const isAdmin = user?.role === 'admin';

  const { data, isLoading, refetch } = useFetch<any>(
    `/staff/wage-requests/?payment_type=${paymentType}&ordering=-created_at&r=${reloadKey}`,
    { enabled: true },
  );

  const batches: WageBatch[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data?.results || [];
  }, [data]);

  const fail = (title: string) => (e: any) =>
    toast({
      title,
      description: e?.response?.data?.error || e?.message || 'Unknown error',
      variant: 'destructive',
    });

  const downloadCSV = async (batch: WageBatch) => {
    try {
      await downloadFile(
        `staff/wage-requests/${batch.id}/export-csv/`,
        `wage_${batch.payment_type}_${batch.id}.xls`,
      );
    } catch (e: any) {
      fail('Download failed')(e);
    }
  };

  const recall = async (batch: WageBatch) => {
    try {
      await postData({ url: `staff/wage-requests/${batch.id}/recall/`, data: {} });
      toast({ title: 'Recalled to draft' });
      refetch?.();
    } catch (e: any) {
      fail('Recall failed')(e);
    }
  };

  const approve = async (batch: WageBatch) => {
    try {
      await postData({ url: `staff/wage-requests/${batch.id}/approve/`, data: {} });
      toast({ title: 'Approved' });
      refetch?.();
    } catch (e: any) {
      fail('Approve failed')(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-10 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  if (!batches.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg py-10 text-center text-sm text-muted-foreground">
        No {paymentType} requests yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground">#</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Staff</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-foreground">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Paid on</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Reason</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Submitted by</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground">Approved by</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-foreground">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2 px-4 text-xs text-muted-foreground font-mono tabular-nums">{b.id}</td>
                <td className="py-2 px-4 text-xs"><StatusBadge status={b.status} /></td>
                <td className="py-2 px-4 text-xs">{b.line_count}</td>
                <td className="py-2 px-4 text-xs text-right">
                  R{Number(b.total_amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-4 text-xs">
                  {b.target_payroll === 'general' ? (
                    'Fortnight payroll'
                  ) : b.target_payroll === 'weekend' ? (
                    'Off weekend payroll'
                  ) : (
                    <span className="text-muted-foreground">Paid separately</span>
                  )}
                </td>
                <td className="py-2 px-4 text-xs">{b.custom_reason || '—'}</td>
                <td className="py-2 px-4 text-xs">
                  <div>{b.submitted_by_name || '—'}</div>
                  <div className="text-muted-foreground">{fmtDateTime(b.submitted_at) || '—'}</div>
                </td>
                <td className="py-2 px-4 text-xs">
                  <div>{b.approved_by_name || '—'}</div>
                  <div className="text-muted-foreground">{fmtDateTime(b.approved_at) || '—'}</div>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <div className="flex gap-1 justify-end">
                    {b.status === 'pending' && (
                      <>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 border-green-200 text-green-700 hover:bg-green-50"
                            onClick={() => approve(b)}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => recall(b)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Recall
                        </Button>
                      </>
                    )}
                    {(b.status === 'approved' || b.status === 'partially_approved') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => downloadCSV(b)}
                        title="Download bank file"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Bank file
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WageBatchTable;

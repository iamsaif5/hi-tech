import React from 'react';
import { Loader2 } from 'lucide-react';
import useFetch from '@/hooks/useFetch';

interface Line {
  id: number;
  name: string;
  clock: string;
  factory: string;
  amount: string;
  status: string;
  note?: string;
}

interface Props {
  /** Which store the rows come from — the two shapes differ slightly. */
  kind: 'wage' | 'bonus';
  batchId: number;
  /** Rendered only when the card is open, so no request is made per row. */
  open: boolean;
  expectedCount?: number;
}

const STATUS_STYLE: Record<string, string> = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  queried: 'bg-red-50 text-red-700 border-red-200',
  rejected: 'bg-gray-100 text-gray-600 border-gray-200',
};

/**
 * Who is actually being paid, and how much each.
 *
 * An approval card showed a staff count and a total, so approving a batch
 * meant agreeing to a number without seeing the people behind it. Loaded on
 * expand rather than inlined on every approval row, since the list can hold
 * many requests.
 */
const ApprovalLines: React.FC<Props> = ({ kind, batchId, open, expectedCount }) => {
  const url = kind === 'wage'
    ? `staff/wage-requests/${batchId}/`
    : `staff/bonuses/?batch=${batchId}`;

  const { data } = useFetch<any>(open ? url : '', { enabled: open });

  // Wage requests nest their lines; bonuses come back as a list, paginated or not.
  const raw: any[] = kind === 'wage'
    ? (Array.isArray(data?.lines) ? data.lines : [])
    : (Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []);

  const lines: Line[] = raw.map(r => ({
    id: r.id,
    name: kind === 'wage' ? r.staff_name : r.staff_member_name,
    clock: kind === 'wage' ? r.staff_clock_number : r.clock_number,
    factory: r.staff_factory || r.factory || '',
    amount: r.amount,
    status: r.status,
    note: kind === 'wage' ? r.query_note : r.query_comment,
  }));

  if (!open) return null;

  if (!data) {
    return (
      <p className="pt-1 text-xs text-muted-foreground flex items-center gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading {expectedCount ? `${expectedCount} ` : ''}staff…
      </p>
    );
  }

  if (!lines.length) {
    return <p className="pt-1 text-xs text-muted-foreground">No staff on this request.</p>;
  }

  const total = lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
  // Only worth a column when they differ — that is a batch already part-decided.
  const mixed = new Set(lines.map(l => l.status)).size > 1;

  return (
    <div className="pt-1">
      <p className="mb-1 text-xs font-medium text-muted-foreground">
        Staff on this request ({lines.length})
      </p>

      <div className="max-h-56 overflow-y-auto rounded border">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-accent">
            <tr>
              <th className="px-2 py-1 text-left font-medium">Clock</th>
              <th className="px-2 py-1 text-left font-medium">Name</th>
              <th className="px-2 py-1 text-left font-medium">Company</th>
              <th className="px-2 py-1 text-right font-medium">Amount</th>
              {mixed && <th className="px-2 py-1 text-left font-medium">Status</th>}
            </tr>
          </thead>
          <tbody className="bg-white">
            {lines.map(line => (
              <tr key={line.id} className="border-t">
                <td className="px-2 py-1">{line.clock || '—'}</td>
                <td className="px-2 py-1">
                  {line.name}
                  {line.note && (
                    <span className="block text-[11px] text-red-600">Query: {line.note}</span>
                  )}
                </td>
                <td className="px-2 py-1 text-muted-foreground">{line.factory || '—'}</td>
                <td className="px-2 py-1 text-right font-medium">
                  R{(parseFloat(line.amount) || 0).toFixed(2)}
                </td>
                {mixed && (
                  <td className="px-2 py-1">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[11px] capitalize ${
                        STATUS_STYLE[line.status] || STATUS_STYLE.rejected
                      }`}
                    >
                      {line.status}
                    </span>
                  </td>
                )}
              </tr>
            ))}
            <tr className="border-t bg-muted/40 font-semibold">
              <td className="px-2 py-1" colSpan={3}>Total</td>
              <td className="px-2 py-1 text-right">R{total.toFixed(2)}</td>
              {mixed && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalLines;

import React from 'react';
import { Eye, FileText, Loader2 } from 'lucide-react';
import useFetch from '@/hooks/useFetch';

interface Props {
  /** 'loan' uses the generic Document store; 'bonus' has its own table. */
  kind: 'loan' | 'bonus';
  id: number;
  /** From the approval detail, so the list only loads when there is something. */
  count?: number;
}

interface Doc {
  id: number;
  file_name: string;
  file_url: string;
  size_bytes?: number;
  uploaded_by_name?: string;
  uploaded_by?: string;
}

/**
 * Supporting documents, read only, for whoever is approving.
 *
 * Deliberately not DocumentManager: an approver is reviewing what was
 * submitted, not editing it, so there is no upload box and no delete. The two
 * record types are stored differently but expose the same few fields.
 */
const ApprovalDocuments: React.FC<Props> = ({ kind, id, count }) => {
  const url = kind === 'loan'
    ? `staff/documents/?owner_type=loan&owner_id=${id}`
    : `staff/bonuses/${id}/documents/`;

  // Skip the request entirely when the approval says there are none.
  const enabled = count !== 0;
  const { data, isLoading } = useFetch<Doc[]>(enabled ? url : '', { enabled });
  const docs: Doc[] = Array.isArray(data) ? data : [];

  if (!enabled || (!isLoading && docs.length === 0)) return null;

  return (
    <div className="pt-1">
      <p className="text-xs font-medium text-muted-foreground mb-1">
        Supporting Documents
      </p>

      {isLoading ? (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading…
        </p>
      ) : (
        <ul className="space-y-1 min-w-0">
          {docs.map(doc => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-2 min-w-0 rounded bg-gray-50 px-2 py-1"
            >
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-xs text-blue-600 hover:underline"
                  title={doc.file_name}
                >
                  {doc.file_name}
                </a>
                {doc.size_bytes != null && (
                  <span className="shrink-0 text-[11px] text-gray-400">
                    ({(doc.size_bytes / 1024).toFixed(0)} KB)
                  </span>
                )}
              </div>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-gray-400 hover:text-blue-600"
                title="View"
              >
                <Eye className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovalDocuments;

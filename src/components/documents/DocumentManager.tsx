import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Paperclip, FileText, X, Loader2, Download } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { deleteData, postData } from '@/lib/Api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fmtDateTime } from '@/lib/utils';

export type DocumentOwnerType = 'staff' | 'loan' | 'payroll_batch';

interface Doc {
  id: number;
  file_name: string;
  file_url: string;
  size_bytes: number;
  uploaded_by_name: string;
  uploaded_at: string;
}

interface Props {
  ownerType: DocumentOwnerType;
  /** Null while the owner is still being created — upload is disabled until saved. */
  ownerId: number | null;
  label?: string;
}

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.doc,.docx';
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Attach, view and remove files on a staff member, loan or payroll run.
 *
 * One component for all three so the behaviour cannot drift. It replaces the
 * dropzones on staff and loans, which looked like they worked but held the
 * files in browser state and never uploaded them.
 */
const DocumentManager: React.FC<Props> = ({ ownerType, ownerId, label = 'Documents' }) => {
  const { toast } = useToast();
  const { user } = useAuth() as any;
  const canWrite = user?.role !== 'viewer';
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, refetch } = useFetch<Doc[]>(
    ownerId ? `staff/documents/?owner_type=${ownerType}&owner_id=${ownerId}` : '',
    { enabled: !!ownerId },
  );
  const docs: Doc[] = Array.isArray(data) ? data : [];

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // let the same file be picked again after a failure
    if (!files.length || !ownerId) return;

    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > MAX_BYTES) {
          toast({
            title: 'File too large',
            description: `${file.name} is over 10MB.`,
            variant: 'destructive',
          });
          continue;
        }
        const body = new FormData();
        body.append('owner_type', ownerType);
        body.append('owner_id', String(ownerId));
        body.append('file', file);
        // postData passes the body straight to axios, which sets the
        // multipart boundary itself — the same path the bonus upload uses.
        await postData({ url: 'staff/documents/', data: body });
      }
      refetch?.();
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err?.response?.data?.error || err?.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (doc: Doc) => {
    if (!window.confirm(`Remove ${doc.file_name}?`)) return;
    try {
      await deleteData({ url: `staff/documents/${doc.id}/`, data: undefined });
      refetch?.();
    } catch (err: any) {
      toast({
        title: 'Could not remove it',
        description: err?.response?.data?.error || err?.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {!ownerId ? (
        <p className="text-xs text-muted-foreground">
          Save first, then documents can be attached.
        </p>
      ) : (
        canWrite && (
          <div
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => !uploading && inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="mx-auto h-6 w-6 text-gray-400 mb-1 animate-spin" />
            ) : (
              <Paperclip className="mx-auto h-6 w-6 text-gray-400 mb-1" />
            )}
            <p className="text-sm text-gray-500">
              {uploading ? 'Uploading…' : 'Click to attach documents'}
            </p>
            <p className="text-xs text-gray-400">PDF, PNG, JPG, DOC up to 10MB each</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPT}
              className="hidden"
              onChange={onPick}
            />
          </div>
        )
      )}

      {isLoading && ownerId ? (
        <p className="text-xs text-muted-foreground">Loading documents…</p>
      ) : docs.length ? (
        <ul className="space-y-1">
          {docs.map(doc => (
            <li
              key={doc.id}
              className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-blue-600 hover:underline"
                >
                  {doc.file_name}
                </a>
                <span className="text-gray-400 text-xs shrink-0">
                  ({(doc.size_bytes / 1024).toFixed(0)} KB)
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-gray-400 text-xs hidden sm:inline">
                  {doc.uploaded_by_name} · {fmtDateTime(doc.uploaded_at)}
                </span>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600"
                  title="Open"
                >
                  <Download className="h-4 w-4" />
                </a>
                {canWrite && (
                  <button
                    type="button"
                    onClick={() => remove(doc)}
                    className="text-gray-400 hover:text-red-500"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : ownerId ? (
        <p className="text-xs text-muted-foreground">No documents attached yet.</p>
      ) : null}
    </div>
  );
};

export default DocumentManager;

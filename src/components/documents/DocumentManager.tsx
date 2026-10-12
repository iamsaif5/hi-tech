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
  /** Null while the owner is still being created — see `pendingFiles`. */
  ownerId: number | null;
  label?: string;
  /**
   * Queue mode. Supply these two and the picker works before the owner
   * exists: files are held here and the parent uploads them once it has an
   * id. Without them an absent `ownerId` just disables the picker.
   */
  pendingFiles?: File[];
  onPendingFilesChange?: (files: File[]) => void;
}

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.doc,.docx';
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const MAX_BYTES = MAX_DOCUMENT_BYTES;

/**
 * Upload files against an owner that already exists.
 *
 * Exported so a create flow can save the record first and then attach what the
 * operator queued, without reimplementing the field names. Never throws: a
 * failed file is reported back so the caller can say which ones need redoing
 * rather than losing them silently.
 */
export const uploadDocuments = async (
  ownerType: DocumentOwnerType,
  ownerId: number,
  files: File[],
): Promise<{ uploaded: number; failed: string[] }> => {
  let uploaded = 0;
  const failed: string[] = [];
  for (const file of files) {
    try {
      const body = new FormData();
      body.append('owner_type', ownerType);
      body.append('owner_id', String(ownerId));
      body.append('file', file);
      await postData({ url: 'staff/documents/', data: body });
      uploaded += 1;
    } catch {
      failed.push(file.name);
    }
  }
  return { uploaded, failed };
};

/**
 * Attach, view and remove files on a staff member, loan or payroll run.
 *
 * One component for all three so the behaviour cannot drift. It replaces the
 * dropzones on staff and loans, which looked like they worked but held the
 * files in browser state and never uploaded them.
 */
const DocumentManager: React.FC<Props> = ({
  ownerType, ownerId, label = 'Documents', pendingFiles, onPendingFilesChange,
}) => {
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

  // Before the owner exists the picker still works, provided the parent said
  // it will carry the files — it saves the record, then uploads them.
  const queueing = !ownerId && !!onPendingFilesChange;
  const queued = pendingFiles || [];

  const tooLarge = (file: File) => {
    if (file.size <= MAX_BYTES) return false;
    toast({
      title: 'File too large',
      description: `${file.name} is over 10MB.`,
      variant: 'destructive',
    });
    return true;
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // let the same file be picked again after a failure
    if (!files.length) return;

    if (queueing) {
      // Size is checked now rather than at submit, so a file that cannot be
      // sent is rejected while the operator is still looking at the picker.
      onPendingFilesChange!([...queued, ...files.filter(f => !tooLarge(f))]);
      return;
    }
    if (!ownerId) return;

    setUploading(true);
    try {
      for (const file of files) {
        if (tooLarge(file)) continue;
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

      {!ownerId && !queueing ? (
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

      {queueing && queued.length > 0 && (
        <ul className="space-y-1">
          {queued.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">{file.name}</span>
                <span className="text-gray-400 text-xs shrink-0">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => onPendingFilesChange!(queued.filter((_, j) => j !== i))}
                className="text-gray-400 hover:text-red-500 shrink-0"
                title="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
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

      {queueing && (
        <p className="text-xs text-muted-foreground">
          {queued.length
            ? `${queued.length} file${queued.length === 1 ? '' : 's'} will be attached once the staff member is saved.`
            : 'Attach now — files upload automatically once the staff member is saved.'}
        </p>
      )}
    </div>
  );
};

export default DocumentManager;

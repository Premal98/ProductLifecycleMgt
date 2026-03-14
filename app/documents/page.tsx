"use client";

import { AppShell } from '@/components/AppShell';
import { ContentContainer } from '@/components/ContentContainer';
import { useEffect, useMemo, useState } from 'react';

const statusOptions = ['draft', 'review', 'approved'] as const;

type DocumentRow = {
  id: string;
  title: string;
  document_number?: string | null;
  version?: string | null;
  status?: string | null;
  owner_id?: string | null;
  file_url?: string | null;
  file_type?: string | null;
  updated_at?: string | null;
};

type VersionRow = { id: string; version_number: number; changelog?: string | null; created_at?: string | null };

type UploadPayload = {
  title: string;
  document_number?: string;
  status?: string;
  version?: string;
  file?: File;
  document_id?: string;
};

export default function DocumentsPage() {
  const [items, setItems] = useState<DocumentRow[]>([]);
  const [versions, setVersions] = useState<Record<string, VersionRow[]>>({});
  const [selected, setSelected] = useState<DocumentRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({ status: '', q: '' });

  const [form, setForm] = useState<UploadPayload>({ title: '', status: 'draft' });

  async function loadDocuments() {
    const res = await fetch('/api/documents');
    const payload = await res.json();
    const data: DocumentRow[] = payload.data || [];
    setItems(data);
  }

  async function loadVersions(id: string) {
    const res = await fetch(`/api/documents/${id}/versions`);
    const payload = await res.json();
    setVersions((prev) => ({ ...prev, [id]: payload.data || [] }));
  }

  useEffect(() => {
    void loadDocuments();
  }, []);

  async function handleUpload() {
    if (!form.file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', form.file);
    fd.append('title', form.title || form.file.name);
    if (form.document_number) fd.append('document_number', form.document_number);
    if (form.status) fd.append('status', form.status);
    if (form.version) fd.append('version', form.version);
    if (form.document_id) fd.append('document_id', form.document_id);
    fd.append('type', 'document');

    await fetch('/api/uploads', { method: 'POST', body: fd });
    setUploading(false);
    setForm({ title: '', status: 'draft' });
    await loadDocuments();
  }

  const filtered = useMemo(() => {
    return items.filter((doc) => {
      const matchStatus = filters.status ? doc.status === filters.status : true;
      const matchText = filters.q ? (doc.title || '').toLowerCase().includes(filters.q.toLowerCase()) : true;
      return matchStatus && matchText;
    });
  }, [items, filters]);

  function pick(doc: DocumentRow) {
    setSelected(doc);
    void loadVersions(doc.id);
  }

  return (
    <AppShell>
      <ContentContainer>
        <section className="plm-panel plm-soft mb-6 p-6">
          <p className="plm-chip">Document Control</p>
          <h2 className="mt-3 text-3xl font-bold">Controlled Documents Vault</h2>
          <p className="mt-2 text-slate-600">Manage document revisions, status, and approvals with Supabase storage.</p>
        </section>

        <div className="plm-panel mb-6 grid grid-cols-1 gap-3 p-5 md:grid-cols-5">
          <input className="md:col-span-2" placeholder="Search documents" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => setFilters({ q: '', status: '' })}>Reset</button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => void loadDocuments()}>Refresh</button>
          </div>
        </div>

        <div className="plm-panel mb-6 grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Upload document / new revision</p>
            <input placeholder="Document name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input placeholder="Document number" value={form.document_number || ''} onChange={(e) => setForm({ ...form, document_number: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input placeholder="Version (optional)" value={form.version || ''} onChange={(e) => setForm({ ...form, version: e.target.value })} />
            </div>
            <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || undefined })} />
            <div className="flex flex-wrap gap-2 text-sm">
              <button className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={uploading} onClick={handleUpload}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              {selected ? (
                <button className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700" onClick={() => setForm({ ...form, document_id: selected.id, title: selected.title, document_number: selected.document_number || undefined })}>
                  Set as revision of selected
                </button>
              ) : null}
            </div>
          </div>

          {selected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected</p>
                  <p className="text-lg font-semibold text-slate-900">{selected.title}</p>
                  <p className="text-sm text-slate-600">Version {selected.version || 'v1'} · Status {selected.status || 'draft'}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-slate-500">Document #{selected.document_number || '—'}</p>
                <p className="text-slate-500">Owner: {selected.owner_id || '—'}</p>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Versions</p>
                <div className="mt-2 space-y-2">
                  {(versions[selected.id] || []).map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
                      <span className="font-semibold">v{v.version_number}</span>
                      <span className="text-slate-500">{new Date(v.created_at || '').toLocaleDateString()}</span>
                      <span className="text-slate-500">{v.changelog || 'Uploaded'}</span>
                    </div>
                  )) || <p className="text-sm text-slate-500">No versions yet.</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">Select a document to see details and versions.</div>
          )}
        </div>

        <div className="plm-panel overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Version</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2 text-right">Updated</div>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map((doc) => (
              <button key={doc.id} className="grid w-full grid-cols-12 items-center px-4 py-3 text-left hover:bg-slate-50" onClick={() => pick(doc)}>
                <div className="col-span-4">
                  <p className="font-semibold text-slate-900">{doc.title}</p>
                  <p className="text-xs text-slate-500">{doc.document_number || doc.file_type || 'Document'}</p>
                </div>
                <div className="col-span-2 font-mono text-sm text-slate-800">{doc.version || 'v1'}</div>
                <div className="col-span-2"><span className="pill capitalize">{doc.status || 'draft'}</span></div>
                <div className="col-span-2 text-sm text-slate-700">{doc.owner_id || '—'}</div>
                <div className="col-span-2 text-right text-sm text-slate-500">{doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : '—'}</div>
              </button>
            ))}
          </div>
        </div>
      </ContentContainer>
    </AppShell>
  );
}

"use client";

import { AppShell } from '@/components/AppShell';
import { ContentContainer } from '@/components/ContentContainer';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  sku?: string | null;
  lifecycle_stage?: string | null;
  status?: string | null;
  version?: string | null;
  description?: string | null;
  owner_id?: string | null;
  category?: string | null;
  compliance_status?: string | null;
  weight?: number | null;
  dimensions?: string | null;
};

type TabKey = 'overview' | 'documents' | 'cad' | 'bom' | 'changes' | 'costs';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [tab, setTab] = useState<TabKey>('overview');

  useEffect(() => {
    if (!productId) return;
    void (async () => {
      const res = await fetch(`/api/products/${productId}`);
      const payload = await res.json();
      setProduct(payload.data || null);
    })();
  }, [productId]);

  const title = product?.name || 'Product workspace';

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'documents', label: 'Documents' },
    { key: 'cad', label: 'CAD Files' },
    { key: 'bom', label: 'BOM' },
    { key: 'changes', label: 'Change Orders' },
    { key: 'costs', label: 'Costs' }
  ];

  const placeholderDocs = useMemo(() => [
    { title: 'Product Specification', file: 'product_specification.pdf' },
    { title: 'Safety Compliance Report', file: 'safety_compliance_report.pdf' }
  ], []);
  const placeholderCad = useMemo(() => [
    { title: 'Enclosure Design', file: 'enclosure_design.step' },
    { title: 'PCB Layout', file: 'pcb_layout_v2.stp' }
  ], []);
  const placeholderBom = useMemo(() => [
    { level: 'Top', item: 'Main Assembly', qty: 1 },
    { level: 'L1', item: 'Controller PCB', qty: 1 },
    { level: 'L1', item: 'Housing Enclosure', qty: 1 }
  ], []);
  const placeholderChanges = useMemo(() => [
    { number: 'ECO-101', title: 'Replace sensor module', status: 'open' },
    { number: 'ECO-102', title: 'Redesign enclosure for thermal headroom', status: 'in_review' }
  ], []);
  const placeholderCosts = useMemo(() => [
    { type: 'Component', value: '$142.00' },
    { type: 'Estimated build', value: '$520.00' }
  ], []);

  return (
    <AppShell>
      <ContentContainer>
        <section className="plm-panel plm-soft mb-4 p-6">
          <p className="plm-chip">Product Workspace</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <span className="pill">{product?.version || 'v1'}</span>
            <span className="pill bg-slate-100 text-slate-700 capitalize">{product?.lifecycle_stage || 'design'}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">Lifecycle, documents, CAD, BOM, change orders, and costs in one view.</p>
        </section>

        <div className="plm-panel mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/80 px-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-3 text-sm font-semibold ${tab === t.key ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-600'}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'overview' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Details</p>
                  <dl className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between"><dt className="text-slate-500">Product #</dt><dd className="font-semibold">{product?.sku || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Lifecycle</dt><dd className="font-semibold capitalize">{product?.lifecycle_stage || 'design'}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd className="font-semibold">{product?.status || 'active'}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd className="font-semibold">{product?.category || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Compliance</dt><dd className="font-semibold">{product?.compliance_status || '—'}</dd></div>
                  </dl>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Metadata</p>
                  <dl className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between"><dt className="text-slate-500">Weight</dt><dd className="font-semibold">{product?.weight ? `${product.weight} kg` : '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Dimensions</dt><dd className="font-semibold">{product?.dimensions || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Owner</dt><dd className="font-semibold">{product?.owner_id || '—'}</dd></div>
                  </dl>
                </div>
                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Description</p>
                  <p className="mt-2 text-sm text-slate-700">{product?.description || 'No description provided.'}</p>
                </div>
              </div>
            )}

            {tab === 'documents' && (
              <div className="grid gap-3 md:grid-cols-2">
                {placeholderDocs.map((doc) => (
                  <div key={doc.file} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.file}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'cad' && (
              <div className="grid gap-3 md:grid-cols-2">
                {placeholderCad.map((cad) => (
                  <div key={cad.file} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{cad.title}</p>
                    <p className="text-xs text-slate-500">{cad.file}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'bom' && (
              <div className="space-y-2">
                {placeholderBom.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <span className="font-semibold">{row.level}</span>
                    <span>{row.item}</span>
                    <span className="text-slate-500">Qty {row.qty}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'changes' && (
              <div className="space-y-2">
                {placeholderChanges.map((co) => (
                  <div key={co.number} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <div>
                      <p className="font-semibold">{co.number}</p>
                      <p className="text-slate-500">{co.title}</p>
                    </div>
                    <span className="pill capitalize">{co.status}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'costs' && (
              <div className="grid gap-3 md:grid-cols-2">
                {placeholderCosts.map((c) => (
                  <div key={c.type} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">{c.type}</p>
                    <p className="text-xl font-bold text-slate-900">{c.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ContentContainer>
    </AppShell>
  );
}

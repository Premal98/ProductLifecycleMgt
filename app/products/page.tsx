"use client";

import { AppShell } from '@/components/AppShell';
import { ContentContainer } from '@/components/ContentContainer';
import type { Route } from 'next';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

const lifecycleOptions = ['concept', 'design', 'prototype', 'production', 'retired'] as const;

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

const fallbackProducts: Product[] = [
  { id: 'demo-1', name: 'MediFlow Smart Infusion Pump', sku: 'MED-INF-500', lifecycle_stage: 'engineering_validation', status: 'active', version: 'v2', category: 'Medical Device' },
  { id: 'demo-2', name: 'PulseWave Portable ECG Monitor', sku: 'MED-ECG-210', lifecycle_stage: 'prototype', status: 'active', version: 'v1', category: 'Medical Device' },
  { id: 'demo-3', name: 'AeroSense Industrial Air Quality Sensor', sku: 'IND-AQS-330', lifecycle_stage: 'design', status: 'active', version: 'v1', category: 'Industrial' }
];

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [lifecycle, setLifecycle] = useState('');
  const [category, setCategory] = useState('');
  const [owner, setOwner] = useState('');

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [newLifecycle, setNewLifecycle] = useState('design');
  const [newCategory, setNewCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [compliance, setCompliance] = useState('');

  async function loadProducts() {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (lifecycle) params.set('lifecycle', lifecycle);
    if (category) params.set('category', category);
    if (owner) params.set('owner', owner);
    const res = await fetch(`/api/products?${params.toString()}`);
    const payload = await res.json();
    setItems(payload.data || []);
  }

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        sku,
        description,
        lifecycle_stage: newLifecycle,
        category: newCategory,
        weight: weight ? Number(weight) : undefined,
        dimensions: dimensions || undefined,
        compliance_status: compliance || undefined,
        status: 'active'
      })
    });
    setName('');
    setSku('');
    setDescription('');
    setNewCategory('');
    setWeight('');
    setDimensions('');
    setCompliance('');
    await loadProducts();
  }

  async function runAction(id: string, action: 'archive' | 'duplicate' | 'newVersion') {
    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    await loadProducts();
  }

  const display = useMemo(() => (items.length ? items : fallbackProducts), [items]);

  return (
    <AppShell>
      <ContentContainer>
        <section className="plm-panel plm-soft mb-6 p-6">
          <p className="plm-chip">Product Data Management</p>
          <h2 className="mt-3 text-3xl font-bold">Product Portfolio</h2>
          <p className="mt-2 text-slate-600">Search, filter, and manage lifecycle-ready products with metadata and versions.</p>
        </section>

        <div className="plm-panel mb-6 grid grid-cols-1 gap-3 p-5 md:grid-cols-4">
          <input placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={lifecycle} onChange={(e) => setLifecycle(e.target.value)}>
            <option value="">Lifecycle</option>
            {lifecycleOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input placeholder="Owner (user id)" value={owner} onChange={(e) => setOwner(e.target.value)} />
          <div className="md:col-span-4 flex justify-end gap-3">
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => { setSearch(''); setLifecycle(''); setCategory(''); setOwner(''); void loadProducts(); }}>
              Reset
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => void loadProducts()}>
              Apply Filters
            </button>
          </div>
        </div>

        <form className="plm-panel mb-8 grid grid-cols-1 gap-4 p-5 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product name</label>
            <input placeholder="Smart Infusion Pump" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product number / SKU</label>
            <input placeholder="MED-INF-500" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Lifecycle stage</label>
            <select value={newLifecycle} onChange={(e) => setNewLifecycle(e.target.value)}>
              {lifecycleOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <input placeholder="Medical Device" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Weight (kg)</label>
            <input placeholder="1.2" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Dimensions</label>
            <input placeholder="220 x 140 x 90 mm" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Compliance status</label>
            <input placeholder="IEC 60601 underway" value={compliance} onChange={(e) => setCompliance(e.target.value)} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white" type="submit">Create product</button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {display.map((product) => (
            <div key={product.id} className="plm-panel p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{product.category || 'Uncategorized'}</p>
                  <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-600">{product.description || 'Lifecycle-controlled product record.'}</p>
                </div>
                <span className="pill">{product.version || 'v1'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Product #</p>
                  <p className="font-semibold">{product.sku || '—'}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Lifecycle</p>
                  <p className="font-semibold capitalize">{product.lifecycle_stage || 'design'}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Compliance</p>
                  <p className="font-semibold">{product.compliance_status || 'N/A'}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Weight</p>
                  <p className="font-semibold">{product.weight ? `${product.weight} kg` : '—'}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">Dimensions</p>
                  <p className="font-semibold">{product.dimensions || '—'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                <Link href={`/products/${product.id}` as Route} className="rounded-xl border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">Open workspace</Link>
                <button className="rounded-xl border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50" onClick={() => void runAction(product.id, 'newVersion')}>
                  New version
                </button>
                <button className="rounded-xl border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50" onClick={() => void runAction(product.id, 'duplicate')}>
                  Duplicate
                </button>
                <button className="rounded-xl border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50" onClick={() => void runAction(product.id, 'archive')}>
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      </ContentContainer>
    </AppShell>
  );
}


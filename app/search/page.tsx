"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';

type Result = {
  products: Array<{ id: string; name: string; sku?: string }>;
  documents: Array<{ id: string; title: string }>;
  components: Array<{ id: string; name: string; part_number?: string }>;
  suppliers: Array<{ id: string; name: string; email?: string }>;
};

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [data, setData] = useState<Result | null>(null);

  useEffect(() => {
    if (!q) {
      setData(null);
      return;
    }
    void fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((payload) => setData(payload.data || null))
      .catch(() => setData(null));
  }, [q]);

  return (
    <AppShell>
      <section className="plm-panel plm-soft mb-6 p-6">
        <p className="plm-chip">Global Search</p>
        <h2 className="mt-3 text-3xl font-bold">Results for “{q}”</h2>
      </section>

      {!q ? (
        <p className="text-sm text-slate-600">Enter a query in the top search bar.</p>
      ) : !data ? (
        <p className="text-sm text-slate-600">Searching...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SearchCard title="Products" items={data.products} render={(item) => `${item.name} (${item.sku || 'no sku'})`} />
          <SearchCard title="Documents" items={data.documents} render={(item) => item.title} />
          <SearchCard title="Components" items={data.components} render={(item) => `${item.name} (${item.part_number || 'n/a'})`} />
          <SearchCard title="Suppliers" items={data.suppliers} render={(item) => `${item.name}${item.email ? ' · ' + item.email : ''}`} />
        </div>
      )}
    </AppShell>
  );
}

type CardProps<T> = {
  title: string;
  items: T[];
  render: (item: T) => string;
};

function SearchCard<T>({ title, items, render }: CardProps<T>) {
  return (
    <div className="plm-panel p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
            {render(item)}
          </div>
        )) : <p className="text-sm text-slate-500">No results.</p>}
      </div>
    </div>
  );
}

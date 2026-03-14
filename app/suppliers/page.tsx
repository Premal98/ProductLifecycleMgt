"use client";

import { AppShell } from '@/components/AppShell';
import { FormEvent, useEffect, useState } from 'react';

type Supplier = { id: string; name: string; email?: string; rating?: number };

export default function SuppliersPage() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [name, setName] = useState('');

  async function load() {
    const res = await fetch('/api/suppliers');
    const payload = await res.json();
    setItems(payload.data || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setName('');
    await load();
  }

  return (
    <AppShell>
      <h2 className="mb-4 text-2xl font-semibold">Suppliers</h2>
      <form className="mb-6 flex gap-3 rounded-lg bg-white p-4 shadow" onSubmit={onSubmit}>
        <input placeholder="Supplier name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button className="bg-brand-600 text-white" type="submit">Add Supplier</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-slate-500">{item.email || 'No email'}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

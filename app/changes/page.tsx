"use client";

import { AppShell } from '@/components/AppShell';
import { FormEvent, useEffect, useState } from 'react';

type ChangeOrder = { id: string; order_number?: string; title: string; status: string; priority: string };

export default function ChangesPage() {
  const [items, setItems] = useState<ChangeOrder[]>([]);
  const [title, setTitle] = useState('');

  async function load() {
    const res = await fetch('/api/changes');
    const payload = await res.json();
    setItems(payload.data || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await fetch('/api/changes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority: 'medium', status: 'open' })
    });
    setTitle('');
    await load();
  }

  return (
    <AppShell>
      <h2 className="mb-4 text-2xl font-semibold">Change Orders</h2>
      <form className="mb-6 flex gap-3 rounded-lg bg-white p-4 shadow" onSubmit={onSubmit}>
        <input placeholder="Change title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <button className="bg-brand-600 text-white" type="submit">Create ECO</button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-medium">{item.order_number || item.id.slice(0, 8)} - {item.title}</p>
            <p className="text-sm text-slate-500">{item.status} / {item.priority}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

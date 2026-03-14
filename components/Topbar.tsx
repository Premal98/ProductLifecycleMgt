"use client";

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
};

export function Topbar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    void fetch('/api/notifications')
      .then((res) => res.json())
      .then((payload) => setNotifications(payload.data || []))
      .catch(() => setNotifications([]));
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/');
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}` as Route);
  }

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">PLM Workspace</p>
          <p className="text-sm font-semibold text-slate-700">Product data, engineering control, and change governance</p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
            <input
              className="border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0"
              placeholder="Search products, components, documents, suppliers"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800" type="submit">
              Search
            </button>
          </form>
          <div className="relative">
            <button
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={() => setOpen((value) => !value)}
            >
              Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
            {open ? (
              <div className="absolute right-0 top-12 w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                <h3 className="text-sm font-semibold text-slate-800">Notification Center</h3>
                <div className="mt-3 space-y-3">
                  {notifications.length ? (
                    notifications.map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No notifications available.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <button
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

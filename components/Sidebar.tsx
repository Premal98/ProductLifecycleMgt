"use client";

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links: Array<{ href: Route; label: string; hint: string }> = [
  { href: '/dashboard', label: 'Command Center', hint: 'PLM portfolio overview' },
  { href: '/products', label: 'Product Vault', hint: 'Specs and lifecycle' },
  { href: '/projects', label: 'Programs', hint: 'Milestones and tasks' },
  { href: '/boms', label: 'BOM Studio', hint: 'Structures and revisions' },
  { href: '/documents', label: 'Document Control', hint: 'Controlled docs' },
  { href: '/cad', label: 'CAD Vault', hint: 'Mechanical and PCB files' },
  { href: '/suppliers', label: 'Supplier Hub', hint: 'Qualification and sourcing' },
  { href: '/changes', label: 'Change Board', hint: 'ECR/ECO workflow' },
  { href: '/reports', label: 'Analytics', hint: 'Delivery and cost metrics' }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-80 border-r border-slate-200 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 p-5 text-slate-100 shadow-xl">
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200">NovaTech</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Product Lifecycle</h1>
        <p className="mt-1 text-sm text-slate-200/80">Engineering control room</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group block rounded-xl px-3 py-3 transition ${
                active
                  ? 'bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]'
                  : 'text-slate-100/90 hover:bg-white/5 hover:text-white'
              }`}
            >
              <p className="text-sm font-semibold leading-tight">{link.label}</p>
              <p className="text-xs text-slate-200/80 group-hover:text-slate-100/90">{link.hint}</p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

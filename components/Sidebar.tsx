"use client";

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  BarChart3,
  DraftingCompass,
  LayoutDashboard,
  Layers,
  Package,
  Settings,
  FileText,
  BriefcaseBusiness,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { canAccess } from '@/lib/rbac';

const SIDEBAR_STORAGE_KEY = 'plm.sidebar.collapsed';
const EXPANDED_WIDTH = '15rem';
const COLLAPSED_WIDTH = '4.5rem';

type SidebarItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  resource: string;
};

const primaryLinks: SidebarItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, resource: 'dashboard' },
  { href: '/products', label: 'Products', icon: Package, resource: 'products' },
  { href: '/projects', label: 'Projects', icon: BriefcaseBusiness, resource: 'projects' },
  { href: '/boms', label: 'BOM', icon: Layers, resource: 'boms' },
  { href: '/documents', label: 'Documents', icon: FileText, resource: 'documents' },
  { href: '/cad', label: 'CAD Files', icon: DraftingCompass, resource: 'cad_files' }
];

const secondaryLinks: SidebarItem[] = [
  { href: '/suppliers', label: 'Suppliers', icon: Truck, resource: 'suppliers' },
  { href: '/reports', label: 'Reports', icon: BarChart3, resource: 'reports' },
  { href: '/settings', label: 'Settings', icon: Settings, resource: 'settings' }
];

type SidebarNavItemProps = {
  item: SidebarItem;
  active: boolean;
  collapsed: boolean;
};

function SidebarNavItem({ item, active, collapsed }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className={clsx(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        collapsed ? 'lg:justify-center lg:px-2.5 lg:gap-0' : 'lg:justify-start',
        active
          ? 'bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
          : 'text-slate-100/80 hover:bg-white/5 hover:text-white'
      )}
    >
      <span
        className={clsx(
          'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-emerald-300 transition-opacity duration-200',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
        )}
      />
      <Icon
        className={clsx(
          'h-5 w-5 transition-transform duration-200',
          active ? 'text-white' : 'text-slate-200/80 group-hover:text-white group-hover:translate-x-0.5'
        )}
      />
      <span
        className={clsx(
          'whitespace-nowrap transition-all duration-200',
          collapsed
            ? 'lg:max-w-0 lg:translate-x-2 lg:overflow-hidden lg:opacity-0'
            : 'lg:max-w-[180px] lg:opacity-100'
        )}
      >
        {item.label}
      </span>
      {collapsed ? (
        <span className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 px-2.5 py-1.5 text-xs text-white shadow-lg ring-1 ring-white/10 opacity-0 transition group-hover:opacity-100 lg:block">
          {item.label}
        </span>
      ) : null}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [role, setRole] = useState('viewer');

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === 'true');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
    document.documentElement.style.setProperty('--sidebar-width', width);
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed, hydrated]);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      try {
        const response = await fetch('/api/me');
        if (!response.ok) return;
        const payload = await response.json();
        const nextRole = payload?.data?.role as string | undefined;
        if (active && nextRole) {
          setRole(nextRole);
        }
      } catch {
        // Ignore role fetch errors; fallback to viewer access.
      }
    }

    void loadRole();
    return () => {
      active = false;
    };
  }, []);

  const visiblePrimaryLinks = primaryLinks.filter((item) => canAccess(role, item.resource, 'read'));
  const visibleSecondaryLinks = secondaryLinks.filter((item) => canAccess(role, item.resource, 'read'));

  return (
    <aside
      className={clsx(
        'w-full border-b border-slate-200 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 p-5 text-slate-100 shadow-xl',
        'lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:border-b-0 lg:border-r lg:transition-[width] lg:duration-300',
        collapsed ? 'lg:w-[var(--sidebar-width)] lg:px-3 lg:py-4' : 'lg:w-[var(--sidebar-width)]'
      )}
    >
      <div
        className={clsx(
          'mb-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300',
          collapsed ? 'p-3' : 'p-4'
        )}
      >
        <div className={clsx('flex items-center justify-between', collapsed ? 'lg:flex-col lg:items-center lg:justify-center lg:gap-3' : '')}>
          <div className={clsx('flex items-center gap-3', collapsed ? 'lg:flex-col lg:gap-2' : '')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold text-white">
              NT
            </div>
            <div
              className={clsx(
                'transition-all duration-200',
                collapsed
                  ? 'lg:max-w-0 lg:translate-x-2 lg:overflow-hidden lg:opacity-0'
                  : 'lg:max-w-[180px] lg:opacity-100'
              )}
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200">NovaTech</p>
              <h1 className="mt-1 text-lg font-bold text-white">Product Lifecycle</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100/80 transition hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <p
          className={clsx(
            'mt-3 text-sm text-slate-200/80 transition-all duration-200',
            collapsed ? 'lg:max-h-0 lg:opacity-0' : 'lg:opacity-100'
          )}
        >
          Engineering control room
        </p>
      </div>

      <nav className="space-y-4">
        <div className="space-y-1">
          {visiblePrimaryLinks.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              active={pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </div>
        {visibleSecondaryLinks.length ? (
          <div className="space-y-1 border-t border-white/10 pt-4">
            {visibleSecondaryLinks.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                active={pathname === item.href}
                collapsed={collapsed}
              />
            ))}
          </div>
        ) : null}
      </nav>
    </aside>
  );
}

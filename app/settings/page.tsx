import Link from 'next/link';
import { AppShell } from '@/components/AppShell';

const settingsSections = [
  {
    title: 'Users',
    description: 'Manage organization members, roles, and access.',
    href: '/settings/users'
  }
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Settings</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Workspace settings</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
